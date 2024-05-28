import { useEffect, useState } from 'react';

function useIPFSImageLink(initialImageLink: any) {
  const [ipfsLink, setIpfsLink] = useState<any>('');
  useEffect(() => {
    if (initialImageLink) {
      const linkSplit = initialImageLink?.split('/');
      const linkFilter = linkSplit.filter((item: string) => {
        return item === 'ipfs:';
      });
      if (linkFilter[0] === 'ipfs:') {
        linkSplit?.map((item: string, index: string | number) => {
          if (item === 'ipfs:') {
            linkSplit[index] = 'https://gateway.moralisipfs.com/ipfs';
            const linkJoin = linkSplit.filter(Boolean).join('/');
            setIpfsLink(linkJoin);
          }
        });
      } else {
        setIpfsLink(initialImageLink);
      }
    }
  }, [initialImageLink, ipfsLink]);
  return ipfsLink;
}

export default useIPFSImageLink;
