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