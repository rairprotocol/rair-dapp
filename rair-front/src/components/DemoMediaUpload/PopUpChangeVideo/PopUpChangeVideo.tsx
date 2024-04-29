import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { PopUpVideoChangeBox } from './PopUpChangeVideoStyled';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
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
  const { primaryColor, textColor, primaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const [desc, setDesc] = useState(item.description);
  const [title, setTitle] = useState(item.title);
  const [categories, setCategories] = useState<OptionsType[] | undefined>(
    undefined
  );
  const [itemCategory, setItemCategory] = useState(item.category);

  const getCategory = useCallback(async () => {
    const { success, categories } = await rFetch(`/api/files/categories`);

    if (success) {
      setCategories(
        categories.map((item) => {
          return {
            id: item._id,
            label: item.name,
            value: item.name,
            disabled: false
          };
        })
      );
    }
  }, [setCategories]);

  const updateVideoData = async () => {
    if (beforeUpload && categories) {
      const choiceCategory: any =
        categories &&
        categories.find((item: any) => item.value === itemCategory);
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
      const choiceCategory: any =
        categories &&
        categories.find((item: any) => item.value === itemCategory);

      setUploadSuccess(true);

      const updatedVideo = {
        description: desc,
        title: title,
        category: choiceCategory.id
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
          Swal.fire('Successfully!', 'Video has been updated.', 'success');
          closeModal();
          setUploadSuccess(null);
        }

        if (request.error) {
          closeModal();
          setDesc(item.description);
          setTitle(item.title);
          setItemCategory(item.category);
          setUploadSuccess(null);
        }
      } catch (e) {
        closeModal();
        setDesc(item.description);
        setTitle(item.title);
        setItemCategory(item.category);
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
      color: `${primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : '#fff'}`,
      marginTop: 5,
      marginBottom: 5
    }
  };

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

      if (categories && categories.length > 0) {
        const defaultCategory: any =
          categories && categories.find((el: any) => el.id === item.category);

        if (defaultCategory) {
          setItemCategory(defaultCategory.value);
        } else {
          setItemCategory(item.category);
        }
      }
    }
  }, [item, modalIsOpen, categories]);

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
            //   {...selectCommonInfoNFT}
          />
          <InputField
            getter={desc}
            setter={setDesc}
            label="Description"
            customClass="form-control input-select-custom-style"
            placeholder="Select a description"
            //   {...selectCommonInfoNFT}
          />
          <InputSelect
            //   customClass="form-control input-select-custom-style"
            label="Category"
            getter={itemCategory}
            setter={setItemCategory}
            options={categories}
            placeholder="Select a Category"
            {...selectCommonInfoNFT}
          />
          <button
            onClick={() => updateVideoData()}
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
