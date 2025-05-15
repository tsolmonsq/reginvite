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
  options: string; 
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
  id: number;
  name: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  qr_image: string;
  rsvp_url: string;
  image_path: string;
};

export type Template = {
  id: number;
  name: string;
  html: string;
};

export interface Invitation {
  id: number;
  font: string;
  color: string;
  has_qr: boolean;
  has_rsvp: boolean;
  event: EventData;
  template: Template;
}