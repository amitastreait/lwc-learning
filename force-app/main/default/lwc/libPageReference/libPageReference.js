import { api, LightningElement, wire } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
export default class LibPageReference extends NavigationMixin(LightningElement) {

    currentPageReference;
    @api recordId;

    @wire(CurrentPageReference)
    setCurrentPageRefence(currentPageReference) {
        this.currentPageReference = currentPageReference;
        console.log('currentPageReference ', currentPageReference);
    }

    handleNewAccount(){
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                actionName: "new",
                objectApiName: "Account",
            },
            state : {
                "c__AccountId" : this.recordId
            }
        });
    }

    navigateToObjectHomePage(){
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: "Account",
                actionName: "home"
            }
        });
    }

    navigateToObjectListViewPage(){
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: "Account",
                actionName: "list"
            }
        });
    }

    handleEditAccount(){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: "edit",
                recordId: this.recordId
            }
        });
    }

    handleViewAccount(){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: "view",
                recordId: '0034x000013hliUAAQ'
            }
        });
    }

    navigateToExternalUrl(){
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'http://salesforce.com'
            }
        });
    }

    navigateToLWC(){
        let pageRef = {
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'CustomLabel'
            },
            state : {
                "c__AccountId" : this.recordId,
                "c__param1" : "value1"
            }
        }
        this[NavigationMixin.Navigate](pageRef);
    }

}