//@ts-nocheck
import styled from 'styled-components';

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

export const HomePageModalFilter = styled.div`
  padding: 24px 16px 16px 16px;
  ${(props) => {
    const bgc = props?.primaryColor?.includes('charcoal')
      ? 'charcoal-90'
      : 'rhyno-40';
    return !props.isMobileDesign
      ? `width: 280px;
   border-radius: 16px;
   border: 1px solid #4e4d4d;
   transition: 0.5s
   padding: 24px 16px 16px 16px;
   padding: 24px 16px 16px 16px;
   background-color: var(--${bgc});
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
        background-color: var(--${bgc});
        transition: 0.5s`;
  }}
`;
