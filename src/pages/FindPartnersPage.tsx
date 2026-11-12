import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Sparkles, 
  Filter, 
  X, 
  SlidersHorizontal, 
  GraduationCap, 
  Check,
  ChevronDown
} from 'lucide-react';
import { StudentCard } from '../components/cards/StudentCard';
import { useSearchParams } from 'react-router-dom';

export const FindPartnersPage: React.FC = () => {
  const { students, currentUser } = useApp();
  const [searchParams] = useSearchParams();
  const initialSkill = searchParams.get('skill') || '';

  const [searchQuery, setSearchQuery] = useState(initialSkill);
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'reviews'>('match');

  // Filter students (exclude current user)
  const peerList = useMemo(() => {
    return students.filter(s => s.id !== currentUser.id);
  }, [students, currentUser.id]);

  const filteredStudents = useMemo(() => {
    return peerList
      .filter(student => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = student.name.toLowerCase().includes(q);
          const matchMajor = student.major.toLowerCase().includes(q);
          const matchTeach = student.canTeach.some(t => t.skillName.toLowerCase().includes(q));
          const matchLearn = student.wantsToLearn.some(l => l.skillName.toLowerCase().includes(q));
          if (!matchName && !matchMajor && !matchTeach && !matchLearn) return false;
        }

        // University
        if (selectedUniversity !== 'all' && !student.university.toLowerCase().includes(selectedUniversity.toLowerCase())) {
          return false;
        }

        // Department
        if (selectedDepartment !== 'all' && !student.department.toLowerCase().includes(selectedDepartment.toLowerCase())) {
          return false;
        }

        // Year
        if (selectedYear !== 'all' && !student.year.toLowerCase().includes(selectedYear.toLowerCase())) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          return (b.matchScore || 0) - (a.matchScore || 0);
        } else if (sortBy === 'rating') {
          return b.rating - a.rating;
        } else {
          return b.reviewCount - a.reviewCount;
        }
      });
  }, [peerList, searchQuery, selectedUniversity, selectedDepartment, selectedYear, sortBy]);

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (searchQuery) {
      chips.push({ key: 'search', label: `Skill: ${searchQuery}`, onRemove: () => setSearchQuery('') });
    }
    if (selectedUniversity !== 'all') {
      chips.push({ key: 'uni', label: `Uni: ${selectedUniversity}`, onRemove: () => setSelectedUniversity('all') });
    }
    if (selectedDepartment !== 'all') {
      chips.push({ key: 'dept', label: `Dept: ${selectedDepartment}`, onRemove: () => setSelectedDepartment('all') });
    }
    if (selectedYear !== 'all') {
      chips.push({ key: 'year', label: `Year: ${selectedYear}`, onRemove: () => setSelectedYear('all') });
    }
    return chips;
  }, [searchQuery, selectedUniversity, selectedDepartment, selectedYear]);

  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedUniversity('all');
    setSelectedDepartment('all');
    setSelectedYear('all');
    setSortBy('match');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10213A] tracking-tight">
              Find Skill Partners
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-[#D9F4E9] text-[#087F5B] border border-[#A7F3D0]">
              <Sparkles className="w-3.5 h-3.5" />
              Algorithm-Matched Profiles
            </span>
          </div>
          <p className="text-[14.5px] text-[#5E6680] mt-1">
            Connect with students who have complementary learning goals and trade skills directly.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="ss-card p-6 bg-white space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-[#8992AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by skill name, student name, or major..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E4E7F2] text-[13.5px] text-[#10213A] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] text-[13.5px] text-[#10213A] bg-white focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Design">Design & HCI</option>
              <option value="Business">Business & Management</option>
              <option value="Data Science">Data Science</option>
              <option value="Cognitive">Cognitive Science</option>
            </select>
          </div>

          {/* College / University Filter */}
          <div>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] text-[13.5px] text-[#10213A] bg-white focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="all">All Universities</option>
              <option value="Stanford">Stanford University</option>
              <option value="Berkeley">UC Berkeley</option>
              <option value="MIT">MIT</option>
              <option value="Harvard">Harvard University</option>
              <option value="Carnegie">Carnegie Mellon</option>
              <option value="Columbia">Columbia University</option>
              <option value="Washington">Univ of Washington</option>
              <option value="Georgia">Georgia Tech</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E7F2] text-[13.5px] text-[#10213A] bg-white focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="match">Sort: Highest Match</option>
              <option value="rating">Sort: Top Rating</option>
              <option value="reviews">Sort: Most Sessions</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F1F4F9]">
            <span className="text-[12px] font-semibold text-[#8992AA]">Active Filters:</span>
            {activeChips.map(chip => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-medium bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]"
              >
                <span>{chip.label}</span>
                <button onClick={chip.onRemove} className="hover:text-[#3730D3]">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            <button
              onClick={handleClearAll}
              className="text-[12.5px] text-[#DC2626] hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-[14px] text-[#5E6680]">
          Showing <strong className="text-[#10213A]">{filteredStudents.length}</strong> verified peer partners
        </p>
      </div>

      {/* Student Cards Grid: 3 cols desktop, 2 tablet, 1 mobile */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <div className="ss-card p-12 text-center bg-white">
          <Search className="w-12 h-12 text-[#8992AA] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#10213A]">No student matches found</h3>
          <p className="text-[14px] text-[#5E6680] mt-1">Try broadening your filters or clearing search criteria.</p>
          <button
            onClick={handleClearAll}
            className="mt-4 px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-[#4F46E5]"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
