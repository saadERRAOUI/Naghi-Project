import { LightningElement, api } from 'lwc';

/**
 * A presentation component to display a Product__c sObject. The provided
 * Product__c data must contain all fields used by this component.
 */
export default class ProductTile extends LightningElement {
    /** Whether the tile is draggable. */
    @api draggable;
    @api selectable;

    _product;
    /** Product__c to display. */
    @api
    get product() {
        return this._product;
    }
    set product(value) {
        this._product = value;
        this.pictureUrl = value.Image_URL__c;
        this.name = value.Name;
        this.msrp = value.Item_MSRP__c;
    }

    /** Product__c field values to display. */
    pictureUrl;
    name;
    msrp;

    handleClick() {
        const selectedEvent = new CustomEvent('selected', {
            detail: {
                productId : this.product.Id,
                productUrl: this.product.Image_URL__c
            }
        });
        this.dispatchEvent(selectedEvent);
    }

    handleDragStart(event) {
        event.dataTransfer.setData('product', JSON.stringify(this.product));
    }

    handleAddToOppProducts() {
        // console.log('[PRODUCT]', JSON.stringify(this._product));
        this.dispatchEvent(new CustomEvent('addoppprods', {
            detail : {
                product : this._product
            }
        }));
    }
}