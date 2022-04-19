public with sharing class AccountList {

    @AuraEnabled(cacheable=true)
    public static List<Account> accountList(String message){
        try {
            System.System.debug('accountList: ' + messageOne);
            return [SELECT Id, Name, Phone, Industry, Rating, Type, OwnerId,
                    BillingAddress, ShippingAddress, Description, CreatedDate, LastModifiedDate
                    FROM Account LIMIT 10];
            String messageOne = '';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
