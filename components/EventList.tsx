"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3001/events')
      .then((response: { data: React.SetStateAction<Event[]>; }) => setEvents(response.data))
      .catch((error: any) => console.error('Error fetching events:', error));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {events.map(event => (
        <div key={event.id} className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <p className="text-gray-600">{event.description}</p>
          <p className="text-sm text-gray-500">📍 {event.location}</p>
          <p className="text-sm text-gray-500">🕒 {new Date(event.startTime).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default EventList;