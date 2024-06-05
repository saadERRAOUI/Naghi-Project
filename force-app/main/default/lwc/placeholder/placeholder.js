import { LightningElement, api } from 'lwc';

/** Static Resources. */
import BIKE_ASSETS_URL from '@salesforce/resourceUrl/naghi_logo';


export default class Placeholder extends LightningElement {
    @api message;

    /** Url for bike logo. */
    logoUrl = `${BIKE_ASSETS_URL}`;
}
