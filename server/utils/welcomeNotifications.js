const nodemailer = require('nodemailer');

/**
 * Sends a welcome email to the newly registered user
 */
const sendWelcomeEmail = async (user) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `Fitness Club <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Welcome to Fitness Club! 🏋️‍♂️',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #2d2d2d; border-radius: 16px; overflow: hidden; background-color: #0a0a0a; color: #ffffff;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; letter-spacing: 3px; font-size: 28px; text-transform: uppercase; font-weight: 900;">WELCOME ABOARD</h1>
                    </div>
                    
                    <!-- Body -->
                    <div style="padding: 40px 30px; line-height: 1.8;">
                        <p style="font-size: 18px; color: #e5e7eb;">Hi <strong>${user.name}</strong>,</p>
                        <p style="font-size: 16px; color: #9ca3af;">Thank you for joining <strong>Fitness Club</strong>! Your fitness journey starts today. We are excited to help you achieve your goals.</p>
                        
                        <div style="background-color: #1a1a1a; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #333;">
                            <h3 style="color: #8b5cf6; margin-top: 0; font-size: 14px; text-transform: uppercase; tracking: 1px;">Your Account Details:</h3>
                            <p style="margin: 5px 0; font-size: 14px;"><span style="color: #6b7280;">Email:</span> ${user.email}</p>
                            <p style="margin: 5px 0; font-size: 14px;"><span style="color: #6b7280;">Mobile:</span> ${user.phone}</p>
                        </div>
                        
                        <p style="font-size: 16px; color: #9ca3af;">You can now log in to your dashboard to view your workouts, track your progress, and book fitness plans.</p>
                        
                        <div style="text-align: center; margin-top: 40px;">
                            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="background-color: #8b5cf6; color: white; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Go to Dashboard</a>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #111; padding: 25px; text-align: center; border-top: 1px solid #2d2d2d;">
                        <p style="margin: 0; color: #4b5563; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Train Hard. Stay Consistent.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome Email Sent to: ${user.email}`);
    } catch (error) {
        console.error('❌ Error sending welcome email:', error.message);
    }
};

/**
 * Simulates sending a WhatsApp welcome message
 */
const sendWelcomeWhatsApp = async (user) => {
    try {
        // In a real scenario, you would use Twilio or Meta WhatsApp Business API here
        // For now, we simulate the logic
        const message = `*WELCOME TO FITNESS CLUB!* 🏋️‍♂️\n\nHello ${user.name},\n\nYour registration is successful! We're thrilled to have you with us.\n\n*Your Details:*\n📧 Email: ${user.email}\n📱 Phone: ${user.phone}\n\nStart your journey by logging into our portal. See you at the gym!`;

        console.log(`--- SIMULATED WHATSAPP MESSAGE ---`);
        console.log(`To: ${user.phone}`);
        console.log(`Body: ${message}`);
        console.log(`----------------------------------`);

        // Return true to indicate "success" for simulation
        return true;
    } catch (error) {
        console.error('❌ Error sending welcome WhatsApp:', error.message);
    }
};

/**
 * Sends a real welcome SMS message using Twilio
 */
const sendWelcomeSMS = async (user) => {
    try {
        // Checking if Twilio credentials exist in .env
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
            console.log(`[Simulation] SMS to ${user.phone}: Welcome to Fitness Club, ${user.name}! Your registration is successful. Stay Strong!`);
            return;
        }

        const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        await client.messages.create({
            body: `FITNESS CLUB: Welcome ${user.name}! 🏋️‍♂️ Your registration is DONE. Email: ${user.email}. Check your dashboard for your first workout!`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${user.phone}` // Assuming Indian number, adjust as needed
        });

        console.log(`✅ Welcome SMS Sent to: ${user.phone}`);
    } catch (error) {
        console.error('❌ Error sending welcome SMS:', error.message);
    }
};

module.exports = { sendWelcomeEmail, sendWelcomeWhatsApp, sendWelcomeSMS };
