import styled from 'styled-components';

export const ButtonHeart = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(34, 32, 33, 0.5);
  border-radius: 11.6289px;
  width: 32px;
  height: 32px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;

  i {
    font-size: 18px;
    transition: all 0.1s ease;
  }

  &:hover {
    i {
      color: #19a7f6;
    }
  }
`;
