import { EventData, Template } from "@/lib/types";

export function generateInvitationHtml(
  template: Template,
  event: EventData,
  showQR: boolean,
  showRSVP: boolean,
  font: string,
  color: string
): string {
  if (!template || !template.html) return '';

  const QR_SECTION = showQR
    ? `<div style="margin-top: 16px;"><img src="/qr_dummy.png" alt="QR Code" style="width:100px;height:100px;border-radius:8px;" /></div>`
    : '';

  const RSVP_SECTION = showRSVP
    ? `<div style="margin-top: 16px;"><a href="#" style="display: inline-block; background: ${color}; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-weight: 500;">RSVP</a></div>`
    : '';

    return template.html
    .replaceAll('{{TITLE}}', event.name)
    .replaceAll('{{DESCRIPTION}}', event.description ?? '')
    .replaceAll('{{LOCATION}}', event.location)
    .replaceAll('{{START_DATE}}', event.start_date ? new Date(event.start_date).toLocaleString() : '')
    .replaceAll('{{END_DATE}}', event.end_date ? new Date(event.end_date).toLocaleString() : '')
    .replaceAll('{{COLOR}}', color)
    .replaceAll('{{FONT}}', font)
    .replaceAll('{{QR_SECTION}}', QR_SECTION)
    .replaceAll('{{RSVP_SECTION}}', RSVP_SECTION);  
}
