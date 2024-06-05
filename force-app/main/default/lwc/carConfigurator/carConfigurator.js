import { LightningElement, wire } from 'lwc';

import { publish, MessageContext } from 'lightning/messageService';
import CONFIGURATION_SUMMARY_MESSAGE from '@salesforce/messageChannel/ConfigurationSummary__c';

const BASE_SOURCE = "https://build.ford.com/dig/Lincoln/Navigator/2024/HD-TILE-ACC%5BEXTBCK%5D/Image%5B%7CLincoln%7CNavigator%7C2024%7C1%7C1.%7C100A...PUM...89N.STD.65P.21C.NAV.64J.4X4.%5D/EXT/5/vehicle.png";

const EXTERIOR_COLORS = [
    {
        label: 'Infinite Black Metallic',
        code: 'white',
        price: '0 $',
        className: 'slds-visual-picker__figure slds-visual-picker__text slds-align_absolute-center color-option black',
        selected : true,
        id: "visual-picker-91",
        url : 'PUM'
    },
    {
        label: 'Starlight Gray Metallic',
        code: 'black',
        price: '1000 $',
        className: 'slds-visual-picker__figure slds-visual-picker__text slds-align_absolute-center color-option blue',
        selected : false,
        id: "visual-picker-92",
        url : 'PHY'
    },
    {
        label: 'Silver Radiance Metallic',
        code: 'red',
        price: '2000 $',
        className: 'slds-visual-picker__figure slds-visual-picker__text slds-align_absolute-center color-option white',
        selected : false,
        id: "visual-picker-93",
        url : 'PJS'
    },
    {
        label: 'Ceramic Pearl Metallic',
        code: 'blue',
        price: '3000 $',
        className: 'slds-visual-picker__figure slds-visual-picker__text slds-align_absolute-center color-option green',
        selected : false,
        id: 'visual-picker-94',
        url : 'PGS'
    },
    {
        label: 'Pristine White Metallic',
        code: 'green',
        price: '1800 $',
        className: 'slds-visual-picker__figure slds-visual-picker__text slds-align_absolute-center color-option red',
        selected : false,
        id: 'visual-picker-95',
        url : 'PAZ'
    },
    {
        label: 'Diamond Red Metallic Tinted Clearcoat',
        code: 'tan',
        price: '750 $',
        className: 'slds-visual-picker__figure slds-visual-picker__text slds-align_absolute-center color-option tan',
        selected : false,
        id: 'visual-picker-96',
        url : 'PC9'
    }
];

const PACKAGES = [
    {
        label : 'Premiere',
        details : 'Premiere Features Include : ',
        id : 'visual-picker-97',
        selected : true,
        price : '27 000 $',
        disabled : false
    },
    {
        label : 'Navigator Plus Exterior Package',
        details : 'package Features Include : ',
        id : 'visual-picker-98',
        price : '31 000 $',
        selected : false,
        disabled : false
    },
    {
        label : 'Navigator Plus Exterior Package S',
        details : 'package Features Include : ',
        price : '36 000 $',
        id : 'visual-picker-99',
        selected : false,
        disabled : true
    }
];

