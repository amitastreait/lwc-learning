/* eslint-disable @lwc/lwc/no-leading-uppercase-api-name */
import { LightningElement, api } from 'lwc';

export default class MetaFileComponent extends LightningElement {
    @api strName;
    @api isAdmin;
    @api Type;
    @api qty;
    @api recordId; // get the record id from the detail page
    @api objectApiName; // get the object api name from the detail page
}