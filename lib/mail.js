import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Sends an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 */
export async function sendMail({ to, subject, text, html }) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.warn('⚠️ SMTP settings not configured. Email not sent.');
        return null;
    }

    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'Three Diamonds Real Estate'}" <${process.env.SMTP_FROM_EMAIL}>`,
            to,
            subject,
            text,
            html,
        });
        console.log('✅ Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
}

/**
 * Email Template for Proposal Request
 */
export function getProposalEmailTemplate(name, propertyTitle) {
    return {
        subject: `Proposal Request Received - ${propertyTitle}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #1d4ed8;">Hello ${name},</h2>
        <p>Thank you for your interest in <strong>${propertyTitle}</strong>.</p>
        <p>This is to confirm that we have received your request for the property proposal. Our specialized team is currently preparing the comprehensive details for you.</p>
        <p>You can expect to receive the full documentation via email shortly. If you have any immediate questions, feel free to reply to this email or call us directly.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #666666;">
          <p>Best Regards,<br><strong>Three Diamonds Real Estate Team</strong></p>
          <p>Dubai, UAE | <a href="https://threediamonds.ae">threediamonds.ae</a></p>
        </div>
      </div>
    `,
        text: `Hello ${name}, thank you for your interest in ${propertyTitle}. We have received your request for the property proposal and will send it shortly.`
    };
}

/**
 * Email Template for Contact Submission
 */
export function getContactEmailTemplate(name, type = 'Contact') {
    const isBrochure = type.toLowerCase().includes('brochure');
    const subject = isBrochure ? 'Three Diamonds - Brochure Request' : 'Thank you for contacting Three Diamonds';

    return {
        subject,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #1d4ed8;">Hello ${name},</h2>
        <p>Thank you for reaching out to <strong>Three Diamonds Real Estate</strong>.</p>
        <p>${isBrochure
                ? 'We have received your request for our property brochure. We hope you find our portfolio impressive and aligned with your requirements.'
                : 'We have received your message and our team will get back to you as soon as possible.'}</p>
        <p>In the meantime, feel free to explore our latest listings on our website.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #666666;">
          <p>Best Regards,<br><strong>Three Diamonds Real Estate Team</strong></p>
          <p>Dubai, UAE | <a href="https://threediamonds.ae">threediamonds.ae</a></p>
        </div>
      </div>
    `,
        text: `Hello ${name}, thank you for reaching out to Three Diamonds Real Estate. We have received your ${isBrochure ? 'brochure request' : 'message'} and will get back to you shortly.`
    };
}

/**
 * Admin Notification Template
 */
export function getAdminNotificationTemplate(type, data) {
    return {
        subject: `New Lead: ${type}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #1d4ed8;">New ${type} Received</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${Object.entries(data).map(([key, value]) => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 30%; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1')}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${value}</td>
            </tr>
          `).join('')}
        </table>
        <p style="margin-top: 20px; font-size: 12px; color: #666666;">This is an automated notification from Three Diamonds Real Estate Admin System.</p>
      </div>
    `,
        text: `New ${type} received: ${Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(', ')}`
    };
}
/**
 * Email Template for Viewing Request
 */
export function getViewingEmailTemplate(name, propertyTitle, date, time) {
    return {
        subject: `Viewing Request Confirmation - ${propertyTitle}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #1d4ed8;">Hello ${name},</h2>
        <p>Thank you for scheduling a viewing for <strong>${propertyTitle}</strong>.</p>
        <p>We have received your request for the following slot:</p>
        <p style="background-color: #f8fafc; padding: 15px; border-radius: 5px; font-weight: bold;">
          Date: ${date}<br>
          Time: ${time}
        </p>
        <p>Our team will contact you shortly to confirm this appointment. Please note that this is a request and subject to availability until confirmed by our agent.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #666666;">
          <p>Best Regards,<br><strong>Three Diamonds Real Estate Team</strong></p>
          <p>Dubai, UAE | <a href="https://threediamonds.ae">threediamonds.ae</a></p>
        </div>
      </div>
    `,
        text: `Hello ${name}, thank you for scheduling a viewing for ${propertyTitle} on ${date} at ${time}. Our team will contact you shortly to confirm.`
    };
}
