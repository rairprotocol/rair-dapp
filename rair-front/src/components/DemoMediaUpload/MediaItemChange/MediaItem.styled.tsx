import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

interface IMediaItemContainerStyled {
  editTitleVideo: boolean;
}

export const MediaItemContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<IMediaItemContainerStyled>`
  @media screen and (max-width: 1640px) and (min-width: 1480px) {
    & {
      padding-left: ${(props) => (!props.editTitleVideo ? '4rem' : 0)};
    }
  }

  @media screen and (max-width: 1480px) and (min-width: 1360px) {
    & {
      padding-left: ${(props) => (!props.editTitleVideo ? '5rem' : 0)};
    }
  }

  @media screen and (max-width: 1360px) {
    & {
      padding-left: ${(props) => (!props.editTitleVideo ? '3.5rem' : 0)};
    }
  }

  @media screen and (max-width: 1200px) {
    & {
      padding-left: 0;
      padding-top: 20px;
    }
  }
`;
