/* eslint-disable @lwc/lwc/no-dupe-class-members */
/* eslint-disable no-dupe-class-members */
import { LightningElement, wire, api } from 'lwc';
import { getRelatedListCount, getRelatedListRecords, getRelatedListInfo } from 'lightning/uiRelatedListApi';
export default class LdsUIRelatedListAPO extends LightningElement {

    @api recordId;

    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Contacts',
        fields: ['Contact.Name','Contact.Id','Contact.Email','Contact.Title', 'Contact.Account.Name', 'Contact.Account.Id']
    })
    wiredRelatedRecords({ error, data }) {
        if (data) {
            console.log('wiredRelatedRecords data: \n ', JSON.stringify(data) );
        } else if (error) {
            console.error('wiredRelatedRecords error: \n ', JSON.stringify(error) );
        }
    }

    @wire(getRelatedListCount, {
        parentRecordId: '$recordId',
        relatedListId: 'Contacts',
    })
    wiredRelatedRecordCount({ error, data }) {
        if (data) {
            console.log('getRelatedListCount data: \n ', JSON.stringify(data) );
        } else if (error) {
            console.error('getRelatedListCount error: \n ', JSON.stringify(error) );
        }
    }

    @wire(getRelatedListInfo, {
        parentObjectApiName: 'Account',
        relatedListId: 'Contacts'
    })
    wiredRelatedListInfo({ error, data }) {
        if (data) {
            console.log('getRelatedListInfo data: \n ', JSON.stringify(data) );
        } else if (error) {
            console.error('getRelatedListInfo error: \n ', JSON.stringify(error) );
        }
    }
}