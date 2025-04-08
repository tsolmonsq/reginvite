import Image from "next/image";
import { Search } from "lucide-react";
import Button from "@/components/Button";

export default function EventsPage() {
  const events = Array.from({ length: 9 }).map((_, i) => ({
    id: i + 1,
    title: "Text",
    location: "Narantuul Trade Pavilion, BZD - 42 khoroo, Ulaanbaatar 13336, Mongolia",
    date: "2025/05/16",
    image: i % 3 === 0 ? "/event1.jpg" : i % 3 === 1 ? "/event2.jpg" : "/event3.jpg",
  }));

  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      <div className="flex items-center justify-between mt-10 mb-6">
        <h1 className="text-xl md:text-2xl font-semibold">Бүртгэлтэй арга хэмжээнүүд</h1>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm flex items-center gap-2">
          Нэмэх +
        </Button>
      </div>

      <div className="relative max-w-sm mb-8">
        <input
          type="text"
          placeholder="Хайх"
          className="w-full py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-200"
          >
            <Image
              src={event.image}
              alt="Event"
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-base font-semibold mb-1">{event.title}</h2>
              <p className="text-sm text-gray-600 leading-tight mb-2">{event.location}</p>
              <p className="text-xs text-gray-400">{event.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-10 text-sm">
        <button className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-100">← Previous</button>
        {[1, 2, 3, '...', 67, 68].map((page, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded border ${page === 1 ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {page}
          </button>
        ))}
        <button className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-100">Next →</button>
      </div>
    </section>
  );
}
