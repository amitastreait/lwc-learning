/* eslint-disable no-alert */
import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {

    message = 'Parent Component'
    contacts = [
        {
            Id: 1,
            Name: 'Amy Taylor',
            Title: 'VP of Engineering',
        },
        {
            Id: 2,
            Name: 'Michael Jones',
            Title: 'VP of Sales',
        },
        {
            Id: 3,
            Name: 'Jennifer Wu',
            Title: 'CEO',
        },
    ];

    handleChildEvent(event) {
        console.log('Child Event Executed!');
        /*
            let event = {
                detail : {
                    message : this.message,
                    selectedRecordId : this.contact.Id,
                    selectedRecord   : this.contact
                }
            }
        */
        this.message = event.detail.message;
        let recordId = event.detail.selectedRecordId;
        console.log('recordId: ' + recordId);
        console.log(this.message);
        console.log( JSON.stringify(event.target.contact ) );

        const parentEvent = new CustomEvent('parentevent', {
            detail: {
                message: this.message,
                selectedRecordId: recordId,
                selectedRecord: event.target.contact
            }
        });
        this.dispatchEvent(parentEvent);
    }

    handleChildSend(event) {
        event.preventDefault();
        let childComponent = this.template.querySelector('c-child-component');
        if(childComponent) {
            childComponent.handleChild('Child Component Data', this.contacts[0]);
        }
    }
}