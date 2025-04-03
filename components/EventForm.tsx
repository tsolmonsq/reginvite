"use-client"
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const EventForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/events', formData);
      router.push('/events');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-md">
      <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="block w-full mb-2 p-2 border" required />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="block w-full mb-2 p-2 border" required />
      <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="block w-full mb-2 p-2 border" required />
      <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="block w-full mb-2 p-2 border" required />
      <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} className="block w-full mb-2 p-2 border" required />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Event</button>
    </form>
  );
};

export default EventForm;