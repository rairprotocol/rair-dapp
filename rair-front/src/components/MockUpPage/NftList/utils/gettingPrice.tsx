import { utils } from 'ethers';

import { TGettingPriceReturnType } from '../nftList.types';

let priceArray: TGettingPriceReturnType;

export const gettingPrice = (arr: string[]): TGettingPriceReturnType => {
  if (Array.isArray(arr) && arr.length) {
    const minPrice = function arrayMin(arr: string[]): string {
      let len = arr.length,
        min = Infinity;
      while (len--) {
        if (+arr[len] < min) {
          min = +arr[len];
        }
      }
      return utils.formatEther(BigInt(min)).toString();
    };

    const maxPrice = function arrayMax(arr: string[]): string {
      let len = arr.length,
        max = -Infinity;
      while (len--) {
        if (+arr[len] > max) {
          max = +arr[len];
        }
      }
      return utils.formatEther(BigInt(max)).toString();
    };

    priceArray = {
      maxPrice: maxPrice(arr),
      minPrice: minPrice(arr)
    };
  }
  return priceArray;
};
