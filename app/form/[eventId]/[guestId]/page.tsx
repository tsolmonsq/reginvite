'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input, Button } from 'antd';
import { FormField } from '@/lib/types';

export default function GuestEventForm() {
  const { eventId, guestId } = useParams();
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-forms/${eventId}/rsvp`)
      .then((res) => res.json())
      .then((data) => {
        setFields(data.fields || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Form load error:', err);
        setLoading(false);
      });
  }, [eventId]);

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-center mb-8">
        RSVP Хариу бөглөх
      </h1>

      {loading ? (
        <p className="text-center">Ачааллаж байна...</p>
      ) : (
        <form className="space-y-4">
          {fields.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>

              {field.type === 'radio' && field.options ? (
                Array.isArray(field.options) ? (
                  <div className="flex gap-4">
                    {field.options.map((opt, i) => (
                      <label key={i} className="flex items-center gap-2">
                        <input type="radio" name={field.label} />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div>No options available</div>
                )
              ) : field.type === 'checkbox' && field.options ? (
                Array.isArray(field.options) ? (
                  <div className="flex gap-4">
                    {field.options.map((opt, i) => (
                      <label key={i} className="flex items-center gap-2">
                        <input type="checkbox" name={field.label} />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div>No options available</div>
                )
              ) : field.type === 'textarea' ? (
                <textarea
                  placeholder={field.label}
                  required={field.is_required}
                  className="w-full px-3 py-2 border rounded-md"
                />
              ) : (
                <Input
                  type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'}
                  placeholder={field.label}
                  required={field.is_required}
                  className="w-full"
                />
              )}
            </div>
          ))}

          <div className="mt-8 text-center">
            <Button type="primary" className="bg-primary text-white px-6">
              Илгээх
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
