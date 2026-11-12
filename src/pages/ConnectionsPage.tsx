import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  RotateCw, 
  Filter, 
  ArrowLeftRight, 
  CheckCircle2, 
  Clock, 
  Plus,
  Share2
} from 'lucide-react';
import { ConnectionCard } from '../components/cards/ConnectionCard';
import { IncomingRequestCard } from '../components/cards/IncomingRequestCard';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const ConnectionsPage: React.FC = () => {
  const { connections, incomingRequests, sentRequests, showToast } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialTab = searchParams.get('tab') === 'requests' ? 'requests' : 'active';
  const [activeTab, setActiveTab] = useState<'active' | 'requests' | 'sent'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  // Filtered connections
  const filteredConnections = useMemo(() => {
    return connections.filter(conn => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = conn.student.name.toLowerCase().includes(q);
        const matchesTeaches = conn.teachesYou.some(t => t.toLowerCase().includes(q));
        const matchesLearns = conn.learnsFromYou.some(l => l.toLowerCase().includes(q));
        if (!matchesName && !matchesTeaches && !matchesLearns) return false;
      }
      if (selectedDept !== 'all' && !conn.student.department.toLowerCase().includes(selectedDept.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [connections, searchQuery, selectedDept]);

  const handleRefresh = () => {
    showToast('Connections network refreshed', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10213A] tracking-tight">
              Connections & Learning Network
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#D9F4E9] text-[#087F5B] border border-[#A7F3D0]">
              Fall 2026 Term
            </span>
          </div>
          <p className="text-[14.5px] text-[#5E6680] mt-1">
            Manage your active peer partnerships, review incoming swap proposals, and schedule 1-on-1 sessions.
          </p>
        </div>

        <button
          onClick={() => navigate('/find-partners')}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Find New Partners</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-[#E4E7F2] pb-0.5">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 px-5 py-3 text-[14.5px] font-semibold border-b-2 transition-all ${
            activeTab === 'active'
              ? 'border-[#4F46E5] text-[#4F46E5]'
              : 'border-transparent text-[#5E6680] hover:text-[#10213A]'
          }`}
        >
          <span>Active Connections</span>
          <span className={`px-2 py-0.5 rounded-full text-[11.5px] ${
            activeTab === 'active' ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-[#F1F4F9] text-[#5E6680]'
          }`}>
            {connections.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-5 py-3 text-[14.5px] font-semibold border-b-2 transition-all ${
            activeTab === 'requests'
              ? 'border-[#4F46E5] text-[#4F46E5]'
              : 'border-transparent text-[#5E6680] hover:text-[#10213A]'
          }`}
        >
          <span>Incoming Requests</span>
          <span className={`px-2 py-0.5 rounded-full text-[11.5px] ${
            incomingRequests.length > 0 ? 'bg-[#FEF3C7] text-[#D97706] font-bold' : 'bg-[#F1F4F9] text-[#5E6680]'
          }`}>
            {incomingRequests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 px-5 py-3 text-[14.5px] font-semibold border-b-2 transition-all ${
            activeTab === 'sent'
              ? 'border-[#4F46E5] text-[#4F46E5]'
              : 'border-transparent text-[#5E6680] hover:text-[#10213A]'
          }`}
        >
          <span>Sent Requests</span>
          <span className="px-2 py-0.5 rounded-full text-[11.5px] bg-[#F1F4F9] text-[#5E6680]">
            {sentRequests.length}
          </span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="ss-card p-4 bg-white flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="w-4 h-4 text-[#8992AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E4E7F2] text-[13.5px] text-[#10213A] focus:border-[#4F46E5] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-[#E4E7F2] text-[13px] text-[#10213A] bg-white focus:outline-none"
          >
            <option value="all">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Design">Design & HCI</option>
            <option value="Business">Business</option>
            <option value="Data Science">Data Science</option>
          </select>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl border border-[#E4E7F2] text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF]"
            title="Refresh connections"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab 1: Active Connections */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {filteredConnections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConnections.map(conn => (
                <ConnectionCard key={conn.id} connection={conn} />
              ))}
            </div>
          ) : (
            <div className="ss-card p-12 text-center bg-white">
              <Share2 className="w-12 h-12 text-[#8992AA] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#10213A]">No active connections found</h3>
              <p className="text-[14px] text-[#5E6680] mt-1">Accept pending incoming requests or find new partners to start trading skills.</p>
              <button
                onClick={() => navigate('/find-partners')}
                className="mt-4 px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-[#4F46E5]"
              >
                Find Skill Partners
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Incoming Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[18px] text-[#10213A]">Review Incoming Proposals</h3>
              <p className="text-[13px] text-[#5E6680]">Peers offering to exchange complementary skills with you</p>
            </div>
          </div>

          {incomingRequests.length > 0 ? (
            <div className="space-y-4">
              {incomingRequests.map(req => (
                <IncomingRequestCard key={req.id} request={req} />
              ))}
            </div>
          ) : (
            <div className="ss-card p-12 text-center bg-white">
              <CheckCircle2 className="w-12 h-12 text-[#087F5B] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#10213A]">All caught up!</h3>
              <p className="text-[14px] text-[#5E6680] mt-1">You have no pending incoming exchange requests at this time.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Sent Requests */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentRequests.length > 0 ? (
            <div className="space-y-3">
              {sentRequests.map((req, idx) => (
                <div key={idx} className="ss-card p-5 bg-white flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={req.toStudent?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'}
                      alt={req.toStudent?.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E4E7F2]"
                    />
                    <div>
                      <h4 className="font-bold text-[15.5px] text-[#10213A]">{req.toStudent?.name}</h4>
                      <p className="text-[12.5px] text-[#5E6680]">{req.toStudent?.major} • {req.toStudent?.university}</p>
                      <p className="text-[12px] text-[#8992AA] mt-0.5">Proposal sent {req.sentDate}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[12px] font-semibold text-[#D97706] bg-[#FEF3C7]">
                    Awaiting Response
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="ss-card p-12 text-center bg-white">
              <Clock className="w-12 h-12 text-[#8992AA] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#10213A]">No outgoing proposals</h3>
              <p className="text-[14px] text-[#5E6680] mt-1">You haven't sent any pending exchange requests.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
