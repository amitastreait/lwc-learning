import { LightningElement, track, wire } from 'lwc';
import  findOpportunities from '@salesforce/apex/OpportunityTableHandler.findOpportunities';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
    { label: 'Change Owner', name: 'owner' },
];

const columnList = [
    //{ label: 'Opportunity Name', fieldName: 'Name', type : 'text' },
    {
        label: 'Opportunity Name', fieldName: 'OpportunityUrl', type : 'url', wrapText: true,
        typeAttributes: {
            label: { fieldName: 'Name' },
            target: '_self'
        }
    },
    {
        label: 'Account Name', fieldName: 'AccountUrl', type: 'url',
        typeAttributes: {
            label: { fieldName: 'AccountName' },
            target: '_blank'
        },
        cellAttributes: {
            iconName : 'standard:account_info',
            iconAlternativeText : 'Account'
        }
    },
    { label: 'Stage', fieldName: 'StageName', type: 'text',
        cellAttributes: {
            iconName : 'utility:ribbon',
            iconAlternativeText : 'Account',
            iconPosition : 'left',
            // success css class
            class: 'slds-text-color_success slds-text-title_caps',
        }
    },
    { label: 'Amount', fieldName: 'Amount', type: 'currency',
        typeAttributes: {
            currencyCode: 'EUR',
            steps: '0.001'
        },
        editable: true
    },
    { label: 'Closed Date', fieldName: 'CloseDate', type: 'date', editable: true },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];
export default class DataTableComponent extends LightningElement {
    @track data;
    @track columns = columnList;
    isLoading = false;

    @track draftValues = [];

    @track wiredOpportunitiesData; // {error, data }

    @wire(findOpportunities)
    wiredOpportunities(result) {
        this.wiredOpportunitiesData = result; // { error, data }
        if (result.data) {
            //console.log('Data: ', data); // readonly
            this.data = JSON.parse( JSON.stringify(result.data) ) //[...data];
            let baseUrl = 'https://'+window.location.host+'/lightning/r/'; // Account/AccountId/view
            this.data.forEach( record => {
                record.AccountName    = record.AccountId ? record.Account.Name : '';
                record.AccountUrl     = record.AccountId ? baseUrl + 'Account/'+ record.AccountId+'/view' : '';
                record.OpportunityUrl = baseUrl + 'Opportunity/'+ record.Id+'/view';
            });
            //console.log('this.Data: ', this.data); // readonly
        }
        if(result.error){
            console.error('error', result.error);
        }
    }

    handleRowSelection(event) {
        event.preventDefault();
        console.log('event: ', event);
    }

    handleClick(event) {
        event.preventDefault();
        let dt = this.template.querySelector('lightning-datatable');
        let selectedRows2 = dt.getSelectedRows();
        console.log('selectedRows2: ', selectedRows2);
    }

    handleRowAction(event) {
        event.preventDefault();
        console.log('event: ', event);
        // get the selected row
        const actionName = event.detail.action.name;
        const row = event.detail.row; // selected row
        switch (actionName) {
            case 'edit':
                this.editRow(row);
                break;
            case 'delete':
                this.deleteRow(row);
                break;
            case 'owner':
                break;
            default:
        }
    }

    editRow(row) {
        console.log('editRow: ', JSON.stringify(row, null, "\t"));
    }

    deleteRow(row) {
        console.log('deleteRow: ', JSON.stringify(row, null, "\t"));
    }

    handleSave(event) {
        event.preventDefault();
        this.isLoading = true;
        let draftValues = event.detail.draftValues;
        // [ {}, {} ]
        // updateRecord(recordInput)
        // [ { fields: {Id: '', Name: ''} }, { fields: {Id: '', Name: ''} } ]
        let allRecords = []; // all the record inputs
        draftValues.forEach( draft => {
            const fields = {...draft } // { Id: '', Name: ''}
            allRecords = [...allRecords, { fields : fields }];
        })
        console.log('allRecords: ', JSON.stringify(allRecords, null, "\t"));
        // Prepare the Array of updateRecord Promises
        // [ { fields: {Id: '', Name: ''} }, { fields: {Id: '', Name: ''} } ]
        let updateRecordPromises = [];
        allRecords.forEach( recordInput => {
            updateRecordPromises = [...updateRecordPromises, updateRecord(recordInput) ];
        })
        //const promises = allRecords.map(recordInput => updateRecord(recordInput));
        Promise.all(updateRecordPromises)
        .then(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Selected Records Updated!',
                variant: 'success'
            }));
            this.draftValues = [];
            refreshApex(this.wiredOpportunitiesData); // {error, data}
        })
        .catch(error => {
            console.error('error: ', error);
        })
        .finally(() => {
            console.log('finally');
            this.isLoading = false;
        });
    }
}