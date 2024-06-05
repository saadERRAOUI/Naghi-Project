import { LightningElement, api, wire } from 'lwc';

// getOpportunityProducts() method in OpportunityController Apex class
import getOpportunityProducts from '@salesforce/apex/OpportunityController.getOpportunityProducts';
/**
 * Container component that loads and displays a list of Product__c records.
 */
export default class OpportunityProductsList extends LightningElement {
    /**
     * Whether to display the search bar.
     */
    @api searchBarIsVisible = false;

    /**
     * Whether the product tiles are draggable.
     */
    @api tilesAreDraggable = false;
    @api recordId;

    /** Current page in the product list. */
    pageNumber = 1;

    /** The number of items on a page. */
    pageSize;

    /** The total number of items matching the selection. */
    totalItemCount = 0;

    /** JSON.stringified version of filters to pass to apex */
    filters = {};

    /** Show product add to Opp modal flag */
    showAddProdOppModal = false;
    productToAdd;
    selectable = false;
    /**
     * Load the list of available products.
     */
    @wire(getOpportunityProducts, { recordId: '$recordId' })
    products;

    get productsParsed() {
        if (this.products && this.products.data)
        {
            let prods = this.products.data.map(elem => {
                let _elem = {};
                for (let prop in elem) {
                    let _prop = prop;
                    if (_prop.includes('Product2.'))
                        _prop.replace('Product2.', '');
                    _elem[_prop] = elem[prop];
                }
                return _elem;
            });
            console.log('PRODS_', JSON.stringify(prods));
            return prods;
        }
        return undefined;
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
}
