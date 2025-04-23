export type FieldType = 'text' | 'checkbox' | 'radio' | 'textarea' | 'email' | 'number';

export interface FormField {
  id?: number;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
}

export type Event = {
  id: number;
  title: string;
  location: string;
  start_time: string;
  end_time: string;
  imagePath: string;
};

export type EventData = {
  title: string;
  location: string;
  start_time: string;
  end_time: string;
  description: string;
  qr_image: string;
  rsvp_url: string;
  invitationTemplate: InvitationTemplate
};

export type Template = {
  id: number;
  name: string;
  html: string;
  font: string;
  color: string
};

export interface InvitationTemplate {
  id: number;
  font: string;
  color: string;
  show_qr: boolean;
  show_rsvp: boolean;
  baseTemplate: Template;
}