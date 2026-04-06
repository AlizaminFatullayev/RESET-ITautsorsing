require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/contact', async (req, res) => {
  const { name, company, email, package: pkg, note } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Ad və email tələb olunur.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Reset Contact <onboarding@resend.dev>',
        to: 'alizaminfatullayev100@gmail.com',
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
    if (response.ok) {
      res.json({ success: true });
    } else {
      console.error('Resend xətası:', JSON.stringify(data));
      res.status(500).json({ error: 'Mail göndərilə bilmədi.' });
    }
  } catch (err) {
    console.error('Mail göndərmə xətası:', err.message);
    res.status(500).json({ error: 'Mail göndərilə bilmədi.' });
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda işləyir → http://localhost:${PORT}`);
});
