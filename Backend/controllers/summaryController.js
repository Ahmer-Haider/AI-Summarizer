import mammoth from 'mammoth';
import pdf from 'pdf-parse';
import { generateSummary } from '../services/aiService.js';
import { sendSummaryByEmail } from '../services/emailService.js';

const extractText = async (file) => {
    if (file.mimetype === 'application/pdf') {
        const data = await pdf(file.buffer);
        return data.text;
    }
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        return result.value;
    }
    if (file.mimetype === 'text/plain') {
        return file.buffer.toString('utf8');
    }
    throw new Error('Unsupported file type.');
};

export const createSummary = async (req, res) => {
    try {
        const { prompt, text: manualText } = req.body;
        let content = '';

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                content += await extractText(file) + '\n\n';
            }
        } else if (manualText) {
            content = manualText;
        } else {
            return res.status(400).json({ error: 'No text or file provided.' });
        }
        
        const summary = await generateSummary(content, prompt);
        res.json({ summary });
    } catch (error) {
        console.error('Summarization Error:', error);
        res.status(500).json({ error: error.message || 'Failed to generate summary.' });
    }
};

export const shareSummary = async (req, res) => {
    try {
        const { summary, recipients, emailBody } = req.body;
        if (!summary || !recipients || !recipients.length) {
            return res.status(400).json({ error: 'Summary and recipients are required.' });
        }
        await sendSummaryByEmail(summary, recipients, emailBody); 
        res.status(200).json({ message: 'Summary sent successfully!' });
    } catch (error) {
        console.error('Email Sharing Error:', error.message);
        res.status(500).json({ error: error.message || 'Failed to send email.' });
    }
};