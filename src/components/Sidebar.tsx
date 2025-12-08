import React, { useState } from 'react';
import { MdMenuOpen, MdBarChart, MdOutlineQueryStats } from 'react-icons/md';
import { FaChartLine, FaMap } from 'react-icons/fa6';

const menuItems = [
  {
    icons: <MdBarChart size={20} />,
    label: 'Bar Graph',
  },
  {
    icons: <FaChartLine size={20} />,
    label: 'Line Graph',
  },
  {
    icons: <FaMap size={20} />,
    label: 'Map',
  },
  {
    icons: <MdOutlineQueryStats size={20} />,
    label: 'Analysis',
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
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
      <ul style={{
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
        {
          menuItems.map((item, index) => (
            <li
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="py-2 duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
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
          ))
        }
      </ul>
    </nav>
  );
}
