"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormField } from '@/lib/types';
import { Button, Input, Select, Switch, message, Table, Pagination } from 'antd';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import apiFetch from '@/lib/api';

export default function PublicFormPage() {
  const { id } = useParams();
  const [fields, setFields] = useState<FormField[]>([]);
  const [responses, setResponses] = useState<any[]>([]); // Зочдын хариулт хадгалах
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newField, setNewField] = useState<FormField>({
    id: 0,
    label: '',
    type: 'text',
    is_required: false,
    options: []
  });
  const [optionInputs, setOptionInputs] = useState<string[]>([]);

  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:3000';

  const publicFormLink = `${baseUrl}/form/${id}`;

  useEffect(() => {
    const eventId = Number(id);
    apiFetch(`/forms/rsvp/${eventId}`)
      .then((data) => {
        const formFields = data.formFields.map((field: FormField) => {
          if (typeof field.options === 'string') {
            field.options = field.options.split(',');
          } else if (!Array.isArray(field.options)) {
            field.options = [];
          }
          return field;
        });

        setFields(formFields || []);
        setLoading(false);
      });

    // Зочдын хариултуудыг авах
    apiFetch(`/forms/rsvp/${eventId}/responses`)
      .then((data) => {
        setResponses(data.items || []);
      });
  }, [id]);

  const handleSave = async () => {
    const res = await apiFetch(`/forms/rsvp/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    if (res.ok) message.success('Форм хадгалагдлаа');
  };

  // Колонуудыг динамик байдлаар үүсгэх
  const columns = [
    { title: 'Овог', dataIndex: 'last_name', key: 'last_name' },
    { title: 'Нэр', dataIndex: 'first_name', key: 'first_name' },
    { title: 'Имэйл', dataIndex: 'email', key: 'email' },
    { title: 'Утасны дугаар', dataIndex: 'phone_number', key: 'phone_number' },
    ...fields.map((field, i) => ({
      title: field.label,
      dataIndex: `field_${i}`,
      key: `field_${i}`,
      render: (text: any) => <span>{text}</span>,
    })),
  ];

  // Хариултуудыг хүснэгтэд тохируулах
  const data = responses.map((response, index) => {
    const rowData: any = {
      key: response.id,
      last_name: response.last_name,
      first_name: response.first_name,
      email: response.email,
      phone_number: response.phone_number,
    };

    // Талбар бүрийн утгыг авчрах
    fields.forEach((field, i) => {
      const fieldValue = response.fields.find((f: any) => f.label === field.label)?.value;
      rowData[`field_${i}`] = fieldValue;
    });

    return rowData;
  });

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-primary mb-8">
        Маягт тохируулах
      </h1>

      {/* Маягт тохируулах хэсэг */}
      <div className="bg-[#f7fafa] border p-6 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-800 mb-1">{field.label}</label>
              {field.type === 'radio' && field.options ? (
                <div className="space-y-1">
                  {Array.isArray(field.options)
                    ? field.options.map((opt, j) => (
                        <label key={j} className="flex items-center gap-2 text-sm">
                          <input type="radio" name={`radio-${i}`} className="accent-primary" />
                          {opt}
                        </label>
                      ))
                    : field.options.split(',').map((opt, j) => (
                        <label key={j} className="flex items-center gap-2 text-sm">
                          <input type="radio" name={`radio-${i}`} className="accent-primary" />
                          {opt}
                        </label>
                      ))}
                </div>
              ) : field.type === 'checkbox' && field.options ? (
                <div className="space-y-1">
                  {Array.isArray(field.options)
                    ? field.options.map((opt, j) => (
                        <label key={j} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="accent-primary" />
                          {opt}
                        </label>
                      ))
                    : field.options.split(',').map((opt, j) => (
                        <label key={j} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="accent-primary" />
                          {opt}
                        </label>
                      ))}
                </div>
              ) : field.type === 'textarea' ? (
                <textarea
                  placeholder={field.label}
                  required={field.is_required}
                  className="w-full px-3 py-2 border rounded-md text-sm border-gray-300"
                />
              ) : (
                <input
                  type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'}
                  placeholder={field.label}
                  required={field.is_required}
                  className="w-full px-3 py-2 border rounded-md text-sm border-gray-300"
                />
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-6 inline-flex items-center px-3 py-2 text-sm text-primary border border-primary rounded-md hover:bg-[#ecf5f6]"
        >
          <span className="mr-1">➕</span> Талбар нэмэх
        </button>
      </div>

      {/* Хариултуудын хүснэгт */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Хариу өгсөн зочид</h2>
        <Table columns={columns} dataSource={data} pagination={false} rowKey="key" />

        {/* Пагинаци */}
        <Pagination
          total={6} // Replace with `total` from the API response
          pageSize={10}
          current={1} // Replace with `currentPage` from the API response
          onChange={(page) => {
            console.log(`Current Page: ${page}`);
          }}
          className="mt-6"
        />
      </div>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <DialogPanel className="bg-white max-w-md w-full p-6 rounded-lg shadow-xl">
            <DialogTitle className="text-lg font-semibold mb-4">Шинэ талбар нэмэх</DialogTitle>
            <div className="space-y-4">
              {/* Modal content for adding new fields remains the same */}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
}
