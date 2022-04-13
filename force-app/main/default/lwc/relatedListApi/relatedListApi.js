import { api, LightningElement, wire } from 'lwc';
import { getRelatedListCount, getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class RelatedListApi extends LightningElement {

    @api recordId;
    error;
    responseData;
    records;
    @wire(getRelatedListCount, {
        parentRecordId: '$recordId',
        relatedListId: 'Contacts'
    })listInfo({ error, data }) {
        if (data) {
            this.responseData = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.responseData = undefined;
        }
    }

    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Contacts',
        fields: ['Contact.Id','Contact.Name','Contact.Email','Contact.Account.Name']
    })listInfoRecords({ error, data }) {
        if (data) {
            console.log('listInfoRecords data: ' + JSON.stringify(data) );
            this.records = data.records;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }

}