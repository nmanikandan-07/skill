import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarGridProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  currentMonth: Date;
  onChangeMonth: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  selectedDate,
  onSelectDate,
  currentMonth,
  onChangeMonth,
}) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  // First day of month
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    onChangeMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onChangeMonth(new Date(year, month + 1, 1));
  };

  // Build calendar matrix
  const days = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      dateString: '',
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    const dateString = `${year}-${mm}-${dd}`;
    days.push({
      day: d,
      isCurrentMonth: true,
      dateString,
    });
  }

  // Next month leading days to complete grid
  const remaining = 35 - days.length > 0 ? 35 - days.length : (42 - days.length);
  for (let n = 1; n <= remaining; n++) {
    days.push({
      day: n,
      isCurrentMonth: false,
      dateString: '',
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E4E7F2] p-5 shadow-xs">
      {/* Month Header Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-[15.5px] text-[#10213A]">{monthName}</h4>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border border-[#E4E7F2] text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-[#E4E7F2] text-[#5E6680] hover:text-[#10213A] hover:bg-[#F8F9FF]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekdays Row */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {daysOfWeek.map((dow, idx) => (
          <span key={idx} className="text-[12px] font-semibold text-[#8992AA]">
            {dow}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((item, idx) => {
          if (!item.isCurrentMonth) {
            return (
              <div
                key={idx}
                className="h-9 flex items-center justify-center text-[13px] text-[#CBD5E1] font-normal cursor-not-allowed"
              >
                {item.day}
              </div>
            );
          }

          const isSelected = selectedDate === item.dateString;

          return (
            <button
              type="button"
              key={idx}
              onClick={() => onSelectDate(item.dateString)}
              className={`h-9 rounded-xl flex items-center justify-center text-[13.5px] font-medium transition-all ${
                isSelected
                  ? 'bg-[#4F46E5] text-white font-bold shadow-sm'
                  : 'text-[#10213A] hover:bg-[#EEF2FF] hover:text-[#4F46E5]'
              }`}
            >
              {item.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
