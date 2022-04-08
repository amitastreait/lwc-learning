import { api, LightningElement } from 'lwc';

export default class ChildComponent extends LightningElement {
    message = 'Child Component';
    @api contact; // undefined
    textData;
    handleClick() {
        this.message = 'Child Component Clicked!';
        const childEvent = new CustomEvent('childevent', {
            detail : {
                message : this.message,
                selectedRecordId : this.contact.Id,
                //selectedRecord   : {...this.contact}
            },
            bubbles  : true,
            composed : false
        });
        this.dispatchEvent(childEvent);
    }

    @api
    handleChild(param, param1){
        console.log('Child Event Executed!');
        console.log(param);
        console.log(param1);
        this.textData = param;
    }

}