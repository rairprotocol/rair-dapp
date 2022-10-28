import React from 'react';

import CardParagraghTextContainer from './CardParagraghTextContainer/CardParagraghTextContainer';
import {
  CardParagraghElement,
  CardParagraghWrapper,
  CardParagrashTitle
} from './styled/CardParagraghText.styled';
import { ICardParagraphText } from './types/CardParagragh.types';

const CardParagraphText: React.FC<ICardParagraphText> = ({
  title,
  arrayParagragh,
  fontFamilyTitle,
  fontWeight,
  fontAlign
}) => {
  return (
    <CardParagraghWrapper>
      {title && (
        <CardParagrashTitle
          fontWeight={fontWeight}
          fontAlign={fontAlign}
          fontFamily={fontFamilyTitle}>
          {title}
        </CardParagrashTitle>
      )}
      {arrayParagragh &&
        arrayParagragh.map((item, index) => {
          if (item.imgText) {
            return <CardParagraghTextContainer item={item} key={index} />;
          }
          return (
            <React.Fragment key={index}>
              {item.text.map((el, index) => {
                return (
                  <CardParagraghElement key={index}>{el}</CardParagraghElement>
                );
              })}
            </React.Fragment>
          );
        })}
    </CardParagraghWrapper>
  );
};

export default CardParagraphText;
