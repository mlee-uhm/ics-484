import React, { useState } from 'react';
import { MdMenuOpen, MdBarChart } from 'react-icons/md';
import { FaMap } from 'react-icons/fa'; // Added marker icon for scatter
import { FaChartSimple } from 'react-icons/fa6';

// 1. Define the types for the props this component accepts
interface SidebarProps {
  onViewChange: (view: 'choropleth' | 'bar' | 'scatter') => void;
}

// 2. Update menu items to include a 'view' key that matches Home.tsx cases
const menuItems = [
  {
    icons: <FaMap size={20} />,
    label: 'Choropleth Map',
    view: 'choropleth', // Matches case 'choropleth' in Home
  },
  {
    icons: <MdBarChart size={20} />,
    label: 'Hourly Bar Chart',
    view: 'bar', // Matches case 'bar' in Home
  },
  {
    icons: <FaChartSimple size={20} />, // Changed icon slightly for variety
    label: 'Scatter Map',
    view: 'scatter', // Matches case 'scatter' in Home
  },
];

// 3. Destructure the prop here
export default function Sidebar({ onViewChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <nav
      className={`shadow-md h-screen duration-500 ${isOpen ? 'w-60' : 'w-16'}`}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div className="border px-3 py-2 h-20 flex justify-between items-center">
        <MdMenuOpen
          size={24}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            cursor: 'pointer',
            transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s',
          }}
        />
      </div>
      <ul
        style={{
          listStyleType: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
      >
        {menuItems.map((item, index) => (
          <li
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="py-2 duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            // 4. Trigger the view change on click
            onClick={() => onViewChange(item.view as any)}
            style={{
              backgroundColor: hoveredIndex === index ? '#DBEAFE' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingLeft: '12px',
              paddingRight: '12px',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {item.icons}
            </div>
            {isOpen && (
              <p style={{ margin: 0, whiteSpace: 'nowrap' }} className="duration-300">
                {item.label}
              </p>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}