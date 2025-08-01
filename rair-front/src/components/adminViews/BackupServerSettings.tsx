import { useCallback } from 'react';
import Dropzone from 'react-dropzone';

import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import useSwal from '../../hooks/useSwal';
import { rFetch } from '../../utils/rFetch';

const CategoriesPreview = ({ categories }) => {
  return (
    <div className="row w-100">
      <table>
        <thead>
          <tr>
            <td> Category </td>
          </tr>
        </thead>
        <tbody>
          {categories?.map((category, index) => {
            return (
              <tr key={index}>
                <td>{category.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const MapPreview = ({ obj }) => {
  return (
    <div className="row w-100">
      <table>
        <thead>
          <tr>
            <td> Information </td>
            <td> Value </td>
          </tr>
        </thead>
        <tbody>
          {Object.keys(obj)?.map((key, index) => {
            return (
              <tr key={index}>
                <td>{key}</td>
                <td>{obj[key].toString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const AdminsPreview = ({ superAdmins }) => {
  return (
    <div className="row w-100">
      <table>
        <thead>
          <tr>
            <td> Super Admin Addresses </td>
          </tr>
        </thead>
        <tbody>
          {superAdmins?.map((publicAddress, index) => {
            return (
              <tr key={index}>
                <td>{publicAddress}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const BackupServerSettings = () => {
  const reactSwal = useSwal();
  const { primaryColor } = useAppSelector((store) => store.colors);
  const settings = useAppSelector((store) => store.settings);
  const { updateServerSetting } = useServerSettings();

  const importSettings = useCallback(
    async (file: File[]) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!e?.target?.result) {
          return;
        }
        const importedData = JSON.parse(e?.target?.result as string);
        const {
          superAdmins,
          blockchainSettings,
          categories,
          footerLinks,
          customValues,
          dataStatus,
          categoriesStatus,
          _id,
          ...otherValues
        } = importedData;
        if (superAdmins) {
          const { isConfirmed } = await reactSwal.fire({
            html: <AdminsPreview superAdmins={importedData.superAdmins} />,
            showCancelButton: true,
            confirmButtonText: 'Insert',
            cancelButtonText: 'Skip',
            width: '75vw'
          });
          if (isConfirmed) {
            updateServerSetting({
              superAdmins: importedData.superAdmins.map((userAddress) =>
                userAddress.toLowerCase()
              )
            });
          }
        }
        if (blockchainSettings) {
          for await (const chain of importedData.blockchainSettings) {
            const { isConfirmed } = await reactSwal.fire({
              title: 'Blockchain data',
              html: <MapPreview obj={chain} />,
              showCancelButton: true,
              confirmButtonText: 'Insert',
              cancelButtonText: 'Skip',
              width: '75vw'
            });
            if (isConfirmed) {
              await rFetch(`/api/settings/${chain.hash}`, {
                method: 'POST',
                body: JSON.stringify(chain),
                headers: {
                  'Content-Type': 'application/json'
                }
              });
            }
          }
        }
        if (footerLinks) {
          const { isConfirmed } = await reactSwal.fire({
            title: 'Footer links',
            html: <MapPreview obj={footerLinks} />,
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Skip',
            width: '75vw'
          });
          if (isConfirmed) {
            updateServerSetting({ footerLinks: footerLinks });
          }
        }
        if (customValues) {
          const { isConfirmed } = await reactSwal.fire({
            title: 'Custom values',
            html: <MapPreview obj={customValues} />,
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Skip',
            width: '75vw'
          });
          if (isConfirmed) {
            updateServerSetting({ customValues: customValues });
          }
        }
        if (categories) {
          const { isConfirmed } = await reactSwal.fire({
            title: 'Categories',
            html: <CategoriesPreview categories={categories} />,
            showCancelButton: true,
            confirmButtonText: 'Insert',
            cancelButtonText: 'Skip',
            width: '75vw'
          });
          if (isConfirmed) {
            await rFetch('/api/categories', {
              method: 'POST',
              body: JSON.stringify({
                list: categories.map((item) => ({
                  _id: item._id,
                  name: item.name
                }))
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }
        }
        if (otherValues) {
          const { isConfirmed } = await reactSwal.fire({
            title: 'Other values',
            html: <MapPreview obj={otherValues} />,
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Skip',
            width: '75vw'
          });
          const cleanValues = {};
          Object.keys(otherValues).forEach((key) => {
            if (otherValues[key] === '') {
              return;
            }
            cleanValues[key] = otherValues[key];
          });
          if (isConfirmed) {
            updateServerSetting({ ...cleanValues });
          }
        }
      };
      reader.readAsText(file[0]);
    },
    [reactSwal, updateServerSetting]
  );

  const exportSettings = useCallback(async () => {
    const data = new Blob(
      [
        JSON.stringify({
          ...settings,
          featuredCollection: settings.featuredCollection?._id
        })
      ],
      {
        type: 'application/json'
      }
    );

    // Create blob link to download
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `exports.json`);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode?.removeChild(link);
  }, [settings]);

  return (
    <div className="row w-100 px-5">
      <div className="col-12 my-5">
        <button className="btn btn-primary" onClick={exportSettings}>
          Export Configuration
        </button>
      </div>
      <div className="col-12">
        <Dropzone onDrop={importSettings}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <section>
              <div
                {...getRootProps()}
                style={{
                  border: `dashed 1px color-mix(in srgb, ${primaryColor}, #888888)`,
                  position: 'relative'
                }}
                className="w-100 h-100 rounded-rair text-center p-5">
                <input {...getInputProps()} />
                <br />
                {isDragActive ? (
                  <>Drop the config JSON here ...</>
                ) : (
                  <>Drag and drop or click to import settings</>
                )}
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default BackupServerSettings;
