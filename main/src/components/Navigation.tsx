import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LogIn } from 'lucide-react';

const Navigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:bg-gray-50 transition-colors duration-200 shadow-sm">
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[220px] bg-white rounded-lg shadow-lg border border-gray-200 p-1 animate-in fade-in-0 zoom-in-95"
            sideOffset={5}
            align="end"
          >
            <DropdownMenu.Item
              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none"
              onClick={() => navigate('/portal')}
            >
              User's Login
            </DropdownMenu.Item>
            
            <DropdownMenu.Item
              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none"
              onClick={() => navigate('/admindashboard')}
            >
              Branch Manager's Login
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

export default Navigation;