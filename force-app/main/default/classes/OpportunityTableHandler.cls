public with sharing class OpportunityTableHandler {
    public OpportunityTableHandler() {

    }

    @AuraEnabled(cacheable = true)
    public static List<Opportunity> findOpportunities(){
        try {
            return [SELECT Id, Name, StageName, AccountId, Amount, CloseDate, Account.Name FROM Opportunity Order By Amount DESC LIMIT 10];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
