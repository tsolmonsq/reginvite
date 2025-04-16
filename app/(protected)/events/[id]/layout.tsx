import EventSidebarLayout from '@/components/layouts/EventSidebarLayout';
import { ReactNode } from 'react';

export default function EventLayout({ children }: { children: ReactNode }) {
  return <EventSidebarLayout>{children}</EventSidebarLayout>;
}
