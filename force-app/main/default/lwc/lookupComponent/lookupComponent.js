/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, track } from 'lwc';
import searchRecords from '@salesforce/apex/LookupLWCService.searchRecords';
export default class LookupComponent extends LightningElement {

    @track records;
    @track error;
    isLoading = false;
    searchKeyword = '';
    @track selectedRecord;

    handleInputChange(event) {
        event.preventDefault();
        this.searchKeyword = event.target.value;
        this.handleSearch();
    }

    handleSearch() {
        searchRecords({
            searchString : this.searchKeyword
        })
        .then(result => {
            this.records = result;
            this.error = undefined;
            //console.log('result ', result);
        })
        .catch(error => {
            this.error = error;
            this.records = undefined;
            console.error(error);
        });
    }

    handleSelected(event) {
        // get the recordId from the dataset
        const recordId = event.currentTarget.dataset.recordId;
        // find the selected record with find method
        //console.log('recordId ', recordId);
        this.selectedRecord = this.records.find(record => record.Id === recordId);
        //console.log('selectedRecord ', this.selectedRecord);
        this.records = undefined;
        // fire the lookup event
        const lookupEvent = new CustomEvent('lookup', {
            detail : {
                recordId : recordId,
                record : this.selectedRecord
            }
        });
        this.dispatchEvent(lookupEvent);
    }

    handleRemove(event){
        event.preventDefault();
        this.selectedRecord = undefined;
        this.records = undefined;
        // fire the lookup event
        const lookupEvent = new CustomEvent('lookup', {
            detail : {
                recordId : undefined,
                record : undefined
            }
        });
        this.dispatchEvent(lookupEvent);
    }
}