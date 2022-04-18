/* eslint-disable @lwc/lwc/no-api-reassignments */
import { api, LightningElement, wire } from 'lwc';
import contactList from '@salesforce/apex/ContactListLwcService.contactList';
// createContact
import createContact from '@salesforce/apex/ContactListLwcService.createContact';
export default class ContactListComponent extends LightningElement {

    records = [];
    error;

    contactInput = {};
    /*
    {FirstName: 'John', LastName: 'Doe', Email: '', Phone: '', AccountId: '0014x000014OWZSAA4'}
    */

    @api recordId; // inside home page the value will be undefined

    /*@wire(createContact)
    wiredCreateContact({ error, data }) {
        if(error) {
            this.error = error;
            console.error('error ', JSON.stringify(error) );
        }
        if(data) {
            console.log('created contact data ', JSON.stringify(data) );
        }
    }*/
    @wire(contactList, { recordId: '$recordId'} ) // undefined
    wiredContactList(result ) {
        // result = {error, data}
        let { error, data } = result;
        console.log('contact data ', data);
        if(result.error) {
            this.error = result.error;
            this.records = [];
        }
        if(result.data) {
            this.records = result.data;
            this.error = undefined;
        }
    }

    loadMore() {
        this.recordId = '001100000001';
    }

    handleClick(event) {
        event.preventDefault();
        console.log('contactInput ', this.contactInput);
        createContact({
            contactData : JSON.stringify(this.contactInput)
        })
        .then(result => {
            console.log('contact record creared ', result );
        })
        .catch(error => {
            console.error('Contact Created Error ', JSON.stringify(error) );
        })
        .finally(() => {
            console.log('finally');
        });
    }

    handleInputChange(event) {
        event.preventDefault();
        // event.target // lightning-input
        const fieldName  = event.target.name;
        const fieldValue = event.target.value;
        const fieldType  = event.target.type;
        this.contactInput[fieldName] = fieldValue;
        if(fieldType === 'checkbox') {
            this.contactInput[fieldName] = event.target.checked;
        }
    }
}