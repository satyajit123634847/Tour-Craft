var nodemailer = require('nodemailer');
const fs = require('fs');

exports.sendmail = (to, cc, subject, text, attachment, url) => {


    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'parthasarathy.ranganathan@airliquide.com',
            pass: 'wyoifhtonaotimhp'
        }
    })

    var mail = {
        from: 'parthasarathy.ranganathan@airliquide.com',
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

exports.sendmail1 = (to, cc, subject, html, attachments,from,app_password) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: from,
            pass: app_password
        }
    });

    const mailOptions = {
        from: from,
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


// exports.sendmail1 = (to, cc, subject, html, attachments) => {
//     const transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 465,
//         secure: true, // use SSL
//         auth: {
//             user: 'parthasarathy.ranganathan@airliquide.com',
//             pass: 'wyoifhtonaotimhp'
//         }
//     });

//     const mailOptions = {
//         from: 'parthasarathy.ranganathan@airliquide.com',
//         to: to,
//         cc: cc,
//         subject: subject,
//         html: html,
//         attachments: attachments
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log(info);
//         }
//     });
// };



