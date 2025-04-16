'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/buttons/Button';
import apiFetch from '@/lib/api';
import { useAlert } from '@/app/hooks/useAlert';

type Props = {
  token: string;
  onSuccess: () => void;
  onError?: (err: unknown) => void;
};

const EventForm: React.FC<Props> = ({ token, onSuccess, onError }) => {
  const alert = useAlert();

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    image: null as File | null,
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    image: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: form.title.trim() === '' ? 'Нэр оруулна уу.' : '',
      description: form.description.trim() === '' ? 'Дэлгэрэнгүй мэдээлэл оруулна уу.' : '',
      location: form.location.trim() === '' ? 'Байршил оруулна уу.' : '',
      start_time: form.start_time === '' ? 'Эхлэх огноо сонгоно уу.' : '',
      end_time: form.end_time === '' ? 'Дуусах огноо сонгоно уу.' : '',
      image: form.image === null ? 'Зураг оруулна уу.' : '',
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === '');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('location', form.location);
    formData.append('start_time', new Date(form.start_time).toISOString());
    formData.append('end_time', new Date(form.end_time).toISOString());
    formData.append('image', form.image!);

    try {
      await apiFetch('/events', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert.success('Амжилттай бүртгэгдлээ');
      onSuccess();
    } catch (err) {
      console.error('Event creation error:', err);
      alert.error('Бүртгэхэд алдаа гарлаа');
      onError?.(err);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium block mb-1">Арга хэмжээний нэр</label>
        <input
          type="text"
          name="title"
          placeholder="Арга хэмжээний нэр"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={form.title}
          onChange={handleInputChange}
        />
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Дэлгэрэнгүй мэдээлэл</label>
        <textarea
          name="description"
          placeholder="200 тэмдэгт хүртэл"
          maxLength={200}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={form.description}
          onChange={handleInputChange}
        />
        <p className="text-xs text-gray-400 text-right">{form.description.length}/200</p>
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Зураг <span className="text-red-500">*</span></label>
        <input
          type="file"
          accept="image/*"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          onChange={handleFileChange}
        />
        {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1">Эхлэх огноо</label>
          <input
            type="datetime-local"
            name="start_time"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={form.start_time}
            onChange={handleInputChange}
          />
          {errors.start_time && <p className="text-sm text-red-500 mt-1">{errors.start_time}</p>}
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Дуусах огноо</label>
          <input
            type="datetime-local"
            name="end_time"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={form.end_time}
            onChange={handleInputChange}
          />
          {errors.end_time && <p className="text-sm text-red-500 mt-1">{errors.end_time}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Хаяг</label>
        <input
          type="text"
          name="location"
          placeholder="Байршлаа оруулна уу..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={form.location}
          onChange={handleInputChange}
        />
        {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="primary" onClick={handleSubmit}>
          Бүртгэх
        </Button>
      </div>
    </div>
  );
};

export default EventForm;
