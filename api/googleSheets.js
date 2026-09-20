import crypto from "crypto";

const SPREADSHEET_ID =
  process.env.B2B_UKRSIB_SPREADSHEET_ID ||
  "1DMWMSXsTUtmoJ5kKV_N2Kbld56Y0IPbArRKwNypfu4Q";

const CLIENT_EMAIL =
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
  "adsoulx@silken-eye-503718-k1.iam.gserviceaccount.com";

const PRIVATE_KEY =
  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ||
  `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDUJOg1oC6yr2FP
VVMQ7zK+SAYLIbncebhPkG10aqAM2AXcCVRMxfqDAYQ3oa6nI6o7IcsoWciW5one
8aCUL256ZvY2eG267O+l15DTQ0hYyXmK206OXDxFz85Bcge5qyUFH4sSumJIQhJS
Jbdij6cXdixJ6wx4PCrwzIOcqPPVIqlCodP9CNL2AAYxAtJHHgD0LcUyXKgvgYFz
gGgaPLSUUI6UqpbjcYnVpcyB9WKeEcVfeXyvOZ+1ZOSdkI8wZngrwzS1p1OjpORH
Fvxs8e05Qo5XPjJu+6RY+Kghf+098LiUmtFHVNhhKvoUKSz82LEr1KHwOPCzJmWW
xIGLal8TAgMBAAECggEAAWA8n803JM0u6wJYpI5VufqTKyPBKKCyWt8IWt1xImyC
5gSMRcNH/7nhz9SO7OTKi0dbsRpTfjDSJ0IzVkh36W2vAiAxogBGzjFB1LWWgY5a
5Ahn0nz90ZCTfm3FZ+VWIY0dkBmsSjGllzaGpp/wajLCtw5WhEQ9ji2BPE1r0x22
JqLH1LhnoHYFo5+T+uareRe1di7wZ0OTrE10wp7FEAAhCfZNXSFIEhS0UtyChSMs
qrFy3aao3zUn+MS7UPF+a0jKVviPfZBIbGi4ibQ8vDV80U0PqXammeMlgXzyl/Ql
PuaZ/EQgu+BBaFzTBsWlckvsSqed6Ot4elYaS1+jtQKBgQDveb89E4rabdstfLMA
+Z1W+fphdEXuWcgQpsM4gNg6PtyW1q8Ii95xSJzI/Bf/DsthxdMHCxsOnPNVGJnd
ARg5f1lYOqrrQE8J2L+vLP7SoHula+JW0L8+tqLnFq9azRUlGsg+QHdHO0MdnhKM
V1flCdrKn/F7PntInDWRPJMvnQKBgQDiyFw4LL5u7BEgzfts/VKePmNuEfK34bWZ
lfBs2iFY8y4Ut23mKE4vHEUCSnLuYMh9DCTjYvNh5bpQoLbN/Qvfmb/jAhk+Vc/6
FDoiwDYmGKxGDIU7XSWtO56e33F/PWBdTdpHlQdjchZB9/pyrv/N9j7eOp3SPj9I
1//3QqeCbwKBgQDjM50O81WPux5xX5ftWuW+OVkl0MzwQFoiAjXBi+yaBj3/Fhvm
fd1DmWK3BQY3RPANCUUXr5+yE5KBr9964Kj9FCfOH4s9uzvB2dSy/Huflgb5gQuy
1kY718difBFOkrh3BZvqA/ump0Eb/ncWk1+eu+TKzUisZzFMSHhCHTh/uQKBgHrr
YqDID8gLiBUh0H94pwlCg54reEWWv1mp3ZECgkS2OmncKmMvwYDjb7wYIkd2ifTN
WkktXwHXBK+jDLKFz6O4sDsY7hnNZVcFE6W2TSNFCEtHigdtK3jD8evm7Jus5shr
5D4cVs7eDZZgFI2IsPov2E+Xsec8+gw/l2ur4yNdAoGBALUJLkLUDow38+T7CcG1
rXD7oQZWhjDNGsY0srhoCBV/tL55iQF8DpOVLGIoV1XwFXZC6lTGlvUF7moKIwXq
3LGrXIzz5sMD2wC9bkMmsuk2lb6VyxU9LKtqpoYlNYJJDWELf92/u+2iFdRwB5bC
L1TWBslNq0KzQ1Uq0URGmbao
-----END PRIVATE KEY-----`;

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiresAt > now + 60) {
    return cachedToken;
  }

  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encode = (obj) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");
  const unsignedToken = `${encode(header)}.${encode(claimSet)}`;

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsignedToken);
  sign.end();
  const signature = sign.sign(PRIVATE_KEY, "base64url");
  const jwt = `${unsignedToken}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google OAuth2 error: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in || 3600);
  return cachedToken;
}

function parseFromQa(qaString, prefix) {
  if (!qaString || typeof qaString !== "string") return "";
  const parts = qaString.split("|||");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length).trim();
    }
  }
  return "";
}

export async function saveLeadToUkrSibSheet(data) {
  try {
    console.log("=== saveLeadToUkrSibSheet called ===");
    const token = await getAccessToken();

    // Format Kyiv time (UTC+2 / UTC+3 depending on daylight saving)
    const now = new Date();
    const kyivDateStr = now.toLocaleString("uk-UA", {
      timeZone: "Europe/Kiev",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const b2b = data.b2bData || {};
    const qa = data.qa || "";

    // Parse values from b2bData or fallback to qa string
    const name = data.name || data.Name || "";
    let rawPhone = String(data.phone || data.Phone || "").trim();
    let phone = rawPhone;
    if (rawPhone) {
      const digits = rawPhone.replace(/\D/g, "");
      phone = `'${digits ? "+" + digits : rawPhone}`;
    }
    const email = data.email || data.Email || "";
    const intensity =
      b2b.intensity || parseFromQa(qa, "Інтенсивність навчання:");
    const days = b2b.days || parseFromQa(qa, "Зручні дні для занять:");
    const times = b2b.times || parseFromQa(qa, "Зручний час для занять:");
    const level =
      b2b.level || parseFromQa(qa, "Поточний рівень англійської:");
    const goal = b2b.goal || parseFromQa(qa, "Основна мета вивчення:");
    const situations =
      b2b.situations ||
      parseFromQa(qa, "Ситуації використання англійської:");
    const skills =
      b2b.skills || parseFromQa(qa, "Навички для покращення:");
    const teacher =
      b2b.teacher || parseFromQa(qa, "Побажання щодо викладача:");
    const courseTrack =
      b2b.courseTrack || parseFromQa(qa, "Напрям навчання:");
    const company =
      data.company ||
      b2b.company ||
      "UKRSIBBANK BNP Paribas Group";

    // Parse IP and Country
    let ip = "";
    let country = "";
    if (qa && typeof qa === "string") {
      const matchIp = qa.match(/ip:(.*?)\|/);
      const matchCountry = qa.match(/country:(.*?)(?:\|\|\||$)/);
      if (matchIp) ip = matchIp[1].trim();
      if (matchCountry) country = matchCountry[1].trim();
    }
    if (!ip) ip = data.ip || "";
    if (!country) country = data.country || data.geo || "";

    const utmSource = data.utm_source || "";
    const utmMedium = data.utm_medium || "";
    const utmCampaign = data.utm_campaign || "";
    const dialogueUrl = data.dialogueUrl || data.url || "";

    // 20 columns exactly matching the sheet headers
    const row = [
      kyivDateStr,
      name,
      phone,
      email,
      intensity,
      days,
      times,
      level,
      goal,
      situations,
      skills,
      teacher,
      courseTrack,
      company,
      ip,
      country,
      utmSource,
      utmMedium,
      utmCampaign,
      dialogueUrl,
    ];

    console.log("Appending row to Google Sheets:", JSON.stringify(row));

    const sheetRange = encodeURIComponent("Лист1!A:T");
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetRange}:append?valueInputOption=USER_ENTERED`;

    const res = await fetch(appendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [row],
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(
        `Failed to append row to Google Sheet (${res.status}):`,
        errBody,
      );
      return { success: false, error: errBody };
    }

    const resData = await res.json();
    console.log("Successfully appended row to Google Sheet:", resData.updates);
    return { success: true, updates: resData.updates };
  } catch (err) {
    console.error("Error in saveLeadToUkrSibSheet:", err);
    return { success: false, error: err.message };
  }
}
