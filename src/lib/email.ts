import { Resend } from "resend";

let cached: Resend | null = null;
function client() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!cached) cached = new Resend(process.env.RESEND_API_KEY);
  return cached;
}

export async function sendContactEmail(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const c = client();
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
  if (!c || !to) {
    console.warn("[email] Resend not configured; skipping send.");
    return { skipped: true };
  }
  const subject = input.subject?.trim() || `New portfolio message from ${input.name}`;
  const text = `Name: ${input.name}\nEmail: ${input.email}\n\n${input.message}`;
  const html = `
    <h2>New portfolio message</h2>
    <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
    ${input.subject ? `<p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>` : ""}
    <p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>
  `;
  const { error } = await c.emails.send({ from, to, subject, replyTo: input.email, text, html });
  if (error) throw new Error(error.message);
  return { skipped: false };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
