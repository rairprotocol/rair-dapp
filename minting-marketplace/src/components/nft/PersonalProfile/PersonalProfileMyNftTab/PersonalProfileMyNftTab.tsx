import { memo } from 'react';

import Collecteditem from './Collecteditem';

import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import LoadingComponent from '../../../common/LoadingComponent';

import './PersonalProfileMyNftTab.css';

interface IPersonalProfileMyNftTabComponent {
  filteredData: any;
  openModal?: any;
  setSelectedData?: any;
  defaultImg: string;
  chainData: any;
  textColor: any;
  totalCount?: number | undefined;
  showTokensRef?: any;
  loader?: any;
  isLoading?: boolean;
  loadToken?: any;
  profile?: boolean;
}

const PersonalProfileMyNftTabComponent: React.FC<
  IPersonalProfileMyNftTabComponent
> = ({
  filteredData,
  openModal,
  setSelectedData,
  defaultImg,
  chainData,
  textColor,
  profile
}) => {
  const { width } = useWindowDimensions();

  if (!filteredData) {
    return <LoadingComponent />;
  }

  return (
    <div className="gen">
      <div
        className={`list-button-wrapper-grid-template ${
          (profile && 'row profile') ||
          (width >= 1250 && width <= 1400 && 'row')
        }`}>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => {
            return (
              <Collecteditem
                key={item._id}
                item={item}
                index={index}
                chainData={chainData}
                profile={profile}
                defaultImg={defaultImg}
              />
            );
          })
        ) : (
          <p style={{ color: textColor }}>
            There is no such item with that name
          </p>
        )}
      </div>
    </div>
  );
};

export const PersonalProfileMyNftTab = memo(PersonalProfileMyNftTabComponent);
