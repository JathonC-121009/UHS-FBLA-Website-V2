
import { useState } from 'react'
import './Events.css'
import useCalendar from '../hooks/useCalendar'


export const meta = {
  label: 'Events',
  order: 20,
  title: 'Urbana FBLA — Events',
}




function getDaysInMonth(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate()
}




function getFirstDayOfMonth(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  ).getDay()
}




function formatMonth(date) {
  return date.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })
}




export default function Events() {




  const [currentDate,setCurrentDate] = useState(new Date())


  const [animate,setAnimate] = useState(false)




  const {
    events,
    loading,
    error
  } = useCalendar()






  const today = new Date()






  const changeMonth = (newDate)=>{


    setAnimate(false)


    setTimeout(()=>{


      setCurrentDate(newDate)


      setAnimate(true)


    },50)


  }






  const previousMonth = ()=>{


    changeMonth(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth()-1,
        1
      )
    )


  }






  const nextMonth = ()=>{


    changeMonth(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth()+1,
        1
      )
    )


  }






  const goToday = ()=>{


    changeMonth(new Date())


  }






  const daysInMonth = getDaysInMonth(currentDate)


  const firstDay = getFirstDayOfMonth(currentDate)






  const calendarDays=[]






  for(let i=0;i<firstDay;i++){
    calendarDays.push(null)
  }




  for(let i=1;i<=daysInMonth;i++){
    calendarDays.push(i)
  }






  while(calendarDays.length < 42){
    calendarDays.push(null)
  }








  const getEventsForDay=(day)=>{


    if(!day) return []


    return events.filter(event=>{


      const eventDate=new Date(event.start)




      return (


        eventDate.getDate()===day &&


        eventDate.getMonth()===currentDate.getMonth() &&


        eventDate.getFullYear()===currentDate.getFullYear()


      )


    })


  }






  const isToday=(day)=>{


    return (


      day &&


      today.getDate()===day &&


      today.getMonth()===currentDate.getMonth() &&


      today.getFullYear()===currentDate.getFullYear()


    )


  }






  return (


    <>




    <section className="events-hero">


      <div className="events-hero-inner">


        <div className="events-kicker">
          Stay in the Know
        </div>


        <h1>
          FBLA Calendar
        </h1>


        <p>
          Meetings, competitions, and chapter activities.
        </p>


      </div>


    </section>










    <section className="events-section">


      <div className="events-wrap">




        <div className="calendar-card">




          <div className="calendar-header">




            <button onClick={previousMonth}>
              ← Previous
            </button>






            <div className="calendar-title">
              {formatMonth(currentDate)}
            </div>






            <div className="calendar-controls">


              <button onClick={goToday}>
                Today
              </button>


              <button onClick={nextMonth}>
                Next →
              </button>


            </div>




          </div>










          {loading && (
            <div className="calendar-message">
              Loading events...
            </div>
          )}






          {error && (
            <div className="calendar-message error">
              Unable to load calendar events.
            </div>
          )}












          {!loading && !error && (




          <div className={`calendar-body ${animate ? "calendar-enter":""}`}>




            <div className="calendar-weekdays">


            {
              [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat"
              ].map(day=>(


                <div key={day}>
                  {day}
                </div>


              ))
            }


            </div>










            <div className="calendar-grid">




            {
              calendarDays.map((day,index)=>(




                <div


                  key={index}


                  className={`
                    calendar-day
                    ${isToday(day)?"today":""}
                    ${!day?"empty":""}
                  `}


                >




                  {
                    day && (


                    <div className="day-number">


                      {day}


                      {
                        isToday(day)&&(


                        <span className="today-label">
                          Today
                        </span>


                        )
                      }


                    </div>


                    )
                  }






                  {
                    getEventsForDay(day).map(event=>(


                    <div
                      key={event.id}
                      className="calendar-event"
                    >


                      {event.title}


                    </div>


                    ))


                  }




                </div>




              ))
            }




            </div>




          </div>


          )}




        </div>








        <div className="calendar-legend">


          <div>
            <span className="legend meeting"></span>
            Meetings
          </div>


          <div>
            <span className="legend competition"></span>
            Competitions
          </div>


          <div>
            <span className="legend community"></span>
            Community
          </div>


          <div>
            <span className="legend social"></span>
            Social
          </div>


          <div>
            <span className="legend deadline"></span>
            Deadlines
          </div>


        </div>




      </div>




    </section>




    </>


  )


}


