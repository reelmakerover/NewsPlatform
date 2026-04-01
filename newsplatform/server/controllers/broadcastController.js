const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email transporter
const getTransporter = () => nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  }
});

// Send bulk email
exports.sendBulkEmail = async (req, res) => {
  try {
    const { subject, message, targetPlan, htmlContent } = req.body;
    if (!subject || !message) return res.status(400).json({ success: false, message: 'Subject aur message required hai' });

    // Target users based on plan
    const query = { isActive: true };
    if (targetPlan === 'premium') query['subscription.plan'] = { $in: ['basic','premium','annual'] };
    else if (targetPlan === 'free') query['subscription.plan'] = 'free';

    const users = await User.find(query).select('name email').lean();
    if (!users.length) return res.status(400).json({ success: false, message: 'Koi user nahi mila' });

    const transporter = getTransporter();
    let sent = 0, failed = 0;

    // Send in batches of 50
    const batchSize = 50;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const emails = batch.map(u => u.email).join(',');
      try {
        await transporter.sendMail({
          from: `"IndiaInk" <${process.env.EMAIL_USER}>`,
          bcc: emails,
          subject,
          text: message,
          html: htmlContent || `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:#1a1a1a;padding:20px;text-align:center;">
                <h1 style="color:white;margin:0;">India<span style="color:#E03535">Ink</span></h1>
              </div>
              <div style="padding:30px;background:#f9f9f9;">
                <p style="font-size:16px;line-height:1.6;color:#333;">${message.replace(/\n/g,'<br/>')}</p>
              </div>
              <div style="padding:15px;text-align:center;background:#eee;font-size:12px;color:#666;">
                <a href="${process.env.CLIENT_URL}/unsubscribe">Unsubscribe</a>
              </div>
            </div>`
        });
        sent += batch.length;
      } catch(e) { failed += batch.length; }
    }

    res.json({ success: true, message: `✅ ${sent} emails sent, ${failed} failed`, sent, failed, total: users.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Send bulk SMS via Fast2SMS (Indian SMS gateway - free tier available)
exports.sendBulkSMS = async (req, res) => {
  try {
    const { message, targetPlan } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message required hai' });
    if (message.length > 160) return res.status(400).json({ success: false, message: 'SMS max 160 characters' });

    const query = { isActive: true, phone: { $ne: '', $exists: true } };
    if (targetPlan === 'premium') query['subscription.plan'] = { $in: ['basic','premium','annual'] };
    else if (targetPlan === 'free') query['subscription.plan'] = 'free';

    const users = await User.find(query).select('phone').lean();
    const phones = users.map(u => u.phone).filter(p => p && p.length >= 10)
      .map(p => p.replace(/\D/g, '').slice(-10)).filter(p => p.length === 10);

    if (!phones.length) return res.status(400).json({ success: false, message: 'Koi valid phone number nahi mila' });

    // Fast2SMS API
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: { 'authorization': process.env.FAST2SMS_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        route: 'q',
        message,
        language: 'english',
        flash: 0,
        numbers: phones.join(',')
      })
    });
    const data = await response.json();
    if (data.return) {
      res.json({ success: true, message: `✅ SMS sent to ${phones.length} numbers`, count: phones.length });
    } else {
      res.status(400).json({ success: false, message: data.message || 'SMS failed', details: data });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get broadcast stats
exports.getBroadcastStats = async (req, res) => {
  try {
    const [total, premium, withPhone, withEmail] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true, 'subscription.plan': { $in: ['basic','premium','annual'] } }),
      User.countDocuments({ isActive: true, phone: { $ne: '', $exists: true } }),
      User.countDocuments({ isActive: true, email: { $exists: true } }),
    ]);
    res.json({ success: true, stats: { total, premium, free: total - premium, withPhone, withEmail } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
