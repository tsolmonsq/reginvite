export type FieldType = 'text' | 'checkbox' | 'radio' | 'textarea' | 'email' | 'number';

export interface Form {
  id: number;
  formFields: FormField[]
}

export interface FormField {
  id: number;
  label: string;
  type: string;
  is_required: boolean;
  options?: string[] | null;
}

export type Event = {
  id: number;
  title: string;
  location: string;
  start_date: string;
  end_date: string;
  imagePath: string;
};

export type EventData = {
  title: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  qr_image: string;
  rsvp_url: string;
};

export type Template = {
  id: number;
  name: string;
  html: string;
};

export interface InvitationTemplate {
  id: number;
  font: string;
  color: string;
  show_qr: boolean;
  show_rsvp: boolean;
  baseTemplate: Template;
}