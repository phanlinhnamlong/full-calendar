import "./App.css";
import CalendarComponent from "./component/CalendarComponent";
import "react-calendar/dist/Calendar.css";
import SideBarComponent from "./component/SideBarComponent";
import { useState } from "react";

const initialEvents = [
  { id: '1', todo: "Task 1", time: "10:00 AM", name: 'Linh' },
  { id: '2', todo: "Task 2", time: "2:00 PM", name: 'Linh' }
];

function App() {
  const [events, setEvents] = useState(initialEvents)

  return (
    <div className="main">
      <CalendarComponent  setEvents={setEvents} events= {events}/>
      <SideBarComponent events= {events} />
    </div>
  );
}

export default App;