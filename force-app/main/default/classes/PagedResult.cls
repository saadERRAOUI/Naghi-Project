/**
 * @description       : 
 * @author            : ERRAOUI Saad
 * @group             : 
 * @last modified on  : 05-23-2024
 * @last modified by  : ERRAOUI Saad
**/
public with sharing class PagedResult {
    @AuraEnabled
    public Integer pageSize { get; set; }

    @AuraEnabled
    public Integer pageNumber { get; set; }

    @AuraEnabled
    public Integer totalItemCount { get; set; }

    @AuraEnabled
    public Object[] records { get; set; }
}