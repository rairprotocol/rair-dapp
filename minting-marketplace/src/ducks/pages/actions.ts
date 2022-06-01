//@ts-nocheck
import * as types from './types';

const getCurrentPage = ( currentPage ) => ({
    type: types.GET_CURRENT_PAGE_START, currentPage
} as const);
const getCurrentPageEnd = () => ({
    type: types.GET_CURRENT_PAGE_END,
} as const);

// const getCurrentPageEnd = ( ) => ({
//     type: types.GET_CURRENT_PAGE_COMPLETE
// })

export { getCurrentPage, getCurrentPageEnd }