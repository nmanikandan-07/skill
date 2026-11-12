import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Sparkles, 
  ArrowLeftRight, 
  SlidersHorizontal, 
  X, 
  Grid3X3, 
  Map, 
  Check, 
  Filter,
  ArrowRight
} from 'lucide-react';
import { SkillCard } from '../components/cards/SkillCard';
import { SKILL_CATEGORIES } from '../data/skills';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const ExploreSkillsPage: React.FC = () => {
  const { skills, setQuickMatchOpen } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  // Filter skills
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = skill.title.toLowerCase().includes(q);
        const matchesCategory = skill.category.toLowerCase().includes(q);
        const matchesDesc = skill.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesDesc) return false;
      }

      // Category
      if (selectedCategory !== 'all') {
        const catObj = SKILL_CATEGORIES.find(c => c.id === selectedCategory);
        if (catObj && skill.category.toLowerCase() !== catObj.name.toLowerCase()) {
          return false;
        }
      }

      // Level
      if (selectedLevel !== 'all' && skill.level !== selectedLevel) {
        return false;
      }

      // Bookmarked
      if (bookmarkedOnly && !skill.bookmarked) {
        return false;
      }

      return true;
    });
  }, [skills, searchQuery, selectedCategory, selectedLevel, bookmarkedOnly]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setVerifiedOnly(false);
    setBookmarkedOnly(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10213A] tracking-tight">
              Explore Skills
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]">
              {skills.length} Available Skills
            </span>
          </div>
          <p className="text-[14.5px] text-[#5E6680] mt-1">
            Discover technical, design, and professional skills taught by verified peers across top universities.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#E4E7F2] shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                : 'text-[#5E6680] hover:text-[#10213A]'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>Grid View</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
              viewMode === 'map'
                ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                : 'text-[#5E6680] hover:text-[#10213A]'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Category Map</span>
          </button>
        </div>
      </div>

      {/* Highlighted High-Demand Exchange Banner */}
      <div className="rounded-[20px] bg-gradient-to-r from-[#4F46E5] via-[#4338CA] to-[#3730D3] p-6 text-white shadow-elevated relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[12px] font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Highest Demand Peer Exchange This Week</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold flex items-center gap-3">
              <span>UI/UX Design</span>
              <ArrowLeftRight className="w-5 h-5 text-white/80" />
              <span>Python / Backend Engineering</span>
            </h3>
            <p className="text-[13.5px] text-white/80">
              48 active pairings this week • Students trading frontend and design tokens for API schemas and databases
            </p>
          </div>

          <button
            onClick={() => setQuickMatchOpen(true)}
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13.5px] font-bold text-[#4F46E5] bg-white hover:bg-[#F8F9FF] shadow-sm transition-all"
          >
            <span>View Match Group</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="ss-card p-5 bg-white space-y-4">
        {/* Top Search Input & Dropdowns */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8992AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skill title, topic, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E4E7F2] text-[14px] text-[#10213A] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8992AA] hover:text-[#10213A]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] text-[13.5px] text-[#10213A] bg-white focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="all">All Difficulty Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>

            {/* Bookmarks Filter */}
            <button
              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
              className={`px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium border transition-all ${
                bookmarkedOnly
                  ? 'bg-[#EEF2FF] border-[#C7D2FE] text-[#4F46E5]'
                  : 'bg-white border-[#E4E7F2] text-[#5E6680] hover:text-[#10213A]'
              }`}
            >
              ★ Bookmarked
            </button>

            {/* Clear All */}
            {(searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all' || bookmarkedOnly) && (
              <button
                onClick={handleClearFilters}
                className="text-[13px] text-[#DC2626] hover:underline px-2"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {SKILL_CATEGORIES.map(category => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'bg-[#F8F9FF] text-[#5E6680] hover:text-[#10213A] hover:bg-[#EEF2FF]'
                }`}
              >
                {category.name} ({category.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Grid */}
      {viewMode === 'grid' ? (
        filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="ss-card p-12 text-center bg-white">
            <Search className="w-12 h-12 text-[#8992AA] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#10213A]">No skills found matching your criteria</h3>
            <p className="text-[14px] text-[#5E6680] mt-1">Try resetting your search query or picking another category.</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-[#4F46E5]"
            >
              Reset Filters
            </button>
          </div>
        )
      ) : (
        /* Category Map Matrix View */
        <div className="ss-card p-8 bg-white space-y-6">
          <h3 className="text-xl font-bold text-[#10213A]">Category Knowledge Map</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SKILL_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
              const catSkills = skills.filter(s => s.category.toLowerCase() === cat.name.toLowerCase());
              return (
                <div key={cat.id} className="p-5 rounded-2xl border border-[#E4E7F2] bg-[#F8F9FF] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[16px] text-[#10213A]">{cat.name}</h4>
                    <span className="text-[12px] font-semibold text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-full">
                      {catSkills.length} skills
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map(s => (
                      <button
                        key={s.id}
                        onClick={() => navigate(`/find-partners?skill=${encodeURIComponent(s.title)}`)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#E4E7F2] hover:border-[#4F46E5] text-[13px] font-medium text-[#10213A] shadow-2xs hover:shadow-xs transition-all"
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
