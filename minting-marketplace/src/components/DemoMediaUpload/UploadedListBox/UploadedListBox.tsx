import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { copyEmbebed } from '../../../utils/copyEmbed';
import { rFetch } from '../../../utils/rFetch';
import { TooltipBox } from '../../common/Tooltip/TooltipBox';
import NftVideoplayer from '../../MockUpPage/NftList/NftData/NftVideoplayer/NftVideoplayer';
import { ModalContentCloseBtn } from '../../MockUpPage/utils/button/ShowMoreItems';
import { playImagesColored } from '../../SplashPage/images/greyMan/grayMan';
import MediaItemChange from '../MediaItemChange/MediaItemChange';
import PopUpChoiceNFT from '../PopUpChoiceNFT/PopUpChoiceNFT';
import { IUploadedListBox } from '../types/DemoMediaUpload.types';

import AnalyticsPopUp from './AnalyticsPopUp/AnalyticsPopUp';

const UploadedListBox: React.FC<IUploadedListBox> = ({
  fileData,
  index,
  setMediaList,
  mediaList,
  uploadSuccess,
  getMediaList,
  setUploadSuccess,
  setMediaUploadedList,
  address,
  collectionIndex
}) => {
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const [openVideoplayer, setOpenVideoplayer] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [watchCounter, setWatchCounter] = useState<number | null>(null);
  const [loadDeleting, setLoadDeleting] = useState(false);
  const [editTitleVideo, setEditTitleVideo] = useState<boolean>(false);
  const [currentContract, setCurrentContract] = useState<any>(null);

  const customStyles = {
    overlay: {
      zIndex: '1'
    },
    content: {
      background: primaryColor === 'rhyno' ? '#F2F2F2' : '#383637',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      fontFamily: 'Plus Jakarta Text',
      border: 'none',
      borderRadius: '16px',
      height: 'auto',
      overflow: 'hidden'
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCounterVideo = async () => {
    if (fileData._id) {
      try {
        const req = await rFetch(
          `/api/analytics/${fileData._id}?onlyCount=true`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        setWatchCounter(req.totalCount);
      } catch (e) {
        console.info(e);
      }
    }
  };

  const deleterUploaded = async (index: number) => {
    setLoadDeleting(true);

    try {
      const req = await rFetch(`/api/media/remove/${index}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (req.success) {
        setLoadDeleting(false);
        getMediaList();
      }
    } catch (e) {
      console.info(e);
    }
  };

  const removeVideoAlert = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        deleterUploaded(fileData._id);
      }
    });
  };

  const getCurrentContract = useCallback(async () => {
    const contracts = fileData.unlockData.offers.map((offer) => offer.contract);
    if (contracts.length) {
      const request = await rFetch(
        `/api/contracts/singleContract/${contracts[0]}`
      );
      setCurrentContract(request.contract);
    }
  }, [fileData]);

  const openModal = useCallback(() => {
    setModalIsOpen(true);
  }, [setModalIsOpen]);

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
    setOpenVideoplayer(false);
  }, [setModalIsOpen]);

  useEffect(() => {
    closeModal();
  }, [closeModal]);

  useEffect(() => {
    getCurrentContract();
  }, [getCurrentContract]);

  useEffect(() => {
    getCounterVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIsOpen]);

  return (
    <div
      className="medialist-box"
      key={index}
      style={{
        backgroundColor: `var(--${primaryColor}-80)`,
        color: textColor,
        borderRadius: '15px',
        marginTop: '20px'
      }}>
      <div className="mediaitem-block col-12">
        <div className="animated-block" onClick={openModal}>
          <img
            className="modal-content-play-image"
            src={playImagesColored}
            alt="Button play video"
          />
          <img className="w-100" src={fileData.animatedThumbnail} />
        </div>
        <MediaItemChange
          setMediaList={setMediaList}
          item={fileData}
          index={index}
          mediaList={mediaList}
          uploadSuccess={uploadSuccess}
          textFlag={false}
          mediaId={fileData._id}
          getMediaList={getMediaList}
          setEditTitleVideo={setEditTitleVideo}
          editTitleVideo={editTitleVideo}
          setUploadSuccess={setUploadSuccess}
        />
        {currentContract && (
          <button
            onClick={() => {
              copyEmbebed(fileData._id, currentContract.contractAddress);
            }}
            className="col-12 btn-stimorol btn rounded-rair white">
            <>
              <i className="fas fa-check" /> Copy embed code{' '}
            </>
          </button>
        )}
        {currentContract && (
          <div className="border-stimorol rounded-rair col-12">
            <PopUpChoiceNFT
              fileData={fileData}
              setMediaList={setMediaList}
              mediaList={mediaList}
              index={index}
              setUploadSuccess={setUploadSuccess}
              titleOfContract={currentContract ? currentContract : 'null'}
              setMediaUploadedList={setMediaUploadedList}
              address={address}
              collectionIndex={collectionIndex}
            />
          </div>
        )}
        <button
          onClick={() => removeVideoAlert()}
          disabled={loadDeleting}
          className={`btn btn-danger rounded-rairo ${
            primaryColor === 'rhyno' ? 'rhyno' : ''
          }`}>
          <i className="fas fa-trash" />
        </button>
        {!editTitleVideo && (
          <AnalyticsPopUp videoId={fileData._id} watchCounter={watchCounter} />
        )}
      </div>
      <>
        <Modal
          isOpen={modalIsOpen}
          style={customStyles}
          onRequestClose={closeModal}
          contentLabel="Video Modal">
          <div className="modal-content-wrapper-for-video demo-pop-up">
            <div className="modal-content-video">
              {fileData.isUnlocked === false ? (
                <>
                  <TooltipBox enterDelay={200} title="You need to buy an NFT.">
                    <>
                      <i
                        data-title="You need to buy an NFT."
                        className="fa fa-lock modal-content-video-lock"
                      />
                    </>
                  </TooltipBox>
                </>
              ) : openVideoplayer ? (
                <NftVideoplayer selectVideo={fileData} />
              ) : (
                <>
                  <img
                    onClick={() => setOpenVideoplayer(true)}
                    className={'modal-content-play-image'}
                    src={playImagesColored}
                    alt="Button play video"
                  />
                </>
              )}
              {openVideoplayer ? (
                <></>
              ) : (
                <img
                  alt="Modal content video thumbnail"
                  src={`${fileData.staticThumbnail}`}
                  className="modal-content-video-thumbnail"
                />
              )}
            </div>
            <div className="modal-content-video-choice">
              <div className="modal-content-close-btn-wrapper">
                <ModalContentCloseBtn
                  onClick={closeModal}
                  primaryColor={primaryColor}>
                  <i
                    className="fas fa-times"
                    style={{ lineHeight: 'inherit' }}
                  />
                </ModalContentCloseBtn>
              </div>
              <div className="modal-content-block-btns">
                {fileData.isUnlocked === false && (
                  <div className="modal-content-block-buy"></div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      </>
    </div>
  );
};

export default UploadedListBox;
