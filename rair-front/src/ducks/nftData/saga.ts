import axios, { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { getNftListTotal, getNftListTotalClear } from './action';
import { TParamsNftDataProps } from './nftData.types';
import * as types from './types';

import { TContract, TGetFullContracts } from '../../axios.responseTypes';

export function* setNftDataContract({ params }: TParamsNftDataProps) {
  getNftListTotalClear();

  try {
    const { data }: AxiosResponse<TGetFullContracts> = yield call(
      axios.get,
      `/api/contracts/full?itemsPerPage=${params.itemsPerPage}&pageNum=${params.currentPage}` +
        `${params.blockchain ? '&blockchain=' + params.blockchain : ''}` +
        `${
          params.category && params.category !== undefined
            ? params.category
            : ''
        }` +
        `${
          params.contractTitle ? '&contractTitle=' + params.contractTitle : ''
        }`
    );

    if (data.success) {
      const covers = data.contracts.map((item: TContract) => ({
        id: item._id,
        productId: item.products?._id,
        blockchain: item.blockchain,
        collectionIndexInContract: item.products.collectionIndexInContract,
        contract: item.contractAddress,
        cover: item.products.cover,
        title: item.title,
        name: item.products.name,
        user: item.user,
        userData: item.userData,
        copiesProduct: item.products.copies,
        offerData: item.products.offers?.map((elem) => ({
          price: elem.price,
          offerName: elem.offerName,
          offerIndex: elem.offerIndex,
          productNumber: elem.product
        }))
      }));
      yield put({ type: types.GET_NFTLIST_COMPLETE, nftList: covers });
      yield put(getNftListTotal(data.totalNumber));
    }
  } catch (error) {
    yield put({ type: types.GET_NFT_DATA_ERROR, errorMessage: 'error' });
  }
}

export function* sagaNftData() {
  yield takeLatest(types.GET_NFTLIST_START, setNftDataContract);
}
