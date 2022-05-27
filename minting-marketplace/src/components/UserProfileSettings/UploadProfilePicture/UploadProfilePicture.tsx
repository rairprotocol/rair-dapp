//@ts-nocheck
import React, { useCallback, useState, useRef, useEffect } from "react";
import { Edit } from "./Edit/Edit";
import { Profile } from "./Profile/Profile";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const UploadProfilePicture = ({
  setOpenModalPic,
  currentUserAddress,
  setUserName,
  setUserEmail,
  setImagePreviewUrl,
  imagePreviewUrl,
  setTriggerState,
}) => {
  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [active, setActive] = useState("edit");
  const { primaryColor } = useSelector(store => store.colorStore);

  const [, /*updateUsr*/ setUpdateUsr] = useState({});

  const updateProfile = useCallback(async () => {
    let formData = new FormData();
    formData.append("nickName", name);
    formData.append("email", status);
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
    }).then((blob) => blob.json());
    setUpdateUsr(res);

    if (res.success) {
      setUserName(res.user.nickName);
      setUserEmail(res.user.email);
    }

    if (res?.user?.avatar) {
      setImagePreviewUrl(res.user.avatar);
    }

    if (!res.success) {
      Swal.fire('Info', `${res.message}`, 'question');
    }
  }, [
    name,
    status,
    file,
    currentUserAddress,
    setUserName,
    setUserEmail,
    setImagePreviewUrl,
  ]);

  // const upPr = useCallback(async () => {
  //   const res = await fetch(
  //     `/api/users/${currentUserAddress.toLowerCase()}?publicAddress=${currentUserAddress.toLowerCase()}`,
  //     {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-rair-token": localStorage.token,
  //       },
  //       body: JSON.stringify({
  //         nickName: name,
  //         email: status,
  //       }),
  //     }
  //   )
  //   .then(blob => blob.json());
  //   setUpdateUsr(res);
  //   setUserName(res.user.nickName);
  //   setUserEmail(res.user.email)
  // }, [currentUserAddress, name, status, setUserEmail, setUserName]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      let activeP = active === "edit" ? "profile" : "edit";
      setActive(activeP);
      updateProfile();
    },
    [active, updateProfile]
  );

  const rootEl = useRef(null);

  const onCloseModalPic = useCallback(() => {
    setOpenModalPic(false);
    setTriggerState(false);
  }, [setOpenModalPic, setTriggerState]);

  const onClick = useCallback(
    (e) => rootEl.current.contains(e.target) || onCloseModalPic(),
    [onCloseModalPic]
  );

  useEffect(() => {
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [onClick, setOpenModalPic]);

  return (
    <div ref={rootEl}>
      {active === "edit" ? (
        <Edit
          currentUserAddress={currentUserAddress}
          imagePreviewUrl={imagePreviewUrl}
          name={name}
          status={status}
          setImagePreviewUrl={setImagePreviewUrl}
          setStatus={setStatus}
          setName={setName}
          setFile={setFile}
          onSubmit={handleSubmit}
          setOpenModalPic={setOpenModalPic}
          setTriggerState={setTriggerState}
          primaryColor={primaryColor}
        />
      ) : (
        <Profile
          setOpenModalPic={setOpenModalPic}
          onSubmit={handleSubmit}
          src={imagePreviewUrl}
          name={name}
          status={status}
          setTriggerState={setTriggerState}
        />
      )}
    </div>
  );
};

export default UploadProfilePicture;
