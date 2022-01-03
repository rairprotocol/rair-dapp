import React, { useCallback, useState, useRef, useEffect } from "react";
import { Edit } from "./Edit/Edit";
import { Profile } from "./Profile/Profile";

const UploadProfilePicture = ({setOpenModalPic}) => {
  const [, /*file*/ setFile] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    "https://static.dezeen.com/uploads/2021/06/elon-musk-architect_dezeen_1704_col_1.jpg"
  );
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [active, setActive] = useState("edit");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      let activeP = active === "edit" ? "profile" : "edit";
      setActive(activeP);
    },
    [active]
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
