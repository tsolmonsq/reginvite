import { Input, Select, Switch } from 'antd';
import { FormField } from '@/lib/types';

interface Props {
  field: FormField;
  onChange: (updated: FormField) => void;
  onDelete: () => void;
}

const fieldTypes = ['text', 'checkbox', 'radio', 'textarea', 'email', 'number'];

export default function FormFieldEditor({ field, onChange, onDelete }: Props) {
  console.log("<<<field:", field)
  return (
    <div className="border p-4 rounded-lg mb-3 bg-white shadow-sm space-y-2">
      <Input
        value={field.label}
        placeholder="Талбарын нэр"
        onChange={(e) => onChange({ ...field, label: e.target.value })}
      />

      <Select
        value={field.type}
        onChange={(val) => onChange({ ...field, type: val })}
        options={fieldTypes.map((t) => ({ label: t, value: t }))}
      />

      {['checkbox', 'radio'].includes(field.type) && (
        <Input
          placeholder="Сонголтууд (зайгаар тусгаарлан бичнэ)"
          value={field.options?.join(' ') || ''}
          onChange={(e) =>
            onChange({ ...field, options: e.target.value.split(' ') })
          }
        />
      )}

      <div className="flex items-center gap-2">
        <Switch
          checked={field.required}
          onChange={(val) => onChange({ ...field, required: val })}
        />
        <span>Заавал бөглөх</span>
        <button
          onClick={onDelete}
          className="ml-auto text-red-500 text-sm underline"
        >
          Устгах
        </button>
      </div>
    </div>
  );
}
