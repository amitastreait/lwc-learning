public with sharing class ContactListLwcService {
    public ContactListLwcService() {

    }

    @AuraEnabled(cacheable = true)
    public static List<Contact> contactList(String recordId){
        try {
            return [SELECT Id, Name, Email, Phone, AccountId, Account.Name FROM Contact WHERE AccountId != null ]; //
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string createContact(String contactData){
        try {
            Contact contact = (Contact)System.JSON.deserialize(contactData, Contact.class);
            // InputWrapper wrapper = (InputWrapper)System.JSON.deserialize(contactData, InputWrapper.class);
            insert contact;
            return contact.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable = true)
    public static string dummyMethod(){
        try {
            return helloWorld();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static string helloWorld(){
        try {
            return 'Hello World';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class InputWrapper{
        public String FirstName;
        public String LastName;
        public String Email;
        public String Phone;
        public String AccountId;
    }
}
