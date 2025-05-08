"use client";

import { useState, useEffect, JSX } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/buttons/Button";
import apiFetch from "@/lib/api";

interface Event {
  id: number;
  name: string;
  location: string;
  start_date: string;
  end_date?: string;
  image_path: string | null;
}

export default function ImageSlider(): JSX.Element {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiFetch<{ items: Event[] }>("/events/public");
        const sorted = response.items.sort(
          (a, b) =>
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        );
        setEvents(sorted.slice(0, 3));
      } catch (err) {
        console.error("Failed to load events", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovered, events]);

  const variants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const prevSlide = (): void => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  const nextSlide = (): void => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const currentEvent = events[currentIndex];

  const imageUrl = currentEvent?.image_path
    ? `http://localhost:3002/uploads/${currentEvent.image_path}`
    : "/default-image.jpg"; // fallback image

  return (
    <div
      className="relative w-full mx-auto mt-4 overflow-hidden"
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[700px] mx-12 group">
        <AnimatePresence custom={direction} mode="wait">
          {currentEvent && (
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={imageUrl}
                alt={`Event ${currentEvent.name}`}
                layout="fill"
                objectFit="cover"
                className="rounded-xl"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end text-center text-white bg-black/40 rounded-xl p-20">
                <h2 className="text-4xl font-bold mb-4">{currentEvent.name}</h2>
                <p className="text-xl mb-2">{new Date(currentEvent.start_date).toDateString()}</p>
                <p className="text-lg mb-4">{currentEvent.location}</p>
                <Button>Оролцох</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2"
        onClick={prevSlide}
      >
        <ChevronLeft className="text-white w-8 h-8" />
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2"
        onClick={nextSlide}
      >
        <ChevronRight className="text-white w-8 h-8" />
      </button>

      <div className="flex justify-center mt-4">
        {events.map((_, index) => (
          <div
            key={index}
            className={`h-4 w-4 mx-1 ${
              index === currentIndex ? "bg-[#A3A3A3]" : "bg-[#D9D9D9]"
            } rounded-xl transition-all duration-500`}
          ></div>
        ))}
      </div>
    </div>
  );
}
