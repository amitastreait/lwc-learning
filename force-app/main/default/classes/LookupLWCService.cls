public with sharing class LookupLWCService {

    @AuraEnabled(cacheable = true)
    public static List<sObject> searchRecords(String searchString) {
        String likeParams = '%' + searchString + '%';
        System.System.debug('likeParams: ' + likeParams);
        String query = 'SELECT Id, Name FROM Account WHERE Name LIKE :likeParams';
        return Database.query(query);
    }
}
