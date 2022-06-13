//@ts-nocheck
import * as types from './types';

const updateTokenMetadata = (
    url,
    formData
) => ({
    type: types.UPDATE_TOKEN_METADATA,
    url,
    formData

});

export { updateTokenMetadata }