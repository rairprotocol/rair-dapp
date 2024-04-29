import React from 'react';

import {
  CardParagraghElement,
  CardParagraghImageContainer,
  CardParagraghTextBlock
} from '../styled/CardParagraghText.styled';

const CardParagraghTextContainer = ({ item }) => {
  return (
    <CardParagraghImageContainer>
      <CardParagraghTextBlock>
        <React.Fragment>
          {item.text.map((el, index) => {
            return (
              <CardParagraghElement key={index}>{el}</CardParagraghElement>
            );
          })}
        </React.Fragment>
      </CardParagraghTextBlock>
      <>
        <img src={item.imgText.img} alt={item.imgText.alt} />
      </>
    </CardParagraghImageContainer>
  );
};

export default CardParagraghTextContainer;
