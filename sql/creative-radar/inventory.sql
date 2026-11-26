SELECT TO_JSON_STRING(STRUCT(subject, student_type, buyer, COUNT(DISTINCT campaign_id) AS campaigns)) AS item
FROM (
  SELECT subject, student_type, campaign_id,
    COALESCE(REGEXP_EXTRACT(campaign_name, r'^(Julia|Kris|Sasha)_'), 'Інші') AS buyer
  FROM `justschool-473216.marketing_funnel.fb_google_tiktok`
  WHERE DATE(ad_date) BETWEEN DATE_SUB(@cycle_end, INTERVAL 34 DAY) AND @cycle_end
    AND source = 'Facebook' AND total_spend > 0
    AND (subject IN ('Math','Programming') OR subject = 'English')
)
GROUP BY subject, student_type, buyer
ORDER BY subject, student_type, buyer
