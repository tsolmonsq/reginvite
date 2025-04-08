export default function DashboardPage() {
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg p-4">
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>
          <nav className="flex flex-col gap-4">
            <a href="#" className="text-gray-700 hover:text-blue-500">🏠 Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-500">📊 Analytics</a>
            <a href="#" className="text-gray-700 hover:text-blue-500">⚙️ Settings</a>
            <a href="#" className="text-gray-700 hover:text-red-500">🚪 Logout</a>
          </nav>
        </aside>
  
        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Navbar */}
          <header className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 rounded border border-gray-300"
            />
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
          </header>
  
          {/* Dashboard cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-sm text-gray-500">Users</h3>
              <p className="text-2xl font-semibold">1,245</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-sm text-gray-500">Sales</h3>
              <p className="text-2xl font-semibold">$8,394</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-sm text-gray-500">Visits</h3>
              <p className="text-2xl font-semibold">23,994</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-sm text-gray-500">Signups</h3>
              <p className="text-2xl font-semibold">349</p>
            </div>
          </section>
  
          {/* Chart placeholder */}
          <div className="bg-white p-6 rounded shadow text-center text-gray-500">
            📈 Chart Area (Coming Soon)
          </div>
        </main>
      </div>
    );
  }
  