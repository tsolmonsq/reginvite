import EventList from "../../components/EventList";

export default function EventsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <EventList />
    </div>
  );
}