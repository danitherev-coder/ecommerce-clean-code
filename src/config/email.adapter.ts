import nodemailer, { Transporter } from 'nodemailer';

export interface SendEmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    htmlBody?: string;
}

export class EmailAdapter {

    private transporter: Transporter;

    constructor(
        mailerService: string,
        mailerEmail: string,
        senderEmailPassword: string,
    ) {
        this.transporter = nodemailer.createTransport({
            service: mailerService,
            auth: {
                user: mailerEmail,
                pass: senderEmailPassword
            }
        });
    }


    async sendEmail(options: SendEmailOptions): Promise<string> {
        const { to, subject, text, htmlBody } = options;

        try {
            const sentInformation = await this.transporter.sendMail({
                from: '"Ecommerce"',
                to,
                subject,
                text,
                html: htmlBody
            })


            console.log('Email enviado');
            return sentInformation
        } catch (error) {
            console.log(error, 'no se puedo enviar el email');            
            throw error;
        }
    }

}
