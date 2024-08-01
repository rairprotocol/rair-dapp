// @ts-nocheck
//unused-component
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rFetch } from '../../utils/rFetch';
import setDocumentTitle from '../../utils/setTitle';

const MyNFTs = () => {
  const params = useParams();

  const [creator, setCreator] = useState('');
  const [contractName, setContractName] = useState('');
  const [contractNetwork, setContractNetwork] = useState('');

  const [productName, setProductName] = useState('');
  const [startingToken, setStartingToken] = useState(0);
  const [endingToken, setEndingToken] = useState(0);
  const [soldCopies, setSoldCopies] = useState(0);

  const [tokenData, setTokenData] = useState([]);

  const getData = useCallback(async () => {
    const contractData = await rFetch(
      `/api/contracts/network/${params.blockchain}/${params.contract}`
    );
    if (contractData.success) {
      setCreator(contractData.contract.user);
      setContractName(contractData.contract.title);
      setContractNetwork(contractData.contract.blockchain);
    }

    const productsData = await rFetch(
      `/api/contracts/network/${params.blockchain}/${params.contract}/products`
    );
    if (productsData.success) {
      const product = productsData.products.find(
        (i) => i.collectionIndexInContract === Number(params.product)
      );
      if (product) {
        setProductName(product.name);
        setStartingToken(product.firstTokenIndex);
        setEndingToken(product.firstTokenIndex + product.copies);
        setSoldCopies(product.soldCopies);
      }
    }

    const tokenData = await rFetch(
      `/api/nft/network/${params.blockchain}/${params.contract}/${params.product}`
    );
    if (tokenData.success) {
      setTokenData(
        tokenData?.result?.tokens?.map((item) => ({
          tokenIndex: item.uniqueIndexInContract,
          name: item.metadata?.name,
          image: item.metadata?.image
        }))
      );
    }
  }, [params.contract, params.product, params.blockchain]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    setDocumentTitle(
      `${
        productName !== ''
          ? productName
          : `${params.contract}:${params.product}`
      }`
    );
  }, [productName, params]);

  return (
    <div className="col-12">
      <br />
      <div className="row px-0 mx-0 w-100">
        <h3> {productName} </h3>
        <div className="col-12 col-md-6">
          <small>
            From contract: <b>{contractName}</b>
            <br />
            From network: <b>{contractNetwork}</b>
            <br />
            Created by: <b>{creator}</b>
          </small>{' '}
          <br />
        </div>
        <div className="col-12 col-md-6">
          Range from {startingToken} to {endingToken} <br />
          {endingToken - startingToken - soldCopies} tokens up for minting!
          <br />
        </div>
        <progress
          max={endingToken - startingToken}
          value={soldCopies}
          className="col-12"
          style={{ height: '5vh' }}
        />
      </div>
      <div className="row w-100 mx-0 px-0">
        {tokenData?.map(({ tokenIndex, image, name }, index) => {
          return (
            <Link
              key={index}
              className="col-3 p-1"
              to={`/token/${params.blockchain}/${params.contract}/${tokenIndex}`}
              style={{
                height: '20vh',
                border: 'none',
                color: 'inherit',
                textDecoration: 'none'
              }}>
              <div
                className="w-100 h-100 bg-white"
                style={{ borderRadius: '10px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '2px', left: '2px' }}>
                  #{tokenIndex - startingToken}
                </div>
                <div
                  style={{
                    textShadow: '0 0 black',
                    position: 'absolute',
                    bottom: '2px'
                  }}>
                  <small>{name}</small>
                </div>
                <div
                  className="w-100 h-100 text-center"
                  style={{
                    backgroundColor: 'gray',
                    backgroundImage: `url(${image})`,
                    borderRadius: '16px',
                    backgroundPosition: 'center',
                    backgroundSize: '100% auto',
                    backgroundRepeat: 'no-repeat'
                  }}>
                  {!image && <FontAwesomeIcon icon={faImage} className="h1" />}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MyNFTs;
