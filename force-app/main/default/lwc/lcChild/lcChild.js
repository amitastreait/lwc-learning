import { api, LightningElement } from 'lwc';

export default class LcChild extends LightningElement {
    @api greeting;

    constructor() {
        super();
        console.log('Child constructor');
        console.log('Child greeting message: ' + this.greeting);
    }

    connectedCallback() {
        console.log('Child connectedCallback');
        console.log('Child greeting message:  connectedCallback ' + this.greeting);
        console.log(showMessage.value);
    }

    disconnectedCallback() {
        console.log('Child disconnectedCallback');
    }

    renderedCallback() {
        console.log('Child renderedCallback');
    }

    errorCallback(error, stack) {
        console.log('Child errorCallback');
        console.log('error: ' , error);
        console.log('stack: ' , stack);
    }
}