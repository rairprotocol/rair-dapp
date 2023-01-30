import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import InputSelect from '../../common/InputSelect';
import NftVideoplayer from '../../MockUpPage/NftList/NftData/NftVideoplayer/NftVideoplayer';
import { ModalContentCloseBtn } from '../../MockUpPage/utils/button/ShowMoreItems';
import { playImagesColored } from '../../SplashPage/images/greyMan/grayMan';
import MediaItemChange from '../MediaItemChange/MediaItemChange';
import { IUploadedListBox } from '../types/DemoMediaUpload.types';

const UploadedListBox: React.FC<IUploadedListBox> = ({
  fileData,
  index,
  setMediaList,
  mediaList,
  uploadSuccess,
  copyEmbebed,
  selectCommonInfo,
  updateMediaCategory,
  mediaUploadedList,
  deleterUploaded,
  categories
}) => {
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const [openVideoplayer, setOpenVideoplayer] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

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
      height: 'auto'
    }
  };

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
        <img
          onClick={openModal}
          className="w-100"
          src={fileData.animatedThumbnail}
        />
        {/* <p className="col-12">{fileData.title}</p> */}
        <MediaItemChange
          setMediaList={setMediaList}
          item={fileData}
          index={index}
          mediaList={mediaList}
          uploadSuccess={uploadSuccess}
          textFlag={true}
        />
        <button
          // disabled={
          //   uploadSuccess === false ||
          //   uploading ||
          //   fileData.category === 'null' ||
          //   fileData.description === 'test' ||
          //   fileData.offer === 'null'
          // }
          onClick={() => copyEmbebed(fileData._id)}
          className="col-12 btn-stimorol btn rounded-rair white">
          <>
            <i className="fas fa-check" /> Copy embed code{' '}
          </>
        </button>
        <div className="border-stimorol rounded-rair col-12">
          <InputSelect
            options={categories}
            setter={() =>
              updateMediaCategory(mediaUploadedList, index, fileData.category)
            }
            placeholder="Unlockable status"
            getter={fileData.category}
            disabled={true}
            {...selectCommonInfo}
          />
        </div>
        <button
          onClick={() => deleterUploaded(fileData._id)}
          className="btn btn-danger rounded-rairo">
          <i className="fas fa-trash" />
        </button>
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
                  <i
                    data-title="You need to buy NFT"
                    className="fa fa-lock modal-content-video-lock"
                  />
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
