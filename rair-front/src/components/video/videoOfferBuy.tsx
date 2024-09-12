import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { TVideoItemContractData } from './video.types';

import { useAppSelector } from '../../hooks/useReduxHooks';
import { rFetch } from '../../utils/rFetch';
import CustomButton from '../MockUpPage/utils/button/CustomButton';

const OfferBuyButton = ({ offerName, contract, product }) => {
  const [contractData, setContractData] = useState<TVideoItemContractData>();

  const navigate = useNavigate();
  const { primaryColor } = useAppSelector((store) => store.colors);

  const fetchContractData = useCallback(async () => {
    const data = await rFetch(`/api/contracts/${contract}`);
    if (data.success) {
      setContractData(data.contract);
    }
  }, [contract]);

  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]);

  return (
    <CustomButton
      text={`${contractData?.title} - ${offerName}`}
      width={'100%'}
      height={'48px'}
      textColor={primaryColor}
      onClick={() => {
        navigate(
          `/collection/${contractData?.blockchain}/${contractData?.contractAddress}/${product}/0`
        );
      }}
      margin={'0px 0px 0.35rem 0.5rem'}
      custom={false}
      background={`var(--${
        primaryColor === 'charcoal' ? 'charcoal-80' : 'charcoal-40'
      })`}
    />
  );
};

export default OfferBuyButton;
