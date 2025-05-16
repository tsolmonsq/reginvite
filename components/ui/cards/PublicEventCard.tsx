"use client"

import Image from "next/image"; 
import Button from "../buttons/Button";
import { useRouter } from "next/navigation";


interface PublicEventCardProps {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate?: string;
  imagePath: string | null;
}

export default function PublicEventCard({
  id,
  name,
  location,
  startDate,
  endDate,
  imagePath,
}: PublicEventCardProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white max-w-sm">
      <div className="relative h-[200px] w-full">
        <Image
          src={imagePath ? `${process.env.NEXT_PUBLIC_API_URL}/${imagePath}` : '/no_event_image.jpg'}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{location}</p>
        <p className="text-sm text-gray-500">
          {endDate ? `${startDate} - ${endDate}` : startDate}
        </p>
        <Button 
          onClick={() => router.push(`/public-events/${id}`)} 
          className="mt-2 w-full"
        >
            Оролцох
        </Button>
      </div>
    </div>
  );
}
