// lib/resend.ts
import { Resend } from "resend";

// console.log("Resend API Key present?", !!process.env.RESEND_API_KEY);

export const resend = new Resend(process.env.RESEND_API_KEY!);
