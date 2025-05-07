"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import PublicEventCard from "./ui/cards/PublicEventCard";
import apiFetch from "@/lib/api";

interface Event {
  id: number;
  name: string;
  location: string;
  start_date: string;
  end_date?: string;
  image_path: string | null;
}

export default function PublicEventSlider() {
  const [events, setEvents] = useState<Event[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const maxVisible = 4;

  const next = () => {
    setDirection(1);
    setStartIndex((prev) => (prev + 1) % events.length);
  };

  const prev = () => {
    setDirection(-1);
    setStartIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiFetch<{ items: Event[] }>("/events/public");
        setEvents(response.items);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (isHovered || events.length <= maxVisible) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [startIndex, isHovered, events]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  // Энэ нь үргэлж 4 ширхэг эвентийг дараалж харуулах болно (дахин эхэлж эхэлдэг)
  const getVisibleEvents = () => {
    const result: Event[] = [];
    for (let i = 0; i < Math.min(maxVisible, events.length); i++) {
      result.push(events[(startIndex + i) % events.length]);
    }
    return result;
  };

  const visibleEvents = getVisibleEvents();

  return (
    <div className="relative w-11/12 mx-auto">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-xl md:text-2xl font-semibold">Оролцох боломжтой эвентүүд</h2>
        <a href="/public-events" className="text-primary hover:underline font-medium">
          Бүгдийг харах →
        </a>
      </div>

      <div
        className="relative flex items-center"
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={prev}
          disabled={events.length <= maxVisible}
          className="absolute left-0 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100"
        >
          <ChevronLeft />
        </button>

        <div className="w-full overflow-hidden px-8">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={startIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              {visibleEvents.map((event, idx) => (
                <PublicEventCard
                  key={`${event.id}-${idx}`} // 👈 давхардахаас сэргийлнэ
                  {...event}
                  startDate={event.start_date}
                  endDate={event.end_date}
                  imageUrl={"https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={next}
          disabled={events.length <= maxVisible}
          className="absolute right-0 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
