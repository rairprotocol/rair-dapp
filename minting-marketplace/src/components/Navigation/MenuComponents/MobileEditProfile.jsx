import React, { useCallback, useState } from 'react'
import { ImageUpload } from '../../UserProfileSettings/UploadProfilePicture/ImageUpload/ImageUpload';
import { BlockAvatar, ButtonEdit, InputChange, LabelForm, ListEditProfileMode, ProfileButtonBack, TitleEditProfile } from '../NavigationItems/NavigationItems'
// import defaultPictures from './../../../images/defaultUserPictures.png'

const MobileEditProfile = ({ primaryColor, toggleEditMode, userData, editMode, currentUserAddress }) => {
    const [name, setName] = useState(userData.nickName);
    const [email, setEmail] = useState(userData.email);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(userData.avatar);
    const [file, setFile] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(false);

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    console.log(loading, "loading")

    const photoUpload = useCallback(
        (e) => {
            e.preventDefault();
            const reader = new FileReader();
            const fileF = e.target.files[0];
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
                setFile(fileF);
            };
            reader.readAsDataURL(fileF);
        },
        [setImagePreviewUrl, setFile]
    );

    const updateProfile = useCallback(async () => {
        setLoading(true);
        let formData = new FormData();
        formData.append("nickName", name);
        formData.append("email", email);
        if (file) {
            formData.append("file", file);
        }
        const res = await fetch(`/api/users/${currentUserAddress.toLowerCase()}`, {
            method: "POST",
            headers: {
                Accept: "multipart/form-data",
                "X-rair-token": localStorage.token,
            },
            body: formData,
        }).then((data) => {
            return data.json()
        });

        if (res.success) {
            setName(res.user.nickName);
            setEmail(res.user.email);
            if (res.user.avatar) {
                setImagePreviewUrl(res.user.avatar);
            }
            setLoading(false);
            setStatus(true);
        }
    }, [
        name,
        email,
        file,
        currentUserAddress,
        setName,
        setEmail,
        setImagePreviewUrl,
        setLoading
    ]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            updateProfile();
        },
        [updateProfile]
    );

    return (
        <ListEditProfileMode editMode={editMode} primaryColor={primaryColor}>
            <ProfileButtonBack onClick={toggleEditMode}><i className="fas fa-chevron-left"></i></ProfileButtonBack>
            <TitleEditProfile>Edit Profile</TitleEditProfile>

            <form onSubmit={handleSubmit}>
                <BlockAvatar>
                    <ImageUpload onChange={photoUpload} src={imagePreviewUrl} />
                </BlockAvatar>
                <div>
                    <LabelForm>Name:</LabelForm>
                    <InputChange onChange={onChangeName} type="text" value={name.replace(/\@/g, '')} />
                    <LabelForm>Email:</LabelForm>
                    <InputChange onChange={onChangeEmail} type="email" value={email} />
                </div>

                {
                    status ? <h5>Saved!</h5> : <>
                        {
                            loading ? <h5>loading...</h5> : <ButtonEdit type="submit">Save changes</ButtonEdit>
                        }
                    </>
                }
            </form>

        </ListEditProfileMode >
    )
}

export default MobileEditProfile