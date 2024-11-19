import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { DatePicker } from "antd";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayjs from 'dayjs';

const viewOptions = [
  { value: "timeGridDay", label: "Day" },
  { value: "timeGridWeek", label: "Week" },
  { value: "dayGridMonth", label: "Month" },
];
const initialEventsCalenDar = [
    {todo: 'Meeting', name: 'Linh', time: '2h', id: '0', start: new Date()}
]

const CalendarComponent = ({events, setEvents}) => {
  const calendar = useRef(null);
  const [initialView, setInitialView] = useState("dayGridMonth");
  const [initialDate, setInitialDate] = useState(new Date());
  const [eventsCalendar, setEventsCalendar] = useState(initialEventsCalenDar);
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0 });
  
  const customWeekStartEndFormat = (value) =>
    `${dayjs(value).startOf('week').format('DD/MM/YYYY')} ~ ${dayjs(value)
    .endOf('week')
    .format('DD/MM/YYYY')}`;

  const rangePickerProps = {
    timeGridDay: { format: "DD/MM/YYYY" },
    timeGridWeek: { picker: "week", format: customWeekStartEndFormat },
    dayGridMonth: { picker: "month" },
  };

  const handleChangeSelect = (e) => {
    setInitialView(e.target.value);
    setInitialDate(null);
    calendar.current?.getApi().changeView(e.target.value);
  };

  const handleChangeDatePicker = (date) => {
    if (!date) return;   
    calendar.current?.getApi().gotoDate(date.toDate());
  };

  const handleDayClick = (event) => { 
    const { clientX: x, clientY: y } = event.jsEvent;
    setPopup(prevState => ({
      visible: !prevState.visible,
      x,
      y
    }));
  };

  useEffect(() => { 
    const externalEventsElement = document.getElementById("external-events");
    if (externalEventsElement) {
      const draggable = new Draggable(externalEventsElement, {
        itemSelector: ".fc-event",
        eventData: (eventEl) => ({
          ...eventEl.dataset,
          create: true
        })
      });
  
      return () => {
        draggable.destroy();
      };
    }
  }, []);

  const handleEventReceive = (info) => {
    const { draggedEl, event } = info;
    const eventData = draggedEl.dataset;
    const newEvent = {
      ...eventData,
      start: event.start,
    };
    const updateEvents = events.filter(i=>i.id !== newEvent.id)
    setEvents(updateEvents)
    setEventsCalendar(eventsCalendar.concat(newEvent));
  };

  const renderContent = (info) => {
    const { todo, name, time } = info.event.extendedProps;
    return (
      <div className="renderContent">
        <p>{todo}</p>
        <p>{name}</p>
        <p>{time}</p>
      </div>
    );
  };

  return (
    <div className="calendar">
      <div className="calendarSelect">
        <div>
          <select
            value={initialView}
            onChange={(e) => {
            handleChangeSelect(e)
            }}
          >
            {viewOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {rangePickerProps[initialView] && (
          <DatePicker
            {...rangePickerProps[initialView]}
            onChange={handleChangeDatePicker}
            defaultValue= {dayjs()} 
          />
        )}
      </div>
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={initialView}
          initialDate={initialDate}
          ref={calendar}
          events={eventsCalendar?.map((i) => ({
            extendedProps: {
              todo: i.todo,
              name: i.name,
              time: i.time
            },
            start: i.start
          }))}
          headerToolbar={false}
          dateClick={handleDayClick}
          droppable={true}
          selectable={true}
          eventReceive={handleEventReceive}
          eventContent={renderContent}
        />
        {popup.visible && (
          <div
            style={{        
              top: popup.y - 120,
              left: popup.x - 80,
            }}
            className="popup"
          >
            <span>New Job</span>
            <span>Add Time Off</span>
            <span>Add Custom Event </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarComponent;
