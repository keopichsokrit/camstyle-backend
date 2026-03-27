const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        service: 'gmail', // Keep this as you had it
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
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Detailed Email Error:", error);
        throw error; // Rethrow so the controller catches it
    }
};

module.exports = sendEmail;