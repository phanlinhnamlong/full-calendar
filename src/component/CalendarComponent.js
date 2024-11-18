import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { DatePicker } from 'antd';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';

const { RangePicker } = DatePicker;

const CalendarComponent = ({events}) => {
  const [initialView, setInitialView] = useState('dayGridMonth')
  const calendar = useRef(null)
  const [open, setOpen] = useState(false)
  const [eventsCalendar, setEventsCalendar] = useState([])

  const handleChange = (date) => {
    console.log(date[0].format('DD/MM/YYYY'))
    console.log(date[1].format('DD/MM/YYYY'))
  }

  const handleDayClick = (date) => {
    console.log(date.dateStr)
    setOpen(true)
  }

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
          time:time,
          create: true
        };
      }
    });
  });

  const handleEventDrop = (info) => {
    const divEl = info.draggedEl
    const eventData = divEl.dataset
    const newEvent = {
      id: eventData.id,
      todo: eventData.todo,
      name: eventData.name,
      time: eventData.time
    };

    setEventsCalendar([...eventsCalendar, newEvent]);
  }
  const renderContent = (info) => {
    return (
      <div>
        <p>{info.event.extendedProps.todo}</p>
        <p>{info.event.extendedProps.name}</p>
        <p>{info.event.extendedProps.time}</p>
      </div>
    )
  }
  console.log(eventsCalendar)
  return (    
    <div className='w-3/4'> 
      <header className="flex gap-4 justify-center">
        <div className="mb-4">
        <select value={initialView} onChange={(e)=> {
          setInitialView(e.target.value)
          if(calendar.current) {
            calendar.current.getApi().changeView(e.target.value)
          }
        }} className='p-2 border border-[#d9d9d9] bg-white rounded-[4px] '>
        <option value="dayGridDay">Day</option>
              <option value="dayGridWeek">Week</option>
              <option value="dayGridMonth">Month</option>
        </select>
        </div>
        <div>
        <RangePicker onChange={handleChange} picker='week' />
        </div>

      </header>
      {open && 
        <div className='absolute left-32 top-32  z-50 flex flex-col gap-4 p-4 w-[200px] rounded-[2px] text-start shadow' 
        >
          <p>New Job</p>
          <p>Add Time Off</p>
          <p>Add Custom Event </p>
        </div>
      }
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, resourceTimeGridPlugin]}
        initialView={initialView}
        ref={calendar}
        events={eventsCalendar.slice(0,1).map(i=>({
          extendedProps: {
            todo: i.todo,
            name: i.name
          }
        }))}
        headerToolbar={false}
        dateClick={handleDayClick}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        eventContent={renderContent}
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: true,
          meridiem: 'short'
        }}
      />
    </div>  
  )
};

export default CalendarComponent;