export const changeIPFSLink = (
  str = 'https://ipfs.io/ipfs/QmUEr1RZXxtDbBB8QQBPP7VnVLwx8AANPjmkM4ux3t1aaK/1683105830974-2845269091.jpeg'
) => {
  const array = str.split('https://ipfs.io/ipfs/');
  return process.env.REACT_APP_IPFS_GATEWAY + array[1];
};
