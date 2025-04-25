'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormField } from '@/lib/types';
import { Button, Input, Select, Switch, message } from 'antd';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import apiFetch from '@/lib/api';

export default function PublicFormPage() {
  const { id } = useParams();
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newField, setNewField] = useState<FormField>({
    label: '',
    type: 'text',
    required: false,
    options: []
  });
  const [optionInputs, setOptionInputs] = useState<string[]>([]);

  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:3000';

  const publicFormLink = `${baseUrl}/form/${id}`;

  useEffect(() => {
    const eventId = Number(id); 
    apiFetch(`/event-forms/${eventId}/rsvp`)
      .then((data) => {
        setFields(data.fields || []);
        setLoading(false);
      });
  }, [id]);

  const handleFieldChange = (index: number, updated: FormField) => {
    const newFields = [...fields];
    newFields[index] = updated;
    setFields(newFields);
  };

  const handleAddFieldClick = () => {
    setNewField({ label: '', type: 'text', required: false, options: [] });
    setOptionInputs([]);
    setModalOpen(true);
  };

  const handleModalSave = () => {
    const options = ['checkbox', 'radio'].includes(newField.type) ? optionInputs.filter(opt => opt.trim()) : [];
    setFields([...fields, { ...newField, options }]);
    setModalOpen(false);
  };

  const handleSave = async () => {
    const res = await apiFetch(`/event-forms/${id}/rsvp`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    if (res.ok) message.success('Форм хадгалагдлаа');
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-primary mb-8">
        Маягт тохируулах
      </h1>

      <div className="bg-[#f7fafa] border p-6 rounded-xl shadow-sm">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-800 mb-1">{field.label}</label>
              {field.type === 'radio' && field.options ? (
                <div className="space-y-1">
                  {field.options.map((opt, j) => (
                    <label key={j} className="flex items-center gap-2 text-sm">
                      <input type="radio" name={`radio-${i}`} className="accent-primary" />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : field.type === 'checkbox' && field.options ? (
                <div className="space-y-1">
                  {field.options.map((opt, j) => (
                    <label key={j} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="accent-primary" />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : field.type === 'textarea' ? (
                <textarea
                  placeholder={field.label}
                  required={field.required}
                  className="w-full px-3 py-2 border rounded-md text-sm border-gray-300"
                />
              ) : (
                <input
                  type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'}
                  placeholder={field.label}
                  required={field.required}
                  className="w-full px-3 py-2 border rounded-md text-sm border-gray-300"
                />
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddFieldClick}
          className="mt-6 inline-flex items-center px-3 py-2 text-sm text-primary border border-primary rounded-md hover:bg-[#ecf5f6]"
        >
          <span className="mr-1">➕</span> Талбар нэмэх
        </button>
      </div>

      <div className="text-right mt-6">
        <Button
          type="primary"
          onClick={handleSave}
          className="bg-primary text-white px-6 py-2 rounded-md text-sm font-semibold"
        >
          Хадгалах
        </Button>
      </div>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <DialogPanel className="bg-white max-w-md w-full p-6 rounded-lg shadow-xl">
            <DialogTitle className="text-lg font-semibold mb-4">Шинэ талбар нэмэх</DialogTitle>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Талбарын нэр</label>
                <Input
                  value={newField.label}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  placeholder="Жишээ: Гишүүнчлэлийн дугаар"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Төрөл</label>
                <Select
                  value={newField.type}
                  onChange={(val) => {
                    setNewField({ ...newField, type: val });
                    if (val === 'checkbox' || val === 'radio') {
                      setOptionInputs(['']);
                    }
                  }}
                  className="w-full"
                  options={[
                    { value: 'text', label: 'Text' },
                    { value: 'email', label: 'Email' },
                    { value: 'number', label: 'Number' },
                    { value: 'textarea', label: 'Textarea' },
                    { value: 'checkbox', label: 'Checkbox' },
                    { value: 'radio', label: 'Radio' },
                  ]}
                />
              </div>
              {(newField.type === 'checkbox' || newField.type === 'radio') && (
                <div>
                  <label className="block text-sm font-medium mb-1">Сонголтууд</label>
                  <div className="space-y-2">
                    {optionInputs.map((val, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input
                          value={val}
                          onChange={(e) => {
                            const updated = [...optionInputs];
                            updated[idx] = e.target.value;
                            setOptionInputs(updated);
                          }}
                          className="flex-1"
                        />
                        <Button danger onClick={() => setOptionInputs(optionInputs.filter((_, i) => i !== idx))}>
                          Устгах
                        </Button>
                      </div>
                    ))}
                    <Button onClick={() => setOptionInputs([...optionInputs, ''])}>Сонголт нэмэх</Button>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Switch
                  checked={newField.required}
                  onChange={(val) => setNewField({ ...newField, required: val })}
                />
                <span className="text-sm">Заавал бөглөх</span>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={() => setModalOpen(false)}>Болих</Button>
                <Button type="primary" className="bg-blue-600 text-white" onClick={handleModalSave}>
                  Нэмэх
                </Button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
}