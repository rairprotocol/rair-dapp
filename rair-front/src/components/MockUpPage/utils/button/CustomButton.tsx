import { FC } from 'react';

import { ShowMoreContainer, ShowMoreItem, ShowMoreText } from './ShowMoreItems';

import { useAppSelector } from '../../../../hooks/useReduxHooks';
import { ICustomButton } from '../../NftList/nftList.types';

import cl from './CustomButton.module.css';

const CustomButton: FC<ICustomButton> = ({
  text,
  width,
  height,
  onClick,
  textColor,
  margin,
  font,
  background,
  hoverBackground,
  padding,
  loading = false
}) => {
  const { primaryColor } = useAppSelector((store) => store.colors);

  return (
    <ShowMoreContainer
      className={cl.nftDataPageShowMoreWrapper}
      loading={loading.toString()}
      width={width}
      height={height}
      textColor={textColor}
      background={background ? background : undefined}
      margin={margin}>
      {onClick ? (
        <ShowMoreItem
          background={background}
          hoverBackground={hoverBackground}
          width={width}
          height={height}
          textColor={textColor}
          primaryColor={primaryColor}
          className={cl.nftDataPageShowMore}
          onClick={onClick}
          padding={padding}>
          <ShowMoreText
            className={cl.nftDataPageShowMoreText}
            font={font}
            fontSize={'1rem'}
            fontColor={'#fff'}>
            {text}
          </ShowMoreText>
        </ShowMoreItem>
      ) : (
        <ShowMoreItem
          width={width}
          height={height}
          textColor={textColor}
          className={cl.nftDataPageShowMore}>
          <ShowMoreText
            className={cl.nftDataPageShowMoreText}
            font={font}
            fontSize={'1rem'}
            fontColor={'#fff'}>
            {text}
          </ShowMoreText>
        </ShowMoreItem>
      )}
    </ShowMoreContainer>
  );
};

export default CustomButton;
