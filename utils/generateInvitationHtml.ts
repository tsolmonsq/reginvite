import { EventData, InvitationTemplate } from "@/lib/types";

export function generateInvitationHtml(
  invitationTemplate: InvitationTemplate,
  event: EventData,
  showQR: boolean,
  showRSVP: boolean,
  font: string,
  color: string
): string {
  const html = invitationTemplate.baseTemplate?.html || '';

  return html
    .replaceAll('{{TITLE}}', event.title)
    .replaceAll('{{DESCRIPTION}}', event.description ?? '')
    .replaceAll('{{LOCATION}}', event.location)
    .replaceAll('{{START_TIME}}', new Date(event.start_time).toLocaleString())
    .replaceAll('{{END_TIME}}', new Date(event.end_time).toLocaleString())
    .replaceAll('{{COLOR}}', color)
    .replaceAll('{{FONT}}', font)
    .replaceAll('{{QR_SECTION}}', showQR ? `<div>[QR]</div>` : '')
    .replaceAll('{{RSVP_SECTION}}', showRSVP ? `<div>[RSVP]</div>` : '');
}
