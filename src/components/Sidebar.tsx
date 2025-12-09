import React, { useState } from 'react';
import { MdMenuOpen, MdBarChart } from 'react-icons/md';
import { FaMap } from 'react-icons/fa';
import { FaChartLine } from 'react-icons/fa6';

// 1. Define valid view types
type ViewType = 'choropleth' | 'bar' | 'trends';

interface SidebarProps {
  onViewChange: (view: ViewType) => void;
}

const menuItems: { icons: React.ReactNode; label: string; view: ViewType }[] = [
  {
    icons: <FaMap size={20} />,
    label: 'Choropleth Map',
    view: 'choropleth',
  },
  {
    icons: <MdBarChart size={20} />,
    label: 'Frequency Stats',
    view: 'bar',
  },
  {
    icons: <FaChartLine size={20} />,
    label: 'Trends Across Time',
    view: 'trends', // Renamed from 'scatter'
  },
];

export default function Sidebar({ onViewChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <nav
      className={`shadow-md h-screen duration-500 ${isOpen ? 'w-60' : 'w-16'}`}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div className="border px-3 py-2 h-20 flex justify-between items-center">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setIsOpen(!isOpen);
          }}
          style={{
            display: 'inline-flex',
            cursor: 'pointer',
            transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s',
          }}
        >
          <MdMenuOpen size={24} />
        </div>
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
            className="w-full"
          >
            <button
              type="button"
              className="py-2 duration-300 w-full"
              onClick={() => onViewChange(item.view)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                backgroundColor: hoveredIndex === index ? '#DBEAFE' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingLeft: '12px',
                paddingRight: '12px',
                border: 'none',
                cursor: 'pointer',
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
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
