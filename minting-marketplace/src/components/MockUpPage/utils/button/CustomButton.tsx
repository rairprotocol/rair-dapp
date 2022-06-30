//@ts-nocheck
import React from 'react';
import { useSelector } from 'react-redux';

import cl from './CustomButton.module.css';
import { ShowMoreContainer, ShowMoreItem } from './ShowMoreItems';

function CustomButton({
  text,
  width,
  height,
  onClick,
  textColor,
  margin
  //   primaryColor,
}) {
  const { primaryColor } = useSelector((store) => store.colorStore);

  return (
    <ShowMoreContainer
      className={cl.nftDataPageShowMoreWrapper}
      width={width}
      height={height}
      color={textColor}
      margin={margin}>
      {onClick ? (
        <ShowMoreItem
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
}

export default CustomButton;
