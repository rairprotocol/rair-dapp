import { useEffect, useState } from 'react';
import { ILikeButton } from '../../mockupPage.types';
import './LikeButton.css';

const LikeButton: React.FC<ILikeButton> = ({ likeButtonStyle }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(false);
    //get liked status
  }, []);
  const likeHandler = () => {
    setLiked(!liked);
  };

  return (
    <div
      className={likeButtonStyle}
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
