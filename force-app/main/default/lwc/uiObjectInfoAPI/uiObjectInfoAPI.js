/* eslint-disable no-unreachable */
/* eslint-disable @lwc/lwc/no-api-reassignments */
/* eslint-disable no-else-return */
import { api, LightningElement, wire } from 'lwc';
import { getObjectInfo, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
export default class UiObjectInfoAPI extends LightningElement {


    objectInfo;
    accountSourceOptions;

    @api picklistFieldApiName = 'Active__c';
    @api recordTypeId;
    @api objectApiName;
    @api label;
    @api placeHolder;
    @api required;
    @api disabled;

    errorMessage;
    friendlyMessage = 'Error retrieving data';
    viewDetails = false;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    wiredObject({ error, data }) {
        if(data){
            //console.log('wiredObject data: ', JSON.stringify(data) );
            this.objectInfo = data;
            if(!this.recordTypeId){
                this.recordTypeId = data.defaultRecordTypeId;
            }
        }
        if(error){
            console.error('wiredObject error: ' + JSON.stringify(error) );
            this.objectInfo = undefined;
            this.errorMessage = this.reduceErrors(error);
        }
    }

    @wire(getPicklistValuesByRecordType, { objectApiName: 'Account', recordTypeId: '$recordTypeId' })
    wiredPicklistValues({ error, data }) {

        if(data){
            console.log('wiredPicklistValues data: \n ' , data );
            let accountSource = data.picklistFieldValues[this.picklistFieldApiName];
            this.accountSourceOptions = [
                { label : 'Select One', value : ''}
            ];
            accountSource.values.forEach( item => {
                this.accountSourceOptions = [...this.accountSourceOptions, { label: item.label, value: item.value }];
            });
            //console.log('accountSource: ' , JSON.stringify(this.accountSourceOptions) );
        }
        if(error){
            console.error('wiredPicklistValues error: ' , JSON.stringify(error) );
            this.errorMessage = this.reduceErrors(error);
        }
    }

    get options() {
        if(this.accountSourceOptions){
            return this.accountSourceOptions;
        }else{
            return [];
        }
    }

    handleShowDetailsClick() {
        this.viewDetails = !this.viewDetails;
    }

    reduceErrors = (errors) => {
        if (!Array.isArray(errors)) {
            errors = [errors];
        }
        return (
            errors
                // Remove null/undefined items
                .filter((error) => !!error)
                // Extract an error message
                .map((error) => {
                    // UI API read errors
                    if (Array.isArray(error.body)) {
                        return error.body.map((e) => e.message);
                    }
                    // Page level errors
                    else if ( error?.body?.pageErrors && error.body.pageErrors.length > 0 ) {
                        return error.body.pageErrors.map((e) => e.message);
                    }
                    // Field level errors
                    else if ( error?.body?.fieldErrors && Object.keys(error.body.fieldErrors).length > 0 ) {
                        const fieldErrors = [];
                        Object.values(error.body.fieldErrors).forEach(
                            (errorArray) => {
                                fieldErrors.push(
                                    ...errorArray.map((e) => e.message)
                                );
                            }
                        );
                        return fieldErrors;
                    }
                    // UI API DML page level errors
                    else if ( error?.body?.output?.errors && error.body.output.errors.length > 0 ) {
                        return error.body.output.errors.map((e) => e.message);
                    }
                    // UI API DML field level errors
                    else if ( error?.body?.output?.fieldErrors && Object.keys(error.body.output.fieldErrors).length > 0 ) {
                        const fieldErrors = [];
                        Object.values(error.body.output.fieldErrors).forEach(
                            (errorArray) => {
                                fieldErrors.push(
                                    ...errorArray.map((e) => e.message)
                                );
                            }
                        );
                        return fieldErrors;
                    }
                    // UI API DML, Apex and network errors
                    else if (error.body && typeof error.body.message === 'string') {
                        return error.body.message;
                    }
                    // JS errors
                    else if (typeof error.message === 'string') {
                        return error.message;
                    }
                    // Unknown error shape so try HTTP status text
                    return error.statusText;
                })
                // Flatten
                .reduce((prev, curr) => prev.concat(curr), [])
                // Remove empty strings
                .filter((message) => !!message)
        );
    }
}