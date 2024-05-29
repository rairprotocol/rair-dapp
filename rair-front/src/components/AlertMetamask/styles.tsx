import styled from 'styled-components';

export const Alert = styled.div`
  width: 100%;
  position: fixed;
  display: flex;
  padding: 1.3vh 1vw;
  align-items: center;
  text-align: center;
  justify-content: center;
  background: var(--yellow-alert);
  z-index: 101;
  transition: background 0.5s ease;
  cursor: default;

  :hover {
    color: white;
    background: #7400af;
  }
  @media (max-width: 500px) {
    font-size: 12px;
  }

  svg {
    cursor: pointer;
  }
`;
