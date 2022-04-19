import { LightningElement } from 'lwc';

export default class Child extends LightningElement {

    constructor() {
        super();
        console.log('Child constructor');
    }

    connectedCallback() {
        console.log('Child connectedCallback');
        //console.log('Child message: ' + showChild.value);
    }

    disconnectedCallback() {
        console.log('Child disconnectedCallback');
    }

    renderedCallback() {
        console.log('Child renderedCallback');
    }
}