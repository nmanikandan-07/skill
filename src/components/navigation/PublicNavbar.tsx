import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E4E7F2]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-[76px] flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white shadow-sm shadow-[#4F46E5]/30">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[20px] font-bold text-[#10213A] tracking-tight">SkillSync</span>
            <span className="text-[11px] font-medium text-[#8992AA] -mt-1 hidden sm:block">
              Peer Learning Network
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-[14.5px] font-medium text-[#10213A] hover:text-[#4F46E5] transition-colors">
            Home
          </Link>
          <Link to="/explore-skills" className="text-[14.5px] font-medium text-[#5E6680] hover:text-[#4F46E5] transition-colors">
            Explore Skills
          </Link>
          <a href="#how-it-works" className="text-[14.5px] font-medium text-[#5E6680] hover:text-[#4F46E5] transition-colors">
            How It Works
          </a>
          <a href="#about" className="text-[14.5px] font-medium text-[#5E6680] hover:text-[#4F46E5] transition-colors">
            About
          </a>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-bold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE] rounded-xl transition-all shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>Demo Login</span>
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-3.5 py-2 text-[14px] font-medium text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF] rounded-xl transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14.5px] font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730D3] shadow-sm transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#5E6680] hover:text-[#10213A] rounded-lg"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E4E7F2] px-6 py-5 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-[#10213A] py-1"
            >
              Home
            </Link>
            <Link
              to="/explore-skills"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-[#5E6680] py-1"
            >
              Explore Skills
            </Link>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-[#5E6680] py-1"
            >
              How It Works
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-[#5E6680] py-1"
            >
              About
            </a>
          </div>

          <div className="pt-3 border-t border-[#E4E7F2] flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              className="w-full py-2.5 text-center text-[14px] font-medium text-[#5E6680] border border-[#E4E7F2] rounded-xl"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/register');
              }}
              className="w-full py-2.5 text-center text-[14px] font-medium text-white bg-[#4F46E5] rounded-xl shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
