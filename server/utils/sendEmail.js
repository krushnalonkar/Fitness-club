const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // 2. Define email options
    const mailOptions = {
        from: `Gym Portal <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #fcfcfc;">
                <!-- Header -->
                <div style="background-color: #8b5cf6; padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0; letter-spacing: 2px; font-size: 24px; text-transform: uppercase;">Gym Portal Response</h1>
                </div>
                
                <!-- Body -->
                <div style="padding: 30px; line-height: 1.6; color: #333;">
                    <p style="font-size: 16px;">Hello <strong>${options.name}</strong>,</p>
                    <p style="font-size: 16px;">Thank you for contacting us. Regarding your inquiry on <strong>"${options.originSubject}"</strong>:</p>
                    
                    <div style="background-color: #f3f4f6; border-left: 4px solid #8b5cf6; padding: 20px; margin: 25px 0; border-radius: 4px; font-style: italic;">
                        "${options.message}"
                    </div>
                    
                    <p style="font-size: 16px;">We hope this information helps. If you have any further questions, please don't hesitate to reach out again.</p>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Stay Strong. Stay Healthy.</p>
                </div>
            </div>
        `
    };

    // 3. Send email
    try {
        console.log(`Attempting to send email to ${options.email}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully: ${info.response}`);
        return info;
    } catch (error) {
        console.error(`❌ Mailer Error for ${options.email}:`, error.message);
        throw error;
    }
};

module.exports = sendEmail;
