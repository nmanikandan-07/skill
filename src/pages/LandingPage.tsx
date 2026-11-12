import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  ArrowRightLeft, 
  Star, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  Layers, 
  Calendar,
  Lock,
  Award,
  Zap,
  Check
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/skills';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setQuickMatchOpen } = useApp();

  return (
    <div className="bg-[#F8F9FF] text-[#10213A]">
      {/* Hero Section */}
      <section className="bg-[#F7F8FF] border-b border-[#E4E7F2] pt-12 pb-20 lg:pt-18 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#4F46E5] text-[13px] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#4F46E5]" />
                <span>Verified University Student Network</span>
              </div>

              {/* Large Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#10213A] tracking-tight leading-[1.12]">
                Learn Together.<br />
                <span className="text-[#4F46E5]">Grow Together.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-lg sm:text-[18px] text-[#5E6680] leading-relaxed max-w-xl">
                The premier peer learning network where verified university students trade hands-on skills, collaborate 1-on-1, and build real capability — completely free of tuition fees.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730D3] shadow-card transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#FDE047]" />
                  <span>One-Click Demo Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/explore-skills')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-medium text-[#10213A] bg-white hover:bg-[#F8F9FF] border border-[#E4E7F2] transition-all"
                >
                  <BookOpen className="w-4 h-4 text-[#4F46E5]" />
                  <span>Explore Skills</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex items-center gap-6 text-[13px] text-[#5E6680] font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#087F5B]" />
                  <span>.edu SSO Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#087F5B]" />
                  <span>Zero Tuition Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#087F5B]" />
                  <span>1:1 Structured Swaps</span>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Mutual-Match Interface */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[22px] border border-[#E4E7F2] shadow-elevated p-6 sm:p-7 relative">
                {/* Protocol Header Bar */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F1F4F9]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#087F5B]" />
                    <span className="ml-2 text-[12px] font-semibold text-[#8992AA] tracking-wide uppercase">
                      Live Mutual Match Protocol
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold text-[#4F46E5] bg-[#EEF2FF] border border-[#C7D2FE]">
                    <Sparkles className="w-3.5 h-3.5" />
                    96% Match
                  </span>
                </div>

                {/* Profiles Match Container */}
                <div className="space-y-4">
                  {/* Student 1 Profile */}
                  <div className="p-4 rounded-xl bg-[#F8F9FF] border border-[#E4E7F2]/80 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-bold text-[16px]">
                        A
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-[15px] text-[#10213A]">Arun Kumar</h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-[#4F46E5]" />
                        </div>
                        <p className="text-[12px] text-[#5E6680]">Computer Science • 3rd Year • Stanford</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-[12px] text-[#F59E0B] font-bold">
                        <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                        <span>4.9</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[11.5px]">
                      <span className="px-2 py-0.5 rounded bg-[#D9F4E9] text-[#087F5B] font-semibold">
                        Can Teach: Python & Backend
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4F46E5] font-semibold">
                        Wants: UI/UX & Figma
                      </span>
                    </div>
                  </div>

                  {/* Circular Exchange Icon */}
                  <div className="relative flex items-center justify-center py-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-dashed border-[#CBD5E1]" />
                    </div>
                    <div className="relative w-10 h-10 rounded-full bg-[#4F46E5] text-white flex items-center justify-center shadow-md">
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Student 2 Profile */}
                  <div className="p-4 rounded-xl bg-[#F8F9FF] border border-[#E4E7F2]/80 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] text-white flex items-center justify-center font-bold text-[16px]">
                        D
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-[15px] text-[#10213A]">Divya Sharma</h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-[#4F46E5]" />
                        </div>
                        <p className="text-[12px] text-[#5E6680]">Product Design • 2nd Year • Stanford</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-[12px] text-[#F59E0B] font-bold">
                        <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                        <span>4.8</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[11.5px]">
                      <span className="px-2 py-0.5 rounded bg-[#D9F4E9] text-[#087F5B] font-semibold">
                        Can Teach: UI/UX & Figma
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4F46E5] font-semibold">
                        Wants: Python & Backend
                      </span>
                    </div>
                  </div>
                </div>

                {/* Green Success Strip and Connect Action */}
                <div className="mt-5 pt-4 border-t border-[#F1F4F9] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[12.5px] font-semibold text-[#087F5B]">
                    <CheckCircle2 className="w-4 h-4 text-[#087F5B]" />
                    <span>Balanced 1:1 Skill Exchange</span>
                  </div>

                  <button
                    onClick={() => {
                      setQuickMatchOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-[#087F5B] hover:bg-[#076a4c] shadow-xs transition-all"
                  >
                    <span>Connect Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="py-12 bg-white border-b border-[#E4E7F2]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#E4E7F2]">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#4F46E5]">12,400+</div>
              <div className="text-[14px] text-[#5E6680] font-medium mt-1">Verified Students</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#10213A]">850+</div>
              <div className="text-[14px] text-[#5E6680] font-medium mt-1">Skills Shared</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#087F5B]">34,000+</div>
              <div className="text-[14px] text-[#5E6680] font-medium mt-1">Free Peer Exchanges</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#4F46E5]">4.9 / 5.0</div>
              <div className="text-[14px] text-[#5E6680] font-medium mt-1">Average Session Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Three-Step Learning Process */}
      <section id="how-it-works" className="py-20 lg:py-24 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[13px] font-bold uppercase tracking-wider text-[#4F46E5]">
            How It Works
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#10213A]">
            Exchange Skills in 3 Simple Steps
          </h2>
          <p className="text-[16px] text-[#5E6680]">
            No credit cards, no subscriptions. Just pure student-to-student capability building.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="ss-card p-8 bg-white relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] font-extrabold text-xl flex items-center justify-center">
              1
            </div>
            <h3 className="text-[20px] font-bold text-[#10213A]">List Your Skills</h3>
            <p className="text-[14.5px] text-[#5E6680] leading-relaxed">
              Verify your academic email, add what you are comfortable mentoring in, and tag what you want to learn next.
            </p>
          </div>

          {/* Step 2 */}
          <div className="ss-card p-8 bg-white relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D9F4E9] text-[#087F5B] font-extrabold text-xl flex items-center justify-center">
              2
            </div>
            <h3 className="text-[20px] font-bold text-[#10213A]">Match & Schedule</h3>
            <p className="text-[14.5px] text-[#5E6680] leading-relaxed">
              Our protocol pairs complementary student needs. Pick an available slot on the calendar and sync meeting details.
            </p>
          </div>

          {/* Step 3 */}
          <div className="ss-card p-8 bg-white relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] font-extrabold text-xl flex items-center justify-center">
              3
            </div>
            <h3 className="text-[20px] font-bold text-[#10213A]">Swap & Endorse</h3>
            <p className="text-[14.5px] text-[#5E6680] leading-relaxed">
              Meet virtually or on campus. Swap practical knowledge, test each other's code/designs, and earn verified peer endorsements.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Skill Categories */}
      <section id="categories" className="py-16 bg-[#F7F8FF] border-y border-[#E4E7F2]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#4F46E5]">
                Curated Catalogue
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10213A] mt-1">
                Popular Skill Categories
              </h2>
            </div>
            <button
              onClick={() => navigate('/explore-skills')}
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4F46E5] hover:underline"
            >
              <span>View All 500+ Skills</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SKILL_CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/explore-skills?category=${cat.id}`)}
                className="ss-card p-5 bg-white text-center cursor-pointer hover:border-[#4F46E5] hover:shadow-card transition-all"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] mb-3">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[14px] text-[#10213A] leading-snug">{cat.name}</h4>
                <p className="text-[12px] text-[#8992AA] mt-1">{cat.count} mentors</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="bg-[#4F46E5] rounded-[24px] p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-elevated">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Ready to trade skills with peers at your university?
            </h2>
            <p className="text-white/80 text-[16px] leading-relaxed">
              Join thousands of college students exchanging computer science, design systems, languages, and interview skills every week.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-3.5 rounded-xl font-bold text-[15px] bg-white text-[#4F46E5] hover:bg-[#F8F9FF] shadow-sm transition-all"
              >
                Join with University Email
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-7 py-3.5 rounded-xl font-medium text-[15px] text-white bg-[#4338CA] hover:bg-[#3730D3] transition-all"
              >
                Sign In to Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
