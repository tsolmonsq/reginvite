'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  FileText,
  CheckSquare,
} from 'lucide-react';

const tabs = [
  { slug: 'guests', label: 'Зочид', icon: Users },
  { slug: 'invitation', label: 'Урилга', icon: BookOpen },
  { slug: 'forms', label: 'Маягт', icon: FileText },
  { slug: 'attendance', label: 'Ирц', icon: CheckSquare },
];

export default function EventSidebarLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { id } = useParams();
  const [eventTitle, setEventTitle] = useState<string | null>(null);

  // Эвентийн нэрийг fetch хийх
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:3001/events/${id}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch event title');
        const data = await res.json();
        setEventTitle(data.title);
      } catch (error) {
        console.error('Event fetch error:', error);
        setEventTitle(null);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-8 text-primary">
          {eventTitle ? eventTitle : `Эвент #${id}`}
        </h2>

        <nav className="space-y-2">
          {tabs.map((tab) => {
            const href = `/events/${id}/${tab.slug}`;
            const isActive =
              pathname.includes(`/${tab.slug}`) || (pathname === `/protected/events/${id}` && tab.slug === 'guests');

            const Icon = tab.icon;

            return (
              <Link
                key={tab.slug}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                  isActive
                    ? 'border border-primary text-primary bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-primary' : 'text-gray-500'
                  }`}
                />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-white">{children}</main>
    </div>
  );
}
