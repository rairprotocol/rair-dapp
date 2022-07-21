import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IVideoItem, TParticularProduct } from './video.types';
import { SvgKey } from '../MockUpPage/NftList/SvgKey';
import { SvgLock } from '../MockUpPage/NftList/SvgLock';
import axios from 'axios';
import { UserType } from '../../ducks/users/users.types';
import { TUserResponse } from '../../axios.responseTypes';
import { useStateIfMounted } from 'use-state-if-mounted';
// import zIndex from '@mui/material/styles/zIndex';
// import chainData from '../../utils/blockchainData';
// import { TChainItemData } from '../../utils/utils.types';

const VideoItem: React.FC<IVideoItem> = ({ mediaList, item }) => {
  const navigate = useNavigate();
  const [data, setData] = useStateIfMounted<TParticularProduct | null>(null);
  const [dataUser, setDataUser] = useStateIfMounted<UserType | null>(null);

  // const checkChain = (data: TChainItemData) => {
  //   if (data?.name === 'Ethereum Goerli') {
  //     return (
  //       <img
  //         style={{ width: '14px' }}
  //         src={data?.image}
  //         alt={`${data?.name}`}
  //       />
  //     );
  //   } else {
  //     return (
  //       <img
  //         style={{
  //           width: '14px',
  //           transform: 'scale(1.5)',
  //           marginBottom: '2px'
  //         }}
  //         src={data?.image}
  //         alt={`${data?.name}`}
  //       />
  //     );
  //   }
  // };
  const getInfo = useCallback(async () => {
    if (mediaList && item) {
      const response = await axios.get(
        `/api/${mediaList[item].contract}/${mediaList[item].product}`
      );
      setData(response.data.result);
    }
  }, [mediaList, item, setData]);

  const getInfoUser = useCallback(async () => {
    if (mediaList && item && data) {
      const response = await axios.get<TUserResponse>(
        `/api/users/${mediaList[item].authorPublicAddress}`
        // `/api/users/${data.data.result.contract.user}`
      );
      setDataUser(response.data.user);
    }
  }, [mediaList, item, data, setDataUser]);

  useEffect(() => {
    getInfo();
  }, [getInfo]);

  useEffect(() => {
    getInfoUser();
  }, [getInfoUser]);

  const [hovering, setHovering] = useState(false);
  return (
    <button
      className="col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start video-wrapper"
      style={{
        height: '215px',
        // height: '291px',
        width: '384px',
        // width: '291px',
        border: 'none',
        backgroundColor: 'transparent',
        marginBottom: '20px',
        marginRight: '24px'
      }}
      onClick={() => {
        navigate(
          `/watch/${mediaList[item]._id}/${mediaList[item].mainManifest}`
        );
      }}
      onMouseEnter={() => setHovering(mediaList[item].animatedThumbnail !== '')}
      onMouseLeave={() => setHovering(false)}>
      <div
        className="col-12 rounded"
        style={{
          top: 0,
          position: 'relative',
          height: '100%',
          width: 'inherit'
        }}>
        <img
          alt="thumbnail"
          src={`${mediaList[item].staticThumbnail}`}
          style={{
            position: 'absolute',
            bottom: 0,
            borderRadius: '16px',
            // objectFit: 'contain',
            background: 'black'
          }}
          className="col-12 h-100 w-100"
        />
        <img
          alt="Animated thumbnail"
          src={`${mediaList[item].animatedThumbnail}`}
          style={{
            position: 'absolute',
            display: hovering ? 'block' : 'none',
            bottom: 0,
            borderRadius: '16px',
            // objectFit: 'contain',
            background: 'black'
          }}
          className="col-12  h-100 w-100"
        />
        {/* <div
          className="rounded-rair"
          style={{
            backgroundColor: 'var(--charcoal)',
            color: 'white',
            position: 'absolute',
            top: 219,
            right: 9,
            minWidth: '107px',
            height: '25px',
            textAlign: 'center',
            borderRadius: '10px',
            zIndex: '1'
          }}>
          {mediaList[item].duration}
        </div> */}
        {mediaList[item]?.isUnlocked ? (
          <SvgKey color={'#4E4D4D'} bgColor={'white'} />
        ) : (
          <SvgLock color={'white'} />
        )}
      </div>
      <div className="col description-wrapper-video">
        <span className="description-title">{mediaList[item].title}</span>
        <div className="info-wrapper video-size">
          <div className="user-info">
            <div className="user-image">
              <img src={dataUser?.avatar ? dataUser?.avatar : ''} alt="user" />
            </div>
            <div className="user-name">
              <span>{dataUser?.nickName}</span>
            </div>
          </div>
          <div className="price-info">
            {/* <div className="price-image">
              {data?.contract.blockchain &&
                checkChain(chainData[data?.contract.blockchain])}
            </div> */}
            <div className="price-total">
              {/* <span>{data?.contract.products.offers[0].price}</span> */}
              <span className="duration-for-video">
                {' '}
                {mediaList[item].duration}
              </span>
            </div>
            {/* <div className="price-blockchain">
              <span>
                {data?.contract.blockchain &&
                  chainData[data?.contract.blockchain]?.symbol}
              </span>
            </div> */}
          </div>
        </div>
        <br />
        {/* <span className='description'>{mediaList[item].description.slice(0, 25)}{mediaList[item].description.length > 30 ? '...' : ''}<br></br></span> */}
        {/* <span className='description'>{mediaList[item].author.slice(0, 7)}{mediaList[item].author.length > 10 ? '...' : ''}</span> */}
      </div>
    </button>
  );
};

export default VideoItem;
