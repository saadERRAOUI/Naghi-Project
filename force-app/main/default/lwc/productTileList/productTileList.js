import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

// Lightning Message Service and message channels
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/ProductsFiltered__c';
import PRODUCT_SELECTED_MESSAGE from '@salesforce/messageChannel/ProductSelected__c';

// getProducts() method in ProductController Apex class
import getProducts from '@salesforce/apex/ProductController.getProducts';
import createOpportunityLineItem from '@salesforce/apex/OpportunityController.createOpportunityLineItem';

/**
 * Container component that loads and displays a list of Product__c records.
 */
export default class ProductTileList extends LightningElement {
    /**
     * Whether to display the search bar.
     */
    @api searchBarIsVisible = false;

    /**
     * Whether the product tiles are draggable.
     */
    @api tilesAreDraggable = false;

    /** Current page in the product list. */
    pageNumber = 1;

    /** The number of items on a page. */
    pageSize;

    /** The total number of items matching the selection. */
    totalItemCount = 0;

    /** JSON.stringified version of filters to pass to apex */
    filters = {};

    /** Load context for Lightning Messaging Service */
    @wire(MessageContext) messageContext;

    /** Subscription for ProductsFiltered Lightning message */
    productFilterSubscription;

    /** Show product add to Opp modal flag */
    showAddProdOppModal = false;
    productToAdd;
    selectable = true;
    /**
     * Load the list of available products.
     */
    @wire(getProducts, { filters: '$filters', pageNumber: '$pageNumber' })
    products;

    connectedCallback() {
        // Subscribe to ProductsFiltered message
        this.productFilterSubscription = subscribe(
            this.messageContext,
            PRODUCTS_FILTERED_MESSAGE,
            (message) => this.handleFilterChange(message)
        );
    }

    handleProductSelected(event) {
        // Published ProductSelected message
        publish(this.messageContext, PRODUCT_SELECTED_MESSAGE, {
            productId: event.detail.productId,
            productUrl : event.detail.productUrl
        });
    }

    handleSearchKeyChange(event) {
        this.filters = {
            searchKey: event.target.value.toLowerCase()
        };
        this.pageNumber = 1;
    }

    handleFilterChange(message) {
        this.filters = { ...message.filters };
        this.pageNumber = 1;
    }

    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
    }

    handleShowAddToOppModal(event) {
        this.showAddProdOppModal = true;
        this.productToAdd = event.detail.product;
    }

    handleCloseModal() {
        this.showAddProdOppModal = false;
    }

    handleSaveModal(event) {
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
        }).finally(()=> {
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
