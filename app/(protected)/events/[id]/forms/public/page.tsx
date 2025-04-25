// Enhanced Public Form Management with UX dialogs for max guests and form state
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormField } from '@/lib/types';
import { Button, Input, Select, Switch, DatePicker, message, Modal } from 'antd';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import apiFetch from '@/lib/api';
import dayjs from 'dayjs';

export default function PublicFormPage() {
  const { id } = useParams();
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newField, setNewField] = useState<FormField>({ label: '', type: 'text', required: false, options: [] });
  const [optionInputs, setOptionInputs] = useState<string[]>([]);
  const [maxGuests, setMaxGuests] = useState<number | undefined>(undefined);
  const [guestCount, setGuestCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [closeAt, setCloseAt] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const publicFormLink = `${baseUrl}/form/${id}`;

  useEffect(() => {
    const fetchFormData = async () => {
      const eventId = Number(id);
  
      const formData = await apiFetch(`/event-forms/${eventId}/public`);
      setFields(formData.fields || []);
      setMaxGuests(formData.max_guests);
      setIsOpen(formData.is_open);
      setCloseAt(formData.close_at);
  
      const stats = await apiFetch(`/event-forms/${eventId}/public/stats`);
      setGuestCount(stats.registered);
  
      setLoading(false);
    };
  
    fetchFormData();
  }, [id]);

  const handleSaveFields = async () => {
    const res = await apiFetch(`/event-forms/${id}/public`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    if (res.ok) message.success('Форм хадгалагдлаа');
  };

  const handleSettingsSave = async () => {
    if (maxGuests !== undefined && maxGuests < guestCount) {
      return message.error(`Одоогийн бүртгэлтэй ${guestCount} зочин байгаа тул ${maxGuests} болгож болохгүй`);
    }

    const res = await apiFetch(`/event-forms/${id}/public/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        max_guests: maxGuests,
        close_at: closeAt ? new Date(closeAt).toISOString() : undefined,
        is_open: isOpen,
      }),
    });

    if (res.ok) {
      message.success('Тохиргоо хадгалагдлаа');
      setShowSettingsModal(false);
    } else {
      message.error('Алдаа гарлаа');
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-primary mb-8">Маягт тохируулах</h1>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-700">Холбоос:</div>
          <div className="text-sm text-blue-600 underline cursor-pointer" onClick={() => navigator.clipboard.writeText(publicFormLink)}>
            {publicFormLink}
          </div>
        </div>
        <Button onClick={() => setShowSettingsModal(true)} className="border-primary text-primary">Тохиргоо</Button>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        Бүртгэгдсэн зочид: <span className="font-semibold">{guestCount}</span>
      </div>

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
                <textarea placeholder={field.label} required={field.required} className="w-full px-3 py-2 border rounded-md text-sm border-gray-300" />
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

        <button onClick={() => setModalOpen(true)} className="mt-6 inline-flex items-center px-3 py-2 text-sm text-primary border border-primary rounded-md hover:bg-[#ecf5f6]">
          ➕ Талбар нэмэх
        </button>
      </div>

      <div className="text-right mt-6">
        <Button type="primary" onClick={handleSaveFields} className="bg-primary text-white px-6 py-2 rounded-md text-sm font-semibold">
          Хадгалах
        </Button>
      </div>

      <Modal title="Формын тохиргоо" open={showSettingsModal} onCancel={() => setShowSettingsModal(false)} onOk={handleSettingsSave} okText="Хадгалах">
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Форм нээлттэй эсэх</label>
            <Switch checked={isOpen} onChange={(checked) => setIsOpen(checked)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Дээд зочдын тоо</label>
            <Input type="number" min={guestCount} value={maxGuests} onChange={(e) => setMaxGuests(Number(e.target.value))} />
            <small className="text-gray-500">Одоогийн бүртгэлтэй зочдын тоо: {guestCount}</small>
          </div>
          <div>
            <label className="block text-sm mb-1">Бүртгэл хаагдах огноо</label>
            <DatePicker
              className="w-full"
              value={closeAt ? dayjs(closeAt) : null}
              onChange={(val) => setCloseAt(val ? val.toISOString() : null)}
              showTime
              placeholder="Хугацаа сонгоно уу"
            />
          </div>
        </div>
      </Modal>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
        <DialogPanel className="bg-white max-w-md w-full p-6 rounded-lg shadow-xl">
            <DialogTitle className="text-lg font-semibold mb-4">Шинэ талбар нэмэх</DialogTitle>
            <div className="space-y-6">
        
              <Input 
                placeholder="Талбарын нэр" 
                value={newField.label} 
                onChange={(e) => setNewField({ ...newField, label: e.target.value })} 
                className="w-full"
              />
              
              <Select
                value={newField.type}
                onChange={(val) => {
                  setNewField({ ...newField, type: val });
                  if (val === 'checkbox' || val === 'radio') setOptionInputs(['']);
                }}
                className="w-full"
                options={['text', 'email', 'number', 'textarea', 'checkbox', 'radio'].map((t) => ({ label: t, value: t }))}
              />
             
              {(newField.type === 'checkbox' || newField.type === 'radio') && (
                <div className="space-y-3">
                  {optionInputs.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <Input 
                        value={opt} 
                        onChange={(e) => {
                          const updated = [...optionInputs];
                          updated[i] = e.target.value;
                          setOptionInputs(updated);
                        }} 
                        className="w-full"
                      />
                      <Button danger onClick={() => setOptionInputs(optionInputs.filter((_, j) => j !== i))}>
                        Устгах
                      </Button>
                    </div>
                  ))}
                  <Button onClick={() => setOptionInputs([...optionInputs, ''])}>Сонголт нэмэх</Button>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Switch checked={newField.required} onChange={(val) => setNewField({ ...newField, required: val })} />
                <span className="text-sm">Заавал бөглөх</span>
              </div>
              
              <div className="flex justify-end gap-4 pt-6">
                <Button onClick={() => setModalOpen(false)}>Болих</Button>
                <Button 
                  type="primary" 
                  className="bg-blue-600 text-white" 
                  onClick={() => {
                    const options = ['checkbox', 'radio'].includes(newField.type) ? optionInputs.filter(opt => opt.trim()) : [];
                    setFields([...fields, { ...newField, options }]);
                    setModalOpen(false);
                  }}
                >
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
