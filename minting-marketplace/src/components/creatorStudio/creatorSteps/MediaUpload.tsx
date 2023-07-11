import React, { useCallback, useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { utils } from 'ethers';
import { io } from 'socket.io-client';

import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import {
  uploadVideoEnd,
  uploadVideoStart
} from '../../../ducks/uploadDemo/action';
import videoIcon from '../../../images/videoIcon.svg';
import chainData from '../../../utils/blockchainData';
import { validateInteger } from '../../../utils/metamaskUtils';
import { rFetch } from '../../../utils/rFetch';
import { OptionsType } from '../../common/commonTypes/InputSelectTypes.types';
import LoadingComponent from '../../common/LoadingComponent';
import MediaListBox from '../../DemoMediaUpload/MediaListBox/MediaListBox';
import UploadedListBox from '../../DemoMediaUpload/UploadedListBox/UploadedListBox';
import { TOfferType } from '../../marketplace/marketplace.types';
import { IMediaUpload, TCategories, TMediaType } from '../creatorStudio.types';

const MediaUpload: React.FC<IMediaUpload> = ({
  setStepNumber,
  contractData,
  stepNumber
}) => {
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const { address, collectionIndex, blockchain } = useParams();
  const dispatch = useDispatch();
  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [mediaUploadedList, setMediaUploadedList] = useState<any>([]);
  const [mediaList, setMediaList] = useState<TMediaType[]>([]);
  const [offerList, setOfferList] = useState<OptionsType[]>([]);
  const [forceRerender, setForceRerender] = useState<boolean>(false);
  const [categoryArray, setCategoryArray] = useState<OptionsType[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [thisSessionId, setThisSessionId] = useState<string>('');
  const [socketMessage, setSocketMessage] = useState<string | undefined>();
  const [uploadProgress, setUploadProgress] = useState<
    boolean | number | undefined
  >(undefined);
  const [uploading, setUploading] = useState<boolean>(false);
  const [currentTitleVideo, setCurrentTitleVideo] = useState<string>('');
  const [newUserStatus, setNewUserStatus] = useState(false);

  const getCategories = useCallback(async () => {
    const { success, categories } = await rFetch('/api/categories');
    if (success) {
      setSelectedCategory(categories[0].name);
      setCategoryArray(
        categories.map((item: TCategories) => {
          return { label: item.name, value: item.name };
        })
      );
    }
  }, []);

  const selectCommonInfo = {
    customClass: 'form-control rounded-rair',
    customCSS: {
      backgroundColor: `var(--${primaryColor}-80)`,
      color: textColor
    },
    optionCSS: {
      color: textColor
    }
  };

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    const unlocked: OptionsType[] = [
      {
        label: 'Unlocked',
        value: '-1'
      }
    ];

    setOfferList(
      contractData?.product?.offers
        ? unlocked.concat(
            contractData?.product?.offers.map((item: TOfferType) => {
              return {
                label: `${item.offerName} (${
                  Number(item.range[1]) - Number(item.range[0]) + 1
                } tokens for ${utils
                  .formatEther(
                    validateInteger(+item.price) ? item.price.toString() : 0
                  )
                  .toString()} ${
                  chainData[contractData.blockchain]?.symbol
                } each)`,
                value: contractData.diamond
                  ? item.diamondRangeIndex
                  : item.offerIndex
              };
            })
          )
        : []
    );
  }, [contractData]);

  const uploadVideoDemo = async (item, storage) => {
    dispatch(uploadVideoStart());
    setCurrentTitleVideo(item.title);
    setUploadSuccess(false);
    const formData = new FormData();
    formData.append('video', item.file);
    formData.append('title', item.title.slice(0, 29));
    formData.append('description', item.title);
    formData.append('storage', storage);
    if (item.contractAddress && item.productIndex && item.offer) {
      formData.append('contract', item.contractAddress);
      formData.append('product', item.productIndex);
      if (item.offer && item.offer[0].value !== '-1') {
        formData.append('offer', JSON.stringify([String(item.offer[0].value)]));
      } else {
        formData.append('demo', String(item.offer[0].value === '-1'));
        formData.append('offer', JSON.stringify(['0']));
      }
    }
    if (selectedCategory) {
      formData.append('category', selectedCategory);
    }
    setSocketMessage('');
    setUploading(true);
    try {
      const tokenRequest = await rFetch('/api/v2/upload/token');
      if (!tokenRequest.success) {
        setUploading(false);
        return;
      }
      const request = await rFetch(
        `/ms/api/v1/media/upload${
          newUserStatus ? '/demo' : ''
        }?socketSessionId=${thisSessionId}`,
        // `${process.env.REACT_APP_UPLOAD_PROGRESS_HOST}/ms/api/v1/media/upload${
        //   newUserStatus ? '/demo' : ''
        // }?socketSessionId=${thisSessionId}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'x-rair-token': tokenRequest.secret
          },
          body: formData
        }
      );

      if (request && request.status === 'faild') {
        setUploading(false);
        setUploadProgress(false);
        setUploadSuccess(null);
        setSocketMessage('');
        getMediaList();
      }
      setUploading(false);
      getMediaList();
    } catch (e) {
      console.error(e);
      setUploading(false);
      setSocketMessage('');
      getMediaList();
    }
  };

  const onMediaDrop = (media) => {
    let aux: TMediaType[] = [...mediaList];
    aux = aux.concat(
      media.map((item: File) => {
        return {
          offer: 'null',
          category: 'null',
          title: item.name.slice(0, 29),
          file: item,
          description: '',
          preview: URL.createObjectURL(item),
          contractAddress: contractData?._id,
          productIndex: contractData?.product.collectionIndexInContract,
          storage: 'null'
        };
      })
    );
    setMediaList(aux);
  };

  const deleter = (index: number) => {
    const aux = [...mediaList];
    aux.splice(index, 1);
    setMediaList(aux);
  };

  const StringToNumber = useCallback((message) => {
    const str = message.substr(message.length - 8, 10);
    const lastString = message.split(' pin');
    const lastString2 = message.split(' upload');
    if (
      lastString2[1] === 'ing to Google Cloud' ||
      lastString2[1] === 'ing to IPFS'
    ) {
      setSocketMessage('uploading to Cloud');
    }

    const specSymb = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
    const newStr = str.split('').filter((item) => {
      if (specSymb.includes(item)) {
        return item;
      }
    });
    if (isNaN(newStr.join(''))) {
      if (
        message === 'uploaded to Google Cloud.' ||
        message === 'uploaded to IPFS.'
      ) {
        dispatch(uploadVideoEnd());
        setUploadSuccess(true);
        getMediaList();
        setUploadProgress(false);
        setUploadSuccess(null);
        setSocketMessage('');
      } else if (
        lastString[1] === 'ning to Google Cloud.' ||
        lastString[1] === 'ning to IPFS.'
      ) {
        dispatch(uploadVideoEnd());
        setMediaList((prev) => [
          ...prev.filter((item) => item.file.name !== lastString[0])
        ]);
        setUploading(false);
        setCurrentTitleVideo('');
        setSocketMessage('');
      }
      return false;
    } else {
      return Number(newStr.join(''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMediaList = async () => {
    if (currentUserAddress !== undefined) {
      setLoading(true);
      if (contractData?.external) {
        try {
          const { success, files } = await rFetch(
            `/api/nft/network/${blockchain}/${address}/${collectionIndex}/files`
          );
          if (success && contractData) {
            const asArray = Object.entries(files);

            const filtered: any = asArray.filter(
              ([key, value]: any) =>
                value?.contract === contractData?.product.contract &&
                value?.product === collectionIndex
            );

            setMediaUploadedList(Object.fromEntries(filtered));
            setLoading(false);
          }
        } catch (e) {
          setLoading(false);
        }
      } else {
        const { success, list, error } = await rFetch(
          `/api/media/list?userAddress=${currentUserAddress}`
        );

        if (success && contractData) {
          const asArray = Object.entries(list);

          const filtered: any = asArray.filter(
            ([key, value]: any) =>
              value?.contract === contractData?.product.contract &&
              value?.product === collectionIndex
          );

          setMediaUploadedList(Object.fromEntries(filtered));
          setLoading(false);
        }

        if (error) {
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    getCategories();
    // eslint-disable-next-line
  }, [getCategories]);

  useEffect(() => {
    setStepNumber(stepNumber);
  }, [setStepNumber, stepNumber]);

  useEffect(() => {
    const sessionId = Math.random().toString(36).substr(2, 9);
    setThisSessionId(sessionId);
    const so = io();
    so.emit('init', sessionId);
    so.on('uploadProgress', (data) => {
      const { last, message } = data;
      setSocketMessage(message);
      if (message) {
        setUploadProgress(StringToNumber(message));
      }
      if (last) {
        setUploading(false);
        setUploadSuccess(true);
        getMediaList();
      }
    });

    return () => {
      so.removeListener('uploadProgress');
      so.emit('end', sessionId);
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (uploadSuccess) {
      getMediaList();
      setUploading(false);
      setUploadProgress(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadSuccess]);

  useEffect(() => {
    if (!currentUserAddress) return;
    getMediaList();
    // eslint-disable-next-line
  }, [currentUserAddress]);

  return (
    <div className="col-12 mb-5">
      <div className="rounded-rair col-12 mb-3">
        <Dropzone onDrop={onMediaDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <section>
              <div
                {...getRootProps()}
                style={{
                  border: 'dashed 1px var(--charcoal-80)',
                  position: 'relative'
                }}
                className="w-100 h-100 rounded-rair col-6 text-center mb-3 p-5">
                <input {...getInputProps()} />
                <img
                  alt=""
                  style={{
                    filter:
                      primaryColor === 'rhyno' ? 'brightness(40%)' : undefined
                  }}
                  src={videoIcon}
                  className="mt-5 mb-3"
                />
                <br />
                {isDragActive ? (
                  <>Drop the images here ...</>
                ) : (
                  <>
                    Drag and drop or{' '}
                    <span style={{ color: 'var(--bubblegum)' }}>click</span> to
                    upload unlockable content
                  </>
                )}
              </div>
            </section>
          )}
        </Dropzone>
      </div>
      {loading ? (
        <LoadingComponent />
      ) : (
        Object.keys(mediaUploadedList)
          .sort()
          .map((item, index) => {
            const fileData = mediaUploadedList[item];
            return (
              <UploadedListBox
                key={fileData.title + index}
                fileData={fileData}
                index={index}
                setMediaList={setMediaList}
                mediaList={mediaUploadedList}
                uploadSuccess={uploadSuccess}
                getMediaList={getMediaList}
                setUploadSuccess={setUploadSuccess}
                setMediaUploadedList={setMediaUploadedList}
                address={address}
                collectionIndex={collectionIndex}
              />
            );
          })
      )}
      {mediaList.map((item, index, array) => {
        return (
          // <MediaUploadRow
          //   key={index}
          //   item={item}
          //   index={index}
          //   array={array}
          //   categoriesArray={categoryArray}
          //   deleter={() => deleter(index)}
          //   offerList={offerList}
          //   rerender={() => setForceRerender(!forceRerender)}
          // />
          <MediaListBox
            key={index + item.title}
            item={item}
            index={index}
            mediaList={mediaList}
            setMediaList={setMediaList}
            uploadSuccess={uploadSuccess}
            uploadProgress={uploadProgress}
            setUploadSuccess={setUploadSuccess}
            uploading={uploading}
            uploadVideoDemo={uploadVideoDemo}
            selectCommonInfo={selectCommonInfo}
            deleter={deleter}
            currentTitleVideo={currentTitleVideo}
            socketMessage={socketMessage}
            setSocketMessage={setSocketMessage}
            newUserStatus={newUserStatus}
            address={address}
            collectionIndex={collectionIndex}
          />
        );
      })}
    </div>
  );
};

const ContextWrapper = (props: IMediaUpload) => {
  return (
    <WorkflowContext.Consumer>
      {(value) => {
        return <MediaUpload {...value} {...props} />;
      }}
    </WorkflowContext.Consumer>
  );
};

export default ContextWrapper;
