import React from 'react';
import { useSelector } from 'react-redux';

import Teammate from './Teammate';

import { RootState } from '../../../ducks';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { ITeamMeetComponentCommon } from '../splashPage.types';

const TeamMeetComponentCommon: React.FC<ITeamMeetComponentCommon> = ({
  readMoreCount,
  setReadMoreCount,
  teamArray,
  className,
  arraySplash
}) => {
  const primaryColor = useSelector<RootState, ColorChoice>(
    (state) => state.colorStore.primaryColor
  );
  return (
    <div className={className ? 'splash-team-greyman' : ''}>
      {teamArray.map((t, index) => {
        return (
          <Teammate
            readMoreCount={readMoreCount}
            setReadMoreCount={setReadMoreCount}
            key={index + t.nameTeammate}
            name={t.nameTeammate}
            desc={t.aboutTeammate}
            socials={t.socials}
            primaryColor={primaryColor}
            url={t.imageUrl}
            readMoreCountFlag={t.readMoreCountFlag}
            arraySplash={arraySplash}
          />
        );
      })}
    </div>
  );
};

export default TeamMeetComponentCommon;
