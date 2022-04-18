import { LightningElement, wire } from 'lwc';
import helloWorld from '@salesforce/apex/ContactListLwcService.helloWorld';
export default class HelloWorldComponent extends LightningElement {

    helloWorldMessage = '';
    @wire(helloWorld)
    wireHelloWorld({error, data}) {
        if (error) {
            console.error(error);
        }
        if (data) {
            this.helloWorldMessage = data;
        }
    }
}