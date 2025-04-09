'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import Button from '@/components/Button';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

type Event = {
  id: number;
  title: string;
  location: string;
  start_time: string;
  end_time: string;
  imagePath: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    image: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:3001/events", {
          method: 'GET',
          credentials: 'include', 
        });
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        console.log("<<<LOG events:", data)
        setEvents(data);
      } catch (err) {
        setError('Арга хэмжээг ачааллаж чадсангүй.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSubmit = async () => {
    if (!form.image) {
      alert('Зураг оруулна уу.');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('location', form.location);
    formData.append('start_time', new Date(form.start_time).toISOString());
    formData.append('end_time', new Date(form.end_time).toISOString());
    formData.append('image', form.image);
  
    try {
      const res = await fetch('http://localhost:3001/events', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Арга хэмжээ үүсгэхэд алдаа гарлаа.');
      }
  
      const newEvent = await res.json();
      setEvents((prev) => [...prev, newEvent]);
      setIsModalOpen(false);
      setForm({
        title: '',
        description: '',
        location: '',
        start_time: '',
        end_time: '',
        image: null,
      });
    } catch (err) {
      console.error(err);
      alert('Арга хэмжээ үүсгэхэд алдаа гарлаа.');
    }
  };  

  const formatDateTime = (isoDate: string) => {
    const date = new Date(isoDate);
    return `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      <div className="flex items-center justify-between mt-10 mb-6">
        <h1 className="text-xl md:text-2xl font-semibold">Бүртгэлтэй арга хэмжээнүүд</h1>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          Нэмэх +
        </Button>
      </div>

      <div className="relative max-w-sm mb-8">
        <input
          type="text"
          placeholder="Хайх"
          className="w-full py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      </div>

      {loading ? (
        <p>Уншиж байна...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition duration-200"
          >
            <Image
              src={
                event.imagePath
                  ? `http://localhost:3001/${event.imagePath}`
                  : '/no_event_image.jpg'
              }
              alt={event.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">{event.title}</h2>
              <p className="text-sm text-gray-600 leading-snug mb-3">{event.location}</p>
              <p className="text-xs text-gray-400">{formatDateTime(event.start_time)}</p>
            </div>
          </div>          
          ))}
        </div>
      )}

      {/* MODAL */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <DialogPanel className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl">
            <DialogTitle className="text-center text-xl font-semibold mb-6">Арга хэмжээ бүртгэх</DialogTitle>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium block mb-1">Арга хэмжээний нэр</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Арга хэмжээний нэр"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={form.title}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Дэлгэрэнгүй мэдээлэл</label>
                <textarea
                  name="description"
                  placeholder="200 тэмдэгт хүртэл"
                  maxLength={200}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={form.description}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-400 text-right">{form.description.length}/200</p>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Зураг <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onChange={handleFileChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Эвентийн эхлэх огноо <span className="text-red-500">*</span></label>
                  <input
                    type="datetime-local"
                    name="start_time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={form.start_time}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Эвентийн дуусах огноо <span className="text-red-500">*</span></label>
                  <input
                    type="datetime-local"
                    name="end_time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={form.end_time}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Хаяг <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="location"
                  placeholder="Байршлаа оруулна уу..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={form.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Болих
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  Бүртгэх
                </Button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
}
