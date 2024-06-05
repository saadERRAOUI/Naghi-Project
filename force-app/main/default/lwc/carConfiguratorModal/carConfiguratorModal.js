import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import ACCOUNT_ID from "@salesforce/schema/Opportunity.AccountId";
import { CloseActionScreenEvent } from 'lightning/actions';

// Lightning Message Service and a message channel
import { publish, createMessageContext } from 'lightning/messageService';
import CAR_CONFIGURATOR_SUMMARY_MESSAGE from '@salesforce/messageChannel/CarConfiguratorSummary__c';

const SOURCE_TAB_NAME = 'Car_Configurator1';

export default class CarConfiguratorModal extends NavigationMixin(LightningElement) {

    @api recordId;
    tabName = SOURCE_TAB_NAME;
    accountId;

    messageContext = createMessageContext();
    @wire(getRecord, {recordId : '$recordId', fields : [ACCOUNT_ID]})opp;

    handleOpenConfigurator() {
        this.accountId = getFieldValue(this.opp.data, ACCOUNT_ID);
        this.navigateNext();
        publish(this.messageContext, CAR_CONFIGURATOR_SUMMARY_MESSAGE, {
            product : {
                opportunityId : this.recordId,
                accountId : this.accountId 
            }
        });
    }

    navigateNext() {
        this[NavigationMixin.Navigate]({
            type: "standard__navItemPage",
            attributes: {
                apiName: this.tabName,
                product : {
                    opportunityId : this.recordId,
                    accountId : this.accountId 
                }
            }
        });
      }

      closeAction() {
        this.dispatchEvent(new CloseActionScreenEvent());
     }
     
}