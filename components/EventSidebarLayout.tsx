'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  FileText,
  CheckSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const tabs = [
  { slug: 'guests', label: 'Зочид', icon: Users },
  { slug: 'invitation', label: 'Урилга', icon: BookOpen },
  { slug: 'forms', label: 'Маягт', icon: FileText },
  { slug: 'attendance', label: 'Ирц', icon: CheckSquare },
];

const formSubTabs = [
  { slug: 'public', label: 'Нийтэд нээлттэй' },
  { slug: 'rsvp', label: 'Нэмэлт мэдээллийн' },
];

export default function EventSidebarLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { id } = useParams();
  const [eventTitle, setEventTitle] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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

            if (tab.slug === 'forms') {
              return (
                <div key={tab.slug}>
                  <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                      pathname.includes('/forms')
                        ? 'border border-primary text-primary bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                    {isFormOpen ? <ChevronUp className="ml-auto w-4 h-4" /> : <ChevronDown className="ml-auto w-4 h-4" />}
                  </button>

                  {isFormOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {formSubTabs.map((sub) => {
                        const subHref = `/events/${id}/forms/${sub.slug}`;
                        const isSubActive = pathname.includes(`/forms/${sub.slug}`);
                        return (
                          <Link
                            key={sub.slug}
                            href={subHref}
                            className={`block px-3 py-1.5 rounded-md text-sm font-medium ${
                              isSubActive
                                ? 'bg-primary text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

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
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-white">{children}</main>
    </div>
  );
}
