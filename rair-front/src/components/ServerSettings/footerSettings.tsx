import { useEffect, useState } from 'react';

import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import { FooterLink } from '../../types/databaseTypes';
import InputField from '../common/InputField';

const FooterSettings = () => {
  const [footerLinksCopy, setFooterLinksCopy] = useState<Array<FooterLink>>([]);

  const { footerLinks } = useAppSelector((store) => store.settings);
  const { primaryButtonColor, textColor } = useAppSelector(
    (store) => store.colors
  );

  const { updateServerSetting } = useServerSettings();

  useEffect(() => {
    if (footerLinks) {
      // Redux is passing readonly references
      setFooterLinksCopy(JSON.parse(JSON.stringify(footerLinks)));
    }
  }, [footerLinks]);

  const modifyFooterLinks =
    (index: number, field: string) => (value: string) => {
      const aux = [...footerLinksCopy];
      aux[index][field] = value;
      setFooterLinksCopy(aux);
    };

  const deleteFooterLinks = (index: number) => {
    const aux = [...footerLinksCopy];
    aux.splice(index, 1);
    setFooterLinksCopy(aux);
  };

  return (
    <div className="col-12 px-5 my-2">
      <h3>Footer items</h3>
      {footerLinksCopy &&
        footerLinksCopy.map((footerLink, index) => {
          return (
            <div key={index} className="row">
              <div className="col-12 col-md-5">
                <InputField
                  label="Text"
                  customClass="rounded-rair form-control text-center p-1 w-100"
                  getter={footerLink.label}
                  setter={modifyFooterLinks(index, 'label')}
                  type="text"
                />
              </div>
              <div className="col-12 col-md-6">
                <InputField
                  label="URL"
                  customClass="rounded-rair form-control text-center p-1 w-100"
                  getter={footerLink.url}
                  setter={modifyFooterLinks(index, 'url')}
                  type="text"
                />
              </div>
              <button
                className="btn mt-4 col-12 col-md-1 btn-danger"
                onClick={() => {
                  deleteFooterLinks(index);
                }}>
                Delete
              </button>
            </div>
          );
        })}
      <button
        className="btn rair-button float-start"
        style={{
          background: primaryButtonColor,
          color: textColor
        }}
        onClick={() => {
          updateServerSetting({ footerLinks: footerLinksCopy });
        }}>
        Set Footer Links
      </button>
      <button
        className="btn btn-success float-end"
        onClick={() => {
          const aux = footerLinks ? [...footerLinks] : [];
          aux.push({
            label: '',
            url: ''
          });
          setFooterLinksCopy(aux);
        }}>
        Add
      </button>
    </div>
  );
};

export default FooterSettings;
