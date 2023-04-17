import { configureStore } from '@reduxjs/toolkit'
import web3Slice from './web3Slice';

export default configureStore({
  reducer: {
    web3: web3Slice,
  },
  middleware: ((getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false, // Prevents issues with the Signer class from Ethers
  }))
})