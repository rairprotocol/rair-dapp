import React, { useCallback, useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import Swal from 'sweetalert2';

import WorkflowContext from '../../contexts/CreatorWorkflowContext';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import {
  uploadVideoEnd,
  uploadVideoStart
} from '../../ducks/uploadDemo/action';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import videoIcon from '../../images/videoIcon.svg';
import { rFetch } from '../../utils/rFetch';
import { OptionsType } from '../common/commonTypes/InputSelectTypes.types';
import LoadingComponent from '../common/LoadingComponent';
import { TooltipBox } from '../common/Tooltip/TooltipBox';
import { IMediaUpload, TMediaType } from '../creatorStudio/creatorStudio.types';

import MediaListBox from './MediaListBox/MediaListBox';
import UploadedListBox from './UploadedListBox/UploadedListBox';

import './DemoMediaUpload.css';

const MediaUpload: React.FC<IMediaUpload> = () => {
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  const dispatch = useDispatch();

  const { width } = useWindowDimensions();

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

  const [mediaList, setMediaList] = useState<TMediaType[]>([]);
  const [mediaUploadedList, setMediaUploadedList] = useState<any>([]);
  const [, /*categories*/ setCategories] = useState<OptionsType[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [thisSessionId, setThisSessionId] = useState<string>('');
  const [socketMessage, setSocketMessage] = useState<string | undefined>();
  const [newUserStatus, setNewUserStatus] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<
    boolean | number | undefined
  >(undefined);
  const [currentTitleVideo, setCurrentTitleVideo] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [loading, setLoading] = useState<boolean>(false);

  const rerenderFC = () => {
    setRerender(!rerender);
  };

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

  const getCategories = useCallback(async () => {
    if (currentUserAddress !== undefined) {
      const request = await rFetch('/api/contracts');
      const demoCategoryArray = [
        {
          name: 'Unlocked (demo)',
          disabled: false
        },
        {
          name: `NFT🔒 (coming soon)`,
          disabled: false
        }
      ];

      const newCategories = demoCategoryArray.concat(
        request.contracts &&
          request.contracts.map((el) => {
            return {
              name: el.title,
              disabled: false
            };
          })
      );

      setCategories(
        newCategories.map((item) => {
          return {
            label: item.name,
            value: item.name,
            disabled: item.disabled
          };
        })
      );
    }
    const { success, categories } = await rFetch(`/api/categories`);

    if (success) {
      setSelectedCategory(categories[0].name);
    }
  }, [currentUserAddress]);

  const getMediaList = async () => {
    if (currentUserAddress !== undefined) {
      setLoading(true);
      const firstData = await rFetch(
        `/api/media/list?userAddress=${currentUserAddress}&itemsPerPage=1`
      );
      const { success, list, error } = await rFetch(
        `/api/media/list?userAddress=${currentUserAddress}&itemsPerPage=${
          firstData.totalNumber || '1'
        }`
      );

      if (success) {
        setMediaUploadedList(list);
        setLoading(false);
      }

      if (error) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getCategories();
    // eslint-disable-next-line
  }, [getCategories]);

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

  const handleNewUserStatus = useCallback(async () => {
    if (currentTitleVideo) {
      const requestContract = await rFetch(
        '/api/contracts/full?itemsPerPage=5'
      );
      const { success, contracts } = await rFetch(
        `/api/contracts/full?itemsPerPage=${requestContract.totalNumber || '5'}`
      );

      if (success) {
        const contractsFiltered = contracts.filter(
          (el) => el.user === currentUserAddress
        );

        if (contractsFiltered.length === 0) {
          setNewUserStatus(true);
        } else {
          setNewUserStatus(false);
        }
      }
    } else {
      setLoading(false);
    }
  }, [currentUserAddress]);

  const uploadVideoDemo = async (item, storage) => {
    dispatch(uploadVideoStart());
    setCurrentTitleVideo(item.title);
    setUploadSuccess(false);
    const formData = new FormData();
    formData.append('video', item.file);
    formData.append('title', item.title.slice(0, 29));
    formData.append('description', item.description);
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
    } else {
      formData.append('contract', '0x571acc173f57c095f1f63b28f823f0f33128a6c4');
      formData.append('product', '0');
      formData.append('offer', JSON.stringify(['0']));
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
      }

      setUploading(false);
      getMediaList();
    } catch (e) {
      console.error(e);
      setUploading(false);
      setSocketMessage('');
    }
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

  const onMediaDrop = (media) => {
    let aux: TMediaType[] = [...mediaList];
    aux = aux.concat(
      media.map((item: File) => {
        return {
          offer: 'null',
          category: 'DEMO',
          title: item.name.slice(0, 29),
          file: item,
          description: 'test',
          preview: URL.createObjectURL(item),
          contractAddress: undefined,
          productIndex: undefined,
          storage: 'null'
        };
      })
    );
    setMediaList(aux);
  };

  const deleter = async (index: number) => {
    const aux = [...mediaList];
    aux.splice(index, 1);
    setMediaList(aux);
  };

  useEffect(() => {
    if (width <= 1000) {
      Swal.fire({
        imageWidth: 70,
        imageHeight: 'auto',
        imageAlt: 'Custom image',
        imageUrl:
          'https://new-dev.rair.tech/static/media/RAIR-Tech-Logo-POWERED-BY-BLACK-2021.abf50c70.webp',
        title: 'Oops...',
        text: 'Our Beta Upload is currently not optimized for mobile, please use a desktop browser for the best experience'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleNewUserStatus();
  }, [handleNewUserStatus]);

  return (
    <div className="demo-media-wrapper">
      <h3 className="fw-bold">Video demo</h3>
      <h6 className="m-auto col-5" style={{ color: '#A7A6A6' }}>
        Max file size 500 mb each. Please add your email profile settings.
        Analytics will be emailed to you weekly
      </h6>
      <br />
      <div className="m-auto col-10 mb-5">
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
                  <TooltipBox title="Drag and Drop Images">
                    <>
                      <img
                        alt=""
                        style={{
                          filter:
                            primaryColor === 'rhyno'
                              ? 'brightness(40%)'
                              : undefined
                        }}
                        src={videoIcon}
                        className="mt-5 mb-3"
                      />
                    </>
                  </TooltipBox>
                  <br />
                  {isDragActive ? (
                    <>Drop the images here ...</>
                  ) : (
                    <>
                      Drag and drop or{' '}
                      <span style={{ color: 'var(--bubblegum)' }}>click</span>{' '}
                      to upload unlockable content
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
                />
              );
            })
        )}
        {mediaList.map((item, index) => {
          return (
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
            />
          );
        })}
      </div>
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
