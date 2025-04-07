const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

const sendMail = async (type, to, subject, templateName, templateVariables) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: type === "info" ? process.env.SMTP_INFO_USER : process.env.SMTP_SUPPORT_USER,
            pass: process.env.SMTP_INFO_PASS,
        },
    });

    const templatePath = path.join(__dirname, "../templates/emails", `${templateName}.ejs`);

    const htmlContent = await ejs.renderFile(templatePath, { subject, ...templateVariables });

    const mailOptions = {
        from: type === "info" ? process.env.SMTP_INFO_USER : process.env.SMTP_SUPPORT_USER,
        to,
        subject,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Mail gönderildi:", info.response);
    } catch (err) {
        console.error("Mail gönderim hatası:", err.message);
    }
};

module.exports = { sendMail };
