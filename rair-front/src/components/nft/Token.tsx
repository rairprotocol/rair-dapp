//@ts-nocheck
//unused-component
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as ethers from 'ethers';
import Swal from 'sweetalert2';

import { TMetadataType, TTokenResponseData } from '../../axios.responseTypes';
import * as ERC721Token from '../../contracts/RAIR_ERC721.json';
import { rFetch } from '../../utils/rFetch';
import setDocumentTitle from '../../utils/setTitle';
import MinterMarketplaceItem from '../marketplace/MinterMarketplaceItem';
import VideoList from '../video/videoList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
const erc721Abi = ERC721Token.default.abi;

const Token = () => {
  const params = useParams();
  const [metadata, setMetadata] = useState({ name: 'Loading...' });
  const [owner, setOwner] = useState('');
  const [name, setName] = useState('');
  const [productIndex, setProductIndex] = useState();
  const [marketData, setMarketData] = useState();

  const fetchData = useCallback(async () => {
    try {
      const { success, products } = await rFetch(
        `/api/contracts/network/${params.blockchain}/${params.contract}/offers`
      );
      const contractData = await rFetch(
        `/api/contracts/network/${params.blockchain}/${params.contract}`
      );
      if (success && contractData.success) {
        const [product] = products.filter(
          (i) =>
            i.firstTokenIndex <= params.identifier &&
            i.firstTokenIndex + i.copies >= params.identifier
        );
        if (!product) {
          return;
        }
        setProductIndex(product.collectionIndexInContract);
        setMarketData(
          product.offers.map((offer) => {
            return {
              blockchain: contractData.contract.blockchain,
              contractAddress: contractData.contract.contractAddress,
              productIndex: product.collectionIndexInContract,
              productName: product.name,
              totalCopies: product.copies,
              ...offer
            };
          })
        );
      }
    } catch (err) {
      console.error('our error', err.response.message);
    }
  }, [params.contract, params.identifier, params.blockchain]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getData = useCallback(async () => {
    const aux = await axios.get<TTokenResponseData>(
      `/api/nft/network/${
        params.blockchain
      }/${params.contract.toLowerCase()}/token/${params.identifier}`
    );
    const { result } = aux.data;
    if (result) {
      setMetadata(result.metadata);
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(0);
      const instance = new ethers.Contract(params.contract, erc721Abi, signer);
      setName(await instance.name());
      try {
        setOwner(await instance.ownerOf(params.identifier));
      } catch (err) {
        setOwner('No one!');
      }
      const meta = await (
        await axios.get<TMetadataType>(
          await instance.tokenURI(params.identifier)
        )
      ).data;
      setMetadata(meta);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', "We couldn't fetch the token's Metadata", 'error');
      setMetadata({
        name: 'No title found',
        description: 'No description found'
      });
    }
  }, [params.contract, params.identifier, params.blockchain]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    setDocumentTitle(
      `${name !== '' ? name : `${params.contract}:${params.identifier}`}`
    );
  }, [name, params]);

  return (
    <div className="col-12 row px-0 mx-0">
      <div className="col-6">
        {metadata?.image ? (
          <img
            className="w-100 h-auto"
            alt="NFT powered by Rair"
            src={metadata.image}
          />
        ) : (
          <div
            className="w-100 bg-secondary"
            style={{
              position: 'relative',
              borderRadius: '10px',
              height: '80vh'
            }}>
            <FontAwesomeIcon
              icon={faImage}
              className="h1"
              style={{ position: 'absolute', top: '50%' }}
            />
          </div>
        )}
      </div>
      <div className="col-6">
        <hr />
        <small>
          {' '}
          {params.contract}:{params.identifier} ({name}){' '}
        </small>
        <br />
        <h1
          className="w-100"
          style={{
            textShadow: '5px 0 20px white, -5px 0 20px white',
            color: 'black'
          }}>
          {' '}
          {metadata ? metadata.name : 'No metadata available'}{' '}
        </h1>
        <small> Owned by: {owner} </small>
        <br />
        <hr className="mb-5" />
        {metadata && (
          <>
            <small> {metadata.description} </small>
            <br />
            {metadata.attributes && (
              <>
                <h5 className="w-100 mt-5">Attributes</h5>
                <div className="col-12 row px-0 mx-0">
                  {Object.keys(metadata.attributes).map((item, index) => {
                    let itm = metadata.attributes[item];
                    //console.log(Object.keys(metadata.attributes[item]))
                    if (itm.trait_type === undefined) {
                      if (Object.keys(metadata.attributes[item]).length === 1) {
                        itm = {
                          trait_type: item,
                          value: metadata.attributes[item]
                        };
                      }
                      itm = {
                        trait_type: item,
                        value: metadata.attributes[item]
                      };
                    }
                    return (
                      <div key={index} className="col-4 px-1 my-2">
                        <div
                          style={{
                            overflowX: 'hidden',
                            backgroundColor: '#77F9',
                            borderRadius: '10px',
                            border: 'solid blue 1px',
                            height: '5vh'
                          }}
                          className="w-100 h-100 py-auto">
                          {itm.trait_type === 'External URL' ? (
                            <a href={itm.value} style={{ color: 'inherit' }}>
                              {itm.value}
                            </a>
                          ) : (
                            <b>{itm.value}</b>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {metadata.features && (
              <>
                <h5 className="w-100 mt-5">Features</h5>
                <div className="col-12 row px-0 mx-0">
                  {metadata.features.map((item, index) => {
                    const itm = item.split(':');
                    //console.log(Object.keys(metadata.attributes[item]))
                    return (
                      <div key={index} className="col-4 my-2">
                        <div
                          style={{
                            backgroundColor: '#F77A',
                            borderRadius: '10px',
                            border: 'solid red 1px',
                            height: '5vh'
                          }}
                          className="w-100 h-100 py-auto">
                          {itm[0]}: <b>{itm[1]}</b>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {metadata.image && (
              <div className="col-12">
                <button
                  disabled
                  className="btn btn-primary"
                  id="button_buy_token">
                  Buy
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="row">
        <div className="col-12 row px-0 mx-0">
          <h1>Associated Files</h1>
          {productIndex !== undefined && (
            <VideoList
              responseLabel="files"
              endpoint={`/api/nft/${params.blockchain}/${params.contract}/${productIndex}/files/${params.identifier}`}
            />
          )}
        </div>
        <hr />
        <h1>On the Marketplace</h1>
        <div className="col-12 row px-0 mx-0">
          {marketData &&
            marketData.map((item, index) => {
              return (
                <MinterMarketplaceItem item={item} index={index} key={index} />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Token;
