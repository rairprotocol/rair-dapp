import React, { useCallback, useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector, useStore } from 'react-redux';
import {
  faCheck,
  faPen,
  faTimes,
  faTrash,
  faUpload
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import {
  uploadVideoEnd,
  uploadVideoStart
} from '../../../ducks/uploadDemo/action';
import useSwal from '../../../hooks/useSwal';
import chainData from '../../../utils/blockchainData';
import { rFetch } from '../../../utils/rFetch';
import sockets from '../../../utils/sockets';
import InputField from '../../common/InputField';
import InputSelect from '../../common/InputSelect';
import LinearProgressWithLabel from '../LinearProgressWithLabel/LinearProgressWithLabel';
import { IMediaListBox } from '../types/DemoMediaUpload.types';

type Options = {
  label: string;
  value: string;
};

const ContractDataModal = ({
  contract,
  setContract,
  product,
  setProduct,
  offer,
  setOffer,
  setOfferName,
  demo,
  setDemo
}) => {
  const [newContract, setNewContract] = useState(contract || 'null');
  const [newProduct, setNewProduct] = useState(product || 'null');
  const [newOffer, setNewOffer] = useState(offer);
  const [newDemoStatus, setNewDemoStatus] = useState(demo);

  const [contractData, setContractData] = useState<any>({});

  const [offerNameMapping, setOfferNameMapping] = useState({});

  const [offerOptions, setOfferOptions] = useState<Options[]>([]);
  const [productOptions, setProductOptions] = useState<Options[]>([]);
  const [contractOptions, setContractOptions] = useState<Options[]>([]);

  const reactSwal = useSwal();
  const { textColor, primaryButtonColor, secondaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const getContractData = useCallback(async () => {
    const request = await rFetch('/api/contracts/full?itemsPerPage=5');

    if (request?.success) {
      const { success, contracts } = await rFetch(
        `/api/contracts/full?itemsPerPage=${request?.totalNumber || '5'}`
      );
      if (!success) {
        return;
      }
      const contractMapping = {};
      contracts.forEach((contract) => {
        if (!contractMapping[contract._id]) {
          contract.productArray = [contract.products];
          delete contract.products;
          contractMapping[contract._id] = contract;
        } else {
          contractMapping[contract._id]?.productArray.push(contract.products);
        }
      });
      setContractData(contractMapping);
      setContractOptions(
        Object.keys(contractMapping)
          .map((contractId) => {
            const data = contractMapping[contractId];
            return {
              label: `${data.title} (${
                data.blockchain in chainData
                  ? chainData[data.blockchain].symbol
                  : 'Unknown blockchain'
              })`,
              value: contractId
            };
          })
          .sort((a, b) => {
            if (a.label > b.label) {
              return 1;
            }
            return -1;
          })
      );
    }
  }, []);

  useEffect(() => {
    getContractData();
  }, [getContractData]);

  const getProductList = useCallback(() => {
    if (
      !newContract ||
      newContract === 'null' ||
      contractData[newContract]?.productArray.length === 0
    ) {
      return;
    }
    setProductOptions(
      contractData[newContract]?.productArray.map((product, index: number) => {
        return {
          label: product.name,
          value: index
        };
      })
    );
  }, [newContract, contractData]);

  useEffect(() => {
    setNewProduct('null');
    setNewOffer('null');
  }, [newContract]);

  useEffect(() => {
    getProductList();
  }, [getProductList]);

  const getOfferList = useCallback(() => {
    const data = contractData[newContract]?.productArray[newProduct]?.offers;
    if (!data) {
      return;
    }
    const nameMapping = {};
    data.forEach((offer) => {
      nameMapping[offer._id] = offer.offerName;
    });
    setOfferNameMapping(nameMapping);
    setOfferOptions(
      data.map((offer) => {
        return {
          label: offer.offerName,
          value: offer._id
        };
      })
    );
  }, [contractData, newContract, newProduct]);

  useEffect(() => {
    getOfferList();
  }, [getOfferList]);

  return (
    <>
      <InputSelect
        customClass="form-control rounded-rair"
        placeholder="Select contract"
        label="Contract"
        options={contractOptions}
        getter={newContract}
        setter={setNewContract}
      />
      {newContract && newContract !== 'null' && (
        <InputSelect
          placeholder="Select product"
          customClass="form-control rounded-rair"
          label="Product"
          options={productOptions}
          getter={newProduct}
          setter={setNewProduct}
        />
      )}
      {newProduct && newProduct !== 'null' && (
        <>
          <InputSelect
            placeholder="Select offer"
            customClass="form-control rounded-rair"
            label="Offer"
            options={offerOptions}
            getter={newOffer}
            setter={setNewOffer}
          />
          <br />
          <button
            style={{
              color: textColor,
              background: newDemoStatus
                ? secondaryButtonColor
                : primaryButtonColor,
              border: `solid 1px ${textColor}`
            }}
            className={'btn rair-button'}
            onClick={() => setNewDemoStatus(!newDemoStatus)}>
            {newDemoStatus ? 'Demo' : 'Unlockable'}
          </button>
          <br />
          {newDemoStatus
            ? 'Anyone can unlock this video'
            : 'Only NFT owner can unlock the video'}
        </>
      )}
      <hr />
      <button
        className="btn btn-outline-danger float-start"
        onClick={() => {
          reactSwal.close();
        }}>
        Close <FontAwesomeIcon icon={faTimes} />
      </button>
      <button
        className="btn rair-button float-end"
        style={{
          background: primaryButtonColor,
          color: textColor
        }}
        onClick={() => {
          setContract(newContract);
          setProduct(newProduct);
          setOffer(newOffer);
          setOfferName(offerNameMapping[newOffer]);
          setDemo(newDemoStatus);
          reactSwal.close();
        }}>
        Save <FontAwesomeIcon icon={faCheck} />
      </button>
    </>
  );
};

const BasicDataModal = ({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  categoryOptions
}) => {
  const [newTitle, setNewTitle] = useState<string>(title);
  const [newDescription, setNewDescription] = useState<string>(description);
  const [newCategory, setNewCategory] = useState(category);
  const { textColor, primaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);
  const reactSwal = useSwal();
  return (
    <>
      <InputField
        customClass="rounded-rair form-control"
        label="Title"
        getter={newTitle}
        setter={setNewTitle}
      />
      <InputField
        customClass="rounded-rair form-control"
        label="Description"
        getter={newDescription}
        setter={setNewDescription}
      />
      <InputSelect
        customClass="rounded-rair form-control"
        label="Category"
        options={categoryOptions}
        getter={newCategory}
        setter={setNewCategory}
      />
      <hr />
      <button
        className="btn btn-outline-danger float-start"
        onClick={() => {
          reactSwal.close();
        }}>
        Close <FontAwesomeIcon icon={faTimes} />
      </button>
      <button
        className="btn rair-button float-end"
        style={{
          background: primaryButtonColor,
          color: textColor
        }}
        onClick={() => {
          setTitle(newTitle);
          setDescription(newDescription);
          setCategory(newCategory);
          reactSwal.close();
        }}>
        Save <FontAwesomeIcon icon={faCheck} />
      </button>
    </>
  );
};

const MediaListBox: React.FC<IMediaListBox> = ({
  index,
  item,
  deleter,
  newUserStatus,
  rerender
}) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [contract, setContract] = useState<string>(item.contractAddress);
  const [product, setProduct] = useState<string>(item.productIndex);
  const [offer, setOffer] = useState<string>(item.offer);
  const [offerName, setOfferName] = useState<string>('');
  const [demo, setDemo] = useState<boolean>(item.demo);

  const [category, setCategory] = useState(item.category);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);

  const [uploading, setUploading] = useState<boolean>(false);
  const [socketMessage, setSocketMessage] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [categoryOptions, setCategoryOptions] = useState<Options[]>([]);

  const {
    primaryColor,
    secondaryColor,
    textColor,
    primaryButtonColor,
    secondaryButtonColor
  } = useSelector<RootState, ColorStoreType>((store) => store.colorStore);
  const store = useStore();
  const reactSwal = useSwal();
  const dispatch = useDispatch();

  const getCategories = useCallback(async () => {
    const { success, categories } = await rFetch('/api/files/categories');
    if (success) {
      setCategoryOptions(
        categories.map((item) => {
          return { label: item.name, value: item._id };
        })
      );
      setCategory(categories?.at(0)?._id);
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    const report = (socketData) => {
      if (!socketData) {
        return;
      }
      setUploading(true);
      const { message, data } = socketData;
      const [videoTitle, progress] = data;
      if (item.file.name === videoTitle) {
        setSocketMessage(message);
        setUploadProgress(progress);
        if (progress === 100) {
          setSocketMessage('');
          setUploading(false);
          setUploadSuccess(true);
          setTimeout(() => {
            dispatch(uploadVideoEnd());
            rerender?.();
            deleter(index);
          }, 3000);
        }
      }
    };
    sockets.nodeSocket.on('uploadProgress', report);

    return () => {
      sockets.nodeSocket.off('uploadProgress', report);
    };
  }, [deleter, dispatch, index, item.file.name, rerender]);

  const uploadVideo = useCallback(
    async (storage) => {
      if (contract === 'null' || product === 'null' || offer === 'null') {
        return;
      }
      dispatch(uploadVideoStart());
      setUploadSuccess(false);
      const formData = new FormData();

      formData.append('video', item.file);
      formData.append('title', title.slice(0, 29));
      formData.append('description', description);
      formData.append('storage', storage);
      for (const off of [offer]) {
        formData.append('offers[]', off);
      }
      formData.append('demo', demo.toString());
      formData.append('category', category);
      setSocketMessage('');
      setUploading(true);
      try {
        const tokenRequest = await rFetch('/api/upload/token');
        if (!tokenRequest.success) {
          setUploading(false);
          return;
        }
        reactSwal.fire({
          title: 'Please wait',
          html: 'Uploading file',
          icon: 'info',
          showConfirmButton: false
        });
        const request = await rFetch(`/ms/api/v1/media/upload`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'x-rair-token': tokenRequest.secret
          },
          body: formData
        });

        if (request?.status === 'error') {
          setUploading(false);
          setUploadProgress(0);
          setUploadSuccess(false);
          setSocketMessage('');
        } else if (request?.success) {
          reactSwal.close();
        }
      } catch (e) {
        console.error(e);
        setUploading(false);
        setSocketMessage('');
      }
      rerender?.();
    },
    [
      contract,
      product,
      offer,
      dispatch,
      item.file,
      title,
      description,
      demo,
      category,
      rerender,
      reactSwal
    ]
  );

  useEffect(() => {
    setUploadSuccess(false);
  }, [setUploadSuccess]);

  const alertChoiceCloud = useCallback(() => {
    reactSwal.fire({
      title: 'Select video storage location (Cloud or IPFS)',
      html: (
        <div className="container-choice-clouds">
          <button
            style={{
              background: primaryButtonColor,
              color: textColor
            }}
            className="rair-button btn"
            onClick={() => uploadVideo('gcp')}>
            Cloud
          </button>
          <button
            style={{
              background: primaryButtonColor,
              color: textColor
            }}
            className="rair-button btn"
            onClick={() => uploadVideo('ipfs')}>
            IPFS
          </button>
        </div>
      ),
      showConfirmButton: false,
      showCancelButton: true,
      width: '40vw'
    });
  }, [reactSwal, uploadVideo, primaryButtonColor, textColor]);

  const editVideoTitle = useCallback(() => {
    reactSwal.fire({
      html: (
        <Provider store={store}>
          <BasicDataModal
            {...{
              title,
              setTitle,
              description,
              setDescription,
              category,
              setCategory,
              categoryOptions
            }}
          />
        </Provider>
      ),
      showConfirmButton: false
    });
  }, [reactSwal, category, categoryOptions, description, store, title]);

  const selectVideoOffer = useCallback(() => {
    reactSwal.fire({
      html: (
        <Provider store={store}>
          <ContractDataModal
            {...{
              contract,
              setContract,
              product,
              setProduct,
              offer,
              setOffer,
              setOfferName,
              demo,
              setDemo
            }}
          />
        </Provider>
      ),
      showConfirmButton: false
    });
  }, [reactSwal, store, contract, product, offer, demo]);

  return (
    <div
      className="row w-100"
      style={{
        backgroundColor: primaryColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: secondaryColor,
        color: textColor,
        borderRadius: '15px',
        marginTop: '20px'
      }}>
      <div className="col-12 col-md-3">
        <video className="w-100" src={item.preview} />
      </div>
      <div className="col-12 col-md-9 row mt-3">
        <div className="col-12 text-start col-md-9">
          <span className="b h4">{title}</span>
          <br />
          <small>
            {categoryOptions?.find((cat) => cat.value === category)?.label}
          </small>
        </div>
        <div className="col-12 col-md-3 text-end">
          {offerName !== '' && (
            <>
              Unlocked by: {offerName} ({demo ? 'Demo' : 'Unlockable'})
            </>
          )}
        </div>
        {uploading ? (
          <div className="col-12 text-center">
            <LinearProgressWithLabel value={uploadProgress} />
            <span>{socketMessage}</span>
          </div>
        ) : (
          <>
            <div className="col-12 col-md-3 text-start">
              <button
                disabled={uploadProgress > 0 || uploading}
                onClick={() => deleter(index)}
                style={{ color: textColor }}
                className={`btn btn-outline-danger rounded-rair`}>
                Remove <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="col-12 col-md-3">
              <button
                disabled={uploadProgress > 0}
                style={{ background: primaryButtonColor, color: textColor }}
                onClick={editVideoTitle}
                className={`btn rair-button rounded-rair`}>
                Edit Video Information <FontAwesomeIcon icon={faPen} />
              </button>
            </div>
            <div className="col-12 col-md-3">
              <button
                disabled={uploading}
                onClick={selectVideoOffer}
                style={{
                  background: secondaryButtonColor,
                  color: textColor
                }}
                className={`btn rair-button rounded-rair`}>
                {offerName === '' ? (
                  <>Select offer</>
                ) : (
                  <>
                    Edit Offer <FontAwesomeIcon icon={faPen} />
                  </>
                )}
              </button>
            </div>
            <div className="col-12 col-md-3 text-end">
              <button
                onClick={() => alertChoiceCloud()}
                disabled={
                  offer === 'null' ||
                  (newUserStatus ? !newUserStatus : uploading && !uploadSuccess)
                }
                style={{
                  background: primaryButtonColor,
                  color: textColor
                }}
                className="rair-button btn rounded-rair">
                Upload File <FontAwesomeIcon icon={faUpload} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaListBox;
