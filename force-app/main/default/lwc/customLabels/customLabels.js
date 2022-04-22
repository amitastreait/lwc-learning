/* eslint-disable no-restricted-globals */
import { api, LightningElement } from 'lwc';
import LastName from '@salesforce/label/c.LastName';
import FirstName from '@salesforce/label/c.FirstName';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
export default class CustomLabels extends LightningElement {

    @api recordId;

    label = {
        LastName : LastName,
        FirstName : FirstName
    }

    contactRecord = {

    }

    get options(){
        return [
            { label: 'Mr.', value: 'Mr.' },
            { label: 'Mrs.', value: 'Mrs.' },
        ];
    }

    handleInputChange(event){
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        this.contactRecord[fieldName] = fieldValue;
    }

    handleClick(event){
        event.preventDefault();
        let allValid = this.handleValidateInput();
        if(!allValid){
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: 'Please fill all the required fields',
                variant: 'error'
            }));
            return;
        }
        let fields = {};
        fields['LastName'] = this.contactRecord.LastName;
        fields['FirstName'] = this.contactRecord.FirstName;
        fields['Title'] = this.contactRecord.Title;
        fields['Phone'] = this.contactRecord.Phone;
        fields['Email'] = this.contactRecord.Email;
        fields['AccountId'] = this.recordId;

        const recordInput = { apiName: 'Contact', fields };

        createRecord(recordInput)
            .then(contact => {
                let contactId = contact.id;
                let url = 'https://'+location.host+'/lightning/r/Contact/'+contactId+'/view'
                const eventInfo = new ShowToastEvent({
                    title: 'Success!',
                    message: 'Customer {0} has been created. Click {1} to view.',
                    // Customer Amit Singh has been creared. Click
                    messageData: [
                        this.contactRecord.FirstName + " " + this.contactRecord.LastName,
                        {
                            url : url,
                            label : "Here"
                        }
                    ],
                    variant: 'success',
                    mode: 'sticky'
                });
                this.dispatchEvent(eventInfo);
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error creating record',
                    message: error.body.message,
                    variant: 'error'
                }));
            })

        

    }

    handleValidateInput(){
        const allValid = [
            ...this.template.querySelectorAll('lightning-input,lightning-combobox,lightning-input-address'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
        return allValid;
    }

    handleInfo(event){
        event.preventDefault();
        const eventInfo = new ShowToastEvent({
            title: 'Get Help',
            message: 'Salesforce documentation is available in the app. Click ? in the upper-right corner.',
            variant: 'info',
            mode: 'dismissable'
        });
        this.dispatchEvent(eventInfo);
    }

    handleInfoSuccess(event){
        event.preventDefault();
        const eventInfo = new ShowToastEvent({
            title: 'Success!',
            message: 'Salesforce documentation is available in the app. Click ? in the upper-right corner.',
            variant: 'success',
            mode: 'sticky'
        });
        this.dispatchEvent(eventInfo);
    }

    handleWarning(event){
        event.preventDefault();
        const eventInfo = new ShowToastEvent({
            title: 'Warning!',
            message: 'Salesforce documentation is available in the app. Click ? in the upper-right corner.',
            variant: 'warning',
            mode: 'dismissable'
        });
        this.dispatchEvent(eventInfo);
    }

    handleError(event){
        event.preventDefault();
        const eventInfo = new ShowToastEvent({
            title: 'Error!',
            message: 'Salesforce documentation is available in the app. Click ? in the upper-right corner.',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(eventInfo);
    }

    handleCritical(event){
        event.preventDefault();
        const eventInfo = new ShowToastEvent({
            title: 'Critical!',
            message: 'Customer {0} has been created. Click {1} to view.',
            // Customer Amit Singh has been creared. Click
            messageData: [
                'Amit Singh',
                {
                    url : "https://www.sfdcpanther.com",
                    label : "Here"
                }
            ],
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(eventInfo);
    }

}