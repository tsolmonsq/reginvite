'use client';

import { useState, useEffect } from 'react';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { EventCategory } from '@/lib/enums';
import Button from '../ui/buttons/Button';

interface EventFormProps {
  formData: any;
  setFormData: (value: any) => void;
  onSubmit: () => void;
  onImageUpload: (file: File) => void;
}

export default function EventForm({
  formData,
  setFormData,
  onSubmit,
  onImageUpload,
}: EventFormProps) {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({ ...prev, description: e.target.value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      category: e.target.value as EventCategory,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Эвентийн нэр */}
      <div className="flex flex-col">
        <label htmlFor="name" className="text-sm mb-1 font-medium">
          Эвентийн нэр
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Эвентийн нэр"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="border border-gray-300 rounded-md px-4 py-2 text-sm"
        />
      </div>

      {/* Дэлгэрэнгүй мэдээлэл */}
      <div className="flex flex-col">
        <label htmlFor="description" className="text-sm mb-1 font-medium">
          Дэлгэрэнгүй мэдээлэл
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Эвентийн дэлгэрэнгүй мэдээллийг оруулна уу."
          value={formData.description}
          onChange={handleDescriptionChange}
          maxLength={1000}
          rows={5}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm resize-none"
        />
        <div className="text-xs text-gray-500 mt-1 text-right">
          {formData.description.length}/1000
        </div>
      </div>

      {/* Зураг ба Ангилал */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-sm mb-1 font-medium">
            Зураг <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-black file:text-white
              hover:file:bg-gray-800"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="category" className="text-sm mb-1 font-medium">
            Ангилал сонгох
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {Object.entries(EventCategory).map(([key, label]) => (
              <option key={key} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Огноо */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Эхлэх огноо</label>
          <input
            type="datetime-local"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-md px-4 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Дуусах огноо</label>
          <input
            type="datetime-local"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-md px-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* Хаяг */}
      <div className="flex flex-col">
        <label htmlFor="location" className="text-sm font-medium mb-1">Хаяг</label>
        <div className="relative">
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Байршил оруулна уу."
            value={formData.location}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm pr-10"
          />
          <MapPinIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Товч */}
      <Button type="submit" className="w-full">
        Үүсгэх
      </Button>
    </form>
  );
}
