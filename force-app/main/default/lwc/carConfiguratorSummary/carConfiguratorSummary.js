import { LightningElement, wire, track, api } from 'lwc';
import { subscribe, createMessageContext } from 'lightning/messageService';
import { CurrentPageReference } from 'lightning/navigation';
import CONFIGURATION_SUMMARY_MESSAGE from '@salesforce/messageChannel/ConfigurationSummary__c';
import CAR_CONFIGURATOR_SUMMARY_MESSAGE from '@salesforce/messageChannel/CarConfiguratorSummary__c';

import { ShowToastEvent } from "lightning/platformShowToastEvent";

import getRecordProduct from '@salesforce/apex/ProductController.getRecordProduct';
import createOpportunityLineItem from '@salesforce/apex/OpportunityController.createOpportunityLineItem';

const BASE_SOURCE = "https://build.ford.com/dig/Lincoln/Navigator/2024/HD-TILE-ACC%5BEXTBCK%5D/Image%5B%7CLincoln%7CNavigator%7C2024%7C1%7C1.%7C100A...PUM...89N.STD.65P.21C.NAV.64J.4X4.%5D/EXT/5/vehicle.png";
const BASE_CAR_NAME = "LINCOLN NAVIGATOR 2023";

export default class CarConfiguratorSummary extends LightningElement {
    isLoading = false;
    img = BASE_SOURCE;
    car_name = BASE_CAR_NAME;
    showAddToOppModal = false;
    
    @track accountId;
    @track opportunityId;

    paint = {
        label: 'Infinite Black Metallic',
        price: '0 $'
    };
    pack = {
        label : 'Premiere',
        details : 'Premiere Features Include : ',
        price : '27 000 $'
    };
    wheel = {
        label : '20” 12-Spoke Bright Machined Aluminum Wheel with Painted Pockets',
        price : '120 $',
    };
    interior = {
        label: 'Sandstone',
        price: '0 $'
    };

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        console.log('page_REF', JSON.stringify(currentPageReference));
       if (currentPageReference && currentPageReference.attributes.product) {
            this.opportunityId = currentPageReference.attributes.product?.opportunityId;
            this.accountId = currentPageReference.attributes.product?.accountId;
            console.log('this_opportunityId', JSON.stringify(this.opportunityId));
            console.log('this_accountId', JSON.stringify(this.accountId));
       }
    }

    /** Load context for Lightning Messaging Service */
    messageContext = createMessageContext();

    @wire(getRecordProduct, { productName: '$car_name' }) product;

    get imgUrl() {
        return this.img;
    }

    get productInfo() {
        return this.product.data;
    }

    get account() {
        return this.accountId;
    }
    
    setAccountId(value) {
        this.accountId = value;
    }
    
    setOppId(value) {
        this.opportunityId = value;
    }
    
    get opportunity() {
        return this.opportunityId;
    }

    /** Subscription for productSelectionSubscription Lightning message */
    productSelectionSubscription;

    /** Subscription for configurationSummarySubscription Lightning message */
    configurationSummarySubscription;

    connectedCallback() {
        this.configurationSummarySubscription = subscribe(
            this.messageContext,
            CAR_CONFIGURATOR_SUMMARY_MESSAGE,
            (message) => this.handleConfiguration(message)
        );

        this.productSelectionSubscription = subscribe(
            this.messageContext,
            CONFIGURATION_SUMMARY_MESSAGE,
            (message) => this.handleConfigurationSelected(message.product)
        );
    }

    handleConfiguration(message) {
        this.setAccountId(message.product.accountId) ;
        this.setOppId(message.product.opportunityId);

    }

    handleConfigurationSelected(message) {
        this.isLoading = true;
        this.paint = message.paint;
        this.pack = message.pack;
        this.wheel = message.wheel;
        this.interior = message.interior;
        this.img = message.img;
        setTimeout(() => {
            this.isLoading = false;
        }, 3000); 
    }

    handleSubmitOppForSave() {
        this.showAddToOppModal = true;
    }

    handleCloseModal() {
        this.showAddToOppModal = false;
    }

    handleSubmitSave(event) {
        let payload = event.detail;
        createOpportunityLineItem({
            opportunityId: payload.oppId, 
            product2Id: payload.prod.Id, 
            quantity:payload.qty,
            totalPrice :payload.prod.Item_MSRP__c
        })
        .then(result => {
            this.showNotification('SUCCESS', 'Product has been added successffully to Opportunity !', 'success');
        })
        .catch(error => {
            this.showNotification('ERROR', 'Error while saving the changes !', 'error');
        }).finally(() => {
            this.handleCloseModal();
        })
    }

    showNotification(title, message, variant) {
        const evt = new ShowToastEvent({
          title: title,
          message: message,
          variant: variant,
        });
        this.dispatchEvent(evt);
    }
}