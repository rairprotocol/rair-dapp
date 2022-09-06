import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../ducks';
import { ColorChoice } from '../../../../ducks/colors/colorStore.types';
import { ICustomButton } from '../../NftList/nftList.types';
import cl from './CustomButton.module.css';
import { ShowMoreContainer, ShowMoreItem } from './ShowMoreItems';

const CustomButton: React.FC<ICustomButton> = ({
  text,
  width,
  height,
  onClick,
  textColor,
  margin,
  custom
}) => {
  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );

  return (
    <ShowMoreContainer
      className={cl.nftDataPageShowMoreWrapper}
      width={width}
      height={height}
      textColor={textColor}
      margin={margin}>
      {onClick ? (
        <ShowMoreItem
          background={custom}
          width={width}
          height={height}
          textColor={textColor}
          primaryColor={primaryColor}
          className={cl.nftDataPageShowMore}
          onClick={onClick}>
          <span className={cl.nftDataPageShowMoreText}>{text}</span>
        </ShowMoreItem>
      ) : (
        <ShowMoreItem
          width={width}
          height={height}
          textColor={textColor}
          className={cl.nftDataPageShowMore}>
          <span className={cl.nftDataPageShowMoreText}>{text}</span>
        </ShowMoreItem>
      )}
    </ShowMoreContainer>
  );
};

export default CustomButton;
