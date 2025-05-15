import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Table, Skeleton, message, Input } from 'antd';
import { FormField } from '@/lib/types';
import DotDivider from '@/components/ui/assets/DotDivider';
import Image from 'next/image';
import Button from '@/components/ui/buttons/Button';
import apiFetch from '@/lib/api';

interface Form {
  id: number;
  formFields: FormField[];
  type: string;
  is_open: boolean;
  max_guests: number;
  close_at: string;
  total_registrations: number;
  total_submissions: number;
}

export default function PublicEventForm() {
  const { eventId } = useParams();
  const [form, setForm] = useState<Form | undefined>();
  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [eventMeta, setEventMeta] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const currentValue = prev[field];
      if (Array.isArray(currentValue)) {
        if (currentValue.includes(value)) {
          return { ...prev, [field]: currentValue.filter((v: any) => v !== value) };
        } else {
          return { ...prev, [field]: [...currentValue, value] };
        }
      } else {
        return { ...prev, [field]: value };
      }
    });
  };

  useEffect(() => {
    const fetchFormAndEvent = async () => {
      try {
        const formRes = await apiFetch<Form>(`/forms/public/${eventId}`);
        setForm(formRes);
        setFields(formRes.formFields || []);

        const eventRes = await apiFetch<any>(`/events/${eventId}`);
        setEventMeta(eventRes);

        // Fetch responses from the API
        const responsesRes = await apiFetch<any>(`/forms/public/${eventId}/responses`);
        console.log('Responses:', responsesRes);
        setResponses(responsesRes.items || []); // Set the 'items' array to responses
      } catch (err) {
        console.error("Алдаа:", err);
        message.error("Өгөгдөл ачаалахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };

    fetchFormAndEvent();
  }, [eventId]);

  const handleSubmit = async () => {
    if (!eventId) {
      message.error("Event ID is missing");
      return; 
    }

    const payload = {
      responses: Object.keys(formData).map((key) => {
        const fieldValue = formData[key];
        const fieldId = fields.find((f) => f.label === key)?.id;

        if (fieldId) {
          return {
            fieldId,
            value: Array.isArray(fieldValue) ? fieldValue.join(",") : fieldValue,
          };
        }
        return null;
      }).filter((r) => r !== null),
      eventId: eventId.toString(),
    };

    try {
      await apiFetch(`/forms/${eventId}/register`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      message.success("Амжилттай бүртгэгдлээ");
      setFormData({});
    } catch (err: any) {
      console.error(err);
      message.error(`Алдаа: ${err.message || "Бүртгэл амжилтгүй"}`);
    }
  };

  const columns = [
    {
      title: 'Овог',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Нэр',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Имэйл хаяг',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Утасны дугаар',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
  ];

  // Map responses to dataSource for Table
  const dataSource = responses.map((response, index) => ({
    key: index,
    last_name: response.last_name,
    first_name: response.first_name,
    email: response.email,
    phone_number: response.phone_number,
  }));

  return (
    <div className="bg-white min-h-screen px-6 py-10 font-sans">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <Image src="/logo.svg" alt="RegInvite logo" width={72} height={72} className="mx-auto mb-2" />
        {loading ? (
          <Skeleton active paragraph={{ rows: 2 }} title className="max-w-md mx-auto" />
        ) : eventMeta ? (
          <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-5">{eventMeta.name}</h1>

            {eventMeta.description && (
              <p className="text-base text-gray-600 mb-4">{eventMeta.description}</p>
            )}

            <div className="text-sm text-gray-500 flex flex-wrap items-center justify-center gap-x-4">
              <span className="font-medium">{eventMeta.location}</span>
              <span className="hidden sm:inline">|</span>
              <span>
                {new Date(eventMeta.start_date).toLocaleString('mn-MN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
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
                    {Array.isArray(field.options) ? (
                      field.options.map((opt, i) => (
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
                      ))
                    ) : (
                      <span>No options available</span>
                    )}
                  </div>
                ) : field.type === 'checkbox' && field.options ? (
                  <div className="flex flex-wrap gap-4">
                    {Array.isArray(field.options) ? (
                      field.options.map((opt, i) => (
                        <label key={i} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name={field.label}
                            value={opt}
                            onChange={(e) =>
                              handleChange(field.label, e.target.checked ? opt : '')
                            }
                            className="accent-primary"
                          />
                          {opt}
                        </label>
                      ))
                    ) : (
                      <span>No options available</span>
                    )}
                  </div>
                ) : field.type === 'textarea' ? (
                  <textarea
                    placeholder={field.label}
                    required={field.is_required}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                    value={formData[field.label] || ''}
                    onChange={(e) => handleChange(field.label, e.target.value)}
                  />
                ) : (
                  <Input
                    name={field.label}
                    type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'}
                    placeholder={field.label}
                    required={field.is_required}
                    value={formData[field.label] || ''}
                    onChange={(e) => handleChange(field.label, e.target.value)}
                    className="text-sm"
                  />
                )}
              </div>
            ))}

            <div className="text-center pt-6">
              <Button onClick={handleSubmit}>Илгээх</Button>
            </div>
          </form>
        )}
      </div>

      <div className="pt-12">
        <DotDivider />
        <h2 className="text-2xl text-center font-semibold mt-8 mb-4">Бүртгэлийн Хариултууд</h2>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </div>
  );
}
