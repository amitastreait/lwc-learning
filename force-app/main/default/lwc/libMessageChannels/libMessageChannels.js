import { LightningElement } from 'lwc';
import { createMessageContext, publish, releaseMessageContext} from 'lightning/messageService';
import MyMessageChannel from '@salesforce/messageChannel/MyMessageChannel__c';
export default class LibMessageChannels extends LightningElement {

    messageContext = createMessageContext();

    handlePublishInformation(event) {
        event.preventDefault();
        const message = {
            recordId    : '00150000008XqXu',
            message     : 'Hello from LWC',
            record      : {
                Id      : '00150000008XqXu',
                Name    : 'LWC',
                Type    : 'Account',
                Phone   : '1234567890',
                Website : 'www.salesforce.com',
                OwnerId : '005R0000000KQZx'
            }
        }
        publish(this.messageContext, MyMessageChannel, message);
        console.log('Message Published');
    }

    disconnectedCallback() {
        releaseMessageContext(this.messageContext);
    }
}