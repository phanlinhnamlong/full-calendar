import EventItem from "./EventItem";

export default function SideBarComponent({events}) {

return (
  <div className='sidebar'>
  <div id='external-events'> 
    {events.map(event => (
      <EventItem 
        key={event.id} 
        event={event} 
      />
    ))}
  </div>
</div>
);
}