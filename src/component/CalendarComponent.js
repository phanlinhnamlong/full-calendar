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


const CalendarComponent = () => {
  const [initialView, setInitialView] = useState("dayGridMonth");
  const calendar = useRef(null);
  const [eventsCalendar, setEventsCalendar] = useState([
    {todo: 'Meeting', name: 'Linh', time: '2h', id: '0', start: new Date()}
  ]);
  const [initialDate, setInitialDate] = useState(new Date());
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0 });
  const weekFormat = 'DD/MM/YYYY';

  const customWeekStartEndFormat = (value) =>
    `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
    .endOf('week')
    .format(weekFormat)}`;

  const rangePickerProps = {
    timeGridDay: { format: "DD/MM/YYYY" },
    timeGridWeek: { picker: "week", format: customWeekStartEndFormat },
    dayGridMonth: { picker: "month" },
  };

  const handleChangeSelect = (e) => {
    setInitialView(e.target.value);
    setInitialDate(null);
    if (calendar.current) {
      calendar.current.getApi().changeView(e.target.value);
    }
  };

  const handleChangeDatePicker = (date) => {
    if (date) {
      const calendarApi = calendar.current.getApi();
      calendarApi.gotoDate(date.toDate()); 
    }
  };

  const handleDayClick = (event) => {
    const x = event.jsEvent.clientX;
    const y = event.jsEvent.clientY;

    setPopup({ visible: !popup.visible, x, y });
  };

  useEffect(() => { 
    new Draggable(document.getElementById("external-events"), {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        return {
          ...eventEl.dataset,
          create: true,
        };
      },
    });
  }, []);

  const handleEventReceive = (info) => {
    const eventData = info.draggedEl.dataset;
    const newEvent = {
      ...eventData,
      start: info.event.start,
      end: info.event.end,
    };

    setEventsCalendar(eventsCalendar.concat(newEvent));
  };

  const renderContent = (info) => {
    return (
      <div>
        <p>{info.event.extendedProps.todo}</p>
        <p>{info.event.extendedProps.name}</p>
        <p>{info.event.extendedProps.time}</p>
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
