import { api, LightningElement } from 'lwc';

export default class Parent extends LightningElement {

    @api message;
    greeting = 'Hello World';
    showChild = true;

    get itemName() {
        return this.greeting;
    }
    set itemName(value){
        this.greeting = value;
    }

    constructor() {
        super();
        console.log('Parent constructor');
        console.log('Parent message: ' + this.message);
        console.log('Parent message: ' + this.itemName);
    }

    connectedCallback() {
        console.log('Parent connectedCallback');
        console.log('Parent message connectedCallback: ' + this.message);
        console.log('Parent message connectedCallback: ' + this.itemName);
    }

    renderedCallback() {
        console.log('Parent renderedCallback');
    }

    disconnectedCallback() {
        console.log('Parent disconnectedCallback');
    }

    errorCallback(error, stack){
        console.log('Parent errorCallback');
        // log the error and stack
        console.error('Error in Parent ', error );
        console.log('Stack in Parent ',  stack);
    }

    handleChange(event) {
        this.greeting = event.target.value;
    }

    handleShowHideChild(event) {
        this.showChild = !this.showChild;
    }
}
