import { api, LightningElement, wire, track } from 'lwc';
import INVOICE_NUMBER from '@salesforce/schema/Invoice__c.Invoice_Number__c';
import INVOICE_STATUS from '@salesforce/schema/Invoice__c.Status__c';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { MessageContext, publish} from 'lightning/messageService';
import InvoiceRelatedRecords from '@salesforce/messageChannel/InvoiceRelatedRecords__c';

const fields = [INVOICE_NUMBER, INVOICE_STATUS]

export default class InvoiceTileComponent extends LightningElement {

    @api recordId;
    logPayment  = false;
    logRefund   = false;
    showSpinner = false;

    @wire(MessageContext) messageContext;

    subscription = null;

    fieldsToCreate = [];
    paymentFields = [
        {
            objectApiName: 'Payment__c',
            fieldApiName: 'Amount__c'
        },
        {
            objectApiName: 'Payment__c',
            fieldApiName: 'Date__c'
        },
        {
            objectApiName: 'Payment__c',
            fieldApiName: 'Status__c'
        },
        {
            objectApiName: 'Payment__c',
            fieldApiName: 'Reference_Number__c'
        },
        {
            objectApiName: 'Payment__c',
            fieldApiName: 'Comments__c'
        }
    ]

    refundFields = [
        {
            objectApiName: 'Refund__c',
            fieldApiName: 'Amount__c'
        },
        {
            objectApiName: 'Refund__c',
            fieldApiName: 'Date__c'
        },
        {
            objectApiName: 'Refund__c',
            fieldApiName: 'Status__c'
        },
        {
            objectApiName: 'Refund__c',
            fieldApiName: 'Reason__c'
        },
        {
            objectApiName: 'Refund__c',
            fieldApiName: 'Reference_Number__c'
        }
    ]

    @wire(getRecord, { recordId: '$recordId', fields: fields })
    invoice;

    get invoiceNumber() {
        return getFieldValue(this.invoice.data, INVOICE_NUMBER);
    }

    get fields(){
        return this.fieldsToCreate;
    }

    set fields(value){
        this.fieldsToCreate = value;
    }

    get apiName(){
        return this.logPayment ? 'Payment__c' : 'Refund__c';
    }

    get showModal(){
        return this.logPayment || this.logRefund;
    }

    set showModal(value){
        this.logPayment = value;
    }

    get showStatus(){
        return getFieldValue(this.invoice.data, INVOICE_STATUS) === 'Voided';
    }

    handlePayment(event) {
        event.preventDefault();
        this.logPayment = true;
        this.logRefund  = false;
        this.fields = this.paymentFields;
    }

    handleRefund(event) {
        event.preventDefault();
        this.logRefund = true;
        this.logPayment = false;
        this.fields = this.refundFields;
    }

    handleSuccess(event) {
        event.preventDefault();
        this.logPayment = false;
        this.logRefund  = false;
        this.showModal  = false;
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: 'Record Created',
            variant: 'success'
        }));

        const message = {
            recordId: this.recordId,
            message : "This is simple message from LWC"
        };
        publish(this.messageContext, InvoiceRelatedRecords, message);
    }

    handleClose(){
        this.logPayment = false;
        this.logRefund = false;
    }

    handleVoid(event) {
        event.preventDefault();
        this.showSpinner = true;
        const fields = { 'Id': this.recordId, 'Status__c': 'Voided' };
        const recordInput = { fields }
        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Invoice Voided',
                    variant: 'success'
                }));
            })
            .catch(error => {
                /* Log the Error using the console.error() method */
                console.error(' Error updating record: ', error);
            })
            .finally(() => {
                this.showSpinner = false;
            })
    }
}