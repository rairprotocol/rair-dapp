import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import { dataStatuses } from '../../redux/commonTypes';

const BooleanSettings = () => {
  const { secondaryButtonColor, textColor, primaryButtonColor } =
    useAppSelector((store) => store.colors);
  const { updateServerSetting } = useServerSettings();
  const { dataStatus, ...settings } = useAppSelector((store) => store.settings);

  return (
    <div className="col-12">
      {[
        {
          title: 'Only return minted tokens on collection page',
          value: 'onlyMintedTokensResult'
        },
        {
          title: 'Allow demo page uploads',
          value: 'demoUploadsEnabled'
        },
        {
          title: 'Use Vault for super admin verification',
          value: 'superAdminsOnVault'
        },
        {
          title: 'Use gasless resales',
          value: 'databaseResales'
        }
      ].map((item, index) => {
        return (
          <div key={index} className="col-12 px-5 text-start my-3">
            <h5>{item.title}</h5>
            <button
              disabled={
                !!settings?.[item.value] || dataStatus === dataStatuses.Loading
              }
              className="btn rair-button"
              style={{
                background: secondaryButtonColor,
                color: textColor
              }}
              onClick={() => updateServerSetting({ [item.value]: 'true' })}>
              Yes
            </button>
            <button
              disabled={
                !settings?.[item.value] || dataStatus === dataStatuses.Loading
              }
              className="btn rair-button"
              style={{
                background: primaryButtonColor,
                color: textColor
              }}
              onClick={() => updateServerSetting({ [item.value]: 'false' })}>
              No
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default BooleanSettings;
