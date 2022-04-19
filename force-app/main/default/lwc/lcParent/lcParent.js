import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import template1 from './templates/template1.html';
import lcParent from './lcParent.html';

export default class LcParent extends LightningElement {
    greeting = 'Hello World';
    showChild = true;
    hasRendered = false;
    fieldApiName = 'Parent_Picklist';

    showTemplate =  true;

    @wire (getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName:'$fieldApiName' })
    parentPicklist;

    constructor(){
        super();
        console.log('Parent constructor');
        console.log('Parent greeting message: ' + this.greeting);
    }

    connectedCallback(){
        console.log('Parent connectedCallback');
        let childComponent = this.template.querySelector('c-lc-child');
        console.log('childComponent: ' + childComponent);
        //console.log(showMessage.value);
    }

    disconnectedCallback(){
        console.log('Parent disconnectedCallback');
    }

    renderedCallback(){
        if(this.hasRendered){
            return;
        }
        this.hasRendered = true;
        // load external lib
        // call the apex
        // execute events
        // manupulate dom
        // manulate child component
        console.log('Parent renderedCallback');
    }

    errorCallback(error, stack){
        console.log('Parent errorCallback');
        console.log('error in parent : ' , error);
        console.log('stack: in parent : ' , stack);
    }

    render(){
        return this.showTemplate ? lcParent : template1; // html template
    }

    handleChange(event){
        this.greeting = event.target.value;
    }

    toggleChild(){
        this.showChild = !this.showChild; // true -> false, false -> true
    }

    toggleTemplate(){
        this.showTemplate = !this.showTemplate; // true -> false, false -> true
    }
}
