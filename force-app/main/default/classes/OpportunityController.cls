/**
 * @description       : 
 * @author            : ERRAOUI Saad
 * @group             : 
 * @last modified on  : 05-26-2024
 * @last modified by  : ERRAOUI Saad
**/
public with sharing class OpportunityController {
    
    @AuraEnabled
    public static String createOpportunityLineItem(String opportunityId, String product2Id, Decimal quantity, Decimal totalPrice) {
        try {
            // Query for the default PricebookId
            Id pricebookId = [SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1].Id;

            OpportunityLineItem newOpportunityLineItem = new OpportunityLineItem();
            newOpportunityLineItem.OpportunityId = opportunityId;
            newOpportunityLineItem.Product2Id = product2Id;
            newOpportunityLineItem.TotalPrice = totalPrice;
            newOpportunityLineItem.Quantity = quantity;
            newOpportunityLineItem.PricebookEntryId = getPricebookEntryId(pricebookId, product2Id); // Get PricebookEntryId
            System.debug('## PRICEBOOK ' + getPricebookEntryId(pricebookId, product2Id));
            // You may need to set other fields of OpportunityLineItem based on your requirements
            
            // Insert the new OpportunityLineItem
            insert newOpportunityLineItem;
            
            return 'Success: OpportunityLineItem created successfully.';
        } catch(Exception e) {
            return 'Error: ' + e.getMessage();
        }
    }

    // Helper method to get PricebookEntryId based on PricebookId and Product2Id
    private static Id getPricebookEntryId(Id pricebookId, String product2Id) {
        PricebookEntry[] pricebookEntries = [SELECT Id FROM PricebookEntry WHERE Pricebook2Id = :pricebookId AND Product2Id = :product2Id LIMIT 1];
        if(pricebookEntries.isEmpty()) {
            throw new AuraHandledException('No PricebookEntry found for the specified Product2Id in the default Pricebook.');
        }
        return pricebookEntries[0].Id;
    }

    @AuraEnabled(Cacheable=true scope='global')
    public static OpportunityLineItem[] getOpportunityProducts(String recordId){
        try {
            System.debug('#### recordId: ' + recordId);
            OpportunityLineItem[] ListOppsItems = [
                SELECT
                    Id,
                    Product2.Name,
                    Product2.Image_URL__c,
                    Product2.Brand__c,
                    Product2.Product_Model__c,
                    Product2.ModelYear,
                    Product2.Number_of_Seats__c,
                    Product2.Product_SKU__c,
                    Product2.Number_of_Doors__c,
                    Product2.Number_of_Gears__c,
                    Product2.Number_of_Cylinders__c,
                    Product2.Item_MSRP__c,
                    Product2.Fuel_Type__c
                FROM OpportunityLineItem
                WHERE OpportunityId =:recordId AND Product2.MakeName = 'Naghi'
                WITH SECURITY_ENFORCED
            ];
            System.debug('#### recordId: ' + ListOppsItems);
            return (ListOppsItems);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}