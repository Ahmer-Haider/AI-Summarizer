import nodemailer from 'nodemailer';
import { htmlToText } from 'html-to-text'; // Import a library to convert HTML to text

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// You'll need to install this helper library first:
// npm install html-to-text

export const sendSummaryByEmail = async (summary, recipients, emailBody) => {
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
        // ✅ ADD a plain text version of the email
        text: htmlToText(htmlContent),
    };

    await transporter.sendMail(mailOptions);
};