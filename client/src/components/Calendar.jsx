import React, { useState, useEffect } from 'react';
import './Calendar.css';
import { useHeaderData } from '../context/HeaderDataContext';
import { months } from '../sections/TopNav';

const Calendar = ({ setShowCalendar }) => {
  const { headerData, setHeaderData } = useHeaderData();
  console.log(headerData.date)
  // Month and year state
  const [currentYear, setCurrentYear] = useState(headerData.date.year);
  const [currentMonth, setCurrentMonth] = useState(headerData.date.month);
  const [currentDay, setCurrentDay] = useState(headerData.date.day)
  const [ selectDayMode, setSelectDayMode ] = useState(false);
  const [isMonthListOpen, setIsMonthListOpen] = useState(false);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate days in the month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month+1, 0).getDate();
  };

  // Generate calendar days based on month and year
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === new Date().getDate() &&
        currentMonth === new Date().getMonth()+1 &&
        currentYear === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'curr-date' : ''}`}
          onClick={() => handleCalendarDayClick(day)}
        >
          {day}
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      );
    }
    return days;
  };

  const handleCalendarDayClick = (day) => {
    if (selectDayMode) {
        setCurrentDay(day)
    }
  }

  // Toggle dark mode
  const toggleSelectDayMode = () => {
    if (!selectDayMode) {
        setCurrentDay(new Date().getDate());
    }

    if (selectDayMode) {
        setCurrentDay(-1);
    }

    setSelectDayMode((prevMode) => !prevMode);
};

  const isFuture = (index) => currentYear === new Date().getFullYear() && index > new Date().getMonth()+1;

  const handleMonthClick = (index) => {
    if (isFuture(index)) return;

    setCurrentMonth(index);
    setIsMonthListOpen(false); 
  };

  // Handle month navigation
  const goToNextYear = () => {
    if (currentYear === new Date().getFullYear()) return;
    if (currentYear === new Date().getFullYear() - 1 && currentMonth > new Date().getMonth()) return;

    setCurrentYear(currentYear + 1) 
  };

  const goToPrevYear = () => {
      setCurrentYear(currentYear - 1);
  };

//   const handleUpdatingDate = () => {
//     console.log(currentDay, currentMonth, currentYear);
//     setDate({
//         day: selectDayMode ? currentDay : -1,
//         month: currentMonth,
//         year: currentYear
//     });
//     console.log('handleUpdatingDate', date)

//     handleUpdatingTable();
//     setShowCalendar(false);
//   }

  const updateTable = () => {
    setHeaderData((prev) => ({
      ...prev,
      date: {
        month: currentMonth,
        year: currentYear,
        day: selectDayMode ? currentDay : -1
      },
    }));

    setShowCalendar(false);
  }

  

  return (
    <div className={`calendar dark`}>
      <div className="calendar-header">
        <span onClick={() => setIsMonthListOpen((prev) => !prev)} className="month-picker" id="month-picker">
          {months[currentMonth-1].name}
        </span>
        <div className="year-picker">
          <span className="year-change" id="prev-year" onClick={goToPrevYear}>
            <pre>&lt;</pre>
          </span>
          <span id="year">{currentYear}</span>
          <span className="year-change" id="next-year" onClick={goToNextYear}>
            <pre>&gt;</pre>
          </span>
        </div>
      </div>
      
      <div className={`calendar-body ${selectDayMode ? 'show' : ''}`}>
        <div className="calendar-week-day">
          {weekDays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="calendar-days">{generateCalendarDays()}</div>
      </div>

      <div className='space-x-16'>
        <div className="calendar-footer">
            <div className={`toggle ${selectDayMode ? 'on' : 'off'}`}>
            <span>Use Days</span>
            <div className="dark-mode-switch" onClick={toggleSelectDayMode}>
                <div className={`dark-mode-switch-ident ${selectDayMode ? 'dark' : 'light'}`}></div>
            </div>
        </div>
        <div>
            <button onClick={() => updateTable()} 
                className='bg-transparent border border-[#00B2CC] text-[#00B2CC] font-semibold'>
                Update
            </button>
        </div>
        
      </div>
      
      </div>
      <div className={`month-list ${isMonthListOpen ? 'show' : ''}`}>
        {months.map((month) => (
            <div className={``} key={month.name} onClick={() => handleMonthClick(month.value)}>
                <div className={`${isFuture(month.value) ? 'text-mutedText hover:bg-transparent' : 'text-primaryText'} ${currentMonth === month.value ? 'bg-[#323048]' : ''}`}>{month.name}</div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
