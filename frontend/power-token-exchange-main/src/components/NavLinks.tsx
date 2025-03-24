
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

interface NavLink {
  title: string;
  path: string;
  requiresAuth: boolean;
}

export const navLinks: NavLink[] = [
  { title: 'Home', path: '/', requiresAuth: false },
  { title: 'About', path: '/about', requiresAuth: false },
  { title: 'Get Started', path: '/get-started', requiresAuth: false },
  { title: 'Dashboard', path: '/dashboard', requiresAuth: true },
  { title: 'Energy Market', path: '/products', requiresAuth: true },
  { title: 'Token Market', path: '/marketplace', requiresAuth: true },
  { title: 'Trade', path: '/start-trading', requiresAuth: true },
  { title: 'Rewards', path: '/rewards', requiresAuth: true },
];

export const NavLinks: React.FC<{
  mobile?: boolean;
  onClick?: () => void;
}> = ({ mobile = false, onClick }) => {
  const { isAuthenticated } = useAuth();
  
  const filteredLinks = navLinks.filter(link => 
    !link.requiresAuth || (link.requiresAuth && isAuthenticated)
  );
  
  return (
    <>
      {filteredLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`transition-colors duration-200 
            ${mobile 
              ? 'block px-4 py-2 text-lg hover:bg-accent' 
              : 'px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground'
            }`}
          onClick={onClick}
        >
          {link.title}
        </Link>
      ))}
    </>
  );
};
