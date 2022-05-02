public with sharing class LookupLWCService {
  @AuraEnabled(cacheable=true)
  public static List<sObject> searchRecords(
    String searchString,
    String ojectApiName,
    String fieldApiName
  ) {
    String likeParams = '%' + searchString + '%';
    System.System.debug('likeParams: ' + likeParams);
    String query =
      'SELECT Id, ' +
      fieldApiName +
      ' FROM ' +
      ojectApiName +
      ' WHERE ' +
      fieldApiName +
      ' LIKE :likeParams';
    return Database.query(query);
  }
}
