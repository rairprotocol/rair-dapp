import * as types from './types';

import headerLogoBlack from '../../images/RAIR-Tech-Logo-POWERED BY-BLACK-2021.png';
import headerLogoWhite from '../../images/RAIR-Tech-Logo-POWERED BY-WHITE-2021.png';

import bgLogoBlack from '../../images/BlackBg.png';
import bgLogoWhite from '../../images/ClayBg.png';

const schemes = {
	'rhyno': {
		primaryColor: 'rhyno',
		secondaryColor: 'charcoal',
		headerLogo: headerLogoBlack,
		textColor: 'black',
		backgroundImage: bgLogoWhite,
		backgroundImageEffect: {backgroundBlendMode: undefined}
	},
	'charcoal': {
		primaryColor: 'charcoal',
		secondaryColor: 'rhyno',
		headerLogo: headerLogoWhite,
		textColor: 'white',
		backgroundImage: bgLogoBlack,
		backgroundImageEffect: {backgroundBlendMode: 'lighten'}
	}
}

const InitialState = schemes[localStorage.colorScheme ? localStorage.colorScheme : 'rhyno']; 

export default function colorStore(state = InitialState, action) {
	switch (action.type) {
		case types.SET_COLOR_SCHEME:
			localStorage.setItem('colorScheme', action.payload);
			return {
				...state,
				...(schemes[action.payload])
			};
		default:
			return state;
	}
}
