import { api, LightningElement, wire } from 'lwc';
import contactInformation from '@salesforce/apex/InvoiceAuraService.contactInformation';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
// InvoiceLineItem__c.Tax_Type__c
import TAX_TYPE from '@salesforce/schema/InvoiceLineItem__c.Tax_Type__c';
import { createRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class InvoiceCreateComponent extends LightningElement {

    @api recordId;
    @api objectApiName;
    invoiceRecord = {};
    selectedCustomerId;
    selectedCustomer;
    showSpinner = false;
    errors;

    invoiceId;
    customerError;
    errorMessage;

    fields           = ['Name'];
    productsfields   = ['Name'];
    fieldsToCreate   = ['FirstName','LastName','Email','Phone', 'AccountId']
    productsToCreate = ['Name', 'ProductCode', 'Description'];

    items = [{
        "Description__c" : "",
        "Invoice__c" : "",
        "Product__c" : "",
        "Quantity__c"  : 1,
        "Tax__c" : 0,
        "Amount__c" : null,
        "Tax_Type__c" : "",
    }];

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: TAX_TYPE })
    taxTypes;

    @wire(contactInformation, { recordId: '$selectedCustomerId' })
    wiredContactInformation({error, data}) {
        if (data) {
            /* console.log('contact data ', data); */
            this.selectedCustomer = {...data};
            this.showSpinner = false;
            this.customerError = undefined;
        }
        if (error) {
            console.error(error);
            this.errors = error;
            this.showSpinner = false;
        }
    }

    get taxType() {
        return this.taxTypes.data ? this.taxTypes.data.values : [];
    }

    handleInputChange(event) {
        event.preventDefault();
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        this.invoiceRecord[fieldName] = fieldValue;
    }

    handleLineInputChange(event) {
        event.preventDefault();
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        this.items[event.target.dataset.index][fieldName] = fieldValue;
        this.items[event.target.dataset.index]['FinalAmount__c'] = this.items[event.target.dataset.index]['Quantity__c'] * this.items[event.target.dataset.index]['Amount__c'];
        this.items[event.target.dataset.index]['Tax_Amount__c'] = ( this.items[event.target.dataset.index]['FinalAmount__c'] * this.items[event.target.dataset.index]['Tax__c'] / 100 ).toFixed(2);
        this.items = [...this.items];
    }

    handleDeleteItem = (event) => {
        event.preventDefault();
        /* get index & recordId from the event.dataset */
        const index = event.target.dataset.index;
        this.items.splice(index, 1);
        this.items = [...this.items];
    }

    handleLookup = (event) => {
        let data = event.detail.data;
        /* console.log('Lookup Data ', JSON.stringify(data, null, "\t")); */
        if(data && data.record){
            // populate the selected record in the correct parent Id field
            //this.newItems[data.index][data.parentAPIName] = data.record.Id;
            this.selectedCustomerId = data.record.Id;
            console.log('Selected Customer Id ', this.selectedCustomerId);
            this.showSpinner = true;
        }else{
            // clear the parent Id field
            //this.newItems[data.index][data.parentAPIName] = undefined;
            this.selectedCustomerId = undefined;
            this.selectedCustomer   = undefined;
        }
    }

    validateInputs() {
        const allValid = [
            ...this.template.querySelectorAll('lightning-input, lightning-textarea'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
        return allValid;
    }

    handleDraftInvoice(event) {
        event.preventDefault();
        let allValid = this.validateInputs();
        this.errors  = undefined;
        if(allValid){
            console.log('Invoice Record ', JSON.stringify(this.invoiceRecord, null, "\t"));
            this.customerError = undefined;
            if(!this.selectedCustomerId){
                this.customerError = 'Please select a customer';
                return;
            }
            this.showSpinner = true;
            /* call createRecord method from lightning/uiRecordApi to create the Invoice under Account */
            const fields = {...this.invoiceRecord};
            fields['Status__c']             = 'Draft';
            fields['Contact__c']            = this.selectedCustomerId;
            /*fields['Description__c']      = this.invoiceRecord.Description__c;
            fields['Invoice_Number__c']     = this.invoiceRecord.Invoice_Number__c;
            fields['InvoiceDate__c']        = this.invoiceRecord.Invoice_Date__c;
            fields['Due_Date__c']           = this.invoiceRecord.Invoice_Total__c;
            fields['Reference__c']          = this.invoiceRecord.Reference__c;
            fields['Comments__c']           = this.invoiceRecord.Comments__c;
            fields['FromAddress__c']        = this.invoiceRecord.FromAddress__c;*/
            let recordInput                 = { apiName : 'Invoice__c', fields };
            console.log('Invoice Record Id ', this.invoiceId);
            if(this.invoiceId){
                fields['Id'] = this.invoiceId;
                recordInput = { fields };
                this.handleUpdateRecord(recordInput);
            }else{
                fields['Company__c']       = this.recordId;
                this.handleCreateInvoice(recordInput);
            }
        }else{
            return;
        }
    }

    handleUpdateRecord(recordInput) {
        updateRecord(recordInput)
        .then(result => {
            this.invoiceId = result.id;
        })
        .catch(error => {
            console.log('Error Updating Invoice Record', error);
            this.errors = error;
        })
        .finally(() => {
            this.showSpinner = false;
        });
    }

    handleCreateInvoice = (recordInput) => {
        createRecord(recordInput)
        .then(result => {
            this.invoiceId = result.id;
            const invoiceEvent = new ShowToastEvent({
                title: 'Success!',
                message: 'Record {0} created! See it {1}!',
                mode : 'dismissable',
                variant : 'success',
                messageData: [
                    'Invoice',
                    {
                        url: 'http://'+location.host+'/lightning/r/Invoice__c/' + this.invoiceId + '/view',
                        label: 'here',
                    },
                ],
            });
            this.dispatchEvent(invoiceEvent);
        })
        .catch(error => {
            console.log('Error Creating Invoice Record', error);
            this.errors = error;
        })
        .finally(() => {
            this.showSpinner = false;
        });
    }

    handleCancel(event) {
        event.preventDefault();
    }

    handleAddItems(event) {
        event.preventDefault();
        this.items = [...this.items, {
            "Description__c" : "",
            "Invoice__c" : "",
            "Product__c" : "",
            "Quantity__c"  : 1,
            "Tax__c" : 0,
            "Amount__c" : null,
            "Tax_Type__c" : "",
        }];
    }

    handleLookupProduct(event) {
        let data = event.detail.data;
        console.log('Lookup Data ', JSON.stringify(data, null, "\t"));
        if(data && data.record){
            // populate the selected record in the correct parent Id field
            this.items[data.index][data.parentAPIName] = data.record.Id;
        }else{
            // clear the parent Id field
            this.items[data.index][data.parentAPIName] = undefined;
        }
    }

    handleSaveItems(event) {
        event.preventDefault();
        console.log('Items ', JSON.stringify(this.items, null, "\t"));
        if(!this.invoiceId){
            this.errorMessage = 'Please save the invoice first';
            return;
        }
        let allValid = this.validateItems();
        if(!allValid){
            return;
        }
        this.showSpinner = true;
        Promise.all(
            this.items.map(item => {
                const fields = {};
                fields['Invoice__c']        = this.invoiceId
                fields['Product__c']        = item.Product__c;
                fields['Quantity__c']       = item.Quantity__c;
                fields['Amount__c']         = item.Amount__c;
                fields['Description__c']    = item.Description__c;
                fields['Tax_Type__c']       = item.Tax_Type__c;
                fields['Tax__c']            = item.Tax__c;
                const recordInput = { apiName: 'InvoiceLineItem__c', fields };
                //console.log('Invoice Line Item Record ', JSON.stringify(recordInput, null, "\t"));
                return createRecord(recordInput);
        })).then(results => {
            //console.log('Results ', JSON.stringify(results, null, "\t"));
            //this.items = [...[]];
            const invoiceEvent = new ShowToastEvent({
                title: 'Success!',
                message: 'Record {0} created! See it {1}!',
                mode : 'dismissable',
                variant : 'success',
                messageData: [
                    'Invoice',
                    {
                        url: 'http://'+location.host+'/lightning/r/Invoice__c/' + this.invoiceId + '/view',
                        label: 'here',
                    },
                ],
            });
            this.dispatchEvent(invoiceEvent);
            //refreshApex(this.wiredInvoiceResult);
        }).catch(error => {
            // ... //
            console.error('Error ', JSON.stringify(error, null, "\t"));
        })
        .finally(() => {
            this.showSpinner = false;
        })
    }
}