// pages/api/send-email.ts

import type { NextApiRequest, NextApiResponse } from 'next';

interface EmailRequest {
    to: string;
    subject: string;
    text: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { to, subject, text }: EmailRequest = req.body;

        try {
            // Call your NestJS backend to send the email
            const response = await fetch('http://localhost:3001/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ to, subject, text }),
            });

            const data = await response.json();

            if (response.ok) {
                return res.status(200).json(data);
            } else {
                return res.status(response.status).json({ message: 'Error sending email', details: data.error });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error sending email' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
