import { LightningElement, wire } from 'lwc';
import accountList from '@salesforce/apex/AccountList.accountList';
export default class AccountList extends LightningElement {

    message;
    records;
    errors;
    selectedAccount;
    @wire(accountList, { message : '$message' })
    wiredData({ error, data }) {
        if (data) {
            console.log('Account Data \n ', data);
            this.records = data;
            this.error = undefined;
        } else if (error) {
            console.error('Error: \n ', error);
            this.error = error;
            this.records = undefined;
        }
    }

    handleButtonClick() {
        //this.viewDetails = true;
        this.message = 'Hello World';
    }

    handleSelected(event){
        event.preventDefault();
        let selectedRecordId = event.currentTarget.dataset.recordId;
        // find the selected record based on Id inside this.records array
        this.selectedAccount = this.records.find(record => record.Id === selectedRecordId);
        console.log('Selected Record \n ', this.selectedAccount);
    }
}