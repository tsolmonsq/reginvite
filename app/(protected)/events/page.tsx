"use client"

import { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import { useAlert } from '@/app/hooks/useAlert';
import { Event } from '@/lib/types';
import apiFetch from '@/lib/api';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { CircularProgress, Pagination, TextField } from '@mui/material';
import { Search } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
import EventCard from '@/components/ui/cards/EventCard'

export default function EventsPage() {
  const alert = useAlert();
  const [cookies] = useCookies(["token"]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    hasNext: false,
    hasPrevious: false,
    totalPages: 1,
  });

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

  useEffect(() => {
    fetchEvents(searchQuery, 1); 
  }, [cookies.token]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchEvents(searchQuery, 1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const fetchEvents = async (query: string = '', page: number = 1) => {
    if (!cookies.token) return;

    setLoading(true);
    setError('');

    try {
      const res = await apiFetch<{ items: Event[]}>(
        `/events/private/?search=${encodeURIComponent(query)}&page=${page}&limit=${meta.limit}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );

      setEvents(res.items);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    setNewEvent((prev) => ({
      ...prev,
      [name]: value, // ISO хөрвүүлэлт хожуу handleSubmit-д хийгдэнэ
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!newEvent.name || !newEvent.start_date || !newEvent.end_date) {
      alert.error("Нэр болон огнооны талбаруудыг бүрэн бөглөнө үү.");
      return;
    }
  
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

  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      <div className="flex items-center justify-between mt-10 mb-6">
        <h1 className="text-xl md:text-2xl font-semibold">Арга хэмжээнүүд</h1>
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
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
        <div className="fixed inset-0 flex items-center justify-center">
          <DialogPanel className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl">
            <DialogTitle className="text-center text-xl font-semibold mb-6">Арга хэмжээ бүртгэх</DialogTitle>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <TextField
                  label="Нэр"
                  name="name"
                  value={newEvent.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Тайлбар"
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                />
                <TextField
                  label="Байршил"
                  name="location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                    label="Эхлэх огноо"
                    name="start_date"
                    type="datetime-local"
                    value={newEvent.start_date}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    label="Төгсөх огноо"
                    name="end_date"
                    type="datetime-local"
                    value={newEvent.end_date}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />

                <Button variant="primary" onClick={handleSubmit}>
                  Бүртгэх
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
}
