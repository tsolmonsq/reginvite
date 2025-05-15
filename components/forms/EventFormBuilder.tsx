import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import FormFieldEditor from '@/components/forms/FormFieldEditor';
import { FormField } from '@/lib/types';
import apiFetch from '@/lib/api';

interface Props {
  eventId: string;
}

export default function EventFormBuilder({ eventId }: Props) {
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/event-forms/${eventId}`)
      .then((data) => {
        setFields(data.fields || []);
        setLoading(false);
      });
  }, [eventId]);

  const handleSave = async () => {
    const res = await apiFetch(`/event-forms/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    if (res.ok) {
      message.success('Хадгалагдлаа');
    }
  };

  const handleFieldChange = (index: number, updated: FormField) => {
    const newFields = [...fields];
    newFields[index] = updated;
    setFields(newFields);
  };

  const handleFieldDelete = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {fields.map((field, i) => (
        <FormFieldEditor
          key={i}
          field={field}
          onChange={(updated) => handleFieldChange(i, updated)}
          onDelete={() => handleFieldDelete(i)}
        />
      ))}

      <Button
        onClick={() =>
          setFields([...fields, { label: '', type: 'text', is_required: false}])
        }
      >
        ➕ Талбар нэмэх
      </Button>

      <div className="text-right">
        <Button type="primary" onClick={handleSave} className="bg-primary text-white">
          Хадгалах
        </Button>
      </div>
    </div>
  );
}
