/**
 * @description       : 
 * @author            : ERRAOUI Saad
 * @group             : 
 * @last modified on  : 05-26-2024
 * @last modified by  : ERRAOUI Saad
**/
public with sharing class ProductController {
    static Integer PAGE_SIZE = 9;

    public class Filters {
        @AuraEnabled
        public String searchKey { get; set; }
        @AuraEnabled
        public Decimal maxPrice { get; set; }
        @AuraEnabled
        public String[] categories { get; set; }
        @AuraEnabled
        public String[] materials { get; set; }
        @AuraEnabled
        public String[] levels { get; set; }
    }

    @AuraEnabled(Cacheable=true scope='global')
    public static PagedResult getProducts(Filters filters, Integer pageNumber) {
        String key, whereClause = '';
        Decimal maxPrice;
        String[] categories, materials, levels, criteria = new List<String>{};
        if (filters != null) {
            maxPrice = filters.maxPrice;
            materials = filters.materials;
            levels = filters.levels;
            if (!String.isEmpty(filters.searchKey)) {
                key = '%' + filters.searchKey + '%';
                criteria.add('Name LIKE :key');
            }
            if (filters.maxPrice >= 0) {
                maxPrice = filters.maxPrice;
                criteria.add('Item_MSRP__c <= :maxPrice');
            }
            if (filters.categories != null) {
                categories = filters.categories;
                criteria.add('Category__c IN :categories');
            }
            if (filters.levels != null) {
                levels = filters.levels;
                criteria.add('Brand__c IN :levels');
            }
            if (filters.materials != null) {
                materials = filters.materials;
                criteria.add('Fuel_Type__c IN :materials');
            }
            if (criteria.size() > 0) {
                whereClause = ' AND ' + String.join(criteria, ' AND ');
            }
        }
        Integer pageSize = ProductController.PAGE_SIZE;
        Integer offset = (pageNumber - 1) * pageSize;
        PagedResult result = new PagedResult();
        result.pageSize = pageSize;
        result.pageNumber = pageNumber;
        result.totalItemCount = Database.countQuery(
            'SELECT count() FROM Product2 WHERE MakeName = \'Naghi\'' + whereClause
        );
        result.records = Database.query(
            'SELECT Id, Name, Item_MSRP__c, Fuel_Type__c, Image_URL__c, Brand__c, Number_of_Cylinders__c, MakeName, Number_of_Gears__c, Number_of_Doors__c, Product_Model__c, ModelYear, Number_of_Seats__c, Product_SKU__c FROM Product2 WHERE MakeName = \'Naghi\' ' +
                whereClause +
                ' WITH SECURITY_ENFORCED' +
                ' ORDER BY Name LIMIT :pageSize OFFSET :offset'
        );
        return result;
    }

    @AuraEnabled(Cacheable=true scope='global')
    public static Product2[] getSimilarProducts(Id productId, Id familyId) {
        return [
            SELECT
                Id,
                Name,
                Image_URL__c,
                Brand__c,
                Product_Model__c,
                ModelYear,
                Number_of_Seats__c,
                Product_SKU__c,
                Number_of_Doors__c,
                Number_of_Gears__c,
                Number_of_Cylinders__c,
                Item_MSRP__c,
                Fuel_Type__c
                // MSRP__c,
                // Description__c,
                // Category__c,
                // Level__c,
                // Picture_URL__c,
                // Material__c
            FROM Product2
            WHERE Id != :productId AND MakeName = 'Naghi'
            // Product_Family__c = :familyId AND 
            WITH SECURITY_ENFORCED
        ];
    }

    @AuraEnabled(Cacheable=true scope='global')
    public static Product2 getRecordProduct(String productName){
        try {
            return [
                SELECT
                    Id,
                    Name,
                    Image_URL__c,
                    Brand__c,
                    Product_Model__c,
                    ModelYear,
                    Number_of_Seats__c,
                    Product_SKU__c,
                    Number_of_Doors__c,
                    Number_of_Gears__c,
                    Number_of_Cylinders__c,
                    Item_MSRP__c,
                    Fuel_Type__c
                FROM Product2
                WHERE Name = :productName AND MakeName = 'Naghi'
                WITH SECURITY_ENFORCED
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}