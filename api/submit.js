export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const data = request.body;

    // 1. Prepare data for NocoDB
    // We try to map the incoming data to likely column names.
    // The columns in your "Landing_FB" table should be:
    // Name, Phone, Email, QA, IP, Country, DialogueUrl, Title
    
    // Parse IP and Country from the QA string for cleaner database entry
    let ip = '';
    let country = '';
    if (data.qa && typeof data.qa === 'string') {
        const parts = data.qa.split('|||');
        if (parts.length > 0) {
            const ipPart = parts[0]; // "ip:1.2.3.4|country:UA"
            const matchIp = ipPart.match(/ip:(.*?)\|/);
            const matchCountry = ipPart.match(/country:(.*?)$/);
            if (matchIp) ip = matchIp[1];
            if (matchCountry) country = matchCountry[1];
        }
    }

    const nocoPayload = {
        "Title": data.name, // Map Name to Title (Primary Value)
        "Name": data.name,
        "Phone": data.phone,
        "Email": data.email,
        "QA": data.qa,
        "IP": ip,
        "Country": country,
        "DialogueUrl": data.dialogueUrl
    };

    const nocoToken = 'xKYg5pA_NAjvwAtnl9IGkJd---0F5BN8MFm992xO';
    const tableId = 'mwyhw2a79xopbef';

    try {
        // Send to NocoDB and n8n in parallel
        const results = await Promise.allSettled([
            fetch(`https://app.nocodb.com/api/v2/tables/${tableId}/records`, {
                method: 'POST',
                headers: {
                    'xc-token': nocoToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nocoPayload)
            }),
            fetch("https://n8n.justschool.me/webhook/19be50df-0410-4330-8dcb-3797fa703c56", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
        ]);

        const nocoRes = results[0];
        const n8nRes = results[1];

        // Log NocoDB errors if any (server-side logs)
        if (nocoRes.status === 'rejected') {
            console.error('NocoDB Failed:', nocoRes.reason);
        } else if (nocoRes.status === 'fulfilled' && !nocoRes.value.ok) {
            console.error('NocoDB Error:', await nocoRes.value.text());
        }

        // Return n8n response to frontend (it expects redirectUri)
        if (n8nRes.status === 'fulfilled' && n8nRes.value.ok) {
            const n8nJson = await n8nRes.value.json();
            return response.status(200).json(n8nJson);
        } else {
            // If n8n fails, just return success so user isn't blocked
            return response.status(200).json({ success: true });
        }

    } catch (e) {
        console.error('Handler Error:', e);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}
