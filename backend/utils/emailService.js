const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create a transporter
    // For production, use a service like SendGrid, Mailgun, or Gmail
    // For development, we can use Mailtrap or a dummy transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Example using Gmail
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 2) Define the email options
    const mailOptions = {
        from: `Mall & Online Offers <${process.env.EMAIL_FROM || 'noreply@malloffers.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: 
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
