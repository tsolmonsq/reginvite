"use client"

import { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import { useAlert } from '@/app/hooks/useAlert';
import { Event } from '@/lib/types';
import apiFetch from '@/lib/api';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { CircularProgress, Pagination} from '@mui/material';
import { Search } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
import EventCard from '@/components/ui/cards/EventCard'
import EventForm from '@/components/forms/EventForm';
import { RotateCcw } from 'lucide-react'

export default function EventsPage() {
  const alert = useAlert();
  const [cookies] = useCookies(["token"]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    is_public: true,
    category: 'Бусад',
    image_path: ''
  });
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 9,
    hasNext: false,
    hasPrevious: false,
    totalPages: 1
  });

  useEffect(() => {
    fetchEvents(searchQuery, 1); 
  }, [cookies.token]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchEvents(searchQuery, 1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Эвентүүдийн жагсаалт авах
  const fetchEvents = async (query: string = '', page: number = 1) => {
    if (!cookies.token) return;

    setLoading(true);
    setError('');

    console.log("Token in cookie >>>", cookies.token);
    
    try {
      const res = await apiFetch<{ total: number, totalPages: number, items: Event[]}>(
        `/events/private/?search=${encodeURIComponent(query)}&page=${page}&limit=${meta.limit}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );

      console.log("<<<LOG Events: ", res);

      setEvents(res.items);
      setMeta((prev) => ({
        ...prev,
        total: res.total,
        totalPages: res.totalPages,
        page,
      }));
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to load events.");
    } finally {
      setLoading(false);
    }
  };
  
  // Эвент үүсгэх
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...newEvent,
        start_date: new Date(newEvent.start_date).toISOString(),
        end_date: new Date(newEvent.end_date).toISOString(),
        is_public: newEvent.is_public ?? false,
        category: newEvent.category ?? 'Бусад',
        image_path: newEvent.image_path ?? '',
      };

      const res = await apiFetch('/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Event creation failed');
      }
  
      setIsModalOpen(false);
      fetchEvents(searchQuery, meta.page);
      alert.success("Амжилттай бүртгэгдлээ");
    } catch (err) {
      console.error('Error creating event:', err);
      alert.error("Бүртгэхэд алдаа гарлаа");
    }
  };  

  // Эвентийн зураг upload хийх. 
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const res = await apiFetch('/uploads/event-image', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });
  
      const data = await res.json();
      setNewEvent(prev => ({ ...prev, image_path: data.image_path }));
    } catch (err) {
      alert.error("Зураг upload хийхэд алдаа гарлаа");
      console.error(err);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      <div className="flex items-center justify-between mt-10 mb-6">
        <h1 className="text-xl md:text-2xl font-semibold">Таны эвентүүд</h1>
        <Button
          className="bg-blue-500 text-white py-2 px-4 rounded text-sm flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          Нэмэх +
        </Button>
      </div>

      <div className="relative max-w-sm mb-8">
        <input
          type="text"
          placeholder="Хайх"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <CircularProgress color="primary" size={40} thickness={5} />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
          <p className="text-gray-600">Эвентүүд ачааллах явцад алдаа гарлаа.</p>
          <Button variant="ghost" className='flex gap-2' onClick={() => fetchEvents(searchQuery, meta.page)}>
            <RotateCcw size={18} />
            Дахин ачаалах
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {meta.totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <Pagination
                count={meta.totalPages}
                page={meta.page}
                onChange={(_, page) => fetchEvents(searchQuery, page)}
                color="primary"
                shape="rounded"
              />
            </div>
          )}
        </>
      )}

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center px-4">
          <DialogPanel className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl">
            <DialogTitle className="text-center text-2xl font-semibold mb-8">
              Эвент үүсгэх
            </DialogTitle>
            <EventForm
              onSubmit={handleSubmit}
              onImageUpload={handleImageUpload}
              initialData={newEvent}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
}
