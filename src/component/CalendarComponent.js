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
  const [eventsCalendar, setEventsCalendar] = useState([]);
  const [value, setValue] = useState(new Date());
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
  const handleChange = (date) => {
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
    let draggableEl = document.getElementById("external-events");
    new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        let id = eventEl.dataset.id;
        let todo = eventEl.dataset.todo;
        let name = eventEl.dataset.name;
        let time = eventEl.dataset.time;
        return {
          id: id,
          todo: todo,
          name: name,
          time: time,
          create: true,
        };
      },
    });
  });

  const handleEventDrop = (info) => {
    const divEl = info.draggedEl;
    const eventData = divEl.dataset;
    const newEvent = {
      id: eventData.id,
      todo: eventData.todo,
      name: eventData.name,
      time: eventData.time,
    };

    setEventsCalendar([...eventsCalendar, newEvent]);
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
              setInitialView(e.target.value);
              setValue(null);
              if (calendar.current) {
                calendar.current.getApi().changeView(e.target.value);
              }
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
            onChange={handleChange}
          />
        )}
      </div>
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={initialView}
          initialDate={value}
          ref={calendar}
          events={eventsCalendar.map((i) => ({
            extendedProps: {
              todo: i.todo,
              name: i.name,
            },
          }))}
          headerToolbar={false}
          dateClick={handleDayClick}
          droppable={true}
          selectable={true}
          eventDrop={handleEventDrop}
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
