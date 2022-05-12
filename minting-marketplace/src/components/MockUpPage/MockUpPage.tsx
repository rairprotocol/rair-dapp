//@ts-nocheck
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchPanel from "./SearchPanel";
// import setDocumentTitle from "../../utils/setTitle";
import MetaTags from "../SeoTags/MetaTags";
import RairFavicon from './assets/rair_favicon.ico'

const MockUpPage = ({ item }) => {
  const seoInformation = {
    title: "Rair Tech Marketplace",
    contentName: "author",
    content: "Digital Ownership Encryption",
    description: "RAIR is a Blockchain-based digital rights management platform that uses NFTs to gate access to streaming content",
    favicon: RairFavicon,
    faviconMobile: RairFavicon
  }

  const dispatch = useDispatch();
  const { primaryColor, textColor } = useSelector(store => store.colorStore);
  useEffect(() => {
    // setDocumentTitle(`All`);
    dispatch({
      type: "SHOW_SIDEBAR_TRUE",
    });
  }, [dispatch]);
  return (
    <div className={"mock-up-page-wrapper"}>
      <MetaTags seoMetaTags={seoInformation} />
      <SearchPanel primaryColor={primaryColor} textColor={textColor} />
    </div>
  );
};
export default MockUpPage;
