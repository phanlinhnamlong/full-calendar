import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { DatePicker } from "antd";
import dayjs from 'dayjs';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';

const viewOptions = [
  { value: "resourceTimeGridDay", label: "Day" },
  { value: "resourceTimeGridWeek", label: "Week" },
  { value: "resourceDayGridMonth", label: "Month" },
];
const initialEventsCalenDar = [
    {todo: 'Meeting', name: 'Linh', time: dayjs().format('hh:mm'), id: '0', start: new Date(), resourceId: 'a'}
]
const resources = [{ id: 'a', title: 'Phòng họp A' }];

const CalendarComponent = ({events, setEvents}) => {
  const calendar = useRef(null);
  const [initialView, setInitialView] = useState("resourceDayGridMonth");
  const [initialDate, setInitialDate] = useState(new Date());
  const [eventsCalendar, setEventsCalendar] = useState(initialEventsCalenDar);
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0 });
  
  const customWeekStartEndFormat = (value) =>
    `${dayjs(value).startOf('week').format('DD/MM/YYYY')} ~ ${dayjs(value)
    .endOf('week')
    .format('DD/MM/YYYY')}`;

  const rangePickerProps = {
    resourceTimeGridDay: { format: "DD/MM/YYYY" },
    resourceTimeGridWeek: { picker: "week", format: customWeekStartEndFormat },
    resourceDayGridMonth: { picker: "month" },
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
    const initializeDraggable = (elementId) => {
      const element = document.getElementById(elementId);
      
      if (!element) return null;
  
      const draggable = new Draggable(element, {
        itemSelector: ".fc-event",
        eventData: (eventEl) => ({
          ...eventEl.dataset,
          create: true
        })
      });
  
      return () => draggable.destroy();
    };
  
    const cleanupExternalEvents = initializeDraggable("external-events");
    const cleanupFullCalendar = initializeDraggable("full-calendar");
  
    return () => {
      cleanupExternalEvents?.();
      cleanupFullCalendar?.();
    };
  }, []);
  
  const handleEventReceive = (info) => {
    const { draggedEl, event } = info;
    if(draggedEl.fcSeg) {
      const eventData = draggedEl.fcSeg.eventRange.def.extendedProps;
      const newEvent = {
        ...eventData,
        time: dayjs(event.start).format('hh:mm'),
        start: event.start,
      };
      const updateEvents = events.filter(i=>i.id !== newEvent.id)
      setEvents(updateEvents)
      setEventsCalendar(eventsCalendar.concat(newEvent));
    }else {
    const eventData = draggedEl.dataset;
    const newEvent = {
      ...eventData,
      time: dayjs(event.start).format('hh:mm'),
      start: event.start,
      resourceId: event._def.resourceIds[0]
    };
    const updateEvents = events.filter(i=>i.id !== newEvent.id)
    setEvents(updateEvents)
    setEventsCalendar(eventsCalendar.concat(newEvent));
  }
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
      <div id="full-calendar">
        <FullCalendar
          plugins={[interactionPlugin, resourceTimeGridPlugin, resourceDayGridPlugin]}
          initialView={initialView}
          initialDate={initialDate}
          ref={calendar}
          events={eventsCalendar?.map((i) => ({
            extendedProps: i,
            start: i.start,
            resourceId: i.resourceId
          }))}
          resources={resources}
          headerToolbar={{start: '', end: '', center:'title'}}
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