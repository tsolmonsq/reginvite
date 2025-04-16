export type FieldType = 'text' | 'checkbox' | 'radio' | 'textarea' | 'email' | 'number';

export interface FormField {
  id?: number;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
}