import { NgxUiLoaderConfig, POSITION, SPINNER, PB_DIRECTION } from 'ngx-ui-loader';

export const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    bgsPosition: POSITION.centerCenter,
    bgsSize: 40,
    bgsType: SPINNER.threeStrings,
    fgsType: SPINNER.threeStrings,
    fgsColor: '#1d5ba5',
    hasProgressBar: true,
    pbDirection: PB_DIRECTION.leftToRight,
    pbThickness: 3,
    pbColor: '#1d5ba5',
    text: 'ALISYS INTEGRADOS',
    textPosition: POSITION.centerCenter,
    textColor: '#e25744'
};
