import { LightningElement, track, wire } from 'lwc';
import { APPLICATION_SCOPE, MessageContext, releaseMessageContext, subscribe, unsubscribe} from 'lightning/messageService';
import MyMessageChannel from '@salesforce/messageChannel/MyMessageChannel__c';
export default class SubscriberComponent extends LightningElement {

    @wire(MessageContext) messageContext;
    subscription;
    @track messageData;
    message;

    connectedCallback() {
        this.subscription = subscribe(this.messageContext, MyMessageChannel, this.handleResponse.bind(this),
            {
                scope : APPLICATION_SCOPE
            }
        );
    }

    handleResponse(message){
        console.log('Message Received: ', JSON.stringify(message , null, "\t") );
        this.messageData = message;
        this.message = JSON.stringify(message , null, "\t");
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        releaseMessageContext(this.messageContext);
    }
}