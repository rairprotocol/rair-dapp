import React, { useCallback, useState } from 'react'
import { ImageUpload } from '../../UserProfileSettings/UploadProfilePicture/ImageUpload/ImageUpload';
import { useForm } from 'react-hook-form';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import {
    BlockAvatar,
    ButtonEdit,
    ErrorInput,
    InputChange,
    LabelForm,
    ListEditProfileMode,
    ProfileButtonBack,
    TitleEditProfile
} from '../NavigationItems/NavigationItems'

const MobileEditProfile = ({ primaryColor, toggleEditMode, userData, editMode, currentUserAddress }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: userData.email
        }
    });
    const [imagePreviewUrl, setImagePreviewUrl] = useState(userData.avatar);
    const [file, setFile] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(false);

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

    const updateProfile = useCallback(async (data) => {
        setLoading(true);
        let formData = new FormData();
        formData.append("nickName", data.name);
        formData.append("email", data.email);
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
            if (res.user.avatar) {
                setImagePreviewUrl(res.user.avatar);
            }
            setLoading(false);
            setStatus(true);
        }
    }, [
        file,
        currentUserAddress,
        setImagePreviewUrl,
        setLoading
    ]);

    const onSubmit = (data) => {
        updateProfile(data);
    }

    return (
        <ListEditProfileMode editMode={editMode} primaryColor={primaryColor}>
            <ProfileButtonBack onClick={toggleEditMode}><i className="fas fa-chevron-left"></i></ProfileButtonBack>
            <TitleEditProfile>Edit Profile</TitleEditProfile>

            <form onSubmit={handleSubmit(onSubmit)}>
                <BlockAvatar>
                    <ImageUpload onChange={photoUpload} src={imagePreviewUrl} />
                </BlockAvatar>
                <div>
                    <LabelForm>
                        Name:
                    </LabelForm>
                    <InputChange
                        id="name"
                        {...register('name', { required: true, maxLength: 20, minLength: 2 })}
                        type="text"
                    />
                    {errors.name && errors.name.type === "required" && (
                        <ErrorInput>This field is required!</ErrorInput>
                    )}
                    {errors.name && errors.name.type === "maxLength" && (
                        <ErrorInput>Name should be less 20 letters!</ErrorInput>
                    )}
                    {errors.name && errors.name.type === "minLength" && (
                        <ErrorInput>Name should be more 2 letters!</ErrorInput>
                    )}
                    <LabelForm
                    >Email:</LabelForm>
                    <InputChange
                        id="email"
                        {...register('email', { required: true })}
                        type="email"
                    />
                    {errors.email && errors.email.type === "required" && (
                        <ErrorInput>This field is required!</ErrorInput>
                    )}
                </div>

                {
                    status ? <Alert style={{display: "flex", justifyContent: "center"}} variant="standard" severity="success">Success! Your profile's updated</Alert> : <>
                        {
                            loading ? <><CircularProgress /></> : <ButtonEdit type="submit">Save changes</ButtonEdit>
                        }
                    </>
                }
            </form>

        </ListEditProfileMode >
    )
}

export default MobileEditProfile