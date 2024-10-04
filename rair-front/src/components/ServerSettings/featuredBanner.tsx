import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import { rFetch } from '../../utils/rFetch';
import { OptionsType } from '../common/commonTypes/InputSelectTypes.types';
import InputSelect from '../common/InputSelect';

const FeaturedBanner = ({ contractList }) => {
  const [selectedContract, setSelectedContract] = useState<string>('null');
  const [selectedProduct, setSelectedProduct] = useState<string>('null');
  const [productOptions, setProductOptions] = useState<Array<OptionsType>>([]);
  const { primaryButtonColor, textColor } = useAppSelector(
    (store) => store.colors
  );
  const { getBlockchainData, updateServerSetting } = useServerSettings();

  const { featuredCollection } = useAppSelector((store) => store.settings);

  useEffect(() => {
    if (!featuredCollection) {
      return;
    }
    setSelectedContract(featuredCollection.contract);
    setSelectedProduct(featuredCollection._id!);
  }, [featuredCollection]);

  const getProductData = useCallback(async () => {
    if (selectedContract === 'null') {
      return;
    }
    setSelectedProduct('null');
    setProductOptions([]);
    const { success, products } = await rFetch(
      `/api/contracts/${selectedContract}/products`
    );
    if (success) {
      setProductOptions(
        products.map((product) => {
          return {
            label: product.name,
            value: product._id
          };
        })
      );
    }
  }, [selectedContract]);

  useEffect(() => {
    getProductData();
  }, [getProductData]);

  return (
    <div className="col-12 px-5 my-2">
      <h3>Featured banner</h3>
      <div className="row">
        <div className="col-12 col-md-6">
          <InputSelect
            label="Contract"
            customClass="rounded-rair form-control"
            placeholder="Select a contract"
            getter={selectedContract}
            setter={setSelectedContract}
            options={contractList.map((contract) => {
              const chainData = getBlockchainData(contract.blockchain);
              return {
                label: `${contract.title} (${chainData?.symbol})`,
                value: contract._id
              };
            })}
          />
        </div>
        <div className="col-12 col-md-6">
          <InputSelect
            label="Product"
            customClass="rounded-rair form-control"
            placeholder="Select a product"
            getter={selectedProduct}
            setter={setSelectedProduct}
            options={productOptions}
          />
        </div>
      </div>
      <button
        disabled={selectedProduct === 'null' || selectedContract === 'null'}
        className="btn rair-button"
        style={{
          background: primaryButtonColor,
          color: textColor
        }}
        onClick={() => {
          if (selectedProduct !== 'null' && selectedContract !== 'null') {
            updateServerSetting({
              featuredCollection: selectedProduct
            });
          }
        }}>
        Set as Featured Banner
      </button>
    </div>
  );
};

export default FeaturedBanner;
