/* eslint-disable no-alert */
/* eslint-disable no-useless-concat */
import { LightningElement } from 'lwc';
import fullCalendar from '@salesforce/resourceUrl/FullCalendarLC';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import accountList from '@salesforce/apex/AccountList.accountList';
export default class LibFullCalendarDemo extends LightningElement {

    calendar;
    eventSelected;
    selectEventId;
    events = [];
    connectedCallback() {
        Promise.all([
            loadScript(this, fullCalendar+'/fullcalendar-4.4.3/packages/core/main.js'), // load JS
            loadScript(this, fullCalendar+'/fullcalendar-4.4.3/packages/core/main.min.js'),

            loadScript(this, fullCalendar+'/fullcalendar-4.4.3/packages/daygrid/main.js'),

            loadScript(this, fullCalendar+'/fullcalendar-4.4.3/packages/interaction/main.js'),
            loadScript(this, fullCalendar+'/fullcalendar-4.4.3/packages/interaction/main.min.js'),

            loadStyle(this, fullCalendar+'/fullcalendar-4.4.3/packages/core/main.css'), // load CSS
            loadStyle(this, fullCalendar+'/fullcalendar-4.4.3/packages/core/main.min.css'),
            loadStyle(this, fullCalendar+'/fullcalendar-4.4.3/packages/daygrid/main.css'),

            loadScript(this, fullCalendar+'/fullcalendar-4.4.3/packages/list/main.js'),
            loadScript(this, fullCalendar+'/fullcalendar-4.4.3/packages/list/main.min.js'),

            loadScript(this, fullCalendar+'/fullcalendar-4.4.3/packages/moment/main.js'),
            loadScript(this, fullCalendar+'/fullcalendar-4.4.3/packages/moment/main.min.js'),

            loadScript(this, fullCalendar+'/fullcalendar-4.4.3/packages/timegrid/main.js'),
            loadScript(this, fullCalendar+'/fullcalendar-4.4.3/packages/timegrid/main.min.js'),
        ])
        .then(() => {
            console.log('Loaded JS and CSS');
            this.renderCalendar();
        })
        .catch(() => {});
    }

    async renderCalendar(){
        var calendarEl = this.template.querySelector('div.calendar-container');
        if(calendarEl){
            await this.fetchAccounts();
            console.log('Events: ', this.events);
            this.calendar = new window.FullCalendar.Calendar(calendarEl, {
                plugins: ["dayGrid", "timeGrid", "list","interaction","moment"],
                header: {
                    left   : "today prev,next",
                    center : "title",
                    right  : "listDay,listWeek,listMonth,timeGridWeek,timeGridDay,dayGridMonth,dayGridWeek,dayGridDay"
                },
                views: {
                    listDay         : { buttonText: "list day"   },
                    listWeek        : { buttonText: "list week"  },
                    listMonth       : { buttonText: "list month" },
                    timeGridWeek    : { buttonText: "week time"  },
                    timeGridDay     : { buttonText: "day time"   },
                    dayGridMonth    : { buttonText: "month"      },
                    dayGridWeek     : { buttonText: "week"       },
                    dayGridDay      : { buttonText: "day"        }
                },
                themeSystem : 'standard',
                events: this.events
            });
            this.calendar.render();
            //this.calendar.setOption('locale', 'fr'); // set locale
            this.calendar.on('eventClick', this.handleEventClick.bind(this) );
            this.calendar.on('dateClick', this.handleDateClicked.bind(this) );
            console.log('Calendar rendered');
        }
    }

    async fetchAccounts(){
        console.log('Fetching accounts');
        await accountList()
        .then(accounts => {
            accounts.forEach(account => {
                let event = {
                    id: account.Id,
                    title: account.Name,
                    start: account.CreatedDate,
                    end: account.LastModifiedDate
                };
                this.events = [...this.events, event];
            });
            console.log('Accounts fetched ', this.events);
        })
        .catch(error => {

        })
    }

    handleEventClick(info) {
        console.log('Event clicked: ' + info.event.id);
        this.selectEventId = info.event.id;
    }

    handleDateClicked(info) {
        var date = new Date(info.dateStr);
        var proposedDate = date.toISOString() ;
        //this.formattedDate = proposedDate;
        console.log(' toISOString : ', date.toISOString());
        console.log(' formattedDate : ', proposedDate);
        alert('Clicked on: ' + info.dateStr);
        alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
        alert('Current view: ' + info.view.type);
        alert('hasDateClicked : ' + this.hasDateClicked);
    }
}