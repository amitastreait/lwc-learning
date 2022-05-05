import { LightningElement, track } from 'lwc';

export default class AddContactsComponent extends LightningElement {

    @track contacts = [{
            'FirstName': '',
            'LastName': '',
            'Email': '',
            'Phone': '',
            'Title': ''
        }];

    handleAddRow(event) {
        event.preventDefault();
        this.contacts = [...this.contacts, {
            'FirstName': '',
            'LastName': '',
            'Email': '',
            'Phone': '',
            'Title': ''
        }];
    }

    handleRemoveRow(event) {
        event.preventDefault();
        let index = event.currentTarget.dataset.index;
        // splice method to remove the specified index
        console.log(index);
        this.contacts.splice(index, 1);
        /* use array filter method to remove the selected index
        this.contacts = this.contacts.filter((contact, i) => {
            return i !== index;
        });
        console.log(this.contacts);*/
        this.contacts = [...this.contacts];
    }

    handleClick(event) {
        event.preventDefault();
        /* ui record api to create the records */
        /* Call the Apex Method and pass the information to the Apex Method */
        let contactString = JSON.stringify(this.contacts);
        // List<Contact> contactList = (List<Contact>)JSON.desrialize(contactString, List<Contact>.class);
        // for loop to populate the Account Id
        // insert contactList;
    }

    handleChange(event) {
        event.preventDefault();
        let selectedIndex = event.currentTarget.dataset.index;
        let fieldApiName = event.currentTarget.name;
        this.contacts[selectedIndex][fieldApiName] = event.target.value;
    }

    handleAccountLookup(event) {
        console.log( JSON.stringify(event.detail) );
        let recordId = event.detail.recordId;
        let parentApiName = event.detail.parentApiName;
        let selectedIndex = event.detail.index;
        this.contacts[selectedIndex][parentApiName] = recordId;
        this.contacts = [...this.contacts];
        console.log( JSON.stringify(this.contacts) );
    }
}