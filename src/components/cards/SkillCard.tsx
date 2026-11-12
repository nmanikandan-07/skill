import React from 'react';
import { Skill } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Bookmark, 
  Star, 
  Users, 
  Calendar, 
  ArrowRight,
  Code,
  Figma,
  Brain,
  Terminal,
  Globe,
  Mic,
  Smartphone,
  Layers,
  Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SkillCardProps {
  skill: Skill;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const { toggleBookmarkSkill, showToast } = useApp();
  const navigate = useNavigate();

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'ui/ux design':
        return <Figma className="w-5 h-5 text-[#4F46E5]" />;
      case 'data science':
        return <Brain className="w-5 h-5 text-[#7C3AED]" />;
      case 'languages':
        return <Globe className="w-5 h-5 text-[#087F5B]" />;
      case 'business & public speaking':
        return <Mic className="w-5 h-5 text-[#D97706]" />;
      case 'app dev':
        return <Smartphone className="w-5 h-5 text-[#0284C7]" />;
      default:
        return <Code className="w-5 h-5 text-[#4F46E5]" />;
    }
  };

  return (
    <div className="ss-card ss-card-hover p-6 flex flex-col justify-between h-full bg-white transition-all">
      <div>
        {/* Category Header & Bookmark Button */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center border border-[#E0E7FF]">
              {getCategoryIcon(skill.category)}
            </div>
            <div>
              <span className="text-[12px] font-semibold text-[#4F46E5] uppercase tracking-wide block">
                {skill.category}
              </span>
              <span className="text-[11px] text-[#8992AA] font-medium">
                {skill.level} Level
              </span>
            </div>
          </div>

          <button
            onClick={() => toggleBookmarkSkill(skill.id)}
            className={`p-2 rounded-xl transition-all ${
              skill.bookmarked
                ? 'text-[#4F46E5] bg-[#EEF2FF]'
                : 'text-[#8992AA] hover:text-[#10213A] hover:bg-[#F8F9FF]'
            }`}
            title={skill.bookmarked ? 'Bookmarked' : 'Bookmark this skill'}
          >
            <Bookmark className={`w-4 h-4 ${skill.bookmarked ? 'fill-[#4F46E5]' : ''}`} />
          </button>
        </div>

        {/* Title & Description */}
        <h3 className="font-bold text-[17px] text-[#10213A] mb-2 leading-snug">
          {skill.title}
        </h3>
        <p className="text-[13.5px] text-[#5E6680] leading-relaxed mb-4">
          {skill.description}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#F1F4F9] text-center mb-4">
          <div>
            <div className="flex items-center justify-center gap-1 text-[13px] font-bold text-[#10213A]">
              <Users className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>{skill.mentorCount}</span>
            </div>
            <span className="text-[11px] text-[#8992AA]">Mentors</span>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[13px] font-bold text-[#F59E0B]">
              <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
              <span>{skill.rating.toFixed(1)}</span>
            </div>
            <span className="text-[11px] text-[#8992AA]">Rating</span>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[13px] font-bold text-[#087F5B]">
              <Calendar className="w-3.5 h-3.5 text-[#087F5B]" />
              <span>{skill.sessionCount}</span>
            </div>
            <span className="text-[11px] text-[#8992AA]">Sessions</span>
          </div>
        </div>

        {/* Top Peer Mentors Stack */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-[12px] font-medium text-[#5E6680]">Top Peer Teachers:</span>
          <div className="flex -space-x-2">
            {skill.topMentors.map((m, idx) => (
              <img
                key={idx}
                src={m.avatar}
                alt={m.name}
                title={`${m.name} (${m.university})`}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => {
          navigate(`/find-partners?skill=${encodeURIComponent(skill.title)}`);
          showToast(`Showing mentors for ${skill.title}`, 'info');
        }}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-[13.5px] font-medium text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] active:bg-[#C7D2FE] border border-[#C7D2FE] rounded-xl transition-all"
      >
        <span>Find Mentors</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
