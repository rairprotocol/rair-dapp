//@ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { rFetch } from '../../../utils/rFetch';
import InputField from '../../common/InputField';
import InputSelect from '../../common/InputSelect';
import io from 'socket.io-client';
import './videoUpload.css';
import { getRandomValues } from '../../../utils/getRandomValues';
import axios from 'axios';
import {
  // TAuthGetChallengeResponse,
  TUploadSocket
} from '../../../axios.responseTypes';
import BlockChainSwitcher from '../../adminViews/BlockchainSwitcher';
const UPLOAD_PROGRESS_HOST = process.env.REACT_APP_UPLOAD_PROGRESS_HOST;

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

  const currentToken = localStorage.getItem('token');

  const [categoryArray, setCategoryArray] = useState([]);
  const getCategories = useCallback(async () => {
    const { success, categories } = await rFetch('/api/categories');
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
    const request = await rFetch('/api/contracts/full?itemsPerPage=5');
    if (request.success) {
      const { success, contracts } = await rFetch(
        `/api/contracts/full?itemsPerPage=${request.totalNumber}`
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
              value: item._id
            });
          }
        });

        setFullContractData(mapping);
        setContractOptions(options);
      }
    }
  }, []);

  useEffect(getFullContractData, [getFullContractData]);

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

  useEffect(() => {
    async function isOffersGet() {
      if (product !== 'null') {
        setSelectedOffers(['null']);
        const offers = await getOffers();
        setCountOfSelects(offers?.length - 1);
      }
    }
    isOffersGet();
  }, [product, contract, getOffers]);

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

  useEffect(() => {
    async function goSession() {
      const sessionId = getRandomValues().toString(36).substr(2, 9);
      setThisSessionId(sessionId);
      const so = io(`${UPLOAD_PROGRESS_HOST}`, { transports: ['websocket'] });
      // const so = io(`http://localhost:5000`, { transports: ["websocket"] });
      setSocket(so);
      // so.on("connect", data => {
      //   console.log('Connected !');
      // });
      so.emit('init', sessionId);

      return () => {
        so.emit('end', sessionId);
      };
    }
    goSession();
  }, []);

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
    backgroundColor: `var(--${primaryColor})`,
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
      <h1> Add Media </h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        className="text-center mx-auto col-12">
        <div className="col-8 py-1">
          <InputField
            customClass="form-control input-select-custom-style"
            customCSS={reusableStyle}
            labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
            label="Title"
            placeholder="Please input a title"
            getter={title}
            setter={setTitle}
          />
        </div>
        <div className="col-8 py-1">
          <InputField
            label="Description"
            customClass="form-control input-select-custom-style"
            customCSS={reusableStyle}
            labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
            placeholder="Please input a description"
            getter={description}
            setter={setDescription}
          />
        </div>
        <div className="col-8 py-1">
          <InputSelect
            customClass="form-control input-select-custom-style"
            customCSS={reusableStyle}
            labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
            label="Category"
            getter={category}
            setter={setCategory}
            placeholder="Choose a category"
            options={categoryArray}
          />
        </div>
        <div className="col-8 py-1">
          <InputSelect
            customClass="form-control input-select-custom-style"
            customCSS={reusableStyle}
            labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
            label="Storage"
            getter={storage}
            setter={setStorage}
            placeholder="Select a storage method"
            options={[
              { label: 'Google Cloud', value: 'gcp' },
              { label: 'IPFS', value: 'ipfs' }
            ]}
          />
        </div>
        <div className="col-8 py-1">
          <InputSelect
            customClass="form-control input-select-custom-style"
            customCSS={reusableStyle}
            labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
            label="Contract"
            getter={contract}
            setter={(e) => {
              setNetworkId(fullContractData[e].blockchain);
              setContract(e);
              setProduct('null');
              setProductOptions([]);
              setOffer('null');
              setOffersOptions([]);
            }}
            placeholder="Select a Contract"
            options={contractOptions}
          />
        </div>
        {productOptions?.length > 0 ? (
          <div className="col-8 py-1">
            <InputSelect
              customClass="form-control input-select-custom-style"
              customCSS={reusableStyle}
              labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
              label="Product"
              getter={product}
              setter={(e) => {
                setProduct(e);
                setOffer('null');
                setOffersOptions([]);
                setSelects([]);
              }}
              placeholder="Choose a product"
              options={productOptions}
            />
          </div>
        ) : (
          <>
            No products available
            <br />
          </>
        )}
        <div className="col-8 py-1">
          {offersOptions?.length
            ? Object.keys(selectedOffers)?.map((key) => {
                return (
                  <InputSelect
                    customClass="form-control input-select-custom-style"
                    customCSS={reusableStyle}
                    labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
                    label={key === '0' ? 'Offers' : ''}
                    getter={selectedOffers[key]}
                    setter={(value) => handleOffer(key, value)}
                    placeholder="Select an offer"
                    options={offersOptions}
                    key={Math.random() * 1_000_000}
                  />
                );
              })
            : 'No offers available'}
          <button
            disabled={selectedOffers?.length >= offersOptions?.length}
            style={reusableStyle}
            className="addButton"
            onClick={createSelects}>
            <i className="fas fa-plus" />
          </button>
        </div>
        <div className="col-8 py-1">
          <label htmlFor="media_id">File:</label>
          <input
            className="form-control input-select-custom-style"
            style={{
              paddingLeft: '7px',
              ...reusableStyle
            }}
            id="media_id"
            type="file"
            onChange={(e) =>
              setVideo(e.target.files ? e.target.files[0] : undefined)
            }
          />
        </div>
        <button
          type="button"
          disabled={
            uploading ||
            storage === 'null' ||
            title === '' ||
            description === '' ||
            /* author === '' || */
            contract === 'null' ||
            product === 'null' ||
            selectedOffers.length === 0 ||
            verifyOffer() ||
            video === undefined
          }
          className="btn py-1 col-8 btn-primary btn-submit-custom"
          onClick={() => {
            if (uploading) {
              return;
            }
            if (video && title && currentToken) {
              setVPV(URL.createObjectURL(video));
              const formData = new FormData();
              formData.append('video', video);
              formData.append('title', title);
              formData.append('description', description);
              formData.append('contract', contract);
              formData.append('category', category);
              formData.append('storage', storage);
              formData.append('product', product);
              const acceptedOffers = [];
              selectedOffers.forEach((item) => {
                if (item !== 'null' && !acceptedOffers.includes(item)) {
                  acceptedOffers.push(item);
                }
              });
              formData.append('offer', JSON.stringify(acceptedOffers));
              setUploading(true);
              axios
                .post<TUploadSocket>(
                  `/ms/api/v1/media/upload?socketSessionId=${thisSessionId}`,
                  formData,
                  {
                    headers: {
                      Accept: 'application/json',
                      'X-rair-token': currentToken
                    }
                  }
                )
                .then((res) => res.data)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .then((response) => {
                  // TODO: in time of uploading
                  // setUploading(false);
                  // setTitle("");
                  // setDescription("");
                  // setVideo(undefined);
                  // setOffersIndex([]);
                  // setCollectionIndex({});
                  // setCategory("null");
                  // setStorage('null');
                  // setContractOptions([]);
                  // setProductOptions();
                  // setOffersOptions();
                  // 	// setAuthor("");
                })
                .catch((e) => {
                  console.error(e);
                  Swal.fire('Error', e, 'error');
                  setUploading(false);
                });
            } else {
              setVPV();
            }
          }}>
          {uploading ? 'Upload in progress' : 'Submit'}
        </button>
        <div />
        <div
          className="progress"
          style={{
            marginTop: '20px',
            width: '67%',
            backgroundColor: `var(--${primaryColor})`
          }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${status}%` }}
            aria-valuenow={status}
            aria-valuemin="0"
            aria-valuemax="100">
            {status}%
          </div>
        </div>
        <div>{status !== 100 && status !== 0 ? `Step: ${message}` : ''}</div>
        <hr className="w-100 my-5" />
      </div>
    </>
  );
};

export default FileUpload;
