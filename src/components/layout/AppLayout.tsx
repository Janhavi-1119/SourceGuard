import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#172033] flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          collapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
