"use client";

import { useState, useEffect, JSX } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/buttons/Button";

interface ImageData {
  src: string;
}

const images: ImageData[] = [
  {
    src: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
  },
  {
    src: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
  },
  {
    src: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
  },
];

interface Props {
  eventName?: string;
  eventLocation?: string;
  eventStartDate?: Date;
  eventEndDate?: Date
}

export default function ImageSlider({eventName, eventLocation, eventStartDate, eventEndDate}:Props): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const prevSlide = (): void => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const nextSlide = (): void => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <div
      className="relative w-full mx-auto mt-4 overflow-hidden"
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[700px] mx-12 group">
        <AnimatePresence custom={direction} mode="wait">
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
              src={images[currentIndex].src}
              alt={`Slider Image ${currentIndex + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-xl cursor-pointer"
            />

            {/* Overlay text + button */}
            <div className="absolute inset-0 flex flex-col items-center justify-end text-center text-white bg-black/40 rounded-xl p-20">
              <h2 className="text-4xl font-bold mb-4">
                {eventName}
              </h2>
              <p className="text-xl mb-2">{eventStartDate?.toDateString()}</p>
              <p className="text-lg mb-4">{eventLocation}</p>
              <Button>
                Оролцох
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        className="absolute left-0 top-1/2 transform h-10 rounded-xl mx-1 -mt-[10px] -translate-y-1/2 p-2 group cursor-pointer"
        onClick={prevSlide}
      >
        <ChevronLeft className="text-primary-black" />
      </button>

      <button
        className="absolute right-0 top-1/2 transform h-10 rounded-xl mx-1 -mt-[10px] -translate-y-1/2 p-2 group cursor-pointer"
        onClick={nextSlide}
      >
        <ChevronRight className="text-primary-black" />
      </button>

      <div className="flex justify-center mt-4">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-4 w-4 mx-1 ${
              index === currentIndex
                ? "bg-[#A3A3A3] rounded-xl"
                : "bg-[#D9D9D9] rounded-xl"
            } transition-all duration-500 ease-in-out`}
          ></div>
        ))}
      </div>
    </div>
  );
}
