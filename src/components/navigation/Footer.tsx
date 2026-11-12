import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E4E7F2] pt-14 pb-10 text-[14px]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white shadow-sm">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-[19px] font-bold text-[#10213A] tracking-tight">SkillSync</span>
            </Link>
            <p className="text-[#5E6680] text-[14px] leading-relaxed max-w-sm">
              The verified university student peer learning network. Exchange skills, build real capabilities, and grow together without tuition fees.
            </p>
            <div className="flex items-center gap-2 text-[12.5px] text-[#087F5B] bg-[#D9F4E9] px-3 py-1.5 rounded-full w-fit font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified SSO Academic Network</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-[#10213A] text-[15px] mb-3.5">Platform</h4>
            <ul className="space-y-2.5 text-[#5E6680]">
              <li><Link to="/explore-skills" className="hover:text-[#4F46E5] transition-colors">Explore Skills</Link></li>
              <li><Link to="/find-partners" className="hover:text-[#4F46E5] transition-colors">Find Partners</Link></li>
              <li><a href="#how-it-works" className="hover:text-[#4F46E5] transition-colors">Mutual Exchange Protocol</a></li>
              <li><Link to="/register" className="hover:text-[#4F46E5] transition-colors">Student Sign Up</Link></li>
            </ul>
          </div>

          {/* Academic Community */}
          <div>
            <h4 className="font-semibold text-[#10213A] text-[15px] mb-3.5">Academic Community</h4>
            <ul className="space-y-2.5 text-[#5E6680]">
              <li><a href="#honor-code" className="hover:text-[#4F46E5] transition-colors">Academic Honor Code</a></li>
              <li><a href="#universities" className="hover:text-[#4F46E5] transition-colors">Supported Universities</a></li>
              <li><a href="#peer-reviews" className="hover:text-[#4F46E5] transition-colors">Peer Endorsements</a></li>
              <li><a href="#safety" className="hover:text-[#4F46E5] transition-colors">Trust & Safety Policy</a></li>
            </ul>
          </div>

          {/* Legal / Zero-Fee Guarantee */}
          <div>
            <h4 className="font-semibold text-[#10213A] text-[15px] mb-3.5">Standards & Policy</h4>
            <ul className="space-y-2.5 text-[#5E6680]">
              <li><a href="#free" className="hover:text-[#4F46E5] transition-colors">Zero-Tuition Guarantee</a></li>
              <li><a href="#terms" className="hover:text-[#4F46E5] transition-colors">Terms of Exchange</a></li>
              <li><a href="#privacy" className="hover:text-[#4F46E5] transition-colors">FERPA / Student Privacy</a></li>
              <li><a href="#guidelines" className="hover:text-[#4F46E5] transition-colors">Conduct Guidelines</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#E4E7F2] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#8992AA]">
          <p>© {new Date().getFullYear()} SkillSync Inc. All rights reserved. Built for university peers worldwide.</p>
          <div className="flex items-center gap-1 text-[13px] text-[#5E6680]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#DC2626] fill-[#DC2626]" />
            <span>for university peer learning</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
