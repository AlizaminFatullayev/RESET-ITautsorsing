const nodemailer = require('nodemailer');

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, company, email, package: pkg, note } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Ad və email tələb olunur.' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `"Reset Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `Yeni müraciət — ${name} (${company || 'N/A'})`,
      html: `<h2>Yeni müraciət</h2>
        <table style="border-collapse:collapse;max-width:500px">
          <tr><td style="padding:8px;border:1px solid #ddd"><b>Ad</b></td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd"><b>Şirkət</b></td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(company || '—')}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd"><b>Email</b></td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd"><b>Paket</b></td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(pkg || '—')}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd"><b>Qeyd</b></td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(note || '—')}</td></tr>
        </table>`,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Mail error:', err.message);
    res.status(500).json({ error: 'Mail göndərilə bilmədi.' });
  }
};
