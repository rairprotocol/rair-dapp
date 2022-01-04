import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import SearchPanel from "./SearchPanel";
import setDocumentTitle from "../../utils/setTitle";

const MockUpPage = ({ item, primaryColor, textColor }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    setDocumentTitle(`All`);
    dispatch({
      type: "SHOW_SIDEBAR_TRUE",
    });
  }, [dispatch]);
  return (
    <div className={"mock-up-page-wrapper"}>
      <SearchPanel primaryColor={primaryColor} textColor={textColor} />
    </div>
  );
};
export default MockUpPage;
