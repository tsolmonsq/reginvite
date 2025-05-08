"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, Clock, Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import apiFetch from "@/lib/api";
import Button from "@/components/ui/buttons/Button";
import { useRouter } from "next/navigation";

interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  start_date: string;
  end_date?: string;
  image_path: string | null;
  category: string;
}

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [registrationsCount, setRegistrationsCount] = useState<number>(0); 
  const [countdown, setCountdown] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await apiFetch<Event>(`/events/${id}`);
      setEvent(res);
    };
    fetchEvent();
  }, [id]);

  // Fetch registrations count
  useEffect(() => {
    const fetchRegistrationsCount = async () => {
      const res = await apiFetch<{ registrationsCount: number }>(`/forms/public/${id}/registrations-count`);
      setRegistrationsCount(res.registrationsCount);
    };
    if (id) fetchRegistrationsCount();
  }, [id]);

  useEffect(() => {
    if (!event?.start_date) return;
    const updateCountdown = () => {
      const start = new Date(event.start_date).getTime();
      const now = new Date().getTime();
      const diff = start - now;

      if (diff <= 0) return setCountdown("Эвент эхэлсэн");
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(`${days} өдөр ${hours} цаг ${minutes}:${seconds.toString().padStart(2, "0")}`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event?.start_date]);

  if (!event) return <div className="text-center py-10">Ачааллаж байна...</div>;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="w-full h-[400px] mt-4 relative">
        <img
          src={`http://localhost:3002/uploads/${event.image_path}`}
          alt={event.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="text-center mt-6">
        <h1 className="text-3xl font-bold">{event.name}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 px-6">
        <div className="flex flex-col items-center border rounded-xl py-4 px-6">
          <div className="flex items-center gap-2 text-primary">
            <Calendar className="w-5 h-5" />
            <span>{event.start_date.slice(0, 10)}</span>
          </div>
          <div className="flex items-center gap-2 text-primary mt-2">
            <Clock className="w-5 h-5" />
            <span>09:00 - 18:00</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="border rounded-xl p-4">
            <h3 className="text-primary font-bold text-base mb-1">Зохион байгуулагч</h3>
            <p className="text-sm font-medium">Ойм ногоон урлан</p>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-700">
              <Phone className="w-4 h-4" />
              77029483
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail className="w-4 h-4" />
              oim@gmail.com
            </div>
          </div>
          <div className="border rounded-xl p-4">
            <h3 className="text-primary font-bold text-base mb-1">Хаана</h3>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 mt-1" />
              <p>{event.location}</p>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="border rounded-xl p-4 flex flex-col items-center justify-center">
            <h3 className="text-primary font-bold text-base mb-2">Эвент эхлэхэд</h3>
            <div className="border border-primary rounded-md px-6 py-2 text-primary text-lg font-semibold bg-white">
              {countdown}
            </div>
            <Button onClick={() => router.push(`/form/${event.id}`)} className="mt-2">
              Оролцох
            </Button>
          </div>
          <div className="flex justify-center mx-10">
            <div className="border p-6 rounded-lg text-center w-full">
              <h3 className="text-lg font-bold text-primary mb-2">Бүртгүүлсэн хүмүүсийн тоо</h3>
              <div className="text-3xl font-bold text-primary">{registrationsCount}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 mt-10">
        <div className="border rounded-xl p-6">
          <h2 className="text-primary font-bold text-lg mb-2">Дэлгэрэнгүй мэдээлэл</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {event.description || "Тайлбар байхгүй"}
          </p>
        </div>
      </div>
    </div>
  );
}
