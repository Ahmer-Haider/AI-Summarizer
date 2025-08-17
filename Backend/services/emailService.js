import nodemailer from 'nodemailer';
import { htmlToText } from 'html-to-text';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const sendSummaryByEmail = async (summary, recipients, emailBody) => {
    const invalidEmails = recipients.filter(email => !validateEmail(email));
    if (invalidEmails.length > 0) {
        throw new Error(`Invalid email address format: ${invalidEmails.join(', ')}`);
    }

    const htmlContent = `
        <div style="font-family: sans-serif; font-size: 16px; color: #333;">
            <p>Hello,</p>
            ${emailBody ? `<p>${emailBody.replace(/\n/g, '<br>')}</p>` : ''}
            <p>Here is the document summary you requested:</p>
            <div style="background-color:#f4f4f4; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
                <pre style="white-space: pre-wrap; font-family: sans-serif; font-size: 14px;">${summary}</pre>
            </div>
            <br>
            <p>Best regards,<br>Your AI Assistant</p>
        </div>
    `;

    const mailOptions = {
        from: `"AI Document Summarizer" <${process.env.EMAIL_USER}>`,
        to: recipients.join(','),
        subject: 'Your AI-Generated Summary',
        html: htmlContent,
        text: htmlToText(htmlContent),
    };
    
    await transporter.sendMail(mailOptions);
};