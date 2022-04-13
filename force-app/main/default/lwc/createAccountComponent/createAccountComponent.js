import { LightningElement } from 'lwc';
import { createRecord, getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import CONTACT_OBJECT from '@salesforce/schema/Contact';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import FIRSTNAME_CONTACT_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_CONTACT_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import NAME_CONTACT_FIELD from '@salesforce/schema/Contact.Name';
import ACCOUNTID_FIELD from '@salesforce/schema/Contact.AccountId';

export default class LdsCreateRecord extends LightningElement {
    accountId;
    name = 'LDS Create Record';
    email = 'test@abc.com';
    phone = '';
    contactFirstName ='Billy';
    contactLastName ='Bounde';
    isContactSuccess = false;

    handleFirstNameChange(event){
        this.contactFirstName = event.target.value;
    }

    handleLastNameChange(event){
        this.contactLastName = event.target.value;
    }

    handleNameChange(event) {
        this.accountId = undefined;
        this.name = event.target.value;
    }

    createAccountAndContact() {
        var fields = {};
        fields[NAME_FIELD.fieldApiName] = this.name;
        const recordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };
        this.isContactSuccess = false;
        debugger;
        createRecord(recordInput)
            .then(account => {
                this.accountId = account.id;
                console.log(this.accountId);
                fields = {};
                fields[FIRSTNAME_CONTACT_FIELD.fieldApiName] = 'Billy';
                fields[LASTNAME_CONTACT_FIELD.fieldApiName] = 'Bounde';
                fields[EMAIL_FIELD.fieldApiName] = this.email;
                fields[PHONE_FIELD.fieldApiName] = this.phone;
                fields[ACCOUNTID_FIELD.fieldApiName] = this.accountId;
                const recordContact = {apiName: "Contact", fields};
                console.log(JSON.stringify(recordContact));
                createRecord(recordContact)
                .then(contact => {
                    console.log(contact + " created");
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Account and Contact created',
                            variant: 'success',
                        }),
                    );
                })
                .catch(error => {
                    debugger;
                    console.log(error);
                    console.log(JSON.stringify(error));
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating contact',
                            message: error.body.message,
                            variant: 'error',
                        }),
                    );
                });

                // );
                this.isContactSuccess = true;
            })
            .catch(error => {
                console.log(JSON.stringify(error));
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });

        if(isContactSuccess){
            

        }
        
    }
}