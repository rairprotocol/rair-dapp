import { BigNumber } from 'ethers';

export function getRGBValue(
  diamond: boolean,
  offer: string | undefined,
  offerData: any[] | undefined,
  indexId: number | string
): string {
  let rgbValue = '';

  if (diamond) {
    if (
      offerData &&
      offerData[0] &&
      BigNumber.from(indexId).gte(offerData[0].range[0]) &&
      BigNumber.from(indexId).lte(offerData[0].range[1])
    ) {
      rgbValue = 'rgb(232,130,213)';
    } else if (
      offerData &&
      offerData[1] &&
      BigNumber.from(indexId).gte(offerData[1].range[0]) &&
      BigNumber.from(indexId).lte(offerData[1].range[1])
    ) {
      rgbValue = 'rgb(114,91,219)';
    } else if (
      offerData &&
      offerData.length > 1 &&
      offerData[2] &&
      BigNumber.from(indexId).gte(offerData[2].range[0]) &&
      BigNumber.from(indexId).lte(offerData[2].range[1])
    ) {
      rgbValue = 'rgb(25,167,246)';
    }
  } else {
    if (offer === '0') {
      rgbValue = 'rgb(232,130,213)';
    } else if (offer === '1') {
      rgbValue = 'rgb(114,91,219)';
    } else {
      rgbValue = 'rgb(25,167,246)';
    }
  }

  return rgbValue;
}
