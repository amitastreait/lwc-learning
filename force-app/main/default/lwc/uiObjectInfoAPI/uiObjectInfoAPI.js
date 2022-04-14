/* eslint-disable no-else-return */
import { api, LightningElement, wire } from 'lwc';
import { getObjectInfo, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';

const DUMMY_RECORD_TYPEID = '012000000000000AAA';

export default class UiObjectInfoAPI extends LightningElement {


    objectInfo;
    accountSourceOptions;

    @api picklistFieldApiName = 'Industry';
    @api recordTypeId = '0124x000000q5iTAAQ';

    @wire(getObjectInfo, { objectApiName: 'Account' })
    wiredObject({ error, data }) {
        if(data){
            //console.log('wiredObject data: ' + JSON.stringify(data) );
            this.objectInfo = data;
        }
        if(error){
            console.error('wiredObject error: ' + JSON.stringify(error) );
            this.objectInfo = undefined;
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
        }
    }

    get options() {
        if(this.accountSourceOptions){
            return this.accountSourceOptions;
        }else{
            return [];
        }
    }

}