const WHEELS = [
    {
        label : '20” 12-Spoke Bright Machined Aluminum Wheel with Painted Pockets',
        id : 'visual-picker-105',
        selected : true,
        price : '120 $',
        url : 'https://shop.lincoln.com/content/dam/vdm_ford/live/en_us/lincoln/nameplate/navigator/2024/part/wheeltype/d2fb2/D2FB2_64B_wheeltype-20inch12spoke_320x320.jpg'
    },
    {
        label : '22" Bright Machined Aluminum Wheels with Premium Painted Pockets',
        id : 'visual-picker-106',
        selected : false,
        price : '200 $',
        url : 'https://shop.lincoln.com/content/dam/vdm_ford/live/en_us/lincoln/nameplate/navigator/2024/part/wheeltype/d2hbj/D2HBJ_64J_wheeltype_22inch-bright-machined-aluminum_320x320_.jpg'
    }
];
const INTERIOR_COLORS = [
    {
        label: 'Sandstone',
        code: 'white',
        price: '0 $',
        className: 'slds-visual-picker__figure slds-visual-picker__text slds-align_absolute-center color-option red',
        selected : true,
        id: "visual-picker-120",
        url : 'https://build.ford.com/dig/Lincoln/Navigator/2024/HD-TILE-ACC%5BINTBCK%5D/Image%5B%7CLincoln%7CNavigator%7C2024%7C1%7C1.%7C100A...PAZ...89N.STD.21C.NAV.64B.4X4.%5D/INT/1/vehicle.png'
    },
    {
        label: 'Black Onyx',
        code: 'black',
        price: '100 $',
        className: 'slds-visual-picker__figure slds-visual-picker__text slds-align_absolute-center color-option black',
        selected : false,
        id: "visual-picker-121",
        url : 'https://build.ford.com/dig/Lincoln/Navigator/2024/HD-TILE-ACC%5BINTBCK%5D/Image%5B%7CLincoln%7CNavigator%7C2024%7C1%7C1.%7C100A...PAZ...89W.STD.21C.NAV.64B.4X4.%5D/INT/1/vehicle.png'
    }
];

export default class CarConfigurator extends LightningElement {
    paintColors = EXTERIOR_COLORS;
    interirors = INTERIOR_COLORS;
    img_url = BASE_SOURCE;
    packages = PACKAGES;
    wheels = WHEELS;

    paint;
    pack;
    wheel;
    interior;

    @wire(MessageContext)messageContext;

    connectedCallback() {
        this.paint = this.paintColors.find(elem => elem.selected == true);
        this.pack = this.packages.find(elem => elem.selected == true);
        this.wheel = this.wheels.find(elem => elem.selected == true);
        this.interior = this.interirors.find(elem => elem.selected == true);
    }

    get exteriorColors() {
        return this.paintColors;
    }

    get imgUrl() {
        return this.img_url;
    }

    get packagesOffered() {
        return this.packages;
    }

    get exteriorOffered() {
        return this.wheels;
    }
    
    get interirorColors() {
        return this.interirors;
    }

    handleSelectedPaint(event) {
        let class_elem_id = event.target.dataset.class;
        this.paintColors = this.paintColors.map((elem) => {
            let _elem = {...elem};
            _elem.selected = (elem.id == class_elem_id) ? true : false;
            return _elem;
        });
        let current_selected = this.paintColors.find(elem => elem.selected == true);
        this.paint = current_selected;
        this.img_url = BASE_SOURCE;
        this.img_url = this.img_url.replace('PUM', current_selected.url);
        this.publishMessageToChannel();
    }

    handleSelectedPack(event) {
        let class_elem_id = event.target.dataset.class;
        this.packages = this.packages.map((elem) => {
            let _elem = {...elem};
            _elem.selected = (elem.id == class_elem_id) ? true : false;
            return _elem;
        });
        let current_selected = this.packages.find(elem => elem.selected == true);
        this.pack = current_selected;
        this.publishMessageToChannel();
    }

    handleSelectedExterior(event) {
        let class_elem_id = event.target.dataset.class;
        this.wheels = this.wheels.map((elem) => {
            let _elem = {...elem};
            _elem.selected = (elem.id == class_elem_id) ? true : false;
            return _elem;
        });
        let current_selected = this.wheels.find(elem => elem.selected == true);
        this.wheel = current_selected;
        this.publishMessageToChannel();
    }

    handleSelectedInterior(event) {
        let class_elem_id = event.target.dataset.class;
        this.interirors = this.interirors.map((elem) => {
            let _elem = {...elem};
            _elem.selected = (elem.id == class_elem_id) ? true : false;
            return _elem;
        });
        let current_selected = this.interirors.find(elem => elem.selected == true);
        this.img_url = current_selected.url;
        this.interior = current_selected;
        this.publishMessageToChannel();
    }

    publishMessageToChannel() {
        let payload = {
            paint : this.paint,
            pack : this.pack,
            wheel : this.wheel,
            interior : this.interior,
            img : this.img_url
        };
        publish(this.messageContext, CONFIGURATION_SUMMARY_MESSAGE, {
            product : payload
        });
    }
}