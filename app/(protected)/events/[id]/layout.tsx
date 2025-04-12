import EventSidebarLayout from '@/components/EventSidebarLayout';
import { ReactNode } from 'react';

export default function EventLayout({ children }: { children: ReactNode }) {
  return <EventSidebarLayout>{children}</EventSidebarLayout>;
}
