import { LightningElement , api } from "lwc";
export default class Rating extends LightningElement {
	@api
	recordId;
	@api
	objectApiName;
}