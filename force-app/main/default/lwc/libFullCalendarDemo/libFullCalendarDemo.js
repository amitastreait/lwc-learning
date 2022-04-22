/* eslint-disable no-alert */
/* eslint-disable no-useless-concat */
import { LightningElement } from 'lwc';
import fCalendar from '@salesforce/resourceUrl/FullCalendarLC';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import accountList from '@salesforce/apex/AccountList.accountList';
import LOCALE from '@salesforce/i18n/locale';
export default class LibFullCalendarDemo extends LightningElement {

    calendar;
    eventSelected;
    selectEventId;
    events = [];
    connectedCallback() {
        Promise.all([
            loadStyle(this, fCalendar + '/packages/core/main.css'),
            loadStyle(this, fCalendar + '/packages/core/main.min.css'),
            loadScript(this, fCalendar + '/packages/core/main.js'),
            loadScript(this, fCalendar + '/packages/core/main.min.js'),

            loadScript(this, fCalendar + "/packages/daygrid/main.js"),
            loadStyle(this, fCalendar + "/packages/daygrid/main.css"),
            loadScript(this, fCalendar + "/packages/list/main.js"),
            loadStyle(this, fCalendar + "/packages/list/main.css"),
            loadScript(this, fCalendar + "/packages/timegrid/main.js"),
            loadStyle(this, fCalendar + "/packages/timegrid/main.css"),
            loadScript(this, fCalendar + "/packages/interaction/main.js"),
            loadScript(this, fCalendar + "/packages/moment/main.js"),
            loadScript(this, fCalendar + "/packages/moment-timezone/main.js"),
            loadScript(this, fCalendar + "/packages/google-calendar/main.js"),
        ])
        .then(() => {
            console.log('Loaded JS and CSS');
            this.renderCalendar();
        })
        .catch((error) => {
            console.log('Error loading JS and CSS: ' , error);
        });
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
            this.calendar.setOption('locale', LOCALE); // set locale
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

        });
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