import { useCallback, useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useParams } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Hex } from 'viem';

import PropertyRow from './propertyRow';

import {
  TAttributes,
  TMetadataType,
  TTokenData
} from '../../../axios.responseTypes';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import { useAppSelector } from '../../../hooks/useReduxHooks';
import useServerSettings from '../../../hooks/useServerSettings';
import useSwal from '../../../hooks/useSwal';
import useWeb3Tx from '../../../hooks/useWeb3Tx';
import { rFetch } from '../../../utils/rFetch';
import InputField from '../../common/InputField';
import LoadingComponent from '../../common/LoadingComponent';
import {
  TNftMapping,
  TParamsBatchMetadata,
  TSingleMetadataType
} from '../creatorStudio.types';
import FixedBottomNavigation from '../FixedBottomNavigation';

const SingleMetadataEditor: React.FC<TSingleMetadataType> = ({
  contractData,
  setStepNumber,
  stepNumber,
  gotoNextStep,
  simpleMode
}) => {
  const [nftMapping, setNFTMapping] = useState<TNftMapping>({});
  const [nftCount, setNFTCount] = useState<number>(0);

  const reactSwal = useSwal();
  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();

  const [nftID, setNFTID] = useState<string>(
    BigInt(contractData?.product?.firstTokenIndex || 0).toString()
  );
  const [nftTitle, setNFTTitle] = useState<string>('');
  const [nftImage, setNFTImage] = useState<string>('');
  const [nftDescription, setNFTDescription] = useState<string>('');
  const [forceRerender, setForceRerender] = useState<boolean>(false);
  const [propertiesArray, setPropertiesArray] = useState<TAttributes[]>([]);
  const [onMyChain, setOnMyChain] = useState<boolean>(
    correctBlockchain(contractData?.blockchain as Hex)
  );
  const [files, setFiles] = useState<File>();
  const { programmaticProvider } = useAppSelector((store) => store.web3);
  const { primaryColor, secondaryButtonColor, textColor, primaryButtonColor } =
    useAppSelector((store) => store.colors);
  const { address, collectionIndex } = useParams<TParamsBatchMetadata>();

  const { getBlockchainData } = useServerSettings();

  const networkId = contractData?.blockchain;
  const contractAddress = contractData?.contractAddress;
  const product = contractData?.product?.collectionIndexInContract;
  const [metadataURI, setMetadataURI] = useState<string>('');

  const getNFTData = useCallback(async () => {
    if (!address || !contractData?.product?.offers) {
      return;
    }
    const fromToken = contractData.product.offers[0].range[0];
    const totalTokens = contractData.product.offers.reduce(
      (result, current) => {
        return result + (BigInt(current.range[1]) - BigInt(current.range[0]));
      },
      BigInt(0)
    );
    const { success, tokens, totalCount } = await rFetch(
      `/api/nft/network/${contractData?.blockchain}/${address.toLowerCase()}/${collectionIndex}?fromToken=${fromToken}&toToken=${totalTokens.toString()}`
    );
    if (success) {
      const mapping = {};
      tokens.forEach((token: TTokenData) => {
        mapping[token.uniqueIndexInContract] = token;
      });
      setNFTMapping(mapping);
      setNFTCount(totalCount);
    }
  }, [address, collectionIndex, contractData]);

  const addRow = () => {
    const aux = [...propertiesArray];
    aux.push({
      percentage: '',
      trait_type: '',
      value: ''
    });
    setPropertiesArray(aux);
  };

  const deleter = (index: number) => {
    const aux = [...propertiesArray];
    aux.splice(index, 1);
    setPropertiesArray(aux);
  };

  useEffect(() => {
    setStepNumber(stepNumber);
  }, [setStepNumber, stepNumber]);

  useEffect(() => {
    getNFTData();
  }, [getNFTData]);

  useEffect(() => {
    const tokenData = nftMapping[nftID];
    if (tokenData?.metadata) {
      setNFTImage(tokenData?.metadata?.image);
      setNFTTitle(tokenData?.metadata?.name);
      setNFTDescription(tokenData?.metadata?.description);
      setPropertiesArray(tokenData?.metadata?.attributes || []);
    } else {
      setNFTImage('');
      setNFTTitle('');
      setNFTDescription('');
      setPropertiesArray([]);
    }
  }, [nftID, nftMapping]);

  useEffect(() => {
    setOnMyChain(correctBlockchain(contractData?.blockchain as Hex));
  }, [contractData, programmaticProvider, correctBlockchain]);

  const onImageDrop = useCallback((acceptedFiles: File[]) => {
    const objectURL = URL.createObjectURL(acceptedFiles[0]);
    setFiles(acceptedFiles[0]);
    setNFTImage(objectURL);
  }, []);

  const pinMetadata = async () => {
    if (!contractData?.instance) {
      return;
    }
    reactSwal.fire({
      title: 'Please wait...',
      html: 'Pinning metadata to IPFS',
      showConfirmButton: false,
      icon: 'info'
    });

    const internalNFTID =
      contractData &&
      BigInt(nftID) - BigInt(contractData.product.firstTokenIndex);

    const response = await rFetch(
      `/api/nft/network/${networkId}/${contractAddress}/${product}/token/${internalNFTID}/pinning`,
      { method: 'POST' }
    );

    if (response?.success) {
      reactSwal.fire({
        title: 'Please wait...',
        html: `Sending URI to the blockchain`,
        showConfirmButton: false,
        icon: 'info'
      });

      if (
        await web3TxHandler(contractData.instance, 'setUniqueURI', [
          BigInt(contractData.product.firstTokenIndex) + nftID,
          response.metadataURI
        ])
      ) {
        reactSwal.fire({
          title: 'Success',
          html: `Metadata pinned for #${nftID}`,
          icon: 'success'
        });
      }
    }
  };

  const updateMetadata = async () => {
    const formData = new FormData();

    const internalNFTID =
      contractData &&
      BigInt(nftID) - BigInt(contractData.product.firstTokenIndex);

    reactSwal.fire({
      title: 'Please wait...',
      html: `Updating metadata for NFT #${nftID}`,
      showConfirmButton: false,
      icon: 'info'
    });

    formData.append('name', nftTitle);
    formData.append('description', nftDescription);
    formData.append(
      'attributes',
      JSON.stringify(
        propertiesArray.map((i) => ({
          trait_type: i.trait_type,
          value: i.value
        }))
      )
    );

    if (files?.name) {
      formData.append('image', files.name);
      formData.append('files', files);
    } else if (nftImage !== nftMapping[nftID]?.metadata?.image) {
      formData.append('image', nftImage);
    }

    const response = await rFetch(
      `/api/nft/network/${networkId}/${contractAddress}/${product}/token/${internalNFTID}`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (response?.success) {
      reactSwal.fire({
        title: 'Success',
        html: `Updated Metadata for NFT #${nftID}`,
        icon: 'success'
      });
    }
  };

  if (!contractData?.product) {
    return <LoadingComponent />;
  }

  return (
    <div className="row px-0 mx-0">
      <h5>{nftCount} NFTs available!</h5>
      <div className="col-12 col-md-6 text-start px-5">
        <div className="col-12 rounded-rair mb-3">
          NFT ID
          <div className="border-stimorol w-100 rounded-rair">
            <InputField
              getter={nftID}
              setter={setNFTID}
              customClass={`rounded-rair w-100 form-control text-center`}
              type="number"
              min={Number(
                BigInt(contractData?.product?.firstTokenIndex).toString()
              )}
              max={Number(
                (
                  BigInt(contractData?.product?.firstTokenIndex) +
                  BigInt(contractData?.product?.copies) -
                  BigInt(1)
                ).toString()
              )}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 rounded-rair mb-3">
            <button
              className="btn rair-button rounded-rair w-100 form-control"
              style={{ color: textColor, background: secondaryButtonColor }}
              onClick={() => {
                setNFTID(
                  BigInt(contractData?.product?.firstTokenIndex).toString()
                );
              }}>
              First
            </button>
          </div>
          <div className="col-12 col-md-6 rounded-rair mb-3">
            <button
              className="btn rair-button rounded-rair w-100 form-control"
              style={{ color: textColor, background: primaryButtonColor }}
              onClick={() => {
                setNFTID(
                  (
                    BigInt(contractData?.product?.firstTokenIndex) +
                    BigInt(contractData?.product?.copies) -
                    BigInt(1)
                  ).toString()
                );
              }}>
              Last
            </button>
          </div>
        </div>
        <br />
        Image
        <br />
        <div className="border-stimorol rounded-rair mb-3 w-100">
          <InputField
            getter={nftImage}
            setter={setNFTImage}
            customClass={`rounded-rair w-100 form-control`}
          />
        </div>
        <br />
        Title
        <br />
        <div className="border-stimorol rounded-rair mb-3 w-100">
          <InputField
            getter={nftTitle}
            setter={setNFTTitle}
            customClass={`rounded-rair w-100 form-control`}
          />
        </div>
        <br />
        Description
        <br />
        <div className="border-stimorol rounded-rair mb-3 w-100">
          <textarea
            value={nftDescription}
            onChange={(e) => setNFTDescription(e.target.value)}
            className={`rounded-rair w-100 form-control`}
            style={{
              background: primaryColor,
              color: textColor
            }}
            rows={3}
          />
        </div>
        <br />
        Properties
        <div
          className="col-12 py-5"
          style={{
            position: 'relative',
            overflowY: 'scroll',
            maxHeight: '30vh'
          }}>
          <button
            onClick={addRow}
            style={{
              background: primaryButtonColor,
              color: textColor,
              position: 'absolute',
              top: 0,
              right: 0
            }}
            className="rounded-rair btn rair-button">
            <FontAwesomeIcon icon={faPlus} />
          </button>
          {propertiesArray && propertiesArray.length > 0 && (
            <table className="w-100">
              <thead>
                <tr>
                  <th>Property Name</th>
                  <th>Property Value</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {propertiesArray.map((item, index) => {
                  return (
                    <PropertyRow
                      key={index}
                      {...item}
                      array={propertiesArray}
                      index={index}
                      deleter={() => deleter(index)}
                      rerender={() => setForceRerender(!forceRerender)}
                    />
                  );
                })}
              </tbody>
              <tfoot />
            </table>
          )}
        </div>
      </div>
      <div className="col-6 px-5">
        <div
          style={{ minHeight: '70vh', maxHeight: '100vh' }}
          className="w-100 border-stimorol py-auto rounded-rair">
          <Dropzone onDrop={onImageDrop}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className={`w-100 h-100 rounded-rair`}>
                <input {...getInputProps()} />
                <img
                  alt=""
                  className="w-100 rounded-rair my-auto"
                  style={{
                    verticalAlign: 'middle',
                    width: '100%',
                    minHeight: '70vh',
                    maxHeight: '100vh',
                    objectFit: 'cover'
                  }}
                  src={nftImage}
                />
              </div>
            )}
          </Dropzone>
        </div>
      </div>
      <FixedBottomNavigation
        forwardFunctions={[
          {
            action: !onMyChain
              ? () => web3Switch(contractData?.blockchain as Hex)
              : pinMetadata,
            label: !onMyChain
              ? contractData?.blockchain
                ? `Switch to ${
                    getBlockchainData(contractData?.blockchain)?.name
                  }`
                : ''
              : 'Pin to IPFS',
            disabled: false
          },
          {
            action: updateMetadata,
            label: 'Save changes',
            disabled: false
          },
          {
            action: gotoNextStep,
            label: 'Continue'
          }
        ]}
      />
      {!simpleMode && contractData?.diamond && contractData.instance && (
        <>
          <div className="col-12">
            <button
              onClick={async () => {
                const URI = await web3TxHandler(
                  contractData.instance,
                  'tokenURI',
                  [contractData.product.firstTokenIndex + Number(nftID)]
                );
                if (URI) {
                  const data = await axios.get<TMetadataType>(URI);
                  setNFTImage(data.data.image);
                  setNFTTitle(data.data.name);
                  setNFTDescription(data.data.description);
                  if (data.data.attributes) {
                    setPropertiesArray(data.data.attributes);
                  }
                  setMetadataURI(URI);
                }
              }}
              className="btn btn-primary">
              Read URI Data from the Blockchain
            </button>
          </div>
          <hr />
          <div className="col-12 col-md-9 px-0">
            <InputField
              customClass="form-control"
              getter={metadataURI}
              setter={setMetadataURI}
              label="Metadata URI"
            />
          </div>
          <div className="col-12 col-md-3 pt-4">
            <button
              onClick={async () => {
                reactSwal.fire({
                  title: 'Sending metadata URI...',
                  html: 'Please wait...',
                  icon: 'info',
                  showConfirmButton: false
                });
                if (
                  await web3TxHandler(contractData.instance, 'setUniqueURI', [
                    Number(contractData.product.firstTokenIndex) +
                      Number(nftID),
                    metadataURI
                  ])
                ) {
                  reactSwal.fire({
                    title: 'Success!',
                    html: 'Metadata URI has been set for that specific token',
                    icon: 'success',
                    showConfirmButton: true
                  });
                }
              }}
              style={{
                background: primaryButtonColor,
                color: textColor
              }}
              className="btn rair-button">
              {metadataURI === '' ? 'Uns' : 'S'}et Metadata for token #{nftID}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const ContextWrapper = (props: TSingleMetadataType) => {
  return (
    <WorkflowContext.Consumer>
      {(value) => {
        return <SingleMetadataEditor {...value} {...props} />;
      }}
    </WorkflowContext.Consumer>
  );
};

export default ContextWrapper;
