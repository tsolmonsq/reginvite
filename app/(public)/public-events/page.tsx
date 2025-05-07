// app/events/page.tsx
"use client";

import { useEffect, useState } from "react";
import PublicEventCard from "@/components/ui/cards/PublicEventCard";
import apiFetch from "@/lib/api";

interface Event {
  id: number;
  name: string;
  location: string;
  start_date: string;
  end_date?: string;
  image_path: string | null;
}

export default function PublicEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await apiFetch<{ items: Event[] }>("/events/public?limit=100");
        setEvents(response.items);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchAllEvents();
  }, []);

  return (
    <div className="w-11/12 mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Оролцох боломжтой эвентүүд</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <PublicEventCard
            key={event.id}
            id={event.id}
            name={event.name}
            location={event.location}
            startDate={event.start_date}
            endDate={event.end_date}
            imageUrl="https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"
          />
        ))}
      </div>
    </div>
  );
}
