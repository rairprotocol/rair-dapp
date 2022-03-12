import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchPanel from "./SearchPanel";
import setDocumentTitle from "../../utils/setTitle";

const MockUpPage = ({ item }) => {
  const dispatch = useDispatch();
  const { primaryColor, textColor } = useSelector(store => store.colorStore);
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
