const nodeMailer = require("nodemailer");

const defaultEmailData = { from: "noreply@node-react.com" };

// sendEmail
exports.sendEmail = emailData => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "namphamviet0710@gmail.com",
            pass: "l y u t g u v q m k h r r k w h"
        }
    });
    return (
        transporter
            .sendMail(emailData)
            .then(info => console.log(`Message sent: ${info.response}`))
            .catch(err => console.log(`Problem sending email: ${err}`))
    );
};
