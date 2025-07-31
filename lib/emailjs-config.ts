// EmailJS Configuration
// Replace these values with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  PUBLIC_KEY: "ECvOkrIrKsJwAJFel", // Replace with your EmailJS public key
  SERVICE_ID: "service_nhvlciu", // Replace with your EmailJS service ID
  TEMPLATE_ID: "template_p6qp2ta", // Replace with your EmailJS template ID
}

// Email template parameters structure
export interface EmailTemplateParams {
  to_email: string
  from_name: string
  from_email: string
  subject: string
  message: string
  interested_in_joining: string
  reply_to: string
} 