import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../ducks';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { ITeamMeetComponentCommon } from '../splashPage.types';
import Teammate from './Teammate';

const TeamMeetComponentCommon: React.FC<ITeamMeetComponentCommon> = ({
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
