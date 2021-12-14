import React, { useCallback, useState, useRef, useEffect } from "react";
import { Edit } from "./Edit/Edit";
import { Profile } from "./Profile/Profile";

const UploadProfilePicture = ({setOpenModalPic, currentUserAddress, setUserName, setUserEmail}) => {
  const [, /*file*/ setFile] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    "https://static.dezeen.com/uploads/2021/06/elon-musk-architect_dezeen_1704_col_1.jpg"
  );
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [active, setActive] = useState("edit");

  const [updateUsr, setUpdateUsr] = useState({});

  // console.log(currentUserAddress);
  // console.log(updateUsr, "updateUsr");
  // console.log(name, "name");

  const upPr = useCallback(async () => {
    const res = await fetch(
      `/api/users/${currentUserAddress.toLowerCase()}?publicAddress=${currentUserAddress.toLowerCase()}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-rair-token": localStorage.token,
        },
        body: JSON.stringify({
          nickName: name,
          email: status,
        }),
      }
    )
    .then(blob => blob.json());
    setUpdateUsr(res);
    setUserName(res.user.nickName);
    setUserEmail(res.user.email)
  }, [currentUserAddress, name, status, setUserEmail, setUserName]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      let activeP = active === "edit" ? "profile" : "edit";
      setActive(activeP);
      upPr()
    },
    [active, upPr, ]
  );

  const rootEl = useRef(null);

  useEffect(() => {
    const onClick = e => rootEl.current.contains(e.target) || setOpenModalPic(false);
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
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
