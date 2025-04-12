'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Guest = {
  id: number;
  last_name: string;
  first_name: string;
  email: string;
  phone: string;
  status: 'Sent' | 'Pending' | 'Failed' | 'By form' | 'New';
};

const dummyGuests: Guest[] = [
  {
    id: 1,
    last_name: 'Бат-Эрдэнэ',
    first_name: 'Тэмүүжин',
    email: 'temuujin@gmail.com',
    phone: '98298902',
    status: 'Sent',
  },
  {
    id: 2,
    last_name: 'Доржсүрэн',
    first_name: 'Энхцэцэг',
    email: 'dorjsuren@gmail.com',
    phone: '88765900',
    status: 'By form',
  },
  {
    id: 3,
    last_name: 'Сүрэнгийн',
    first_name: 'Отгонбат',
    email: 'otgoo@outlook.com',
    phone: '93124004',
    status: 'New',
  },
  {
    id: 4,
    last_name: 'Чулуунбаатар',
    first_name: 'Мөнхтуяа',
    email: 'munhtuya@gmail.com',
    phone: '99003121',
    status: 'Sent',
  },
  {
    id: 5,
    last_name: 'Ганболд',
    first_name: 'Хатанбаатар',
    email: 'khatanaa0903@outlook.com',
    phone: '88102938',
    status: 'Pending',
  },
  {
    id: 6,
    last_name: 'Эрдэнэчимэг',
    first_name: 'Ариунзул',
    email: 'ariu100@gmail.com',
    phone: '99120394',
    status: 'Failed',
  },
];

export default function EventGuestsPage() {
  const { id } = useParams();
  const [guests, setGuests] = useState<Guest[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGuests(dummyGuests);
    }, 500);

    return () => clearTimeout(timeout);
  }, [id]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Урьсан зочид - Эвент #{id}</h1>

      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Овог</th>
            <th className="px-4 py-2 text-left">Нэр</th>
            <th className="px-4 py-2 text-left">Имэйл</th>
            <th className="px-4 py-2 text-left">Утас</th>
            <th className="px-4 py-2 text-left">Төлөв</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{guest.last_name}</td>
              <td className="px-4 py-2">{guest.first_name}</td>
              <td className="px-4 py-2">{guest.email}</td>
              <td className="px-4 py-2">{guest.phone}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    guest.status === 'Sent'
                      ? 'bg-green-100 text-green-800'
                      : guest.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : guest.status === 'Failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {guest.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
