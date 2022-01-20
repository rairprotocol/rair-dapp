import React, { useCallback, useState, useRef, useEffect } from "react";
import { Edit } from "./Edit/Edit";
import { Profile } from "./Profile/Profile";

const UploadProfilePicture = ({
  setOpenModalPic,
  currentUserAddress,
  setUserName,
  setUserEmail,
  setImagePreviewUrl,
  imagePreviewUrl,
}) => {
  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [active, setActive] = useState("edit");

  const [, /*updateUsr*/ setUpdateUsr] = useState({});

  const updateProfile = useCallback(async () => {
    let formData = new FormData();
    formData.append("nickName", name);
    formData.append("email", status);
    if(file){
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
    setUserName(res.user.nickName);
    setUserEmail(res.user.email);
    if(res.user.avatar){
      setImagePreviewUrl(res.user.avatar);
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

  useEffect(() => {
    const onClick = (e) =>
      rootEl.current.contains(e.target) || setOpenModalPic(false);
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [setOpenModalPic]);

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
        />
      ) : (
        <Profile
          setOpenModalPic={setOpenModalPic}
          onSubmit={handleSubmit}
          src={imagePreviewUrl}
          name={name}
          status={status}
        />
      )}
    </div>
  );
};

export default UploadProfilePicture;
