import { api, LightningElement } from 'lwc';

export default class NewLead extends LightningElement {
    @api recordId;
    @api strName;
}