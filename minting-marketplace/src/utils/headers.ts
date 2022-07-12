const headers = () => {
  return {
    'X-rair-token': `${localStorage.token}`
  };
};
const paramsVideo = (params) => {
  return {
    itemsPerPage: `${params.itemsPerPage}`,
    pageNum: `${params.pageNum}`
  };
};

export { headers, paramsVideo };
