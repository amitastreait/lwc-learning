import { LightningElement , api, wire, track } from "lwc";
import { getRecord, createRecord, deleteRecord, getFieldValue, getFieldDisplayValue } from 'lightning/uiRecordApi';
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import NAME_FIELD from '@salesforce/schema/Invoice__c.Name';
import ADDRESS_FIELD from '@salesforce/schema/Invoice__c.Address__c';
import COMPANY_FIELD from '@salesforce/schema/Invoice__c.Company__r.Name';
import CONTACT_NAME from '@salesforce/schema/Invoice__c.Contact__r.Name';
import CONTACT_PHONE from '@salesforce/schema/Invoice__c.Contact__r.Phone';
import CONTACT_EMAIL from '@salesforce/schema/Invoice__c.Contact__r.Email';
import INVOICE_DATE from '@salesforce/schema/Invoice__c.InvoiceDate__c';
// Due_Date__c
import DUE_DATE from '@salesforce/schema/Invoice__c.Due_Date__c';
// PaidDate__c
import PAID_DATE from '@salesforce/schema/Invoice__c.PaidDate__c';
import INVOICE_NUMBER from '@salesforce/schema/Invoice__c.Invoice_Number__c';
import INVOICE_AMOUNT from '@salesforce/schema/Invoice__c.FinalAmount__c';
import INVOICE_STATUS from '@salesforce/schema/Invoice__c.Status__c';
//Reference__c
import REFERENCE from '@salesforce/schema/Invoice__c.Reference__c';
//Comments__c
import COMMENTS from '@salesforce/schema/Invoice__c.Comments__c';
// Tax_Amount__c
import TAX_AMOUNT from '@salesforce/schema/Invoice__c.Tax_Amount__c';
//TotalLineAmount__c
import TOTAL_LINE_AMOUNT from '@salesforce/schema/Invoice__c.TotalLineAmount__c';
// TotalPaidAmount__c
import TOTAL_PAID_AMOUNT from '@salesforce/schema/Invoice__c.TotalPaidAmount__c';
// TotalRefundAmount__c
import TOTAL_REFUND_AMOUNT from '@salesforce/schema/Invoice__c.TotalRefundAmount__c';
import { NavigationMixin } from 'lightning/navigation';

import lineItems from '@salesforce/apex/InvoiceDetailLWCService.lineItems';

// InvoiceLineItem__c.Tax_Type__c
import TAX_TYPE from '@salesforce/schema/InvoiceLineItem__c.Tax_Type__c';

import { APPLICATION_SCOPE, MessageContext, subscribe} from 'lightning/messageService';
import InvoiceRelatedRecords from '@salesforce/messageChannel/InvoiceRelatedRecords__c';
import { refreshApex } from '@salesforce/apex';

const fields = [
    NAME_FIELD, COMPANY_FIELD, ADDRESS_FIELD, CONTACT_NAME, CONTACT_PHONE, CONTACT_EMAIL,
    INVOICE_DATE, DUE_DATE, PAID_DATE, INVOICE_NUMBER, INVOICE_AMOUNT, INVOICE_STATUS, REFERENCE,
    COMMENTS, TAX_AMOUNT, TOTAL_LINE_AMOUNT, TOTAL_REFUND_AMOUNT, TOTAL_PAID_AMOUNT
]
export default class InvoiceDetail extends NavigationMixin(LightningElement) {

    @wire(MessageContext) messageContext;
    subscription = null;

	@api
	recordId;
	@api
	objectApiName;

    fieldApiName    = 'Status__c';
    showButton      = true;
    showLineEdit    = false;

    fields         = ['Name'];
    fieldsToCreate = ['Name','ProductCode','Description']

    items;
    errors;
    payments;
    refunds;
    newItems = [];

    @track wiredInvoiceResult = [];

