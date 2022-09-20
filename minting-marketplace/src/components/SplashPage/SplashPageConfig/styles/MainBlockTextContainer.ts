import styled from 'styled-components';

export type TMainBlockTitle = {
  color: string;
  fontSize: string;
};

export const MainBlockTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const MainBlockTitle = styled.div<TMainBlockTitle>`
  color: ${({ color }) => color};
  font-size: ${({ fontSize }) => fontSize}; ;
`;
