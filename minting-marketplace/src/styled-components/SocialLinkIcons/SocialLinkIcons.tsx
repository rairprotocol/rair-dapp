import styled from 'styled-components';

export const SocialBox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid
    ${(props) => (props.primaryColor === 'rhyno' ? '#D0D0D0' : '#fff')};

  display: flex;
  justify-content: center;
  align-items: center;

  margin-right: ${(props) => props.marginRight};
  margin-left: ${(props) => props.marginLeft};

  a {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    border: 1px solid ${(props) => props.hoverColor};
    background: ${(props) => props.hoverColor};
    transition: all 0.2s ease;
    cursor: pointer;

    svg path {
      fill: #fff;
    }
  }
`;
