import React, { useCallback, useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useSelector } from 'react-redux';

import WorkflowContext from '../../contexts/CreatorWorkflowContext';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import videoIcon from '../../images/videoIcon.svg';
import { rFetch } from '../../utils/rFetch';
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

  const selectCommonInfo = {
    customClass: 'form-control rounded-rair',
    customCSS: {
      backgroundColor: `color-mix(in srgb, ${primaryColor}, #888888)`,
      color: textColor
    },
    optionCSS: {
      color: textColor
    }
  };

  const [mediaList, setMediaList] = useState<TMediaType[]>([]);
  const [mediaUploadedList, setMediaUploadedList] = useState<any>([]);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [newUserStatus, setNewUserStatus] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);

  const getMediaList = async () => {
    if (currentUserAddress !== undefined) {
      setLoading(true);
      const firstData = await rFetch(
        `/api/files/list?userAddress=${currentUserAddress}&itemsPerPage=1`
      );
      const { success, list, error } = await rFetch(
        `/api/files/list?userAddress=${currentUserAddress}&itemsPerPage=${
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
    if (!currentUserAddress) return;
    getMediaList();
    // eslint-disable-next-line
  }, [currentUserAddress]);

  const handleNewUserStatus = useCallback(async () => {
    const requestContract = await rFetch('/api/contracts/full?itemsPerPage=5');
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
  }, [currentUserAddress]);

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
          storage: 'null',
          demo: false
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
                    border: `dashed 1px color-mix(in srgb, ${primaryColor}, #888888)`,
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
              key={index}
              item={item}
              index={index}
              selectCommonInfo={selectCommonInfo}
              deleter={deleter}
              newUserStatus={newUserStatus}
              rerender={getMediaList}
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
