public with sharing class InvoiceAuraService {

    @AuraEnabled(cacheable=true)
    public static Contact contactInformation(String recordId){
        try {
            return [SELECT Id, Name, Phone, Email, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry FROM Contact WHERE Id = :recordId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Invoice__c> listInvoices(List<String> recordId){
        try {
            return [SELECT Id, Name, TotalLineAmount__c, InvoiceDate__c, Due_Date__c, Contact__c, Contact__r.Name,
                Company__c, Company__r.Name, Status__c
                FROM Invoice__c
                WHERE Company__c IN: recordId
                ORDER BY InvoiceDate__c DESC];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable = true)
    public static List<Invoice__c> listInvoiceByUser(String currentUserId){
        try {
            List<String> accountIdsSet = new List<String>();
            for(Account acc :[SELECT Id, Name FROM Account WHERE OwnerId = :currentUserId]){
                accountIdsSet.add(acc.Id);
            }
            List<Invoice__c> invoices = listInvoices(accountIdsSet);
            return invoices;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}