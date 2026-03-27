const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        // DO NOT use service: 'gmail' here
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // FORCING IPv4
        family: 4, 
        // TIMEOUT PROTECTION
        connectionTimeout: 15000, 
        greetingTimeout: 15000,
        socketTimeout: 15000,
    });

    const mailOptions = {
        from: `"CamStyle Support" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        console.log(`Attempting to send email to ${options.email} via IPv4...`);
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Nodemailer Error detected:", error.message);
        throw error; 
    }
};

module.exports = sendEmail;