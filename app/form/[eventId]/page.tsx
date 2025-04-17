'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input, Button } from 'antd';
import { FormField } from '@/lib/types';

export default function PublicEventForm() {
  const { slug } = useParams();
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-forms/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setFields(data.fields || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Алдаа:', err);
        setLoading(false);
      });
  }, [slug]);

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-center mb-8">
        Бүртгэлийн форм
      </h1>

      {loading ? (
        <p className="text-center">Уншиж байна...</p>
      ) : (
        <form className="space-y-4">
          {fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>

              {field.type === 'radio' && field.options ? (
                <div className="flex gap-4">
                  {field.options.map((opt, i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input type="radio" name={field.label} />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : field.type === 'checkbox' && field.options ? (
                <div className="flex gap-4">
                  {field.options.map((opt, i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input type="checkbox" name={field.label} />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : field.type === 'textarea' ? (
                <textarea
                  placeholder={field.label}
                  required={field.required}
                  className="w-full px-3 py-2 border rounded-md"
                />
              ) : (
                <Input
                  type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'}
                  placeholder={field.label}
                  required={field.required}
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
