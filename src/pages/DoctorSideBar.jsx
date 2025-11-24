import { icons } from 'lucide-react';
import React, { useState } from 'react';
import { FaHospital, FaBars, FaTimes, FaUser, FaComments, FaCalendarAlt } from 'react-icons/fa';
import { GrSchedule } from 'react-icons/gr';

const DoctorSideBar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
    { id: 'chat', label: 'Chat', icon: <FaComments /> },
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'schedule', label: 'Schedules', icon : < GrSchedule/>}
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-green-600 text-white transform transition-transform duration-300 z-50
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-green-700">
          <div className="flex items-center">
            <FaHospital className="text-3xl mr-2" />
            <span className="text-xl font-bold">NepoHeal</span>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default DoctorSideBar;