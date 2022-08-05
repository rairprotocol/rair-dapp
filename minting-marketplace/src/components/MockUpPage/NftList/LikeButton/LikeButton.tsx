import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import './LikeButton.css';

const LikeButton = () => {
  const [liked, setLiked] = useState(false);
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  useEffect(() => {
    setLiked(false);
    //get liked status
  }, []);
  const likeHandler = () => {
    //set liked status to the opposite of what it is right now
    setLiked(!liked);
  };

  return (
    <div
      className={`like-button-container ${
        primaryColor === 'rhyno' ? 'rhyno' : ''
      }`}
      onClick={() => {
        likeHandler();
      }}>
      {liked ? (
        <i className="fas fa-heart like-button" />
      ) : (
        <i className="far fa-heart like-button" />
      )}
    </div>
  );
};

export default LikeButton;
