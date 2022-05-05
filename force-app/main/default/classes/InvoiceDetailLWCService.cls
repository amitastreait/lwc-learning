public with sharing class InvoiceDetailLWCService {

    @AuraEnabled(cacheable=true)
    public static InvoiceWrapper lineItems(String recordId){
        InvoiceWrapper wrapper = new InvoiceWrapper();
        try {
            wrapper.lineItems = [SELECT Id, Amount__c, Description__c, Product__c, Product__r.Name, Product__r.ProductCode, Quantity__c, Tax_Type__c, Tax__c, Invoice__c, FinalAmount__c, Tax_Amount__c FROM InvoiceLineItem__c WHERE Invoice__c = :recordId];
            wrapper.payments  = [SELECT Id, Invoice__c, Amount__c, Date__c, Status__c, Comments__c, Reference_Number__c FROM Payment__c WHERE Invoice__c = :recordId];
            wrapper.refunds   = [SELECT Id, Invoice__c, Amount__c, Date__c, Status__c, Reason__c, Reference_Number__c FROM Refund__c WHERE Invoice__c = :recordId];
            return wrapper;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class InvoiceWrapper {
        @AuraEnabled
        public List<InvoiceLineItem__c> lineItems { get; set; }
        @AuraEnabled
        public List<Payment__c> payments { get; set; }
        @AuraEnabled
        public List<Refund__c> refunds { get; set; }
    }
}