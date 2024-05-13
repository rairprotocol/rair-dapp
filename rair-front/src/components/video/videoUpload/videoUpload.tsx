/* eslint-disable no-console */
//@ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Swal from 'sweetalert2';

import AdminView from './adminView';

import {
  // TAuthGetChallengeResponse,
  TUploadSocket
} from '../../../axios.responseTypes';
import { getRandomValues } from '../../../utils/getRandomValues';
import { rFetch } from '../../../utils/rFetch';
import BlockChainSwitcher from '../../adminViews/BlockchainSwitcher';
import ServerSettings from '../../adminViews/ServerSettings';
import InputField from '../../common/InputField';
import InputSelect from '../../common/InputSelect';

import './videoUpload.css';
// const UPLOAD_PROGRESS_HOST = import.meta.env.VITE_UPLOAD_PROGRESS_HOST;

//TODO: alternative env
// const hostname = window.location.hostname;
// console.log(hostname, 'hostname');

// Admin view to upload media to the server
const FileUpload = ({ /*address,*/ primaryColor, textColor }) => {
  const [fullContractData, setFullContractData] = useState({});
  // const [contractID, setContractID] = useState('null');
  const [selectedOffers, setSelectedOffers] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(undefined);
  const [uploading, setUploading] = useState(false);
  // const [adminNFT, setAdminNFT] = useState('');
  const [thisSessionId, setThisSessionId] = useState('');
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState(0);
  const [message, setMessage] = useState(0);
  const [, /*part,*/ setPart] = useState(0);
  const [, setVPV] = useState();
  const [product, setProduct] = useState('null');
  const [productOptions, setProductOptions] = useState();
  const [offersOptions, setOffersOptions] = useState();
  const [offer, setOffer] = useState('null');
  const [, /*countOfSelects*/ setCountOfSelects] = useState(0);
  const [, /*selects*/ setSelects] = useState([]);
  const [selectsData /*setSelectsData*/] = useState({});
  const [contract, setContract] = useState('null');
  const [category, setCategory] = useState('null');
  const [storage, setStorage] = useState('null');
  const [contractOptions, setContractOptions] = useState([]);
  const [offersData /*setOffersData*/] = useState([]);
  const [, /*collectionIndex*/ setCollectionIndex] = useState({});
  const [, /*offersIndex,*/ setOffersIndex] = useState([]);
  const [, /*networkId*/ setNetworkId] = useState('');

  const [categoryArray, setCategoryArray] = useState([]);
  const getCategories = useCallback(async () => {
    const { success, categories } = await rFetch('/api/files/categories');
    if (success) {
      setCategoryArray(
        categories.map((item) => {
          return { label: item.name, value: item.name };
        })
      );
    }
  }, []);

  // const currentUserAddress = useSelector<RootState, string>(
  //   (state) => state.contractStore.currentUserAddress
  // );

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const getFullContractData = useCallback(async () => {
    const request = await rFetch(
      '/api/contracts/full?itemsPerPage=5&hidden=true'
    );
    if (request.success) {
      const { success, contracts } = await rFetch(
        `/api/contracts/full?itemsPerPage=${
          request.totalNumber || '5'
        }&hidden=true`
      );
      if (success) {
        const mapping = {};
        const options = [];
        contracts.forEach((item) => {
          const offerMapping = {};
          item.products.offers.forEach((offer) => {
            offerMapping[
              offer[item.diamond ? 'diamondRangeIndex' : 'offerIndex']
            ] = offer;
          });
          item.products.offers = offerMapping;

          if (mapping[item._id] !== undefined) {
            mapping[item._id].products[
              item.products.collectionIndexInContract
            ] = item.products;
          } else {
            const productMapping = {};
            productMapping[item.products.collectionIndexInContract] =
              item.products;
            item.products = productMapping;
            mapping[item._id] = item;
            options.push({
              label: `${item.title} (${
                item.external
                  ? 'External'
                  : item.diamond
                    ? 'Diamond'
                    : 'Classic'
              })`,
              value: item._id,
              blockSync: item.blockSync,
              blockView: item.blockView
            });
          }
        });

        setFullContractData(mapping);
        setContractOptions(
          options.sort((a, b) =>
            a.label.toLowerCase() >= b.label.toLowerCase() ? 1 : -1
          )
        );
      }
    }
  }, []);

  useEffect(() => {
    getFullContractData();
  }, [getFullContractData]);

  const getProduct = useCallback(async () => {
    setProductOptions(
      Object.keys(fullContractData[contract].products).map((key) => {
        return {
          label: fullContractData[contract].products[key].name,
          value:
            fullContractData[contract].products[key].collectionIndexInContract
        };
      })
    );
  }, [contract, fullContractData]);

  useEffect(() => {
    if (contract !== 'null') {
      setProduct('null');
      getProduct();
    }
  }, [contract, getProduct]);

  const getOffers = useCallback(async () => {
    setOffersOptions(
      Object.keys(fullContractData[contract].products[product].offers).map(
        (key) => {
          return {
            label:
              fullContractData[contract].products[product].offers[key]
                .offerName,
            value:
              fullContractData[contract].products[product].offers[key][
                fullContractData[contract].diamond
                  ? 'diamondRangeIndex'
                  : 'offerIndex'
              ]
          };
        }
      )
    );
  }, [contract, fullContractData, product]);

  const isOffersGet = useCallback(async () => {
    if (product !== 'null') {
      setSelectedOffers(['null']);
      const offers = await getOffers();
      setCountOfSelects(offers?.length - 1);
    }
  }, [product, getOffers]);

  useEffect(() => {
    isOffersGet();
  }, [isOffersGet]);

  useEffect(() => {
    if (selectsData) {
      Object.keys(selectsData).forEach((names) => {
        offersData.forEach((offers) => {
          if (selectsData[names] === offers.offerName) {
            setOffersIndex((prev) => [...prev, offers.offerIndex]);
          }
        });
      });
    }
  }, [selectsData, offer, offersData, setOffersIndex]);

  const goSession = useCallback(async () => {
    const sessionId = getRandomValues().toString(36).slice(2, 9);
    setThisSessionId(sessionId);
    const so = io();
    // const so = io(`http://localhost:5000`, { transports: ["websocket"] });
    setSocket(so);
    // so.on("connect", data => {
    //   console.log('Connected !');
    // });
    so.emit('init', sessionId);

    return () => {
      so.emit('end', sessionId);
    };
  }, []);

  useEffect(() => {
    goSession();
  }, [goSession]);

  if (socket) {
    socket.removeListener('uploadProgress');
    socket.on('uploadProgress', (data) => {
      if (data.part) {
        setPart(getRandomValues() / 10);
      }

      if (data.done) {
        setStatus(data.done);
      }

      if (data.part) {
        setStatus(getRandomValues() / 10);
      }

      setMessage(data.message);

      if (data.last) {
        socket.emit('end', thisSessionId);
        Swal.fire('Success', 'Your file is being processed', 'success');
        setUploading(false);
        setStatus(0);
        setTitle('');
        setDescription('');
        setVideo(undefined);
        setOffersIndex([]);
        setCollectionIndex({});
        setCategory('null');
        setStorage('null');
        setContractOptions([]);
        setProductOptions();
        setOffersOptions();
        document.getElementById('media_id').value = '';
        setMessage(0);
        getFullContractData();
      }
    });
  }

  // const handleChangeSelects = (value, name) => {
  //   setSelectsData({
  //     ...selectsData,
  //     [name]: value
  //   });
  // };

  const createSelects = () => {
    const aux = [...selectedOffers];
    aux.push('null');
    setSelectedOffers(aux);
  };

  const handleOffer = (key, value) => {
    const aux = [...selectedOffers];
    aux[key] = value;
    setSelectedOffers(aux);
  };

  const reusableStyle = {
    backgroundColor: primaryColor,
    color: `var(--${textColor})`
  };

  const verifyOffer = () => {
    return selectedOffers.reduce((prev, current) => {
      return prev && current === 'null';
    }, true);
  };

  return (
    <>
      <BlockChainSwitcher />
      <ServerSettings {...{ fullContractData }} />
      <hr />
      <div className="new">
        <AdminView
          primaryColor={primaryColor}
          contractOptions={contractOptions}
          reusableStyle={reusableStyle}
          contract={contract}
          getFullContractData={getFullContractData}
        />
      </div>
    </>
  );
};

export default FileUpload;
