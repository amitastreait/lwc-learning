import { LightningElement, api } from 'lwc';
import FIRST_NAME from '@salesforce/schema/Lead.FirstName';
import LAST_NAME from '@salesforce/schema/Lead.LastName';
import EMAIL from '@salesforce/schema/Lead.Email'; // Active__c
export default class LdsDemos extends LightningElement {
    @api objectApiName;
    @api recordId;

    fields = [
        FIRST_NAME, LAST_NAME, EMAIL, {
            fieldApiName : 'Phone',
            objectApiName : this.objectApiName,
        },
        {
            fieldApiName : 'Industry',
            objectApiName : this.objectApiName,
        },
        {
            fieldApiName : 'OwnerId',
            objectApiName : this.objectApiName,
        },
        {
            fieldApiName : 'Company',
            objectApiName : this.objectApiName,
        }
    ]; // ObjectApiName.FieldName


    connectedCallback() {
        console.log('connectedCallback');
        console.log( JSON.stringify(FIRST_NAME) );
    }

    handleSubmit(event) {
        event.preventDefault();
        let fields = event.detail.fields;
        fields.Description = 'This is a test description from LDS';
        console.log('handleSubmit');
        console.log( JSON.stringify(event.detail) );
        this.template.querySelector('lightning-record-form').submit(fields);
    }
    handleCancel(event){
        console.log('handleCancel');
        console.log( JSON.stringify(event.detail) );
    }

    handleSuccess(event){
        console.log('handleSuccess');
        console.log( JSON.stringify(event.detail) );
    }

    handleError(event){
        console.log('handleError');
        console.log( JSON.stringify(event.detail) );
    }
}