    showSpinner = false;
    @wire(lineItems, { recordId : '$recordId' })
    wiredData(result) {
        this.wiredInvoiceResult = result;
        let { error, data } = result;
        if (data) {
            // map data into this.items and add ProductName & ProductCode using spread operator
            this.payments = data.payments;
            this.refunds  = data.refunds;
            if(data.lineItems && data.lineItems.length > 0){
                this.items = data.lineItems.map(record => ({
                    ...record,
                    'ProductName': record.Product__c?record.Product__r.Name:'',
                    'ProductCode': record.Product__c?record.Product__r.ProductCode:'',
                    Tax__c: record.Tax__c?record.Tax__c/100:0,
                }));
            }
            //console.log('Modified Data ', this.items);
            /* console.log('wiredData', JSON.stringify(this.items, null, "\t")); */
            this.errors = undefined;
        } else if (error) {
            console.error('Error: ', error);
            this.items = undefined;
            this.errors = error;
        }
    }

    @wire(getRecord, { recordId: '$recordId', fields: fields })
    invoice;

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: TAX_TYPE })
    statusProp;

    connectedCallback() {
        this.subscribeMC();
    }

    subscribeMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            InvoiceRelatedRecords,
            message => {
                this.handleMessage(message);
            },
            { scope: APPLICATION_SCOPE }
        );
    }

    handleMessage(message) {
        console.log('Message Received ', JSON.stringify(message, null, "\t"));
        refreshApex(this.wiredInvoiceResult);
    }

    get statusOptions() {
        return this.statusProp.data ? this.statusProp.data.values : [];
    }

    get showEditLines() {
        return getFieldDisplayValue(this.invoice.data, INVOICE_STATUS) === 'Paid';
    }

    get name() {
        return getFieldValue(this.invoice.data, NAME_FIELD);
    }

    get address() {
        return getFieldValue(this.invoice.data, ADDRESS_FIELD);
    }

    get company() {
        return getFieldValue(this.invoice.data, COMPANY_FIELD);
    }

    get contactName() {
        return getFieldValue(this.invoice.data, CONTACT_NAME);
    }

    get contactPhone() {
        return getFieldValue(this.invoice.data, CONTACT_PHONE);
    }

    get contactEmail() {
        return getFieldValue(this.invoice.data, CONTACT_EMAIL);
    }

    get invoiceDate() {
        return getFieldValue(this.invoice.data, INVOICE_DATE);
    }

    get dueDate() {
        return getFieldValue(this.invoice.data, DUE_DATE);
    }

    get paidDate() {
        return getFieldValue(this.invoice.data, PAID_DATE);
    }

    get invoiceNumber() {
        return getFieldValue(this.invoice.data, INVOICE_NUMBER);
    }

    get invoiceAmount() {
        return getFieldValue(this.invoice.data, INVOICE_AMOUNT);
    }

    get invoiceStatus() {
        return getFieldValue(this.invoice.data, INVOICE_STATUS);
    }

    get reference() {
        return getFieldValue(this.invoice.data, REFERENCE);
    }

    get comments() {
        return getFieldValue(this.invoice.data, COMMENTS);
    }

    get taxAmount() {
        return getFieldValue(this.invoice.data, TAX_AMOUNT);
    }

    get totalLineAmount() {
        return getFieldValue(this.invoice.data, TOTAL_LINE_AMOUNT);
    }

    get totalPaidAmount() {
        return getFieldValue(this.invoice.data, TOTAL_PAID_AMOUNT);
    }

    get totalRefundAmount() {
        return getFieldValue(this.invoice.data, TOTAL_REFUND_AMOUNT);
    }

    handleEdit = (event) => {
        event.preventDefault();
        let obj = {
            type: 'standard__app',
            attributes: {
                pageRef: {
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: this.recordId,
                        objectApiName: this.objectApiName,
                        actionName: 'edit'
                    }
                }
            }
        }
        this[NavigationMixin.Navigate](obj);
    }

    handleClone = (event) => {
        event.preventDefault();
        let obj = {
            type: 'standard__app',
            attributes: {
                pageRef: {
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: this.recordId,
                        objectApiName: this.objectApiName,
                        actionName: 'clone'
                    }
                }
            }
        }
        this[NavigationMixin.Navigate](obj);
    }

    handleDelete = (event) => {
        event.preventDefault();
    }

    handleEditLines = (event) => {
        event.preventDefault();
    }

    handleLineCancel = (event) => {
        event.preventDefault();
        this.showLineEdit = false;
    }

    handleShowLineEdit = (event) => {
        event.preventDefault();
        this.showLineEdit = true;
    }

    handleAddItem = (event) => {
        event.preventDefault();
        this.newItems = [...this.newItems, { }];
        /* console.log('New Items ', this.newItems); */
    }

    handleLookup = (event) => {
        let data = event.detail.data;
        /* console.log('Lookup Data ', JSON.stringify(data, null, "\t")); */
        if(data && data.record){
            // populate the selected record in the correct parent Id field
            this.newItems[data.index][data.parentAPIName] = data.record.Id;
        }else{
            // clear the parent Id field
            this.newItems[data.index][data.parentAPIName] = undefined;
        }
    }

    validateItems = () => {
        const allValid = [
            ...this.template.querySelectorAll('lightning-input'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
    if (allValid) {
            /* Call createRecord to create the record */
            /* use forEach to iterate through the newItems array and create a new record for each item */
            //console.log('New Items ', JSON.stringify(this.newItems, null, "\t"));
            this.showSpinner = true;
            Promise.all(
                this.newItems.map(item => {
                    const fields = {};
                    fields['Invoice__c']        = this.recordId;
                    fields['Product__c']        = item.Product__c;
                    fields['Quantity__c']       = item.Quantity__c;
                    fields['Amount__c']         = item.Amount__c;
                    fields['Description__c']    = item.Description__c;
                    fields['Tax_Type__c']       = item.Tax_Type__c;
                    fields['Tax__c']            = item.Tax__c;
                    const recordInput = { apiName: 'InvoiceLineItem__c', fields };
                    return createRecord(recordInput);
            })).then(results => {
                //console.log('Results ', JSON.stringify(results, null, "\t"));
                this.newItems = [...[]];
                refreshApex(this.wiredInvoiceResult);
            }).catch(error => {
                // ... //
                console.error('Error ', JSON.stringify(error, null, "\t"));
            })
            .finally(() => {
                this.showSpinner = false;
            })
        } else {
            alert('Please update the invalid form entries and try again.');
        }
    }

    handleInputChange = (event) => {
        event.preventDefault();
        const fieldName  = event.target.name;
        const fieldValue = event.target.value;
        this.newItems[event.target.dataset.index][fieldName] = fieldValue;
        /* calculate the total amount for each line item using Tax__c */
        this.newItems[event.target.dataset.index][fieldName] = fieldValue;
        this.newItems[event.target.dataset.index]['FinalAmount__c'] = this.newItems[event.target.dataset.index]['Quantity__c'] * this.newItems[event.target.dataset.index]['Amount__c'];
        this.newItems[event.target.dataset.index]['Tax_Amount__c'] = ( this.newItems[event.target.dataset.index]['FinalAmount__c'] * this.newItems[event.target.dataset.index]['Tax__c'] / 100 ).toFixed(2);
        this.newItems = [...this.newItems];
    }

    handleDeleteItem = (event) => {
        event.preventDefault();
        /* get index & recordId from the event.dataset */
        const index = event.target.dataset.index;
        const selectedRecordId = event.target.dataset.recordId;
        /* console.log('Delete Item ', index, recordId); */
        if(selectedRecordId){
            /* call deleteRecord to delete the record */
            this.showSpinner = true;
            deleteRecord(selectedRecordId)
            .then(() => {
                /* do a console.log to confirm the record was deleted */
                console.log('Record Deleted');
                /* refresh the apex using the refreshApex function */
                refreshApex(this.wiredInvoiceResult);
            })
            .catch(error => {
                /* do a console.error to see the error */
                console.error('Error while deleting the line record', JSON.stringify(error, null, "\t"));
            })
            .finally(() => {
                this.showSpinner = false;
            })
        }else{
            /* remove the item from the array */
            this.newItems.splice(index, 1);
            this.newItems = [...this.newItems];
        }
    }
}