import React from 'react';

import TeamMeetComponentCommon from './TeamComponentCommon';

import { ITeamComponentCommon } from '../splashPage.types';

const TeamMeet: React.FC<ITeamComponentCommon> = ({
  arraySplash,
  classNameHead,
  classNameHeadSpan,
  titleHeadFirst,
  titleHeadSecond,
  colorHeadSecond,
  teamArray,
  classNameGap
}) => {
  return (
    <div className="splash-team">
      <div className="title-team">
        <h3 className={classNameHead ? classNameHead : ''}>
          {titleHeadFirst}{' '}
          {titleHeadSecond && (
            <span
              className={classNameHeadSpan ? classNameHeadSpan : ''}
              style={{ color: colorHeadSecond }}>
              {' '}
              {titleHeadSecond}
            </span>
          )}
        </h3>
      </div>
      <div className="meet-team">
        <TeamMeetComponentCommon
          arraySplash={arraySplash}
          teamArray={teamArray}
          className={classNameGap}
        />
      </div>
    </div>
  );
};

export default TeamMeet;
