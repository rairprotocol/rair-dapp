const headers = () => {
  return {};
};
const paramsVideo = (params) => {
  return {
    itemsPerPage: `${params.itemsPerPage}`,
    pageNum: `${params.pageNum}`
  };
};

export { headers, paramsVideo };
