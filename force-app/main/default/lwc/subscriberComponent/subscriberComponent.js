import { LightningElement, track, wire } from 'lwc';
import { APPLICATION_SCOPE, MessageContext, releaseMessageContext, subscribe, unsubscribe} from 'lightning/messageService';
import MyMessageChannel from '@salesforce/messageChannel/MyMessageChannel__c';
export default class SubscriberComponent extends LightningElement {

    @wire(MessageContext) messageContext;
    subscription;
    @track messageData;

    connectedCallback() {
        this.subscription = subscribe(this.messageContext, MyMessageChannel, this.handleResponse,
            {
                scope : APPLICATION_SCOPE
            }
        );
    }

    handleResponse(message){
        console.log('Message Received: ', JSON.stringify(message , null, "\t") );
        this.messageData =message;
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        releaseMessageContext(this.messageContext);
    }
}