import * as types from './types';

import headerLogoBlack from '../../images/RAIR-Tech-Logo-POWERED BY-BLACK-2021.png';
import headerLogoWhite from '../../images/RAIR-Tech-Logo-POWERED BY-WHITE-2021.png';

import bgLogoBlack from '../../images/BlackBg.png';
import bgLogoWhite from '../../images/ClayBg.png';



const InitialState = {
	primaryColor: 'rhyno',
	headerLogo: headerLogoBlack,
	textColor: 'black',
	backgroundImage: bgLogoWhite,
	backgroundImageEffect: {backgroundBlendMode: undefined}
};

export default function userStore(state = InitialState, action) {
	switch (action.type) {
		case types.SET_COLOR_SCHEME:
			return {
				...state,
				primaryColor: action.payload,
				headerLogo: action.payload === 'rhyno' ? headerLogoBlack : headerLogoWhite,
				textColor: action.payload === 'rhyno' ? 'black' : 'white',
				backgroundImage: action.payload === 'rhyno' ?  bgLogoWhite : bgLogoBlack,
				backgroundImageEffect: {backgroundBlendMode: action.payload === 'rhyno' ?  undefined : 'lighten'}
			};
		default:
			return state;
	}
}
