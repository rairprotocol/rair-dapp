import React from 'react';
import Swal from 'sweetalert2';

import { ButtonHeart } from './BtnMyFavorite.styled';

interface IBtnMyFavorite {
  removeFavotite: () => void;
}

const BtnMyFavorite: React.FC<IBtnMyFavorite> = ({ removeFavotite }) => {
  const warningBeforeRemove = () => {
    Swal.fire({
      title: 'Do you want to remove NFT from MyFavorite?',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: 'Remove'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        removeFavotite();
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  };

  return (
    <ButtonHeart onClick={() => warningBeforeRemove()}>
      <i className="fas fa-heart like-button"></i>
    </ButtonHeart>
  );
};

export default BtnMyFavorite;
