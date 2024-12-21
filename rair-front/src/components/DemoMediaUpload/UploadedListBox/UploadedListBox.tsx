import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import {
  faCheck,
  faLock,
  faTimes,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppSelector } from '../../../hooks/useReduxHooks';
import useSwal from '../../../hooks/useSwal';
import { CustomModalStyle } from '../../../types/commonTypes';
import { copyEmbebed } from '../../../utils/copyEmbed';
import { rFetch } from '../../../utils/rFetch';
import { TooltipBox } from '../../common/Tooltip/TooltipBox';
import NftVideoplayer from '../../MockUpPage/NftList/NftData/NftVideoplayer/NftVideoplayer';
import { ModalContentCloseBtn } from '../../MockUpPage/utils/button/ShowMoreItems';
import { playImagesColored } from '../../SplashPage/images/greyMan/grayMan';
import MediaItemChange from '../MediaItemChange/MediaItemChange';
import { IUploadedListBox } from '../types/DemoMediaUpload.types';

import AnalyticsPopUp from './AnalyticsPopUp/AnalyticsPopUp';

const UploadedListBox: React.FC<IUploadedListBox> = ({
  fileData,
  index,
  setMediaList,
  mediaList,
  uploadSuccess,
  getMediaList,
  setUploadSuccess
}) => {
  const { primaryColor, textColor, primaryButtonColor, isDarkMode } =
    useAppSelector((store) => store.colors);
  const rSwal = useSwal();

  const [openVideoplayer, setOpenVideoplayer] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [loadDeleting, setLoadDeleting] = useState(false);
  const [editTitleVideo, setEditTitleVideo] = useState<boolean>(false);
  const [currentContract, setCurrentContract] = useState<any>(null);

  const customStyles: CustomModalStyle = {
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

  const deleterUploaded = async (index: number) => {
    setLoadDeleting(true);

    try {
      const req = await rFetch(`/api/files/remove/${index}`, {
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
      console.error(e);
    }
  };

  const removeVideoAlert = () => {
    rSwal
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      })
      .then((result) => {
        if (result.isConfirmed) {
          rSwal.fire('Deleted!', 'Your file has been deleted.', 'success');
          deleterUploaded(fileData._id);
        }
      });
  };

  const getCurrentContract = useCallback(async () => {
    const contracts = fileData?.unlockData?.offers?.map(
      (offer) => offer.contract
    );
    if (contracts?.length) {
      const request = await rFetch(`/api/contracts/${contracts[0]}`);
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

  return (
    <div
      className="medialist-box"
      key={index}
      style={{
        backgroundColor: isDarkMode ? `color-mix(in srgb, ${primaryColor}, #888888)` : 'var(--rhyno)',
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
          <img className="w-100" src={fileData?.animatedThumbnail} />
        </div>
        <MediaItemChange
          setMediaList={setMediaList}
          item={fileData}
          index={index}
          mediaList={mediaList}
          uploadSuccess={uploadSuccess}
          textFlag={false}
          mediaId={fileData?._id}
          getMediaList={getMediaList}
          setEditTitleVideo={setEditTitleVideo}
          editTitleVideo={editTitleVideo}
          setUploadSuccess={setUploadSuccess}
        />
        {currentContract && (
          <button
            onClick={() => {
              copyEmbebed(fileData?._id, currentContract.contractAddress);
            }}
            style={{
              background: primaryButtonColor,
              color: textColor
            }}
            className="rair-button btn rounded-rair white">
            <FontAwesomeIcon icon={faCheck} /> Copy embed code
          </button>
        )}
        <button
          onClick={() => removeVideoAlert()}
          disabled={loadDeleting}
          className={`btn btn-danger rounded-rairo ${
            primaryColor === 'rhyno' ? 'rhyno' : ''
          }`}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
        {!editTitleVideo && <AnalyticsPopUp videoId={fileData?._id} />}
      </div>
      <>
        <Modal
          isOpen={modalIsOpen}
          style={customStyles}
          onRequestClose={closeModal}
          contentLabel="Video Modal">
          <div className="modal-content-wrapper-for-video demo-pop-up">
            <div className="modal-content-video">
              {fileData?.isUnlocked === false ? (
                <>
                  <TooltipBox enterDelay={200} title="You need to buy an NFT.">
                    <>
                      <FontAwesomeIcon
                        data-title="You need to buy an NFT."
                        icon={faLock}
                        className="modal-content-video-lock"
                      />
                    </>
                  </TooltipBox>
                </>
              ) : openVideoplayer ? (
                <NftVideoplayer selectVideo={fileData} />
              ) : (
                fileData.staticThumbnail && (
                  <img
                    onClick={() => setOpenVideoplayer(true)}
                    className={'modal-content-play-image'}
                    src={playImagesColored}
                    alt="Button play video"
                  />
                )
              )}
              {openVideoplayer || !fileData.staticThumbnail ? (
                <></>
              ) : (
                <img
                  alt="Video thumbnail"
                  src={`${fileData?.staticThumbnail}`}
                  className="modal-content-video-thumbnail"
                />
              )}
            </div>
            <div className="modal-content-video-choice">
              <div className="modal-content-close-btn-wrapper">
                <ModalContentCloseBtn
                  onClick={closeModal}
                  isDarkMode={isDarkMode}>
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{ lineHeight: 'inherit' }}
                  />
                </ModalContentCloseBtn>
              </div>
              <div className="modal-content-block-btns">
                {fileData?.isUnlocked === false && (
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
