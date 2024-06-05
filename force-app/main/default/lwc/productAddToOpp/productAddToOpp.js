import { LightningElement, api } from 'lwc';

export default class ProductAddToOpp extends LightningElement {

    @api product;
    @api accountRecord;
    @api opportunityRecord;

    selectable = false;
    accountId;
    qty = 1;

    get filterOpportunity() {
        if (this.accountId)
        {
            return ({
                criteria : [
                    {
                      fieldPath: "AccountId",
                      operator: "eq",
                      value: this.accountId
                    }
                ]
            });
        }
        return  ({ criteria : [] });
    }

    connectedCallback() {
        console.log('account', JSON.stringify(this.accountRecord));
        console.log('opportunity', JSON.stringify(this.opportunityRecord));
    }

    get isCalledFromRecordPage() {
        return this.accountRecord && this.opportunityRecord;
    }

    get accountRelated() {
        return this.accountRecord;
    }

    get oppRelated() {
        return this.opportunityRecord;
    }

    handleAccountValueChange(event) {
        this.accountId = event.detail.recordId;
    }

    handleOppIdChange(event) {
        this.oppId = event.detail.recordId;
    }

    handleCancelModal(){
        console.log('account', JSON.stringify(this.accountRecord));
        console.log('opportunity', JSON.stringify(this.opportunityRecord));
        this.dispatchEvent(new CustomEvent('close'));
    }
    
    handleQtyChange(event) {
        this.qty = event.detail.value;
    }

    handleSubmitSave() {
        this.dispatchEvent(new CustomEvent('saveprod', {
            detail : {
                oppId : this.oppId,
                prod : this.product,
                qty : this.qty
            }
        }));
    }
}