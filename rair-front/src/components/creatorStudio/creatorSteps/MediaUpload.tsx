import React, { useCallback, useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import videoIcon from '../../../images/videoIcon.svg';
import { rFetch } from '../../../utils/rFetch';
import LoadingComponent from '../../common/LoadingComponent';
import MediaListBox from '../../DemoMediaUpload/MediaListBox/MediaListBox';
import UploadedListBox from '../../DemoMediaUpload/UploadedListBox/UploadedListBox';
import { IMediaUpload, TMediaType } from '../creatorStudio.types';

const MediaUpload: React.FC<IMediaUpload> = ({
  setStepNumber,
  contractData,
  stepNumber
}) => {
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const { address, collectionIndex } = useParams();
  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const [loading, setLoading] = useState<boolean>(false);

  const [mediaUploadedList, setMediaUploadedList] = useState<any>([]);
  const [mediaList, setMediaList] = useState<TMediaType[]>([]);
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
    let aux: TMediaType[] = [...mediaList];
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

  const getMediaList = async () => {
    if (
      currentUserAddress !== undefined &&
      contractData?.nfts?.tokens?.at(0)?._id
    ) {
      setLoading(true);
      try {
        const { success, data } = await rFetch(
          `/api/files/forToken/${contractData?.nfts?.tokens[0]._id}`
        );
        if (success && contractData) {
          setMediaUploadedList(data.map((unlock) => unlock.file));
        }
      } catch (e) {
        setLoading(false);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    setStepNumber(stepNumber);
  }, [setStepNumber, stepNumber]);

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
