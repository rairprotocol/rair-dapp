import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatEther } from 'ethers/lib/utils';

import OfferSelector from './OfferSelector';

import { RootState } from '../../ducks';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import useSwal from '../../hooks/useSwal';
import chainData from '../../utils/blockchainData';
import { rFetch } from '../../utils/rFetch';
import InputField from '../common/InputField';

const VideoManager = () => {
  const [uploads, setUploads] = useState([]);
  const [unlockData, setUnlockData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [filter, setFilter] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>({});
  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  const reactSwal = useSwal();

  useEffect(() => {
    setUnlockData([]);
    if (!selectedFile._id) {
      return;
    }
    (async () => {
      const { data, success } = await rFetch(
        `/api/v2/files/${selectedFile._id}/unlocks`
      );
      if (success && data?.offers?.length) {
        setUnlockData(data.offers);
      }
    })();
  }, [selectedFile, refresh]);

  useEffect(() => {
    if (!currentUserAddress) {
      return;
    }
    (async () => {
      const { data, success } = await rFetch('/api/v2/files');
      if (success) {
        setUploads(data);
      }
    })();
  }, [currentUserAddress]);

  const addRange = async () => {
    await reactSwal.fire({
      showConfirmButton: false,
      title: 'Adding range',
      html: <OfferSelector fileId={selectedFile._id} />
    });
    setRefresh(!refresh);
  };

  const refreshFileData = useCallback(async () => {
    const { success, file } = await rFetch(
      `/api/v2/files/byId/${selectedFile._id}`
    );
    if (success) {
      setSelectedFile(file);
    }
  }, [selectedFile]);

  const updateFile = useCallback(async () => {
    await rFetch(`/api/v2/files/byId/${selectedFile._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        demo: !selectedFile.demo
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    refreshFileData();
  }, [selectedFile, refreshFileData]);

  const deleteUnlock = useCallback(
    async (offerId) => {
      await rFetch(`/api/v2/files/${selectedFile._id}/unlocks`, {
        method: 'DELETE',
        body: JSON.stringify({
          offer: offerId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setRefresh(!refresh);
    },
    [selectedFile, refresh]
  );

  return (
    <div className="row py-5 ps-5">
      <h4> My Uploads </h4>
      <div className="col-4">
        <InputField
          customClass="form-control"
          placeholder="Title filter"
          getter={filter}
          setter={setFilter}
        />
        <div>
          {uploads &&
            uploads
              .filter((item: any) => {
                return item?.title
                  ?.toLowerCase()
                  ?.includes(filter.toLowerCase());
              })
              .map((item: any, index) => {
                return (
                  <button
                    onClick={() => setSelectedFile(item)}
                    className="btn btn-outline-primary col-12 my-1 border-rair"
                    key={index}>
                    {item.title}
                  </button>
                );
              })}
        </div>
      </div>
      <div className="col-8 p-5">
        {selectedFile.title && (
          <>
            <div className="w-100">
              <div className="row">
                <div className="col-4">
                  <img
                    className="w-100"
                    src={
                      selectedFile.type === 'video'
                        ? selectedFile.animatedThumbnail
                        : selectedFile.staticThumbnail
                    }
                  />
                </div>
                <div className="col-8 py-5">
                  <small>{selectedFile.type}</small>
                  <h3>{selectedFile.title}</h3>
                  <h5>
                    <i className="fa fa-eye" /> {selectedFile.views}
                  </h5>
                  <span>{selectedFile.category.name}</span>
                  <br />
                  <button onClick={updateFile} className="btn btn-royal-ice">
                    {selectedFile.demo ? 'Demo' : 'Unlockable'}
                  </button>
                  <br />
                  <small>{selectedFile.duration}</small>
                  <br />
                  <span>{selectedFile.description}</span>
                </div>
              </div>
            </div>
            Unlocks with the following ranges:
            {unlockData &&
              unlockData.map((unlock: any, index) => {
                return (
                  <div
                    className="text-start border-secondary col-12 rounded-rair mt-2 py-2 px-5 "
                    key={index}>
                    {chainData[unlock.contract.blockchain]?.image && (
                      <img
                        className="me-5"
                        style={{ width: '2rem' }}
                        src={chainData[unlock.contract.blockchain]?.image}
                      />
                    )}
                    <small className="me-3">
                      ({unlock.soldCopies} / {unlock.copies})
                    </small>
                    <span className="me-3">
                      {unlock.contract.title} - {unlock.offerName}
                    </span>
                    <b>
                      {formatEther(unlock.price)}{' '}
                      {chainData[unlock.contract.blockchain].symbol}
                    </b>
                    <button
                      className="btn float-end btn-danger"
                      onClick={() => deleteUnlock(unlock._id)}>
                      <i className="fa fa-trash" />{' '}
                    </button>
                  </div>
                );
              })}
            <br />
            <button onClick={addRange} className="btn float-end btn-stimorol">
              Add range{' '}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoManager;
