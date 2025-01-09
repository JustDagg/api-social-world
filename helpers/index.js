const nodeMailer = require("nodemailer");
require("dotenv").config();

const defaultEmailData = { from: process.env.EMAIL_FROM };

// sendEmail
exports.sendEmail = emailData => {
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        ...emailData,
        from: defaultEmailData.from
    };

    return transporter
        .sendMail(mailOptions)
        .then(info => console.log(`Message sent: ${info.response}`))
        .catch(err => console.log(`Problem sending email: ${err}`));
};
