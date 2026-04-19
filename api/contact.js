function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, company, email, package: pkg, note } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Ad və email tələb olunur.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY env var is missing' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Reset IT <onboarding@resend.dev>',
        to: ['alizaminfatullayev100@gmail.com'],
        reply_to: email,
        subject: `Yeni müraciət — ${name} (${company || 'N/A'})`,
        html: `
          <h2>Yeni əlaqə formu müraciəti</h2>
          <table style="border-collapse:collapse;width:100%;max-width:500px;">
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Ad Soyad</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Şirkət</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(company || '—')}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(email)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Paket</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(pkg || '—')}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Qeyd</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(note || '—')}</td></tr>
          </table>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: data.message || JSON.stringify(data) });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Fetch xətası:', err.message);
    res.status(500).json({ error: err.message });
  }
};
