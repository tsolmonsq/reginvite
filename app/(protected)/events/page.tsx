'use client';

import { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import { useAlert } from '@/app/hooks/useAlert';
import { Event } from '@/lib/types';
import apiFetch from '@/lib/api';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { CircularProgress, Pagination } from '@mui/material';
import { Search } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
import EventCard from '@/components/ui/cards/EventCard';
import EventForm from '@/components/forms/EventForm';

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
      const res = await apiFetch<{ data: Event[]; meta: typeof meta }>(
        `/events?search=${encodeURIComponent(query)}&page=${page}&limit=${meta.limit}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );

      setEvents(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      <div className="flex items-center justify-between mt-10 mb-6">
        <h1 className="text-xl md:text-2xl font-semibold">Арга хэмжээнүүд</h1>
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
            <EventForm
              token={cookies.token}
              onSuccess={() => {
                setIsModalOpen(false);
                fetchEvents(searchQuery, meta.page); // одоогийн хуудас руу буцааж ачаалгана
              }}
              onError={() => alert.error("Арга хэмжээ үүсгэхэд алдаа гарлаа.")}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
}
