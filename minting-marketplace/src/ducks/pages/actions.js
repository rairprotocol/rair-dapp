import * as types from './types';

const getCurrentPage = ( payload ) => ({
    type: types.GET_CURRENT_PAGE_START,
    payload: { payload },
});
const getCurrentPageEnd = ( ) => ({
    type: types.GET_CURRENT_PAGE_END,
});

// const getCurrentPageEnd = ( ) => ({
//     type: types.GET_CURRENT_PAGE_COMPLETE
// })

export { getCurrentPage, getCurrentPageEnd }