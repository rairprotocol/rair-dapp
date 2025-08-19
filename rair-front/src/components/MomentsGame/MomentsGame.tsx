import React from 'react';
import styled from 'styled-components';
import ThreeGame from '../ThreeGame/ThreeGame';

const GameContainer = styled.div`
  width: 100%;
  height: 90vh;
  position: relative;
  overflow: hidden;
`;

const GameIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  position: absolute;
  top: 0;
  left: 0;
`;

const MomentsGame: React.FC = () => {
  return (
    <GameContainer>
     <ThreeGame />
    </GameContainer>
  );
};

export default MomentsGame; 