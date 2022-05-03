public with sharing class LookupLWCService {
  @AuraEnabled(cacheable=true)
  public static List<sObject> searchRecords(String searchString, String ojectApiName, String fieldApiName ) {
    String likeParams = '%' + searchString + '%';
    System.System.debug('likeParams: ' + likeParams);
    String query = 'SELECT Id, ' + fieldApiName +' FROM ' +ojectApiName +' WHERE ' +fieldApiName +' LIKE :likeParams';
    if(String.isBlank(searchString)){
        query = 'SELECT Id, Name, Type, LastViewedDate FROM RecentlyViewed WHERE Type =\''+ojectApiName+'\' ORDER BY LastViewedDate DESC LIMIT 5';
    }
    return Database.query(query);
  }
}
