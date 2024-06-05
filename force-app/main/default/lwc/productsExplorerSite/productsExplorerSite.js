import { LightningElement } from 'lwc';

const SOURCE_IMAGES = [
    {
        url : 'https://www.lincoln.com/is/image/content/dam/vdm_ford/live/en_us/lincoln/nameplate/navigator/2023/collections/dm/22_LCN_NAV_RES_55477.tif?croppathe=1_15x16&wid=640',
        label : 'NAVIGATOR',
        description : 'Seats up to 8'
    },
    {
        url : 'https://www.lincoln.com/is/image/content/dam/vdm_ford/live/en_us/lincoln/nameplate/aviator/2023/collections/dm/23_LCN_AVI_46454v2.tif?croppathe=1_15x16&wid=900',
        label : 'AVIATOR',
        description : 'Seats up to 7'
    },
    {
        url : 'https://www.lincoln.com/is/image/content/dam/vdm_ford/live/en_us/lincoln/nameplate/nautilus/2024/collections/dm/24_LCN_NAU_ENTRY___15-16.tif?croppathe=1_x15x16&wid=900',
        label : 'NAUTILUS',
        description : 'Seats up to 5'
    },
    {
        url : 'https://www.lincoln.com/is/image/content/dam/vdm_ford/live/en_us/lincoln/nameplate/corsair/2023/collections/dm/bl-lineup-23-corsair-nonblv2.tif?croppathe=1_15x16&wid=640',
        label : 'CORSAIR',
        description : 'Seats up to 5'
    }
];

export default class ProductsExplorerSite extends LightningElement {
    get images() {
        return (SOURCE_IMAGES);
    } 
}