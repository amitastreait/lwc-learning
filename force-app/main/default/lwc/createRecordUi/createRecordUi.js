/* eslint-disable no-alert */
/* eslint-disable dot-notation */
import { api, LightningElement, wire } from 'lwc';
import {createRecord, getRecord, deleteRecord, updateRecord, getFieldValue, getFieldDisplayValue} from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import FIRST_NAME from '@salesforce/schema/Contact.FirstName';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Contact.Account.Name';
const CONTACT_FIELDS = [
    'Contact.FirstName',
    'Contact.LastName',
    'Contact.Email',
    'Contact.Phone',
    ACCOUNT_NAME_FIELD
    // Contact.Account__r.Name
];


export default class CreateRecordUi extends LightningElement {

    @api recordId;
    @api objectApiName;
    isLoading = false;

    contactRecord;
    /* $ reactice changes */
    @wire(getRecord, { recordId: '$recordId', fields: CONTACT_FIELDS })
    wiredContactRecord({ error, data }) { //function(error, data) {}
        if(data){
            console.log('wiredContactRecord data: ' + JSON.stringify(data) );
            this.contactRecord = {...data}; // JSON.parse( JSON.stringify(data) ) [...data];
        }else if(error){
            console.log('wiredContactRecord error: ' + JSON.stringify(error) );
        }
    }

    @wire(getObjectInfo, { objectApiName: 'Account' })
    wiredObject({ error, data }) {
        if(data){
            console.log('wiredObject data: ' + JSON.stringify(data) );
        }
    }

    /*
        getFieldValue(record, fieldName);
        record = this.contactRecord.data;
    */

    get firstName(){
        return getFieldValue(this.contactRecord, FIRST_NAME);
    }

    get lastName(){
        return getFieldValue(this.contactRecord, 'Contact.LastName');
    }

    get accountNameContact(){
        return getFieldValue(this.contactRecord, ACCOUNT_NAME_FIELD);
    }

    accountName;
    handleChange(event) {
        event.preventDefault();
        this.accountName = event.detail.value;
    }

    @api
    handleCreateRecord(event) {
        event.preventDefault();
        /* {"fieldApiName":"Name","objectApiName":"Account"} {"objectApiName":"Account"} */
        //this.isLoading = true;
        const fields = {};
        fields['Name'] = this.accountName;
        fields['Description'] = 'This is a test description from LDS';
        fields['Phone'] = '123-456-7890';
        fields['Industry'] = 'Education';

        const recordInput = {
            apiName: ACCOUNT_OBJECT.objectApiName,
            fields
        };
        /*
            Album -
                    Completed /Fulfilled
                    Exceptipon / Rejected
        */
        createRecord(recordInput)
        .then( function(response){
            alert( 'Record Created ' + response.id );
            console.log('createRecord result: ' + JSON.stringify(response) );
        })
        .catch( (error) =>{
            console.log('createRecord error: ' + JSON.stringify(error) );
        })
        .finally( function(){
            console.log('createRecord finally');
            //this.isLoading = false;
        });
    }

    handleUpdateRecord(event) {

        event.preventDefault();
        //this.isLoading = true;
        /* {"fieldApiName":"Name","objectApiName":"Account"} {"objectApiName":"Account"} */
        const fields = {};
        fields['Id']   = this.recordId;
        fields['FirstName'] = 'John';
        fields['Phone'] = '123-456-7890';

        const recordInput = { fields };
        updateRecord(recordInput)
        .then( (result) =>{
            alert( 'Record Updated' );
            console.log('update record result: ' + JSON.stringify(result) );
        })
        .catch( (error) =>{
            console.error('update record error: ' + JSON.stringify(error) );
        })
        .finally( () =>{
            console.log('createRecord finally');
            this.isLoading = false;
        });
    }

    handleDeleteRecord(event) {
        event.preventDefault();
        deleteRecord(this.recordId)
        .then( (result) =>{
            console.log('deleteRecord result: ' + JSON.stringify(result) );
        })
        .catch( (error) =>{
            console.error('deleteRecord error: ' + JSON.stringify(error) );
        } )
        .finally( () =>{
            console.log('deleteRecord finally');
        })
    }
}