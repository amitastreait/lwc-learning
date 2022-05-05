import { api, LightningElement, track } from 'lwc';
import listInvoices from '@salesforce/apex/InvoiceAuraService.listInvoices';
import listInvoiceByUser from '@salesforce/apex/InvoiceAuraService.listInvoiceByUser';
import Id from '@salesforce/user/Id';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];
const COLUMNS = [
    { label: 'Invoice #',   fieldName: 'Name', displayReadOnlyIcon: true, wrapText: true,
        cellAttributes: {
            class: 'slds-text-color_success slds-text-title_caps',
        },
    },
    {
        label: 'Company', fieldName: 'CompanyUrl', type:'url', wrapText: true,
        typeAttributes: {
            label: {
                fieldName: 'COMPANYNAME'
            },
            target : '_self'
        }
    },
    {
        label: 'Bill To Contact', fieldName: 'ContactUrl', type:'url', wrapText: true,
        typeAttributes: {
            label: {
                fieldName: 'ContactName'
            },
            target : '_self'
        }
    },
    { label: 'Status',   fieldName: 'Status__c',
        cellAttributes: {
            iconName: 'utility:ribbon',
            iconAlternativeText: 'Status'
        }
    },
    { label: 'Total Line Amount', fieldName: 'TotalLineAmount__c',  type: 'currency' },
    { label: 'Invoice Date', fieldName: 'InvoiceDate__c', type: 'date'   },
    { label: 'Due Date', fieldName: 'Due_Date__c', type: 'date',
        cellAttributes: {
            class: 'slds-text-color_error',
            iconName : 'utility:lower_flag',
            iconAlternativeText: 'Invoice is overdue'
        }
    },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class InvoiceListComponent extends NavigationMixin(LightningElement) {

    @api recordId;
    columnsList = COLUMNS;
    @track dataList;
    errors;

    handleRowAction = event => {
        event.preventDefault();
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        //console.log('selected row ', JSON.stringify(row) );
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'show_details':
                this.showRowDetails(row);
                break;
            default:
        }
    }

    showRowDetails(row) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: "view",
                recordId: row.Id
            }
        });
    }

    deleteRow(row) {
        deleteRecord(row.Id)
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Deleted!',
                    message: 'Invoice Deleted',
                    variant: 'success'
                }));
                this.connectedCallback();
            })
            .catch(error => {
                this.errors = error;
            })
            .finally(() => {})
    }

    connectedCallback() {
        let baseUrl = 'https://'+location.host+'/lightning/r/';
        if (this.recordId) {
            listInvoices({ recordId: this.recordId })
                .then(result => {
                    this.dataList = [...result];
                    //console.log('result ', JSON.stringify(result));
                    /* map the data and add new attributes COMPANYNAME, CompanyUrl, ContactName, ContactUrl */
                    this.dataList = this.dataList.map( item => ({
                        ...item,
                        COMPANYNAME : item.Company__r.Name,
                        CompanyUrl  : baseUrl +'Account/'+item.Company__c+'/view',
                        ContactName : item.Contact__c?item.Contact__r.Name : '',
                        ContactUrl  : item.Contact__c?baseUrl +'Contact/'+item.Contact__c+'/view' : ''
                    }));
                    //console.log('dataList ', JSON.stringify(this.dataList));
                })
                .catch(error => {
                    console.error('Error While fetching the data', error);
                    this.errors = error;
                })
                .finally(() => {});
        }else{
            listInvoiceByUser({ currentUserId : Id })
            .then(result => {
                this.dataList = [...result];
                this.dataList = this.dataList.map( item => ({
                    ...item,
                    COMPANYNAME : item.Company__r.Name,
                    CompanyUrl  : baseUrl +'Account/'+item.Company__c+'/view',
                    ContactName : item.Contact__c?item.Contact__r.Name : '',
                    ContactUrl  : item.Contact__c?baseUrl +'Contact/'+item.Contact__c+'/view' : ''
                }));
            })
            .catch(error => {
                console.error('Error While fetching the data', error);
                this.errors = error;
            })
            .finally(() => {});
        }
    }
}