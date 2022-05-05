/**
 * @description       :
 * @author            : Amit Singh
 * @group             :
 * @last modified on  : 01-12-2022
 * @last modified by  : Amit Singh
 * Modifications Log
 * Ver   Date         Author       Modification
 * 1.0   08-28-2020   Amit Singh   Initial Version
**/
import { LightningElement, api, track } from 'lwc';
import pubsub from 'c/utils';
import noDataIllustration from './templates/noDataIllustration.html';
import inlineMessage from './templates/inlineMessage.html';

export default class ErrorPanel extends LightningElement {
    @api friendlyMessage = 'Error retrieving data';
    @track viewDetails = false;
    @api errors;
    /** Type of error message **/
    @api type;
    get errorMessages() {
        return pubsub._reduceErrors(this.errors);
    }
    handleCheckboxChange(event) {
        this.viewDetails = event.target.checked;
    }
    handleShowDetailsClick() {
        this.viewDetails = !this.viewDetails;
    }

    render() {
        if (this.type === 'inlineMessage') return inlineMessage;
        return noDataIllustration;
    }
}