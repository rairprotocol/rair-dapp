import React from 'react';
import styled from 'styled-components';

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
      <GameIframe
        src="https://sougen.co/"
        title="Moments of Happiness"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </GameContainer>
  );
};

export default MomentsGame; 