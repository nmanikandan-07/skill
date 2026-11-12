import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  ShieldCheck, 
  ArrowLeft, 
  MoreVertical, 
  Calendar,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const MessagesPage: React.FC = () => {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    sendMessage, 
    currentUser,
    setSelectedPreviewStudent 
  } = useApp();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [inputMessage, setInputMessage] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];

  const filteredConversations = conversations.filter(c => 
    c.partner?.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.lastMessage?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputMessage.trim());
    setInputMessage('');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10213A] tracking-tight">
          Peer Messages
        </h1>
        <p className="text-[14px] text-[#5E6680] mt-0.5">
          Coordinate session agendas, share resources, and exchange feedback.
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 ss-card bg-white overflow-hidden flex border border-[#E4E7F2] shadow-sm">
        {/* Left: Conversations List (hidden on mobile if chat open) */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-[#E4E7F2] flex flex-col bg-white shrink-0 ${
          mobileChatOpen ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Search box */}
          <div className="p-4 border-b border-[#E4E7F2]">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8992AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-[13.5px] rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F1F4F9]">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conv => {
                const isSelected = activeConv && conv.id === activeConv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConversationId(conv.id);
                      setMobileChatOpen(true);
                    }}
                    className={`p-4 flex items-start gap-3.5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#EEF2FF]' : 'hover:bg-[#F8F9FF]'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.partner?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={conv.partner?.name || 'Partner'}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E4E7F2]"
                      />
                      {conv.partner?.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#087F5B] ring-2 ring-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className={`text-[14.5px] truncate ${
                          isSelected ? 'font-bold text-[#4F46E5]' : 'font-semibold text-[#10213A]'
                        }`}>
                          {conv.partner?.name || 'Partner'}
                        </h4>
                        <span className="text-[11px] text-[#8992AA] shrink-0">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      <p className="text-[12px] text-[#5E6680] truncate mt-0.5">
                        {conv.lastMessage}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10.5px] px-1.5 py-0.5 rounded bg-[#D9F4E9] text-[#087F5B] font-medium">
                          {(conv.partner?.major || 'General').split(' ')[0]}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="ml-auto w-4 h-4 rounded-full bg-[#4F46E5] text-white text-[10px] font-bold flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-[#8992AA]">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#4F46E5]" />
                <p className="text-[13.5px] font-semibold text-[#10213A]">No messages yet</p>
                <p className="text-[12px] text-[#5E6680] mt-1">Connect with a peer learner to start coordinating exchange sessions.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Active Chat Conversation */}
        <div className={`flex-1 flex flex-col bg-[#F8F9FF] ${
          !mobileChatOpen ? 'hidden md:flex' : 'flex'
        }`}>
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="h-18 px-5 bg-white border-b border-[#E4E7F2] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileChatOpen(false)}
                    className="md:hidden p-1.5 text-[#5E6680] hover:text-[#10213A] rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative">
                    <img
                      src={activeConv.partner?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={activeConv.partner?.name || 'Partner'}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E4E7F2]"
                    />
                    {activeConv.partner?.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#087F5B] ring-2 ring-white" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-[15px] text-[#10213A]">
                        {activeConv.partner?.name || 'Partner'}
                      </h3>
                      {activeConv.partner?.verified && (
                        <ShieldCheck className="w-4 h-4 text-[#4F46E5]" />
                      )}
                    </div>
                    <span className="text-[12px] text-[#087F5B] font-medium">
                      {activeConv.partner?.online ? 'Online now' : 'Active'} • {activeConv.partner?.university || 'University'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPreviewStudent(activeConv.partner)}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4E7F2] text-[12.5px] font-medium text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF]"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => navigate(`/sessions?partner=${activeConv.partner?.id || ''}`)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12.5px] font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>

              {/* Messages Flow */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Mutual Exchange Header Pill */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#4F46E5] text-[11.5px] font-semibold shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Connected via SkillSync Peer Exchange Protocol</span>
                  </div>
                </div>

                {activeConv.messages.map(msg => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed shadow-2xs ${
                          isMe
                            ? 'bg-[#4F46E5] text-white rounded-br-xs'
                            : 'bg-white text-[#10213A] border border-[#E4E7F2] rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10.5px] text-[#8992AA] mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Footer */}
              <form onSubmit={handleSend} className="p-4 bg-white border-t border-[#E4E7F2] flex items-center gap-2.5">
                <button
                  type="button"
                  className="p-2 text-[#8992AA] hover:text-[#10213A] rounded-xl hover:bg-[#F8F9FF]"
                  title="Attach File"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  placeholder={`Message ${activeConv.partner?.name || 'partner'}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 text-[14px] px-4 py-2.5 rounded-xl border border-[#E4E7F2] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
                />

                <button
                  type="submit"
                  className="p-2.5 rounded-xl text-white bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730D3] shadow-xs transition-all"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F8F9FF]">
              <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mb-4 shadow-xs">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#10213A]">No Conversation Selected</h3>
              <p className="text-[14px] text-[#5E6680] mt-1 max-w-sm">
                Connect with peer learners or accept incoming exchange proposals to start collaborating.
              </p>
              <button
                onClick={() => navigate('/find-partners')}
                className="mt-4 px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all shadow-xs"
              >
                Find Skill Partners
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
