
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing BREVO_API_KEY' });

  const listId = Number(process.env.BREVO_LIST_ID || '0');
  const { name = '', email = '', phone = '', objective = '', budget = '', date = '', source = 'Landing Phoenix', message = '' } = req.body || {};

  if (!email) return res.status(400).json({ error: 'Email is required' });

  const contactPayload = {
    email,
    attributes: {
      PRENOM: name,
      PHONE: phone,
      OBJECTIF: objective,
      BUDGET: budget,
      DATE: date,
      SOURCE: source,
      MESSAGE: message,
    },
    listIds: listId ? [listId] : [],
    updateEnabled: true,
  };

  const r = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(contactPayload),
  });
  const data = await r.json().catch(() => ({}));

  if (!r.ok && data?.code !== 'duplicate_parameter') {
    return res.status(500).json({ error: 'Brevo contacts error', details: data });
  }

  const notifyTo = process.env.BREVO_NOTIFY_TO;
  const senderEmail = process.env.BREVO_SENDER;

  if (notifyTo && senderEmail) {
    const html = `
      <h2>Nouveau lead – Landing Phoenix</h2>
      <ul>
        <li><b>Prénom</b>: ${escapeHtml(name)}</li>
        <li><b>Email</b>: ${escapeHtml(email)}</li>
        <li><b>Téléphone</b>: ${escapeHtml(phone)}</li>
        <li><b>Objectif</b>: ${escapeHtml(objective)}</li>
        <li><b>Budget</b>: ${escapeHtml(budget)}</li>
        <li><b>Date souhaitée</b>: ${escapeHtml(date)}</li>
        <li><b>Source</b>: ${escapeHtml(source)}</li>
        <li><b>Message</b>: ${escapeHtml(message)}</li>
      </ul>
    `;

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { email: senderEmail, name: 'Landing Phoenix' },
        to: [{ email: notifyTo }],
        subject: '🔥 Nouveau lead – Landing Phoenix',
        htmlContent: html,
      }),
    }).then(r=>r.json()).catch(()=>({}));
  }

  return res.status(200).json({ ok: true });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
