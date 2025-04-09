'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import Button from '@/components/Button';

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
        <Button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm flex items-center gap-2">
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
    </section>
  );
}
