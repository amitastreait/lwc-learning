import { api, LightningElement } from 'lwc';

export default class ContactTile extends LightningElement {
    @api contact; // undefined

    handleSelect(event) {
        event.preventDefault();
        const childEvent = new CustomEvent('select', {
            detail : {
                selectedRecordId : this.contact.Id
            },
            bubbles  : true,
            composed : false
        });
        this.dispatchEvent(childEvent);
    }
}