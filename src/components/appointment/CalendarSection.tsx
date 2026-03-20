import { useMemo, useState } from 'react';

import { useDoctorSlotSummary } from '@/hooks/use-doctors';

type CalendarSectionProps = {
  doctorId: string;
  selectedDate: string | null;
  appointmentType: 'all' | 'online' | 'offline';
  onSelectDate: (date: string) => void;
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: totalDays }, (_, i) => i + 1);
}

function isSameMonth(date1: Date, date2: Date) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

function CalendarSection({
  doctorId,
  selectedDate,
  appointmentType,
  onSelectDate,
}: CalendarSectionProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const fiveYearLater = useMemo(() => {
    const next = new Date(today);
    next.setFullYear(next.getFullYear() + 5);
    return next;
  }, [today]);

  const from = formatDate(today);
  const to = formatDate(fiveYearLater);

  const summaryQuery = useDoctorSlotSummary(doctorId, from, to, appointmentType);

  const summaryMap = useMemo(() => {
    const map = new Map<string, { date: string; count: number; hasAvailability: boolean }>();
    (summaryQuery.data ?? []).forEach((item) => {
      map.set(item.date, item);
    });
    return map;
  }, [summaryQuery.data]);

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthValue = currentMonth.getMonth();
  const yearValue = currentMonth.getFullYear();
  const yearOptions = [today.getFullYear(), today.getFullYear() + 1];

  const monthLabel = `Tháng ${String(currentMonth.getMonth() + 1).padStart(2, '0')} - ${currentMonth.getFullYear()}`;
  const canGoPrev = !isSameMonth(currentMonth, today);
  const canGoNext = currentMonth < new Date(fiveYearLater.getFullYear(), fiveYearLater.getMonth(), 1);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <span className="material-icons text-primary">calendar_today</span>
        <h4 className="font-bold">Chọn ngày khám</h4>
      </div>

      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6 px-4">
          <button
            type="button"
            disabled={!canGoPrev}
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            className={`p-2 rounded-lg ${canGoPrev ? 'hover:bg-slate-100 dark:hover:bg-slate-800' : 'opacity-40 cursor-not-allowed'}`}
          >
            <span className="material-icons">chevron_left</span>
          </button>

          <span className="font-bold text-primary">{monthLabel}</span>

          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            className={`p-2 rounded-lg ${canGoNext ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            <span className="material-icons">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 px-4">
          <select
            value={monthValue}
            onChange={(event) => setCurrentMonth(new Date(yearValue, Number(event.target.value), 1))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index} value={index}>
                Tháng {index + 1}
              </option>
            ))}
          </select>

          <select
            value={yearValue}
            onChange={(event) => setCurrentMonth(new Date(Number(event.target.value), monthValue, 1))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                Năm {year}
              </option>
            ))}
          </select>
        </div>

        {summaryQuery.isLoading && <div className="text-sm text-slate-500 text-center mb-3">Đang tải lịch trống...</div>}

        <div className="grid grid-cols-7 text-center text-xs mb-4">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
            <div key={day} className="text-slate-400 py-2">
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="py-3 text-slate-300"></div>
          ))}

          {daysInMonth.map((day) => {
            const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            dateObj.setHours(0, 0, 0, 0);

            const dateStr = formatDate(dateObj);
            const item = summaryMap.get(dateStr);

            const isPast = dateObj < today;
            const isOutOfRange = dateObj > fiveYearLater;
            const isSelected = selectedDate === dateStr;
            const count = item?.count ?? 0;
            const isAvailable = count > 0;
            const isFull = !!item && count === 0;

            if (isPast || isOutOfRange) {
              return (
                <div key={dateStr} className="py-3 rounded-lg text-slate-300 cursor-not-allowed">
                  {day}
                </div>
              );
            }

            if (isSelected) {
              return (
                <button key={dateStr} type="button" onClick={() => onSelectDate(dateStr)} className="py-3 rounded-lg bg-primary text-white font-medium shadow-md shadow-primary/20">
                  <div>{day}</div>
                  <div className="text-[8px] mt-1">Đang chọn</div>
                </button>
              );
            }

            if (isFull) {
              return (
                <div key={dateStr} className="py-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 cursor-not-allowed">
                  <div>{day}</div>
                  <div className="text-[8px] mt-1">Hết lịch</div>
                </div>
              );
            }

            if (isAvailable) {
              return (
                <button key={dateStr} type="button" onClick={() => onSelectDate(dateStr)} className="py-3 rounded-lg bg-blue-50 text-primary font-medium hover:opacity-90 transition">
                  <div>{day}</div>
                  <div className="text-[8px] mt-1">Còn {count} slot</div>
                </button>
              );
            }

            return (
              <div key={dateStr} className="py-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 cursor-not-allowed">
                <div>{day}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CalendarSection;
