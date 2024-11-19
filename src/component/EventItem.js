import React from 'react'

const generateColor = () =>{
  const colorString = '0123456789ABCDEF'
    let colorHex = '#'
  for(let i = 0; i < 6; i++) {
    colorHex += colorString[Math.floor(Math.random() * colorString.length)]
  
  }
  return colorHex
}

const EventItem = ({event}) => {
  const { todo, name, time, id } = event;

  return (
    <div
      className="fc-event sidebarItem"
      draggable
      data-todo={todo}
      data-name={name}
      data-time={time}
      data-id={id}
      style={{
        backgroundColor: generateColor()
      }}
    >
      <p>{todo}</p>
      <p>{name}</p>
      <p>{time}</p>
    </div>
  );
}

export default EventItem
