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
      rgbValue = 'rgba(232,130,213, 1)';
    } else if (
      offerData &&
      offerData[1] &&
      BigNumber.from(indexId).gte(offerData[1].range[0]) &&
      BigNumber.from(indexId).lte(offerData[1].range[1])
    ) {
      rgbValue = 'rgba(114,91,219, 1)';
    } else if (
      offerData &&
      offerData.length > 1 &&
      offerData[2] &&
      BigNumber.from(indexId).gte(offerData[2].range[0]) &&
      BigNumber.from(indexId).lte(offerData[2].range[1])
    ) {
      rgbValue = 'rgba(25,167,246, 1)';
    }
  } else {
    if (offer === '0') {
      rgbValue = 'rgba(232,130,213, 1)';
    } else if (offer === '1') {
      rgbValue = 'rgba(114,91,219, 1)';
    } else {
      rgbValue = 'rgba(25,167,246, 1)';
    }
  }

  return rgbValue;
}
