import React, { useCallback, useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useParams } from 'react-router-dom';

import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import { useAppSelector } from '../../../hooks/useReduxHooks';
import videoIcon from '../../../images/videoIcon.svg';
import { UploadMediaFile } from '../../../types/commonTypes';
import { rFetch } from '../../../utils/rFetch';
import LoadingComponent from '../../common/LoadingComponent';
import MediaListBox from '../../DemoMediaUpload/MediaListBox/MediaListBox';
import UploadedListBox from '../../DemoMediaUpload/UploadedListBox/UploadedListBox';
import { IMediaUpload } from '../creatorStudio.types';

const MediaUpload: React.FC<IMediaUpload> = ({
  setStepNumber,
  contractData,
  stepNumber
}) => {
  const { primaryColor, textColor } = useAppSelector((store) => store.colors);

  const { address, collectionIndex } = useParams();
  const { currentUserAddress } = useAppSelector((store) => store.web3);
  const [loading, setLoading] = useState<boolean>(false);

  const [mediaUploadedList, setMediaUploadedList] = useState<any>([]);
  const [mediaList, setMediaList] = useState<UploadMediaFile[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);

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

  const onMediaDrop = (media) => {
    let aux = [...mediaList];
    aux = aux.concat(
      media.map((item: File) => {
        return {
          offer: 'null',
          category: 'null',
          title: item.name.slice(0, 29),
          file: item,
          description: item.name,
          preview: URL.createObjectURL(item),
          contractAddress: contractData?._id,
          productIndex: contractData?.product.collectionIndexInContract,
          storage: 'null',
          demo: false
        };
      })
    );
    setMediaList(aux);
  };

  const deleter = useCallback(
    (index: number) => {
      const aux = [...mediaList];
      aux.splice(index, 1);
      setMediaList(aux);
    },
    [mediaList]
  );

  const getMediaList = useCallback(async () => {
    if (currentUserAddress !== undefined && contractData?.nfts?.at(0)?._id) {
      setLoading(true);
      try {
        const { success, data } = await rFetch(
          `/api/files/forToken/${contractData.nfts.at(0)?._id}`
        );
        if (success && contractData) {
          setMediaUploadedList(data.map((unlock) => unlock.file));
        }
      } catch (e) {
        setLoading(false);
      }
      setLoading(false);
    }
  }, [contractData, currentUserAddress]);

  useEffect(() => {
    setStepNumber?.(stepNumber);
  }, [setStepNumber, stepNumber]);

  useEffect(() => {
    getMediaList();
  }, [getMediaList]);

  return (
    <div className="col-12 mb-5">
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
                key={index}
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
      {mediaList.map((item, index) => {
        return (
          <MediaListBox
            key={index}
            index={index}
            item={item}
            selectCommonInfo={selectCommonInfo}
            deleter={deleter}
            rerender={getMediaList}
            newUserStatus={true}
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
