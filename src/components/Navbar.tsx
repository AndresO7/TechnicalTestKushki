import Link from 'next/link';
import { PawPrint } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-navbar backdrop-blur-sm bg-white/80 border-b border-secondary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/"
            className="flex items-center gap-2 text-brand-600 hover:text-brand-700 transition-colors"
          >
            <div className="bg-brand-gradient p-2 rounded-lg">
              <PawPrint className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-brand-gradient">
              PetShop
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link 
              href="/"
              className="text-secondary-600 hover:text-secondary-900 transition-colors text-sm font-medium"
            >
              Inicio
            </Link>
           
          </div>
        </div>
      </div>
    </nav>
  );
}; 