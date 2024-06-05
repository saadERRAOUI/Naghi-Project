import { LightningElement, wire } from 'lwc';

// Lightning Message Service and a message channel
import { NavigationMixin } from 'lightning/navigation';
import { subscribe, MessageContext } from 'lightning/messageService';
import PRODUCT_SELECTED_MESSAGE from '@salesforce/messageChannel/ProductSelected__c';

// Utils to extract field values
import { getFieldValue } from 'lightning/uiRecordApi';

// Product__c Schema
import PRODUCT_OBJECT from '@salesforce/schema/Product2';
import NAME_FIELD from '@salesforce/schema/Product2.Name';
import PICTURE_URL_FIELD from '@salesforce/schema/Product2.Image_URL__c';
import CATEGORY_FIELD from '@salesforce/schema/Product2.Brand__c';
import LEVEL_FIELD from '@salesforce/schema/Product2.Product_Model__c';
import MSRP_FIELD from '@salesforce/schema/Product2.Item_MSRP__c';
import BATTERY_FIELD from '@salesforce/schema/Product2.ModelYear';
import CHARGER_FIELD from '@salesforce/schema/Product2.Number_of_Seats__c';
import MOTOR_FIELD from '@salesforce/schema/Product2.Product_SKU__c';
import MATERIAL_FIELD from '@salesforce/schema/Product2.Number_of_Doors__c';
import FOPK_FIELD from '@salesforce/schema/Product2.Number_of_Gears__c';
import FRONT_BRAKES_FIELD from '@salesforce/schema/Product2.Number_of_Cylinders__c';
import REAR_BRAKES_FIELD from '@salesforce/schema/Product2.Fiscal_Power__c';

/**
 * Component to display details of a Product__c.
 */
export default class ProductCard extends NavigationMixin(LightningElement) {
    // Exposing fields to make them available in the template
    categoryField = CATEGORY_FIELD;
    levelField = LEVEL_FIELD;
    msrpField = MSRP_FIELD;
    batteryField = BATTERY_FIELD;
    chargerField = CHARGER_FIELD;
    motorField = MOTOR_FIELD;
    materialField = MATERIAL_FIELD;
    forkField = FOPK_FIELD;
    frontBrakesField = FRONT_BRAKES_FIELD;
    rearBrakesField = REAR_BRAKES_FIELD;

    // Id of Product__c to display
    recordId;

    // Product fields displayed with specific format
    productName;
    productPictureUrl;

    /** Load context for Lightning Messaging Service */
    @wire(MessageContext) messageContext;

    /** Subscription for ProductSelected Lightning message */
    productSelectionSubscription;

    connectedCallback() {
        // Subscribe to ProductSelected message
        this.productSelectionSubscription = subscribe(
            this.messageContext,
            PRODUCT_SELECTED_MESSAGE,
            (message) => this.handleProductSelected(message)
        );
    }

    handleRecordLoaded(event) {
        const { records } = event.detail;
        const recordData = records[this.recordId];
        this.productName = getFieldValue(recordData, NAME_FIELD);
    }

    /**
     * Handler for when a product is selected. When `this.recordId` changes, the
     * lightning-record-view-form component will detect the change and provision new data.
     */
    handleProductSelected(message) {
        this.recordId = message.productId;
        this.productPictureUrl = message.productUrl;
    }

    handleNavigateToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: PRODUCT_OBJECT.objectApiName,
                actionName: 'view'
            }
        });
    }
}
