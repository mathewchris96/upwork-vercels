const nodemailer = require('nodemailer');
const crypto = require('crypto');

// SMTP settings or Email Service Provider configuration
const smtpConfig = {
    host: 'smtp.example.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'user@example.com',
        pass: 'password'
    }
};

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(smtpConfig);

function generateVerificationToken(size = 20) {
    return crypto.randomBytes(size).toString('hex');
}

function saveVerificationTokenToUser(userId, token) {
    // Logic to save the token to the user's record in the database
    console.log(`Saving verification token for user ${userId}`);
    // This is a placeholder for actual database interaction logic
}

function sendVerificationEmail(userEmail, token) {
    const verificationLink = `http://yourdomain.com/verify-email?token=${token}`;
    const mailOptions = {
        from: '"YourCompany" <noreply@yourcompany.com>', // sender address
        to: userEmail, // list of receivers
        subject: 'Email Verification', // Subject line
        text: `Please click on the following link to verify your email: ${verificationLink}`, // plain text body
        html: `<b>Please click on the following link to verify your email:</b> <a href="${verificationLink}">Verify Email</a>` // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}

module.exports = { generateVerificationToken, saveVerificationTokenToUser, sendVerificationEmail };
```