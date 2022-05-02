import { LightningElement } from "lwc";

export default class CustomLookupDemo extends LightningElement {
  required = true;

  handleAccountLookup(event) {
    event.preventDefault();
    let details = event.detail;
    console.log("details ", JSON.stringify(details));
  }

  handleContactLookup(event) {
    event.preventDefault();
    let details = event.detail;
    console.log("details ", JSON.stringify(details));
    // this.records[index][parentApiName] = details.record.Id;
    // this.record[parentApiName] = details.record.Id;
  }
}
