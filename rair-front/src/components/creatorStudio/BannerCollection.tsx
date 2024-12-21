//@ts-nocheck
import { useCallback, useEffect, useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAppSelector } from "../../hooks/useReduxHooks";
import useSwal from "../../hooks/useSwal";
import { rFetch } from "../../utils/rFetch";
import { changeIPFSLink } from "../MockUpPage/NftList/utils/changeIPFSLink";

export const BannerCollection = ({ item, getContractData }) => {
  const { primaryColor } = useAppSelector((store) => store.colors);
  const rSwal = useSwal();

  const [fileUpload, setFileUpload] = useState<any>();
  const [loadingBg, setLoadingBg] = useState<boolean>(false);

  const photoUpload = useCallback(
    (e) => {
      e.preventDefault();
      const reader = new FileReader();
      const fileF = e.target.files[0];
      reader.onloadend = () => {
        if (fileF.type !== "video/mp4") {
          setFileUpload(fileF);
        } else {
          rSwal.fire(
            "Info",
            `You cannot upload video to background!`,
            "warning"
          );
        }
      };
      if (fileF) {
        reader.readAsDataURL(fileF);
      }
    },
    [setFileUpload, rSwal]
  );

  const editBackground = useCallback(async () => {
    const formData = new FormData();
    if (fileUpload) {
      setLoadingBg(true);
      formData.append("banner", fileUpload);

      const response = await rFetch(`/api/products/${item._id}`, {
        method: "POST",
        body: formData,
      });

      if (response.success) {
        setLoadingBg(false);
        getContractData();
      } else {
        setLoadingBg(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUpload]);

  useEffect(() => {
    editBackground();
  }, [editBackground]);

  return (
    <>
      {loadingBg ? (
        <div
          className={`col-1 btn btn-${primaryColor} text-start rounded-rair my-1 m-1 banner-collection`}
        >
          <div className={`loadingProfile`}>
            <div className="loader-wrapper">
              <div className="load" />
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundImage: `url(${
              item && item?.bannerImage
                ? changeIPFSLink(item.bannerImage)
                : "https://storage.googleapis.com/rair_images/1683038949498-1548817833.jpeg"
            })`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
          className={`col-1 btn btn-${primaryColor} text-start rounded-rair my-1 m-1 banner-collection`}
        >
          <FontAwesomeIcon icon={faPlus} />
          <label className={"inputFile"}>
            <input
              className="col-1"
              disabled={loadingBg ? true : false}
              type="file"
              onChange={photoUpload}
            />
          </label>
        </div>
      )}
    </>
  );
};
