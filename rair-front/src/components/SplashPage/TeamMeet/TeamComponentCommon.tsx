import React from 'react';
import { useSelector } from 'react-redux';

import Teammate from './Teammate';

import { RootState } from '../../../ducks';
import { ITeamMeetComponentCommon } from '../splashPage.types';

const TeamMeetComponentCommon: React.FC<ITeamMeetComponentCommon> = ({
  teamArray,
  className,
  arraySplash
}) => {
  const primaryColor = useSelector<RootState, string>(
    (state) => state.colorStore.primaryColor
  );
  return (
    <div className={!className ? 'splash-team-greyman' : ''}>
      {teamArray &&
        teamArray.map((t, index) => {
          return (
            <Teammate
              key={index + t.nameTeammate}
              name={t.nameTeammate}
              desc={t.aboutTeammate}
              socials={t.socials}
              primaryColor={primaryColor}
              url={t.imageUrl}
              arraySplash={arraySplash}
            />
          );
        })}
    </div>
  );
};

export default TeamMeetComponentCommon;
