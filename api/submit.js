export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  // --- CONFIGURABLE ESPUTNIK VALUES ---
  // If "Джерело ліда" is a dropdown list in eSputnik, this value MUST exist in its list of options.
  // You can change this value to match your exact eSputnik option (e.g. "Site", "Quiz" or "Landing").
  // Or keep it as "AI Landing" and add "AI Landing" as an option in eSputnik UI -> Additional Fields settings.
  const esputnikLeadSource = "ai_landing";

  const data = request.body || {};

  console.log("=== API SUBMIT CALLED ===");
  console.log("Incoming request body:", JSON.stringify(data, null, 2));

  // 1. Normalize and clean phone number to flat string format (e.g. +380952150831)
  let phone = data.phone || data.Phone || "";
  if (phone && typeof phone === "string") {
    const digits = phone.replace(/\D/g, "");
    if (digits) {
      phone = "+" + digits;
      data.phone = phone; // update in data too for other services
    } else {
      phone = "";
    }
  }

  const name = data.name || data.Name || "";
  const email = data.email || data.Email || "";
  const qa = data.qa || data.Answear || "";
  const dialogueUrl = data.dialogueUrl || data.url || data.URL || "";

  console.log("Normalized values:", { name, phone, email, qa, dialogueUrl });

  // 2. Prepare data for NocoDB
  // Parse IP and Country from the QA string for cleaner database entry
  let ip = "";
  let country = "";
  if (qa && typeof qa === "string") {
    const parts = qa.split("|||");
    if (parts.length > 0) {
      const ipPart = parts[0]; // "ip:1.2.3.4|country:UA"
      const matchIp = ipPart.match(/ip:(.*?)\|/);
      const matchCountry = ipPart.match(/country:(.*?)$/);
      if (matchIp) ip = matchIp[1];
      if (matchCountry) country = matchCountry[1];
    }
  }
  // Fallback country parsing if present in Geo
  if (!country && data.geo && typeof data.geo === "string") {
    const parts = data.geo.split("/");
    country = parts[0] || "";
  }

  const nocoPayload = {
    Title: name, // Map Name to Title (Primary Value)
    Name: name,
    Phone: phone,
    Email: email,
    QA: qa,
    IP: ip,
    Country: country,
    DialogueUrl: dialogueUrl,
  };

  const nocoToken =
    process.env.NOCODB_TOKEN || "xKYg5pA_NAjvwAtnl9IGkJd---0F5BN8MFm992xO";
  const tableId = process.env.NOCODB_TABLE_ID || "mwyhw2a79xopbef";

  const promises = [];

  // --- Send to NocoDB ---
  if (nocoToken && tableId) {
    console.log("Sending to NocoDB...");
    promises.push(
      fetch(`https://app.nocodb.com/api/v2/tables/${tableId}/records`, {
        method: "POST",
        headers: {
          "xc-token": nocoToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nocoPayload),
      }).then(async (res) => {
        const text = await res.text();
        console.log("NocoDB Response status:", res.status, "Body:", text);
        if (!res.ok) {
          throw new Error(`NocoDB Error: ${res.status}`);
        }
        return { service: "NocoDB", success: true };
      }),
    );
  }

  // --- Send to n8n ---
  const n8nWebhookUrl =
    data.n8nWebhookUrl ||
    "https://n8n.justschool.me/webhook/19be50df-0410-4330-8dcb-3797fa703c56";
  if (n8nWebhookUrl) {
    console.log("Sending to n8n webhook:", n8nWebhookUrl);
    promises.push(
      fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (res) => {
        console.log("n8n Response status:", res.status);
        if (!res.ok) {
          throw new Error(`n8n Error: ${res.status}`);
        }
        try {
          return { service: "n8n", success: true, data: await res.json() };
        } catch (e) {
          return { service: "n8n", success: true };
        }
      }),
    );
  }

  // --- Send to eSputnik ---
  const esputnikApiKey =
    process.env.ESPUTNIK_API_KEY || "47743228FB8260569CA855D42622CFD2";
  if (esputnikApiKey) {
    // Add custom fields and explicitly track their IDs
    const esputnikFields = [];
    const customFieldsIDs = [];

    // 1. Джерело ліда (%CLIENT.LID_SOURSE% - ID 235251)
    if (esputnikLeadSource) {
      esputnikFields.push({
        id: 235251,
        value: esputnikLeadSource,
      });
      customFieldsIDs.push(235251);
    }

    // 2. URL стрічки / лендингу (%PERSONAL.LANDING_URL% - ID 295300)
    if (dialogueUrl) {
      esputnikFields.push({
        id: 295300,
        value: dialogueUrl,
      });
      customFieldsIDs.push(295300);
    }

    // 3. Кастомне поле Name (ID 235152)
    if (name) {
      esputnikFields.push({
        id: 235152,
        value: name,
      });
      customFieldsIDs.push(235152);
    }

    // 4. Кастомне поле Номер телефону (ID 235245)
    if (phone) {
      esputnikFields.push({
        id: 235245,
        value: phone,
      });
      customFieldsIDs.push(235245);
    }

    // 5. Кастомне поле Email (ID 235246)
    if (email) {
      esputnikFields.push({
        id: 235246,
        value: email,
      });
      customFieldsIDs.push(235246);
    }

    // 6. Кастомне поле Тип учня (ID 235249 - "дорослий" або "дитина")
    let studentType = "";
    const lowerUrl = dialogueUrl.toLowerCase();
    const lowerLeadType = (
      data.Lead_type ||
      data.lead_type ||
      ""
    ).toLowerCase();

    if (lowerUrl.includes("/eng-child/") || lowerLeadType.includes("child")) {
      studentType = "дитина";
    } else if (
      lowerUrl.includes("/eng-adult/") ||
      lowerLeadType.includes("adult")
    ) {
      studentType = "дорослий";
    }

    if (studentType) {
      esputnikFields.push({
        id: 235249,
        value: studentType,
      });
      customFieldsIDs.push(235249);
    }

    // 7. Додаткове поле для відповідей на квіз (якщо налаштоване через ENV змінні)
    const esputnikQaFieldId = process.env.ESPUTNIK_QA_FIELD_ID;
    if (esputnikQaFieldId && qa) {
      const parsedId = parseInt(esputnikQaFieldId, 10);
      esputnikFields.push({
        id: parsedId,
        value: qa,
      });
      customFieldsIDs.push(parsedId);
    }

    // contacts API payload with mandatory dedupeOn and customFieldsIDs
    const esputnikPayload = {
      contacts: [
        {
          firstName: name,
          channels: [
            ...(email ? [{ type: "email", value: email }] : []),
            ...(phone
              ? [{ type: "sms", value: phone.replace(/\D/g, "") }]
              : []),
          ],
          fields: esputnikFields,
        },
      ],
      dedupeOn: "email_or_sms",
      customFieldsIDs: customFieldsIDs,
    };

    console.log("Sending payload to eSputnik /contacts endpoint...");
    console.log("eSputnik Payload:", JSON.stringify(esputnikPayload, null, 2));

    const esputnikAuth = Buffer.from(`user:${esputnikApiKey}`).toString(
      "base64",
    );
    promises.push(
      fetch("https://esputnik.com/api/v1/contacts", {
        method: "POST",
        headers: {
          Authorization: `Basic ${esputnikAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(esputnikPayload),
      }).then(async (res) => {
        const text = await res.text();
        console.log("eSputnik Response Status:", res.status);
        console.log("eSputnik Response Body:", text);
        if (!res.ok) {
          throw new Error(`eSputnik Error: ${res.status} - ${text}`);
        }
        return { service: "eSputnik", success: true, response: text };
      }),
    );
  } else {
    console.warn("eSputnik skipped: ESPUTNIK_API_KEY is not configured.");
  }

  try {
    const results = await Promise.allSettled(promises);

    const n8nResult = results.find(
      (r) => r.status === "fulfilled" && r.value && r.value.service === "n8n",
    );

    const summary = results.map((r) => {
      if (r.status === "fulfilled") {
        return { status: "fulfilled", value: r.value };
      } else {
        return { status: "rejected", reason: r.reason?.message || r.reason };
      }
    });

    console.log("Submission execution summary:", summary);

    // Forward the n8n response (with redirectUri) back to the client if available
    if (n8nResult && n8nResult.value.data) {
      return response.status(200).json(n8nResult.value.data);
    } else {
      return response.status(200).json({ success: true, summary });
    }
  } catch (e) {
    console.error("Handler Error:", e);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}
