/**
 * Contact Form API Route — Cloudflare Pages Function
 *
 * Handles form submissions with:
 * - Honeypot spam detection
 * - Server-side validation
 * - Email sending via Cloudflare Email Workers or external SMTP
 *
 * Environment variables needed (set in Cloudflare Pages dashboard):
 * - CONTACT_EMAIL: recipient email (e.g., info@dealcostruzioni.it)
 * - MAILGUN_API_KEY: (optional) Mailgun API key for email delivery
 * - MAILGUN_DOMAIN: (optional) Mailgun domain
 */

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    // Honeypot check — if filled, it's a bot
    const honeypot = formData.get('website');
    if (honeypot) {
      // Silently reject but return 200 to not tip off bots
      return new Response(
        JSON.stringify({ success: true, message: 'Messaggio inviato con successo.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extract form fields
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim() || '';
    const azienda = (formData.get('azienda') as string)?.trim() || '';
    const oggetto = (formData.get('oggetto') as string)?.trim();
    const message = (formData.get('message') as string)?.trim();

    // Server-side validation
    const errors: string[] = [];

    if (!name) errors.push('Il campo Nome è obbligatorio.');
    if (!email) {
      errors.push('Il campo Email è obbligatorio.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Indirizzo email non valido.');
    }
    if (!oggetto) errors.push('Il campo Oggetto è obbligatorio.');
    if (!message) errors.push('Il campo Messaggio è obbligatorio.');

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ success: false, message: errors.join(' ') }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build email body
    const emailBody = `
Nuovo messaggio dal sito DEAL Costruzioni

Nome: ${name}
Email: ${email}
Telefono: ${phone || 'Non specificato'}
Azienda: ${azienda || 'Non specificata'}
Oggetto: ${oggetto}

Messaggio:
${message}

---
Inviato dal modulo di contatto di dealcostruzioni.it
    `.trim();

    // TODO: Configure email delivery.
    // Options for Cloudflare Pages:
    //
    // 1. Cloudflare Email Routing + Email Workers
    //    - Set up in Cloudflare dashboard
    //    - Use the Email Workers API
    //
    // 2. External SMTP via Mailgun/SendGrid/Resend
    //    - Set API keys as environment variables
    //    - Uncomment and configure the fetch call below
    //
    // 3. Simple webhook to Zapier/Make/n8n
    //    - Forward form data to automation platform
    //
    // Example with Resend:
    // const res = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${import.meta.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'noreply@dealcostruzioni.it',
    //     to: 'info@dealcostruzioni.it',
    //     subject: `[Sito Web] ${oggetto}`,
    //     text: emailBody,
    //   }),
    // });

    console.log('Contact form submission:', { name, email, oggetto, phone, azienda });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Messaggio inviato con successo. Ti risponderemo al più presto.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Errore interno del server. Riprova più tardi.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Reject non-POST methods
export const ALL: APIRoute = () => {
  return new Response(
    JSON.stringify({ success: false, message: 'Metodo non consentito.' }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
};
