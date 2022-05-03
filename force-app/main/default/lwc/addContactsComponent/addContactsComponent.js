import { LightningElement, track } from 'lwc';

export default class AddContactsComponent extends LightningElement {

    @track contacts = [
        {
            'FirstName': '',
            'LastName': '',
            'Email': '',
            'Phone': '',
            'Title': ''
        }
    ];

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
}