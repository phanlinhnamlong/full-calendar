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

export default function SideBarComponent() {
  const generateColor = () =>{
    const colorString = '0123456789ABCD'
      let colorHex = '#'
    for(let i = 0; i < 6; i++) {
      colorHex += colorString[Math.floor(Math.random() * colorString.length)]
    
    }
    return colorHex
  }

return (
  <div className='sidebar'>
  <div id='external-events'> 
    {events.map(i=>(
      <div  
      className='fc-event sidebarItem' 
      draggable 
      data-todo={i.todo} 
      data-name={i.name}
      data-time={i.time}
      data-id={i.id}
      key={i.id}
      style={{
        backgroundColor: generateColor()
      }}
      >
      <p>{i.todo}</p>
      <p>{i.name}</p>
      <p>{i.time}</p>
      </div>
    ))}
  </div>
</div>
);
}