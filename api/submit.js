export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  const data = request.body || {};

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
    promises.push(
      fetch(`https://app.nocodb.com/api/v2/tables/${tableId}/records`, {
        method: "POST",
        headers: {
          "xc-token": nocoToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nocoPayload),
      }).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.error("NocoDB Error response:", text);
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
    promises.push(
      fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (res) => {
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
    const esputnikPayload = {
      firstName: name,
      channels: [
        ...(email ? [{ type: "email", value: email }] : []),
        ...(phone ? [{ type: "sms", value: phone.replace(/\D/g, "") }] : []),
      ],
    };

    // Add custom fields for eSputnik
    const esputnikFields = [];

    // 1. Джерело ліда (%CLIENT.LID_SOURSE% - ID 235251)
    esputnikFields.push({
      id: 235251,
      value: "AI Landing",
    });

    // 2. URL стрічки / лендингу (%PERSONAL.LANDING_URL% - ID 295300)
    if (dialogueUrl) {
      esputnikFields.push({
        id: 295300,
        value: dialogueUrl,
      });
    }

    // 3. Додаткове поле для відповідей на квіз (якщо налаштоване через ENV змінні)
    const esputnikQaFieldId = process.env.ESPUTNIK_QA_FIELD_ID;
    if (esputnikQaFieldId && qa) {
      esputnikFields.push({
        id: parseInt(esputnikQaFieldId, 10),
        value: qa,
      });
    }

    if (esputnikFields.length > 0) {
      esputnikPayload.fields = esputnikFields;
    }

    const esputnikAuth = Buffer.from(`user:${esputnikApiKey}`).toString(
      "base64",
    );
    promises.push(
      fetch("https://esputnik.com/api/v1/contact", {
        method: "POST",
        headers: {
          Authorization: `Basic ${esputnikAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(esputnikPayload),
      }).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.error("eSputnik Error response:", text);
          throw new Error(`eSputnik Error: ${res.status}`);
        }
        return { service: "eSputnik", success: true };
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
