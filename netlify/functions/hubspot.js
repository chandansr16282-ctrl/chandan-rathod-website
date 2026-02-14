exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const name = (data.name || "").trim();
    const email = (data.email || "").trim();
    const phone = (data.phone || "").trim();
    const message = (data.message || "").trim();
    const leadType = (data.leadType || "Book a Call").trim();
    const timeframe = (data.timeframe || "").trim();
    const area = (data.area || "").trim();

    if (!name || !email || !phone) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    const apiKey = process.env.HUBSPOT_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: "Missing HUBSPOT_API_KEY" };
    }

    const payload = {
      properties: {
        firstname: name,
        email: email,
        phone: phone,
        lifecyclestage: "lead",
        lead_source: leadType,
        timeframe: timeframe,
        preferred_area: area,
        message: message
      }
    };

    const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await res.text();

    if (!res.ok) {
      return { statusCode: 500, body: result };
    }

    return {
      statusCode: 200,
      body: result
    };

  } catch (err) {
    return { statusCode: 500, body: String(err) };
  }
};
