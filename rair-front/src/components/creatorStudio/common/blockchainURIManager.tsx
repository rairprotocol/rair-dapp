import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber } from 'ethers';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
//import InputSelect from '../../common/InputSelect';
// import { TTokenData } from '../../../axios.responseTypes';
import useSwal from '../../../hooks/useSwal';
import useWeb3Tx from '../../../hooks/useWeb3Tx';
//import { UsersContractsType } from '../../adminViews/adminView.types';
import { rFetch } from '../../../utils/rFetch';
import InputField from '../../common/InputField';
import {
  IIBlockchainURIManager,
  ITokenURIRow,
  TNextToken,
  TUniqueURIArray
} from '../creatorStudio.types';

const TokenURIRow: React.FC<ITokenURIRow> = ({
  tokenId,
  metadataURI,
  deleter,
  index,
  array,
  lastTokenInProduct
}) => {
  const [tokenIndex, setTokenIndex] = useState<string>(tokenId);
  const [metadataLink, setMetadataLink] = useState<string>(metadataURI);
  useEffect(() => {
    setTokenIndex(tokenId);
  }, [tokenId]);

  useEffect(() => {
    setMetadataLink(metadataURI);
  }, [metadataURI]);

  const tokenIdSetter = (value: string) => {
    array[index].tokenId = value;
    setTokenIndex(value);
  };

  const metadataURISetter = (value: string) => {
    array[index].metadataURI = value;
    setMetadataLink(value);
  };

  return (
    <tr>
      <th>
        <InputField
          placeholder="Token Index"
          getter={tokenIndex}
          setter={tokenIdSetter}
          type="number"
          min={0}
          max={lastTokenInProduct}
          customClass="form-control"
          labelClass="w-100"
          labelCSS={{ textAlign: 'left' }}
        />
      </th>
      <th>
        <InputField
          placeholder="Full link"
          getter={metadataLink}
          setter={metadataURISetter}
          customClass="form-control"
          labelClass="w-100"
          labelCSS={{ textAlign: 'left' }}
        />
      </th>
      <th>
        <button onClick={() => deleter(index)} className="btn btn-danger">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </th>
    </tr>
  );
};

