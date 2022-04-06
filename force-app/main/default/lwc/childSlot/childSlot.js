/* eslint-disable @lwc/lwc/no-inner-html */
import { api, LightningElement } from 'lwc';

export default class ChildSlot extends LightningElement {
    message = 'Hello World';

    @api contact; // get the value from the parent ~= contact object
    @api recordName; // get the value from the parent ~= recordName

    handleSlot1 = (event) => {
        console.log(event.target.innerHTML);
        console.log('Slot1 Changed')
    }
}