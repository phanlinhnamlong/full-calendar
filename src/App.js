import "./App.css";
import CalendarComponent from "./component/CalendarComponent";
import "react-calendar/dist/Calendar.css";
import SideBarComponent from "./component/SideBarComponent";

function App() {
  return (
    <div className="main">
      <CalendarComponent />
      <SideBarComponent />
    </div>
  );
}

export default App;