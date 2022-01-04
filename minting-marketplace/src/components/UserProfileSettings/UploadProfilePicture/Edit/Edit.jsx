import React, { memo, useCallback } from "react";
import { ImageUpload } from "../ImageUpload/ImageUpload";
import { Name } from "../Name/Name";
import { Status } from "../Status/Status";
import cl from "./Edit.module.css";

const EditComponent = ({
  onSubmit,
  imagePreviewUrl,
  setImagePreviewUrl,
  setName,
  name,
  setStatus,
  status,
  setFile,
  setOpenModalPic
}) => {
  
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

  return (
    <div className={cl.card}>
      <form onSubmit={onSubmit}>
        <h1>Profile Card</h1>
        <ImageUpload onChange={photoUpload} src={imagePreviewUrl} />
        <Name onChange={(e) => setName(e.target.value)} value={name} />
        <Status onChange={(e) => setStatus(e.target.value)} value={status} />
        <button 
        type="submit" className={cl.save}>
          Save{" "}
        </button>
        <button onClick={() => setOpenModalPic(false)} className={cl.save}>
          Exit{" "}
        </button>
      </form>
    </div>
  );
};

export const Edit = memo(EditComponent);
