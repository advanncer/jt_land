-- Aggregate output only. Date boundaries use local DATETIME columns in the reporting views.
WITH period AS (
  SELECT DATE_SUB(@cycle_end, INTERVAL 34 DAY) AS start_day, @cycle_end AS end_day
), delivery AS (
  SELECT DATE(ad_date) AS day, campaign_name AS campaign, ad_name AS creative,
    CAST(ad_id AS STRING) AS ad_id, total_spend AS spend
  FROM `justschool-473216.marketing_funnel.fb_google_tiktok`, period
  WHERE source = 'Facebook' AND subject = @subject AND student_type = @student_type
    AND account_id <> '26890470997250492'
    AND NOT REGEXP_CONTAINS(IFNULL(campaign_name, ''), r'(?i)(^|[_ -])fb[_ -]*test([_ -]|$)')
    AND DATE(ad_date) <= end_day
), catalog AS (
  SELECT DISTINCT campaign, creative, ad_key
  FROM delivery, UNNEST([LOWER(TRIM(creative)), ad_id]) AS ad_key
  WHERE NULLIF(ad_key, '') IS NOT NULL
), unique_keys AS (
  SELECT LOWER(TRIM(campaign)) AS campaign_key, ad_key,
    ANY_VALUE(STRUCT(campaign, creative)) AS ad
  FROM catalog GROUP BY 1,2 HAVING COUNT(DISTINCT TO_JSON_STRING(STRUCT(campaign,creative)))=1
), leads AS (
  SELECT DISTINCT user_id, created_at, LOWER(TRIM(utm_campaign)) AS campaign_key,
    LOWER(TRIM(utm_content)) AS content_key
  FROM `justschool-473216.marketing_funnel.all_leads_reporting`, period
  WHERE user_id IS NOT NULL AND DATE(created_at) <= end_day
), attributed AS (
  SELECT l.user_id, l.created_at, k.ad.campaign, k.ad.creative
  FROM leads l JOIN unique_keys k ON k.campaign_key=l.campaign_key AND k.ad_key=l.content_key
), people AS (
  SELECT DISTINCT user_id FROM attributed
), pay_history AS (
  SELECT payment_id,student_id,created_at,is_first_paid,REGEXP_REPLACE(phone,r'\D','') AS ph
  FROM `justschool-473216.marketing_funnel.user_payments`
  WHERE LOWER(status) IN ('approved','success','successful') AND amount_uah>0
), payments AS (
  SELECT p.paymentId AS id,p.studentId AS user_id,p.createdAt AS event_time,SUM(p.amount_converted) AS revenue
  FROM `justschool-473216.analytics.enriched_payments` p JOIN people ON user_id=p.studentId CROSS JOIN period
  WHERE DATE(p.createdAt) BETWEEN start_day AND end_day
    AND p.bussines_segment IN ('b2c','employee') AND p.payment_cohort_type='Unknown'
    AND (p.isFirstPaid=1 OR p.number_of_payments=0)
    AND NOT REGEXP_CONTAINS(LOWER(IFNULL(p.b2b_company,'')),r'фонд|hmt')
    AND p.paymentId NOT IN (SELECT DISTINCT f.payment_id FROM pay_history f JOIN pay_history o
      ON o.ph=f.ph AND o.student_id<>f.student_id AND o.created_at<f.created_at
      WHERE f.is_first_paid=1 AND LENGTH(f.ph)>=9 AND f.payment_id IS NOT NULL)
  GROUP BY 1,2,3
), invitations AS (
  SELECT CAST(t.Id AS STRING) AS id,SAFE_CAST(c.UsrstudentId AS INT64) AS user_id,
    MIN(CAST(t.UsrDatetimeHistoryDateInvitedTrial AS DATETIME)) AS event_time
  FROM `justschool-473216.school_crm_data.creatio_trial_lessons` t
  JOIN `justschool-473216.school_crm_data.creatio_with_stage_names` c ON c.Id=t.UsrOpportunityId
  JOIN people ON user_id=SAFE_CAST(c.UsrstudentId AS INT64)
  WHERE LOWER(CAST(t.UsrIsFirstTrialLessonInOpp AS STRING)) IN ('true','1')
  GROUP BY 1,2
), outcomes AS (
  SELECT 'pay' AS kind,CAST(id AS STRING) AS id,user_id,event_time,revenue FROM payments
  UNION ALL
  SELECT 'invite',id,user_id,event_time,0 FROM invitations,period
  WHERE DATE(event_time) BETWEEN start_day AND end_day
), outcome_matches AS (
  -- Competing and unknown touches make the event ambiguous. Never spread it across variants.
  SELECT e.kind,e.id,e.event_time,e.revenue,ANY_VALUE(k.ad) AS ad,
    COUNTIF(k.ad IS NULL)>0 OR COUNT(DISTINCT TO_JSON_STRING(k.ad))<>1 AS uncertain
  FROM outcomes e JOIN leads l ON l.user_id=e.user_id AND l.created_at<=e.event_time
  LEFT JOIN unique_keys k ON k.campaign_key=l.campaign_key AND k.ad_key=l.content_key
  GROUP BY e.kind,e.id,e.event_time,e.revenue
), registrations AS (
  SELECT user_id,campaign,creative,MIN(created_at) AS registered FROM attributed GROUP BY 1,2,3
), events AS (
  SELECT 'fact' AS kind,day,campaign,creative,spend,0 AS leads,0 AS invites,0 AS pays,0.0 AS revenue
  FROM delivery,period WHERE day BETWEEN start_day AND end_day
  UNION ALL
  SELECT 'control',day,campaign,creative,spend,0,0,0,0 FROM delivery,period WHERE day BETWEEN start_day AND end_day
  UNION ALL
  SELECT 'fact',DATE(registered),campaign,creative,0,1,0,0,0 FROM registrations,period
  WHERE DATE(registered) BETWEEN start_day AND end_day
  UNION ALL
  SELECT IF(uncertain,'unresolved','fact'),DATE(event_time),IF(uncertain,NULL,ad.campaign),
    IF(uncertain,NULL,ad.creative),0,0,IF(kind='invite',1,0),IF(kind='pay',1,0),IF(kind='pay',revenue,0)
  FROM outcome_matches
), grouped AS (
  SELECT kind,DATE_DIFF(day,start_day,WEEK(MONDAY)) AS week,campaign,creative,SUM(spend) AS spend,
    SUM(leads) AS leads,SUM(invites) AS invites,SUM(pays) AS pays,SUM(revenue) AS revenue
  FROM events,period GROUP BY 1,2,3,4
)
SELECT TO_JSON_STRING(grouped) AS item FROM grouped
