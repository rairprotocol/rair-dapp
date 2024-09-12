import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

type THomePageModalFilter = {
  primaryColor?: string;
  isMobileDesign?: boolean;
};

// export const HomePageModalFilter = styled.div((props) => {
//   const bgc = props?.primaryColor?.includes('charcoal')
//     ? 'charcoal-90'
//     : 'rhyno-40';
//   return !props.isMobileDesign
//     ? {
//         width: '280px',
//         borderRadius: '16px',
//         border: '1px solid #4e4d4d',
//         padding: '24px 16px 16px 16px',
//         backgroundColor: `var(--${bgc})`
//       }
//     : {
//         position: 'fixed',
//         border: 'none',
//         left: '0px',
//         top: '0px',
//         width: '100%',
//         height: '0px',
//         zIndex: '100',
//         padding: '0px 50px',
//         overflow: 'scroll',
//         fontSize: '20px',
//         backgroundColor: `var(--${bgc})`,
//         transition: '0.5s'
//       };
// });

//`color-mix(in srgb, ${props.primaryColor}, #888888)`

export const HomePageModalFilter = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<THomePageModalFilter>`
  @media screen and (min-width: 1100px) {
    &.filter-modal-wrapper.unlockables-tab {
      width: 384px;
    }
  }

  padding: 24px 16px 16px 16px;
  ${(props) => {
    return !props.isMobileDesign
      ? `width: 280px;
   border-radius: 16px;
   border: 1px solid #4e4d4d;
   transition: 0.5s
   padding: 24px 16px 16px 16px;
   padding: 24px 16px 16px 16px;
   background-color: ${
     props.primaryColor === '#dedede'
       ? 'var(--rhyno-40)'
       : `color-mix(in srgb, ${props.primaryColor} 40%, #888888)`
   };
   
  `
      : `
        position: fixed;
        border: none;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 0px;
        z-index: 100;
        padding: 15px 50px;
        overflow: auto;
        font-size: 20px;
        background-color: ${props.primaryColor};
        transition: 0.5s`;
  }}
`;
