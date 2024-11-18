import './App.css';
import CalendarComponent from './component/CalendarComponent';
import 'react-calendar/dist/Calendar.css';

const events = [
  { 
    id: 1,
    todo: "Task 1",
    time: "10h00 a.m",
    name: 'Linh'
  },
  { 
    id: 2,
    todo: "Task 2",
    time: "14h00 p.m",
    name: 'Linh'
  }
]

function App() {
  const generateColor = ()=>{
    const colorString = '0123456789ABCD'
      let colorHex = '#'
    for(let i = 0; i < 6; i++) {
     colorHex += colorString[Math.floor(Math.random() * colorString.length)]
    
    }
    return colorHex
  }

  return (
    <div className="App">
      <div className='flex gap-2 mt-8'>
        <CalendarComponent events={events} />

        <div className='w-1/4 h-screen p-4'>
          <div id='external-events'> 
            {events.map(i=>(
              <div  
              className='fc-event p-2 border bg-green-50 border-r-2 cursor-move w-72 mb-4' 
              draggable 
              data-todo={i.todo}
              data-name={i.name}
              data-time={i.time}
              data-id={i.id}
              key={i.id}
              style={{borderLeft: `4px solid ${generateColor()}`}}
              >
              <p>{i.todo}</p>
              <p>{i.name}</p>
              <p>{i.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
