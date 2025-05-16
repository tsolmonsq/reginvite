'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Event, EventData } from '@/lib/types';
import { formatDateTime } from '@/utils/formatDateTime';

type Props = {
  event: EventData;
};

const EventCard: React.FC<Props> = ({ event }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/events/${event.id}/guests`)}
      className="cursor-pointer bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition duration-200"
    >
      <Image
        src={event.image_path ? `${process.env.NEXT_PUBLIC_API_URL}${event.image_path}` : '/no_event_image.jpg'}
        alt={event.name}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-2">{event.name}</h2>
        <p className="text-sm text-gray-600 leading-snug mb-3">{event.location}</p>
        <p className="text-xs text-gray-400">{event.start_date}</p>
      </div>
    </div>
  );
};

export default EventCard;
