import { createSlice } from '@reduxjs/toolkit'

export const web3Slice = createSlice({
  name: 'web3',
  initialState: {
    signer: undefined,
    provider: undefined,
    chainId: undefined,
  },
  reducers: {
    loadSigner: (state, action) => {
      state.signer = action.payload;
    },
    loadProvider: (state, action) => {
      state.provider = action.payload;
    },
    loadChainId: (state, action) => {
      state.chainId = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { loadSigner, loadProvider, loadChainId } = web3Slice.actions;

export default web3Slice.reducer