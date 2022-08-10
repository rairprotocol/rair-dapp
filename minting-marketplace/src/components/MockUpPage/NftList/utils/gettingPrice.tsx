//@ts-nocheck
import { utils } from 'ethers';

export type TGettingPriceReturnType = {
  maxPrice: string;
  minPrice: string;
};

export const gettingPrice = (arr: Array<any>): TGettingPriceReturnType => {
  if (Array.isArray(arr) && arr.length) {
    const minPrice = function arrayMin(arr) {
      let len = arr.length,
        min = Infinity;
      while (len--) {
        if (arr[len] < min) {
          min = arr[len];
        }
      }
      return utils.formatEther(BigInt(min)).toString();
    };

    const maxPrice = function arrayMax(arr) {
      let len = arr.length,
        max = -Infinity;
      while (len--) {
        if (arr[len] > max) {
          max = arr[len];
        }
      }
      return utils.formatEther(BigInt(max)).toString();
    };

    return {
      maxPrice: maxPrice(arr),
      minPrice: minPrice(arr)
    };
  }
};
