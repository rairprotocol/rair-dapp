import { useEffect, useState } from 'react';

import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import InputField from '../common/InputField';

const TextSettings = () => {
  const [customNodeAddress, setCustomNodeAddress] = useState<string>('');
  const [customLegalInfo, setCustomLegalInfo] = useState<string>('');
  const [customSignupMessage, setCustomSignupMessage] = useState<string>('');

  const { nodeAddress, legal, signupMessage } = useAppSelector(
    (store) => store.settings
  );
  const { secondaryButtonColor, textColor } = useAppSelector(
    (store) => store.colors
  );

  const { updateServerSetting } = useServerSettings();

  useEffect(() => {
    if (nodeAddress) {
      setCustomNodeAddress(nodeAddress);
    } else {
      setCustomNodeAddress(import.meta.env.VITE_NODE_ADDRESS);
    }
  }, [nodeAddress]);

  useEffect(() => {
    if (legal) {
      setCustomLegalInfo(legal);
    }
  }, [legal]);
  useEffect(() => {
    if (signupMessage) {
      setCustomSignupMessage(signupMessage);
    }
  }, [signupMessage]);

  return (
    <>
      {[
        {
          title: 'Node address',
          getter: customNodeAddress,
          setter: setCustomNodeAddress,
          setting: 'nodeAddress'
        },
        {
          title: 'Legal info',
          getter: customLegalInfo,
          setter: setCustomLegalInfo,
          setting: 'legal'
        },
        {
          title: 'Signup message',
          getter: customSignupMessage,
          setter: setCustomSignupMessage,
          setting: 'signupMessage'
        }
      ].map((setting, index) => {
        return (
          <div key={index} className="col-12 px-5 my-2">
            <h3>{setting.title}</h3>
            <InputField
              customClass="rounded-rair form-control"
              customCSS={{ color: textColor }}
              getter={setting.getter}
              setter={setting.setter}
              placeholder={setting.title}
            />
            <button
              className="btn rair-button"
              style={{
                background: secondaryButtonColor,
                color: textColor
              }}
              onClick={() =>
                updateServerSetting({ [setting.setting]: setting.getter })
              }>
              Set
            </button>
          </div>
        );
      })}
    </>
  );
};

export default TextSettings;
