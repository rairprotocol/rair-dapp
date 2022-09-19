import styled from 'styled-components';

export type ISplashMainBlockWrapper = {
  widthDiff?: string;
  heightDiff?: string;
  bgColor?: string;
};

export const SplashMainBlockWrapper = styled.div<ISplashMainBlockWrapper>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  background-color: ${(props) => (props.bgColor ? props.bgColor : 'none')};
  width: ${(props) => (props.widthDiff ? props.widthDiff : '1200px')};
  height: ${(props) => (props.heightDiff ? props.heightDiff : '694px')};
`;