const BlockchainURIManager: React.FC<IIBlockchainURIManager> = ({
  contractData,
  collectionIndex,
  changeFile
}) => {
  const reactSwal = useSwal();
  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();

  const { textColor, primaryButtonColor, secondaryColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const lastTokenInProduct = contractData?.product?.copies || 0;
  const [blockchainOperationInProgress, setBlockchainOperationInProgress] =
    useState<boolean>(false);
  const [pinOverwrite, setPinOverwrite] = useState<boolean>(false);
  const [contractWideMetadata, setContractWideMetadata] = useState<string>('');
  const [appendTokenForContract, setAppendTokenForContract] =
    useState<boolean>(false);
  const [collectionWideMetadata, setCollectionWideMetadata] =
    useState<string>('');
  const [appendTokenForCollection, setAppendTokenForCollection] =
    useState<boolean>(false);
  //const [rangeWideMetadata, setRangeWideMetadata] = useState<string>('');
  //const [rangeOptions, setRangeOptions] = useState<UsersContractsType[]>([]);
  //const [selectedRange, setSelectedRange] = useState<string>('null');
  //const [appendTokenForRange, setAppendTokenForRange] =
  //useState<boolean>(false);
  const [uniqueURIArray, setUniqueURIArray] = useState<TUniqueURIArray[]>([]);
  const [openSeaURI, setOpenSeaURI] = useState<string>('');
  const [metadataExtension, setMetadataExtension] = useState<string>('');
  /*
  useEffect(() => {
    if (contractData?.product?.offers) {
      setRangeOptions(
        contractData.product.offers.map((item) => {
          return {
            value: item.diamondRangeIndex,
            label: `${item.offerName} (${item.range[0]} - ${item.range[1]})`
          };
        })
      );
    }
  }, [contractData]);
  */

  const addUniqueURIRow = () => {
    if (uniqueURIArray.length > lastTokenInProduct) {
      return;
    }
    const aux = [...uniqueURIArray];
    let nextToken: TNextToken =
      contractData?.nfts.tokens[uniqueURIArray.length];
    if (!nextToken) {
      nextToken = {
        uniqueIndexInContract:
          uniqueURIArray.length > 0
            ? String(Number(uniqueURIArray.at(-1)?.tokenId) + 1)
            : '0',
        metadataURI: ''
      };
    }
    aux.push({
      tokenId: nextToken.uniqueIndexInContract,
      metadataURI: nextToken.metadataURI || ''
    });
    setUniqueURIArray(aux);
  };

  const deleteUniqueURIRow = (index: number) => {
    const aux = [...uniqueURIArray];
    aux.splice(index, 1);
    setUniqueURIArray(aux);
  };

  const checkCurrentBlockchain = () => {
    if (!correctBlockchain(contractData.blockchain)) {
      web3Switch(contractData.blockchain);
      return false;
    }
    return true;
  };

  const pinAll = async () => {
    reactSwal.fire({
      title: `Pinning Metadata`,
      html: `Please wait...`,
      icon: 'info',
      showConfirmButton: false
    });

    const pinAllResponse = await rFetch('/api/nft/pinningMultiple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contractId: contractData._id,
        product: contractData.product.collectionIndexInContract,
        overwritePin: pinOverwrite.toString()
      })
    });

    reactSwal.fire(
      'Success',
      `${pinAllResponse?.totalCount} tokens pinned on CID ${pinAllResponse?.CID}`,
      'success'
    );

    const preppedIPFSURI = `ipfs://${pinAllResponse?.CID}/`;

    setContractWideMetadata(preppedIPFSURI);
    setCollectionWideMetadata(preppedIPFSURI);
    return;
    /*const nftDataResult = await refreshNFTMetadata();
    if (!nftDataResult || nftDataResult?.totalCount.toString() === '0') {
      Swal.fire('Error', 'There are no NFTs to send', 'error');
      return;
    }

    const aux2: TTokenData[] = [
      ...nftDataResult.tokens.filter((item) => {
        return (
          !item.metadataURI ||
          item.metadataURI !== 'none' ||
          !item.isMetadataPinned
        );
      })
    ];

    let counter = 0;
    const pageLength = 50;
    const totalPages = Math.round(aux2.length / pageLength);
    do {
      const page = aux2.splice(0, pageLength);
      Swal.fire({
        title: `Sending group ${counter++} of ${totalPages}`,
        html: `Setting ${page.length} metadata URIs`,
        icon: 'info',
        showConfirmButton: false
      });
      if (
        await web3TxHandler(
          contractData.instance.setUniqueURIBatch(
            page.map((item) =>
              BigNumber.from(contractData.product.firstTokenIndex).add(
                item.token
              )
            ),
            page.map((item) => item.metadataURI)
          )
        )
      ) {
        Swal.fire('Success', 'Token URIs updated', 'success');
      } else {
        break;
      }
    } while (aux2.length > 0);*/
  };

  return (
    <>
      <hr />
      <details>
        <summary className="col-12"> Contract-wide metadata </summary>
        <div className="w-100 row">
          Set the same metadata URI for any token with no unique, range or
          collection URI{' '}
          {appendTokenForContract && (
            <>({"The token's index will be appended at the end of the URI"})</>
          )}
          <div className="col-12">
            <InputField
              customClass="form-control"
              getter={contractWideMetadata}
              setter={setContractWideMetadata}
              placeholder="Contract wide URI"
            />
          </div>
          <button
            onClick={() => setAppendTokenForContract(!appendTokenForContract)}
            className={`col-12 col-md-6 btn
            btn-${appendTokenForContract ? 'royal-ice' : 'warning'}`}>
            {!appendTokenForContract && "Don't "}Include token ID
          </button>
          <button
            onClick={async () => {
              if (!checkCurrentBlockchain()) {
                return;
              }
              reactSwal.fire({
                title: 'Updating Contract Wide URI',
                html: 'Updating the URI for all tokens on the range without unique metadata',
                icon: 'info',
                showConfirmButton: false
              });
              setBlockchainOperationInProgress(true);

              let result = await web3TxHandler(
                contractData.instance,
                'setBaseURI',
                [contractWideMetadata, appendTokenForContract]
              );
              if (!result) {
                reactSwal.fire({
                  title: '(Legacy) Updating Contract Wide URI',
                  html: 'The token index will not be appended at the end of the URI',
                  icon: 'info',
                  showConfirmButton: false
                });
                result = await web3TxHandler(
                  contractData.instance,
                  'setBaseURI',
                  [contractWideMetadata]
                );
              }

              if (result) {
                reactSwal.fire('Success', 'Contract URI updated', 'success');
              }
              setBlockchainOperationInProgress(false);
            }}
            disabled={blockchainOperationInProgress || !contractData.instance}
            style={{
              background: primaryButtonColor,
              color: textColor
            }}
            className="col-12 col-md-6 rair-button btn">
            {blockchainOperationInProgress
              ? 'Sending Metadata...'
              : `${contractWideMetadata === '' ? 'Uns' : 'S'}et metadata`}
          </button>
        </div>
      </details>
      <hr />
      <details>
        <summary className="col-12"> Collection-wide metadata </summary>
        <div className="w-100 row">
          Set the same metadata URI for any token with no unique or range URI{' '}
          {appendTokenForCollection && (
            <>({"The token's index will be appended at the end of the URI"})</>
          )}
          <div className="col-12">
            <InputField
              customClass="form-control"
              getter={collectionWideMetadata}
              setter={setCollectionWideMetadata}
              placeholder="Collection wide URI"
            />
          </div>
          <button
            onClick={() =>
              setAppendTokenForCollection(!appendTokenForCollection)
            }
            className={`col-12 col-md-6 btn 
              btn-${appendTokenForCollection ? 'royal-ice' : 'warning'}`}>
            {!appendTokenForCollection && "Don't "}Include token ID
          </button>
          <button
            onClick={async () => {
              if (!checkCurrentBlockchain()) {
                return;
              }
              reactSwal.fire({
                title: 'Updating Collection Wide URI',
                html: 'Updating the URI for all tokens on the collection without unique or range metadata',
                icon: 'info',
                showConfirmButton: false
              });
              setBlockchainOperationInProgress(true);
              let result: any;
              const operation = contractData.diamond
                ? 'setCollectionURI'
                : 'setProductURI';
              result = await web3TxHandler(contractData.instance, operation, [
                collectionIndex,
                collectionWideMetadata,
                appendTokenForCollection
              ]);
              if (!result && !contractData.diamond) {
                reactSwal.fire({
                  title: '(Legacy) Updating Product Wide URI',
                  html: 'The token index will not be appended at the end of the URI',
                  icon: 'info',
                  showConfirmButton: false
                });
                result = await web3TxHandler(
                  contractData.instance,
                  'setProductURI',
                  [collectionIndex, collectionWideMetadata]
                );
              }
              if (result) {
                reactSwal.fire('Success', 'Collection URI updated', 'success');
              }
              setBlockchainOperationInProgress(false);
            }}
            disabled={blockchainOperationInProgress || !contractData.instance}
            style={{
              background: primaryButtonColor,
              color: textColor
            }}
            className="col-12 col-md-6 rair-button btn">
            {blockchainOperationInProgress
              ? 'Sending Metadata...'
              : `${collectionWideMetadata === '' ? 'Uns' : 'S'}et metadata`}
          </button>
        </div>
      </details>
      {/*
      This might be used later
      <hr />
      <details>
        <summary className="col-12"> Range-wide metadata </summary>
        <div className="w-100 row">
          Set the same metadata URI for any token with no unique URI{' '}
          {appendTokenForRange && (
            <>({"The token's index will be appended at the end of the URI"})</>
          )}
          <div className="col-12">
            <InputSelect
              customClass="form-control"
              options={rangeOptions}
              getter={selectedRange}
              setter={setSelectedRange}
              placeholder="Select a Range"
            />
            <InputField
              customClass="form-control"
              getter={rangeWideMetadata}
              setter={setRangeWideMetadata}
              placeholder="Range wide URI"
            />
          </div>
          <button
            onClick={() => setAppendTokenForRange(!appendTokenForRange)}
            className={`col-12 col-md-6 btn 
            btn-${appendTokenForRange ? 'royal-ice' : 'warning'}`}>
            {!appendTokenForRange && "Don't "}Include token ID
          </button>
          <button
            onClick={async () => {
              if (!checkCurrentBlockchain()) {
                return;
              }
              Swal.fire({
                title: 'Updating Range Wide URI',
                html: 'Updating the URI for all tokens on the range without unique metadata',
                icon: 'info',
                showConfirmButton: false
              });
              setBlockchainOperationInProgress(true);

              if (
                await web3TxHandler(
                  contractData.instance.setRangeURI(
                    selectedRange,
                    rangeWideMetadata,
                    appendTokenForRange
                  ),
                  'This feature might not be implemented yet!'
                )
              ) {
                Swal.fire('Success', 'Range URI updated', 'success');
              }
              setBlockchainOperationInProgress(false);
            }}
            disabled={
              blockchainOperationInProgress ||
              !contractData.instance ||
              selectedRange === 'null'
            }
            style={{
              background: primaryButtonColor,
              color: textColor
            }}
            className="col-12 col-md-6 rair-button btn">
            {blockchainOperationInProgress
              ? 'Sending Metadata...'
              : `${rangeWideMetadata === '' ? 'Uns' : 'S'}et metadata`}
          </button>
        </div>
      </details>*/}
      <hr />
      <details>
        <summary>Metadata Extension for general metadata</summary>
        <InputField
          customClass="form-control"
          getter={metadataExtension}
          setter={setMetadataExtension}
          placeholder="'.' is required"
          label="Metadata Extension (Only for URIs in product or contract-wide metadata)"
        />
        <button
          onClick={async () => {
            if (!checkCurrentBlockchain()) {
              return;
            }
            reactSwal.fire({
              title: 'Updating general metadata extension',
              html: 'This will affect every contract and collection wide metadata',
              icon: 'info',
              showConfirmButton: false
            });
            setBlockchainOperationInProgress(true);

            if (
              await web3TxHandler(
                contractData.instance,
                'setMetadataExtension',
                [metadataExtension],
                {
                  intendedBlockchain: contractData?.blockchain,
                  failureMessage: 'This feature might not be implemented yet!'
                }
              )
            ) {
              reactSwal.fire('Success', 'General extension updated', 'success');
            }
            setBlockchainOperationInProgress(false);
          }}
          disabled={blockchainOperationInProgress || !contractData.instance}
          style={{
            background: primaryButtonColor,
            color: textColor
          }}
          className="col-12 col-md-6 rair-button btn">
          {blockchainOperationInProgress
            ? 'Sending data...'
            : `${metadataExtension === '' ? 'Uns' : 'S'}et extension`}
        </button>
      </details>
      <hr />
      <details>
        <summary className="col-12"> Pinning to IPFS </summary>
        {changeFile
          ? 'The CSV File is not loaded to the database yet, send the CSV file first!'
          : ''}
        <br />
        <button
          onClick={() => setPinOverwrite(!pinOverwrite)}
          disabled={changeFile}
          style={{
            color: textColor,
            background: pinOverwrite ? primaryButtonColor : secondaryColor,
            border: `solid 1px ${textColor}`
          }}
          className={`btn rair-button`}>
          {!pinOverwrite ? "Don't" : ''} Overwrite already pinned metadata
        </button>
        <br />
        <button
          onClick={pinAll}
          disabled={changeFile}
          style={{
            background: primaryButtonColor,
            color: textColor
          }}
          className="btn rair-button">
          Pin token metadata to IPFS
        </button>
      </details>
      <hr />
      <details>
        <summary className="col-12"> Unique metadata for each token </summary>
        <br />
        <div className="col-12">
          Set each NFT with an unique URI
          <table
            style={{ color: 'inherit' }}
            className="table table-responsive w-100">
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Token URI</th>
                <th className="px-0">
                  <button
                    onClick={addUniqueURIRow}
                    style={{
                      background: primaryButtonColor,
                      color: textColor
                    }}
                    className="btn rair-button">
                    Add <FontAwesomeIcon icon={faPlus} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {uniqueURIArray.map((item, index, array) => {
                return (
                  <TokenURIRow
                    {...item}
                    {...{ lastTokenInProduct, index, array }}
                    key={index}
                    deleter={deleteUniqueURIRow}
                  />
                );
              })}
            </tbody>
          </table>
          <button
            onClick={async () => {
              if (!checkCurrentBlockchain() || uniqueURIArray.length <= 0) {
                return;
              }
              reactSwal.fire({
                title: 'Updating URI',
                html: `Updating the URI of ${uniqueURIArray.length} NFT(s)`,
                icon: 'info',
                showConfirmButton: false
              });
              setBlockchainOperationInProgress(true);

              if (
                await web3TxHandler(
                  contractData.instance,
                  'setUniqueURIBatch',
                  [
                    uniqueURIArray.map((item) =>
                      BigNumber.from(contractData.product.firstTokenIndex).add(
                        item.tokenId
                      )
                    ),
                    uniqueURIArray.map((item) => item.metadataURI)
                  ],
                  {
                    intendedBlockchain: contractData.blockchain,
                    failureMessage:
                      "Older versions of the RAIR contract don't have batch metadata update functionality!"
                  }
                )
              ) {
                reactSwal.fire('Success', 'Token URIs updated', 'success');
              }
              setBlockchainOperationInProgress(false);
            }}
            disabled={
              blockchainOperationInProgress || uniqueURIArray.length <= 0
            }
            className="col-12 btn btn-primary">
            {blockchainOperationInProgress
              ? 'Please wait...'
              : `Update the URI of ${uniqueURIArray.length} tokens`}
          </button>
        </div>
      </details>
      <hr />
      <details>
        <summary className="col-12"> Contract Metadata for OpenSea </summary>
        <div className="w-100 row">
          A description of the contract for OpenSea
          <div className="col-12 col-md-9">
            <InputField
              customClass="form-control"
              getter={openSeaURI}
              setter={setOpenSeaURI}
              placeholder="URI for OpenSea"
            />
          </div>
          <div className="col-12 col-md-3">
            <button
              onClick={async () => {
                if (!checkCurrentBlockchain()) {
                  return;
                }
                reactSwal.fire({
                  title: 'Updating Contract URI',
                  html: 'Updating the URI visible to OpenSea',
                  icon: 'info',
                  showConfirmButton: false
                });
                setBlockchainOperationInProgress(true);

                if (
                  await web3TxHandler(contractData.instance, 'setContractURI', [
                    openSeaURI
                  ])
                ) {
                  reactSwal.fire('Success', 'Contract URI updated', 'success');
                }
                setBlockchainOperationInProgress(false);
              }}
              disabled={!contractData.instance}
              style={{
                background: primaryButtonColor,
                color: textColor
              }}
              className="rair-button w-100 btn">
              {blockchainOperationInProgress
                ? 'Sending Metadata...'
                : `${openSeaURI === '' ? 'Uns' : 'S'}et contract metadata`}
            </button>
          </div>
        </div>
      </details>
      <hr />
    </>
  );
};

export default BlockchainURIManager;
