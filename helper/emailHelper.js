var nodemailer = require('nodemailer');

exports.sendmail = (to, cc, subject, text, attachment, url) => {


    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'satyajitvarpe45@gmail.com',
            pass: 'imbdgnxvlttzuxxv'
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


