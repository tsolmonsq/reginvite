'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input, message, Skeleton } from 'antd';
import { FormField } from '@/lib/types';
import DotDivider from '@/components/ui/assets/DotDivider';
import Image from 'next/image';
import Button from '@/components/ui/buttons/Button';

export default function PublicEventForm() {
  const { eventId } = useParams();
  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [eventMeta, setEventMeta] = useState<any>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchFormAndEvent = async () => {
      try {
        const formRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-forms/${eventId}/public`);
        const formData = await formRes.json();
        setFields(formData.fields || []);

        const eventRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/public`);
        const event = await eventRes.json();
        setEventMeta(event);
      } catch (err) {
        console.error('Алдаа:', err);
        message.error('Өгөгдөл ачаалахад алдаа гарлаа');
      } finally {
        setLoading(false);
      }
    };

    fetchFormAndEvent();
  }, [eventId]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      first_name: formData['Нэр'] || '',
      last_name: formData['Овог'] || '',
      email: formData['Имэйл хаяг'] || '',
      phone: formData['Утасны дугаар'] || '',
      eventId: eventId,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-forms/${eventId}/public-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        message.success('Амжилттай бүртгэгдлээ');
        setFormData({});
      } else {
        const error = await res.json();
        message.error(`Алдаа: ${error.message || 'Бүртгэл амжилтгүй'}`);
      }
    } catch (err) {
      console.error(err);
      message.error('Сервертэй холбогдож чадсангүй');
    }
  };

  return (
    <div className="bg-white min-h-screen px-6 py-10 font-sans">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <Image src="/logo.svg" alt="RegInvite logo" width={72} height={72} className="mx-auto mb-2" />
        {loading ? (
          <Skeleton active paragraph={{ rows: 2 }} title className="max-w-md mx-auto" />
        ) : eventMeta ? (
          <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-5">{eventMeta.title}</h1>
            
            {eventMeta.description && (
              <p className="text-base text-gray-600 mb-4">{eventMeta.description}</p>
            )}

            <div className="text-sm text-gray-500 flex flex-wrap items-center justify-center gap-x-4">
              <span className="flex items-center gap-1">
                <span className="font-medium">{eventMeta.location}</span>
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="flex items-center gap-1">
                {new Date(eventMeta.start_time).toLocaleString('mn-MN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="mt-5 bg-[#fefce8] border border-yellow-300 px-4 py-3 rounded-md">
              <p className="text-sm text-yellow-800 font-medium">
                Та уг арга хэмжээнд оролцохыг хүсвэл доорх бүртгэлийн формд мэдээллээ бөглөн бүртгүүлээрэй.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="max-w-2xl mx-auto bg-[#f4f9fa] p-10 rounded-2xl border border-gray-200 shadow-md">
        <h1 className="text-xl font-bold text-gray-900 mb-10">Бүртгэлийн форм</h1>
        {loading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : (
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {fields.map((field, index) => (
              <div key={field.id || index}>
                <label className="block text-sm font-medium text-gray-800 mb-1">{field.label}</label>
                {field.type === 'radio' && field.options ? (
                  <div className="flex flex-wrap gap-4">
                    {field.options.map((opt, i) => (
                      <label key={i} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name={field.label}
                          value={opt}
                          onChange={(e) => handleChange(field.label, e.target.value)}
                          className="accent-primary"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : field.type === 'checkbox' && field.options ? (
                  <div className="flex flex-wrap gap-4">
                    {field.options.map((opt, i) => (
                      <label key={i} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name={field.label}
                          value={opt}
                          onChange={(e) => handleChange(field.label, e.target.checked ? opt : '')}
                          className="accent-primary"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : field.type === 'textarea' ? (
                  <textarea
                    placeholder={field.label}
                    required={field.required}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                    value={formData[field.label] || ''}
                    onChange={(e) => handleChange(field.label, e.target.value)}
                  />
                ) : (
                  <Input
                    name={field.label}
                    type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'}
                    placeholder={field.label}
                    required={field.required}
                    value={formData[field.label] || ''}
                    onChange={(e) => handleChange(field.label, e.target.value)}
                    className="text-sm"
                  />
                )}
              </div>
            ))}

            <div className="text-center pt-6">
              <Button
                onClick={handleSubmit}
              >
                Илгээх
              </Button>
            </div>
          </form>
        )}
      </div>

      <div className="pt-12">
        <DotDivider />
      </div>
    </div>
  );
}
