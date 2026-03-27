const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // --- ADD THIS TO FIX ENETUNREACH ---
        connectionTimeout: 10000, 
        socketTimeout: 10000,
        dnsTimeout: 5000,
        // This forces the connection to use IPv4 instead of IPv6
        family: 4
    });

    const mailOptions = {
        from: `"CamStyle Support" <${process.env.EMAIL_USER}>`,
        to: options.email, // Dynamic: The user's email
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;