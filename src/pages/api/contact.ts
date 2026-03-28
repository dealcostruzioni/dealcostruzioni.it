/**
 * Contact Form API Route — Vercel Serverless Function
 *
 * Handles form submissions with:
 * - Honeypot spam detection
 * - Server-side validation
 * - Email sending via Resend
 *
 * Environment variables (set in Vercel dashboard):
 * - RESEND_API_KEY: Resend API key
 * - CONTACT_EMAIL: recipient email
 */

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Support both JSON and FormData submissions
    const contentType = request.headers.get('content-type') || '';
    let fields: Record<string, string>;

    if (contentType.includes('application/json')) {
      fields = await request.json();
    } else {
      const formData = await request.formData();
      fields = {};
      formData.forEach((v, k) => { fields[k] = v as string; });
    }

    // Honeypot check — if filled, it's a bot
    if (fields.website) {
      return new Response(
        JSON.stringify({ success: true, message: 'Messaggio inviato con successo.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extract form fields
    const name = fields.name?.trim();
    const email = fields.email?.trim();
    const phone = fields.phone?.trim() || '';
    const azienda = fields.azienda?.trim() || '';
    const oggetto = fields.oggetto?.trim();
    const message = fields.message?.trim();

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

    // Build email body (HTML for better formatting in Outlook)
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3E5A5D; border-bottom: 2px solid #D4A853; padding-bottom: 10px;">
          Nuovo messaggio dal sito web
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; color: #333; width: 120px; vertical-align: top;">Nome:</td>
            <td style="padding: 8px 12px; color: #555;">${name}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px 12px; font-weight: bold; color: #333; vertical-align: top;">Email:</td>
            <td style="padding: 8px 12px; color: #555;"><a href="mailto:${email}" style="color: #3E5A5D;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; color: #333; vertical-align: top;">Telefono:</td>
            <td style="padding: 8px 12px; color: #555;">${phone || 'Non specificato'}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px 12px; font-weight: bold; color: #333; vertical-align: top;">Azienda:</td>
            <td style="padding: 8px 12px; color: #555;">${azienda || 'Non specificata'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; color: #333; vertical-align: top;">Oggetto:</td>
            <td style="padding: 8px 12px; color: #555;">${oggetto}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 16px; background: #f5f5f5; border-left: 3px solid #3E5A5D;">
          <p style="font-weight: bold; color: #333; margin: 0 0 8px 0;">Messaggio:</p>
          <p style="color: #555; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #999; margin-top: 10px;">
          Inviato dal modulo di contatto di dealcostruzioni.it
        </p>
      </div>
    `.trim();

    const emailText = `
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

    // Send email via Resend
    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    const CONTACT_EMAIL = import.meta.env.CONTACT_EMAIL || 'web@dealcostruzioni.it';

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, message: 'Configurazione email mancante. Contattaci direttamente a info@dealcostruzioni.it' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'DEAL Costruzioni Sito Web <onboarding@resend.dev>',
        to: CONTACT_EMAIL,
        reply_to: email,
        subject: `[Sito Web] ${oggetto}`,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend error:', errorData);
      return new Response(
        JSON.stringify({ success: false, message: 'Errore nell\'invio del messaggio. Riprova più tardi.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
