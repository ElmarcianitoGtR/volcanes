'use client';
import { 
  MapIcon, 
  CpuChipIcon, 
  CogIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

const FloatingMenu = () => {
  const menuItems = [
    { icon: MapIcon, label: 'Mapa', href: '/' },
    { icon: DocumentTextIcon, label: 'Estadisticas', href: '/estadisticas' },
    { icon: CpuChipIcon, label: 'Hardware', href: '/hardware' },
    { icon: CogIcon, label: 'Equipo', href: '/equipo' },
  ];

  return (
    <div className="fixed left-0 top-1/4 h-70 w-60 bg-gray-50/10 border-r ml-4 z-50 rounded-3xl flex flex-col justify-center items-start ">

      {/* Navegación */}
      <nav className="p-4 w-60">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 group"
                >
                  <Icon className="w-5 h-5 mr-3 group-hover:text-blue-400" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default FloatingMenu;