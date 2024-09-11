import React, { useCallback, useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useParams } from 'react-router-dom';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import { TTokenData } from '../../../axios.responseTypes';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import { useAppSelector } from '../../../hooks/useReduxHooks';
import useServerSettings from '../../../hooks/useServerSettings';
import useSwal from '../../../hooks/useSwal';
import imageIcon from '../../../images/imageIcon.svg';
import csvParser from '../../../utils/csvParser';
import { rFetch } from '../../../utils/rFetch';
import BlockchainURIManager from '../common/blockchainURIManager';
import {
  IBatchMetadataParser,
  TBatchMetadataType,
  TParamsBatchMetadata
} from '../creatorStudio.types';
import FixedBottomNavigation from '../FixedBottomNavigation';

const BatchMetadataParser: React.FC<IBatchMetadataParser> = ({
  contractData,
  setStepNumber,
  stepNumber,
  gotoNextStep,
  simpleMode,
  refreshNFTMetadata
}) => {
  const { address, collectionIndex } = useParams<TParamsBatchMetadata>();

  const [csvFile, setCSVFile] = useState<File>();
  const [metadata, setMetadata] = useState<TBatchMetadataType[]>([
    {
      Artist: '',
      Name: '',
      NFTID: '',
      Description: '',
      Image: '',
      'Public Address': ''
    }
  ]);
  const [headers, setHeaders] = useState<string[]>();
  const [metadataExists, setMetadataExists] = useState<boolean>(false);
  const [changeFile, setChangeFile] = useState<boolean>(false);
  const [buttons, setButtons] = useState<any>([]);

  const { getBlockchainData } = useServerSettings();
  const reactSwal = useSwal();

  const onImageDrop = useCallback((acceptedFiles: File[]) => {
    csvParser(acceptedFiles[0], console.info);
  }, []);
  const onCSVDrop = useCallback((acceptedFiles: File[]) => {
    setCSVFile(acceptedFiles[0]);
    csvParser(acceptedFiles[0], setMetadata);
  }, []);

  useEffect(() => {
    if (!metadata?.at(0)) {
      setButtons([
        {
          label: 'Continue',
          action: gotoNextStep
        }
      ]);
      return;
    }
    setHeaders(
      Object.keys(metadata[0]).filter(
        (item) => !['Name', 'NFTID', 'Description', 'Image'].includes(item)
      )
    );
  }, [metadata, setHeaders, gotoNextStep]);

  const fetchData = useCallback(async () => {
    const { success, tokens, totalCount } = await rFetch(
      `/api/nft/network/${contractData.blockchain}/${address}/${collectionIndex}`
    );

    const newArray: any[] = [];

    if (success && totalCount > 0) {
      //fetch data form set Metadata info for show table
      for (let i = 0; i < tokens.length; i++) {
        const mtd = tokens[i].metadata;
        const nftId = tokens[i].token;
        const info = tokens[i];

        const injectData = {
          Artist: mtd.artist,
          Name: mtd.name,
          NFTID: nftId,
          Description: mtd.description,
          Image: mtd.image,
          'Public Address': info.ownerAddress
        };
        newArray.push(injectData);
        for (let e = 0; e < mtd.attributes.length; e++) {
          const element = mtd.attributes[e];
          injectData[element.trait_type] = element.value;
        }
      }
      setMetadata(newArray);
      setMetadataExists(
        tokens.filter((item: TTokenData) => item.metadata.name !== 'none')
          .length > 0
      );
    }
  }, [address, collectionIndex, contractData.blockchain]);

  useEffect(() => {
    const sendMetadata = async (forceOverwrite = false) => {
      const formData = new FormData();
      if (!collectionIndex) {
        return;
      }
      formData.append('product', collectionIndex);
      formData.append('contract', contractData._id!);
      formData.append('csv', csvFile as Blob, 'metadata.csv');
      if (forceOverwrite) {
        formData.append('forceOverwrite', 'true');
      }
      const response = await rFetch('/api/nft', {
        method: 'POST',
        body: formData,
        redirect: 'follow'
      });
      if (response?.success) {
        reactSwal.fire(
          'Success',
          `Updated ${response.updatedDocuments} metadata entries!`,
          'success'
        );
        setChangeFile(false);
        fetchData();
      } else {
        reactSwal.fire('Error', response?.message, 'error');
      }
    };

    if (!metadata) {
      setButtons([
        {
          label: 'Continue',
          action: gotoNextStep
        }
      ]);
      return;
    } else {
      const buttons = [
        {
          label: changeFile ? 'Send' : 'There is already a csv file uploaded',
          action: changeFile ? () => sendMetadata() : null,
          disabled: changeFile ? false : true
        },
        {
          label: 'Continue',
          action: gotoNextStep
        }
      ];
      if (!simpleMode && changeFile) {
        buttons.splice(0, 0, {
          label: 'Overwrite all token metadata',
          action: () => sendMetadata(true)
        });
      }
      setButtons(buttons);
      return;
    }
  }, [
    simpleMode,
    metadata,
    changeFile,
    gotoNextStep,
    metadataExists,
    collectionIndex,
    contractData,
    csvFile,
    fetchData,
    reactSwal
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { primaryColor, textColor, primaryButtonColor } = useAppSelector(
    (store) => store.colors
  );

  useEffect(() => {
    setStepNumber(stepNumber);
  }, [setStepNumber, stepNumber]);

  const downloadTemplateCSV = () => {
    axios
      .get('/api/nft/csv/sample', { responseType: 'blob' })
      .then((response) => response.data)
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `template.csv`);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode?.removeChild(link);
      });
  };

  const missing = (
    <div
      style={{
        width: '2rem',
        height: '2rem',
        paddingTop: '0.2rem',
        border: 'solid 1px #F63419',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <FontAwesomeIcon icon={faExclamation} className="text-danger" />
    </div>
  );

  return (
    <div className="row">
      <small className="w-100 text-center">
        Please, download our prebuilt CSV template for metadata uploading.
      </small>
      <div className="col-4 text-start mb-3" />
      <button
        style={{
          background: primaryButtonColor,
          color: textColor
        }}
        className={`btn rair-button rounded-rair col-4 my-5`}
        onClick={downloadTemplateCSV}>
        Download CSV Template
      </button>
      <div className="col-4 text-start mb-3" />
      <div className="rounded-rair col-6 mb-3">
        <Dropzone onDrop={onImageDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <section>
              <div
                {...getRootProps()}
                style={{
                  border: `dashed 1px color-mix(in srgb, ${primaryColor}, #888888)`,
                  position: 'relative'
                }}
                className="w-100 h-100 rounded-rair col-6 text-center mb-3 p-3">
                <input {...getInputProps()} />
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    border: `solid 1px ${textColor}`,
                    borderRadius: '50%',
                    width: '1.5rem',
                    height: '1.5rem'
                  }}>
                  1
                </div>
                <img
                  alt=""
                  style={{
                    filter:
                      primaryColor === 'rhyno' ? 'brightness(40%)' : undefined
                  }}
                  src={imageIcon}
                  className="my-5"
                />
                <br />
                {isDragActive ? (
                  <>Drop the images here ...</>
                ) : (
                  <>Drag and drop or click to upload images</>
                )}
              </div>
            </section>
          )}
        </Dropzone>
      </div>
      <div className="rounded-rair col-6 mb-3">
        <Dropzone onDrop={onCSVDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <section>
              <div
                {...getRootProps({
                  onClick: () => setChangeFile(true)
                })}
                style={{
                  border: `dashed 1px color-mix(in srgb, ${primaryColor}, #888888)`,
                  position: 'relative'
                }}
                className="w-100 h-100 rounded-rair col-6 text-center mb-3 p-3">
                <input {...getInputProps()} />
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    border: `solid 1px ${textColor}`,
                    borderRadius: '50%',
                    width: '1.5rem',
                    height: '1.5rem'
                  }}>
                  2
                </div>
                <img
                  alt=""
                  style={{
                    filter:
                      primaryColor === 'rhyno' ? 'brightness(40%)' : undefined
                  }}
                  src={imageIcon}
                  className="my-5"
                />
                <br />
                {isDragActive ? (
                  <>Drop the CSV file here ...</>
                ) : (
                  <>Drag and drop or click to upload the CSV file</>
                )}
              </div>
            </section>
          )}
        </Dropzone>
      </div>
      {metadata && headers && (
        <div
          style={{
            border: `solid 1px color-mix(in srgb, ${primaryColor}, #888888)`,
            overflow: 'scroll',
            width: '100%',
            maxHeight: '50vh'
          }}
          className="rounded-rair">
          <table className={`rair-table table-${primaryColor}`}>
            <thead>
              <tr>
                <th className="py-3">NFT #</th>
                <th>Title</th>
                <th>Description</th>
                <th>Image URL</th>
                {headers.map((item, index) => {
                  return <th key={index}>{item}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {metadata.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.NFTID ? item.NFTID : missing}</th>
                    <th
                      style={{
                        color: `var(--${
                          primaryColor === 'rhyno'
                            ? 'royal-purple'
                            : 'bubblegum'
                        })`
                      }}>
                      {item.Name ? item.Name : missing}
                    </th>
                    <th>{item.Description ? item.Description : missing}</th>
                    <th style={{ color: 'var(--bubblegum)' }}>
                      {item['Image'] ? item['Image'] : missing}
                    </th>
                    {headers.map((header, index) => {
                      return (
                        <th key={index}>
                          {item[header] ? item[header] : missing}
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            <tfoot />
          </table>
        </div>
      )}
      {!simpleMode && (
        <>
          {!contractData.instance ? (
            <>
              Connect to {getBlockchainData(contractData.blockchain)?.name} for
              more options
            </>
          ) : (
            <>
              {collectionIndex && address && (
                <BlockchainURIManager
                  {...{
                    changeFile,
                    contractData,
                    address,
                    collectionIndex,
                    refreshNFTMetadata
                  }}
                />
              )}
            </>
          )}
        </>
      )}

      <FixedBottomNavigation forwardFunctions={buttons} />
    </div>
  );
};

const ContextWrapper = (props: IBatchMetadataParser) => {
  return (
    <WorkflowContext.Consumer>
      {(value) => {
        return <BatchMetadataParser {...value} {...props} />;
      }}
    </WorkflowContext.Consumer>
  );
};

export default ContextWrapper;
