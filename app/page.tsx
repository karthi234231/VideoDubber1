"use client";
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

export default function Home() {
  const [activePage, setActivePage] = useState('howItWorks'); // Default page is 'howItWorks'
  const [isOpen, setIsOpen] = useState(true); // Sidebar state

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div style={{
        flex: 1,
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <MainContent activePage={activePage} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
