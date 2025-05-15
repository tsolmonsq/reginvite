'use client';

import { TextField } from '@mui/material';
import Button from '@/components/ui/buttons/Button';
import { useState } from 'react';

interface EventFormProps {
  onSubmit: (formData: any) => void;
  onImageUpload: (file: File) => void;
  initialData?: any;
}

export default function EventForm({
  onSubmit,
  onImageUpload,
  initialData,
}: EventFormProps) {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      description: '',
      location: '',
      start_date: '',
      end_date: '',
      is_public: true,
      category: 'Бусад',
      image_path: '',
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({ ...prev, description: e.target.value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev: any) => ({ ...prev, category: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TextField
        label="Эвентийн нэр"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        fullWidth
        required
      />

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 mt-2">Дэлгэрэнгүй мэдээлэл</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleDescriptionChange}
          rows={5}
          maxLength={1000}
          className="w-full border rounded-md px-4 py-2 text-sm resize-none"
        />
        <p className="text-right text-xs text-gray-400 mt-1">
          {formData.description.length}/1000
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Зураг</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            onChange={handleImageChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Ангилал</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="Фестиваль">Фестиваль</option>
            <option value="Бусад">Бусад</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Эхлэх огноо"
          name="start_date"
          type="datetime-local"
          value={formData.start_date}
          onChange={handleInputChange}
          fullWidth
          required
        />
        <TextField
          label="Дуусах огноо"
          name="end_date"
          type="datetime-local"
          value={formData.end_date}
          onChange={handleInputChange}
          fullWidth
          required
        />
      </div>

      <TextField
        label="Хаяг"
        name="location"
        value={formData.location}
        onChange={handleInputChange}
        fullWidth
      />

      <div className="pt-4 flex justify-center">
        <Button
          type="submit"
          className="bg-[#74aebf] hover:bg-[#5f9daa] text-white px-8 py-2 rounded-md text-base font-medium"
        >
          Үүсгэх
        </Button>
      </div>
    </form>
  );
}
