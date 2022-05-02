/* eslint-disable @lwc/lwc/no-async-operation */
import { api, LightningElement, track } from "lwc";
import searchRecords from "@salesforce/apex/LookupLWCService.searchRecords";
export default class LookupComponent extends LightningElement {
  @track records;
  @track error;
  isLoading = false;
  searchKeyword = "";
  @track selectedRecord;

  /* Public Property */
  @api lookupLabel = "Case";
  @api objectApiName = "Case"; // Student__c
  @api fieldApiName = "CaseNumber";
  @api iconName = "standard:case"; // iconCat:iconName
  @api placeholder = "Search Case";
  @api required = false;
  @api parentApiName = "ParentId";
  @api index = 0;

  /* Private Property */
  objectLabel = "Case";
  iconUrl =
    "/apexpages/slds/latest/assets/icons/{0}-sprite/svg/symbols.svg#{1}";

  connectedCallback() {
    // check if the object api name contains __c then remove __c with blank vaue and also replace _ with space
    // For Example Booked__c -> Booked
    // For Example Booked_Name__c -> Booked Name
    if (this.objectApiName.includes("__c")) {
      this.objectLabel = this.objectApiName
        .replace("__c", "")
        .replace("_", " ");
    } else {
      this.objectLabel = this.objectApiName;
    }
    let icons = this.iconName.split(":"); // 0 - iconCat, 1 - iconName
    this.iconUrl = this.iconUrl
      .replace("{0}", icons[0])
      .replace("{1}", icons[1]);
  }

  handleInputChange(event) {
    event.preventDefault();
    this.searchKeyword = event.target.value;
    this.handleSearch();
  }

  handleSearch() {
    searchRecords({
      searchString: this.searchKeyword,
      ojectApiName: this.objectApiName,
      fieldApiName: this.fieldApiName
    })
      .then((result) => {
        //this.records = result;
        this.error = undefined;
        //console.log('result ', result);
        this.records = JSON.parse(JSON.stringify(result));
        this.records.forEach((record) => {
          record.Name = record[this.fieldApiName]; // Case.Subject, Contact.Name, Case.CaseNumber
        });
      })
      .catch((error) => {
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
    this.selectedRecord = this.records.find((record) => record.Id === recordId);
    //console.log('selectedRecord ', this.selectedRecord);
    this.records = undefined;
    // fire the lookup event
    const lookupEvent = new CustomEvent("lookup", {
      detail: {
        recordId: recordId,
        parentApiName: this.parentApiName,
        index: this.index,
        record: this.selectedRecord
      }
    });
    this.dispatchEvent(lookupEvent);
  }

  handleRemove(event) {
    event.preventDefault();
    this.selectedRecord = undefined;
    this.records = undefined;
    // fire the lookup event
    const lookupEvent = new CustomEvent("lookup", {
      detail: {
        recordId: undefined,
        parentApiName: this.parentApiName,
        index: this.index,
        record: undefined
      }
    });
    this.dispatchEvent(lookupEvent);
  }

  handleClose(event) {
    event.preventDefault();
    this.records = undefined;
  }
}
