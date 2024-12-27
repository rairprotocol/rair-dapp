//@ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';

import { PopUpVideoChangeBox } from './PopUpChangeVideoStyled';

import { useAppSelector } from '../../../hooks/useReduxHooks';
import useSwal from '../../../hooks/useSwal';
import { CustomModalStyle } from '../../../types/commonTypes';
import { rFetch } from '../../../utils/rFetch';
import { OptionsType } from '../../common/commonTypes/InputSelectTypes.types';
import InputField from '../../common/InputField';
import InputSelect from '../../common/InputSelect';
import { IPopUpChangeVideo } from '../types/DemoMediaUpload.types';

const PopUpChangeVideo: React.FC<IPopUpChangeVideo> = ({
  modalIsOpen,
  closeModal,
  item,
  setUploadSuccess,
  beforeUpload,
  setMediaList,
  mediaList,
  index
}) => {
  const { primaryColor, textColor, primaryButtonColor, isDarkMode } =
    useAppSelector((store) => store.colors);
  const { categories } = useAppSelector((store) => store.settings);
  const rSwal = useSwal();

  const [desc, setDesc] = useState(item.description);
  const [title, setTitle] = useState(item.title);
  const [categoryList, setCategoryList] = useState<OptionsType[] | undefined>(
    undefined
  );
  const [itemCategory, setItemCategory] = useState(item.category._id);

  const getCategory = useCallback(async () => {
    if (categories) {
      setCategoryList(
        categories.map((item) => {
          return {
            id: item._id,
            label: item.name,
            value: item._id,
            disabled: false
          };
        })
      );
    }
  }, [categories]);

  const updateVideoData = async () => {
    if (beforeUpload && categoryList) {
      const choiceCategory: any =
        categoryList &&
        categoryList.find((item: any) => item.value === itemCategory);
      const newMediaList = mediaList;

      newMediaList[index].description = desc;
      newMediaList[index].title = title;

      if (choiceCategory && choiceCategory.id) {
        newMediaList[index].category = choiceCategory.id;
      } else {
        newMediaList[index].category = 'DEMO';
      }

      setMediaList(newMediaList);
      closeModal();
    } else {
      setUploadSuccess(true);

      const updatedVideo = {
        description: desc,
        title: title,
        category: itemCategory
      };
      try {
        const request = await rFetch(`/api/files/update/${item._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedVideo)
        });

        if (request.success) {
          rSwal.fire('Successfully!', 'Video has been updated.', 'success');
          closeModal();
          setUploadSuccess(null);
        }

        if (request.error) {
          closeModal();
          setDesc(item.description);
          setTitle(item.title);
          setItemCategory(item.category._id);
          setUploadSuccess(null);
        }
      } catch (e) {
        closeModal();
        setDesc(item.description);
        setTitle(item.title);
        setItemCategory(item.category._id);
        setUploadSuccess(null);
      }
    }
  };

  const selectCommonInfoNFT = {
    customClass: 'form-control rounded-rair',
    customCSS: {
      backgroundColor: `color-mix(in srgb, ${primaryColor}, #888888)`,
      color: textColor
    },
    optionCSS: {
      color: textColor
    },
    labelCSS: {
      color: textColor,
      marginTop: 5,
      marginBottom: 5
    }
  };

  const customStyles: CustomModalStyle = {
    overlay: {
      zIndex: '1'
    },
    content: {
      background: isDarkMode
        ? `color-mix(in srgb, ${primaryColor}, #2D2D2D)`
        : 'var(--rhyno)',
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
      width: 368
    }
  };

  useEffect(() => {
    getCategory();
  }, [getCategory]);

  useEffect(() => {
    if (!modalIsOpen) {
      setDesc(item.description);
      setTitle(item.title);

      if (categoryList && categoryList.length > 0) {
        const defaultCategory: any =
          categoryList &&
          categoryList.find((el: any) => el.id === item.category);

        if (defaultCategory) {
          setItemCategory(defaultCategory.value);
        } else {
          setItemCategory(item.category._id);
        }
      }
    }
  }, [item, modalIsOpen, categoryList]);

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        onRequestClose={closeModal}
        contentLabel="Video Modal">
        <PopUpVideoChangeBox primaryColor={primaryColor}>
          <InputField
            getter={title}
            setter={setTitle}
            label="Title"
            customClass="form-control input-select-custom-style"
            placeholder="Select a description"
            {...selectCommonInfoNFT}
          />
          <InputField
            getter={desc}
            setter={setDesc}
            label="Description"
            customClass="form-control input-select-custom-style"
            placeholder="Select a description"
            {...selectCommonInfoNFT}
          />
          <InputSelect
            //   customClass="form-control input-select-custom-style"
            label="Category"
            getter={itemCategory}
            setter={setItemCategory}
            options={categoryList}
            placeholder="Select a Category"
            {...selectCommonInfoNFT}
          />
          <button
            onClick={updateVideoData}
            disabled={title === '' || desc === '' || itemCategory === ''}
            style={{
              marginTop: 30,
              background: primaryButtonColor,
              color: textColor
            }}
            className="col-12 rair-button btn rounded-rair white">
            Update
          </button>
        </PopUpVideoChangeBox>
      </Modal>
    </div>
  );
};

export default PopUpChangeVideo;
