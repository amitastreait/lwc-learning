import { LightningElement, api } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Account.Name';
export default class AccountEdit extends LightningElement {
    @api objectApiName;
    @api recordId;
    fields = [NAME_FIELD];

    handleSubmit(event) {
        event.preventDefault(); // stop the form from submitting
        const fields = event.detail.fields;
        fields.Intustry = 'Education'; // modify a field
        this.template.querySelector('lightning-record-form').submit(fields);
    }
    handleSuccess(event){
        const payload = event.detail;
        console.log(JSON.stringify(payload));
    }
}