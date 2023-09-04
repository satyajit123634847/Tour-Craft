var nodemailer = require('nodemailer');
const fs = require('fs');

exports.sendmail = (to, cc, subject, text, attachment, url) => {


    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'parthasarathy.ranganathan@airliquide.com',
            pass: 'Thiru@081980'
        }
    })

    var mail = {
        from: 'satyajitvarpe45@gmail.com',
        to: to,
        subject: subject,
        html: text,
       
    };

    transporter.sendMail(mail, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log(info);
        }
    });
}

exports.sendmail1 = (to, cc, subject, html, attachments) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'satyajitvarpe45@gmail.com',
            pass: 'imbdgnxvlttzuxxv'
        }
    });

    const mailOptions = {
        from: 'satyajitvarpe45@gmail.com',
        to: to,
        cc: cc,
        subject: subject,
        html: html,
        attachments: attachments
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log(info);
        }
    });
};


