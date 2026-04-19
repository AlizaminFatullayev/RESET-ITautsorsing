const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

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

  try {
    await resend.emails.send({
      from: 'Reset IT <onboarding@resend.dev>',
      to: 'alizaminfatullayev100@gmail.com',
      replyTo: email,
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
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Mail göndərmə xətası:', err.message);
    res.status(500).json({ error: 'Mail göndərilə bilmədi.' });
  }
};
