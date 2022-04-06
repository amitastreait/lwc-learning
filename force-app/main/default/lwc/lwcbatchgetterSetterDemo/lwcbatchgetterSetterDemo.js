import { LightningElement } from 'lwc';

export default class LwcbatchgetterSetterDemo extends LightningElement {

    upperCaseItemName = 'Item Name';

    /* random image of a dog based on breed */
    get itemName(){
        console.log('getter called');
        // apex class
        // webservice
        // create record
        // get image by breed
        return this.upperCaseItemName;
    }
    set itemName(value){
        this.upperCaseItemName = value.toUpperCase();
    }

    handlChangeValue(event){
        this.itemName = Math.random().toString();
    }

    handleBreedChange(event){
        console.log(event.target.value);
        this.itemName = event.target.value;
    }
}