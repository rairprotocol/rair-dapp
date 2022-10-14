import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BigNumber } from 'ethers';
//import InputSelect from '../../common/InputSelect';
import Swal from 'sweetalert2';

import { TTokenData } from '../../../axios.responseTypes';
import { RootState } from '../../../ducks';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { metamaskCall } from '../../../utils/metamaskUtils';
//import { UsersContractsType } from '../../adminViews/adminView.types';
import { rFetch } from '../../../utils/rFetch';
import { web3Switch } from '../../../utils/switchBlockchain';
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
          <i className="fas fa-trash" />
        </button>
      </th>
    </tr>
  );
};

const BlockchainURIManager: React.FC<IIBlockchainURIManager> = ({
  contractData,
  collectionIndex,
  refreshNFTMetadata
}) => {
  const { currentChain } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  const lastTokenInProduct = contractData?.product?.copies || 0;
  const [blockchainOperationInProgress, setBlockchainOperationInProgress] =
    useState<boolean>(false);
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
    if (currentChain !== contractData.blockchain) {
      web3Switch(contractData.blockchain);
      return false;
    }
    return true;
  };

  const pinAll = async () => {
    Swal.fire({
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
        product: contractData.product.collectionIndexInContract
      })
    });

    if (!pinAllResponse.success) {
      return;
    }

    const nftDataResult = await refreshNFTMetadata();
    console.info(nftDataResult);
    if (!nftDataResult || nftDataResult.totalCount.toString() === '0') {
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
        await metamaskCall(
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
    } while (aux2.length > 0);
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
              Swal.fire({
                title: 'Updating Contract Wide URI',
                html: 'Updating the URI for all tokens on the range without unique metadata',
                icon: 'info',
                showConfirmButton: false
              });
              setBlockchainOperationInProgress(true);

              let result = await metamaskCall(
                contractData.instance.setBaseURI(
                  contractWideMetadata,
                  appendTokenForContract
                )
              );
              if (!result) {
                Swal.fire({
                  title: '(Legacy) Updating Contract Wide URI',
                  html: 'The token index will not be appended at the end of the URI',
                  icon: 'info',
                  showConfirmButton: false
                });
                result = await metamaskCall(
                  contractData.instance.setBaseURI(contractWideMetadata)
                );
              }

              if (result) {
                Swal.fire('Success', 'Contract URI updated', 'success');
              }
              setBlockchainOperationInProgress(false);
            }}
            disabled={blockchainOperationInProgress || !contractData.instance}
            className="col-12 col-md-6 btn-stimorol btn">
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
              Swal.fire({
                title: 'Updating Collection Wide URI',
                html: 'Updating the URI for all tokens on the collection without unique or range metadata',
                icon: 'info',
                showConfirmButton: false
              });
              setBlockchainOperationInProgress(true);
              let result: any;
              const operation =
                contractData.instance[
                  contractData.diamond ? 'setCollectionURI' : 'setProductURI'
                ];
              result = await metamaskCall(
                operation(
                  collectionIndex,
                  collectionWideMetadata,
                  appendTokenForCollection
                )
              );
              if (!result && !contractData.diamond) {
                Swal.fire({
                  title: '(Legacy) Updating Product Wide URI',
                  html: 'The token index will not be appended at the end of the URI',
                  icon: 'info',
                  showConfirmButton: false
                });
                result = await metamaskCall(
                  contractData.instance.setProductURI(
                    collectionIndex,
                    collectionWideMetadata
                  )
                );
              }
              if (result) {
                Swal.fire('Success', 'Collection URI updated', 'success');
              }
              setBlockchainOperationInProgress(false);
            }}
            disabled={blockchainOperationInProgress || !contractData.instance}
            className="col-12 col-md-6 btn-stimorol btn">
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
                await metamaskCall(
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
            className="col-12 col-md-6 btn-stimorol btn">
            {blockchainOperationInProgress
              ? 'Sending Metadata...'
              : `${rangeWideMetadata === '' ? 'Uns' : 'S'}et metadata`}
          </button>
        </div>
      </details>*/}
      <hr />
      <details>
        <summary>Metadata Extension for batch metadata</summary>
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
            Swal.fire({
              title: 'Updating general metadata extension',
              html: 'This will affect every contract and collection wide metadata',
              icon: 'info',
              showConfirmButton: false
            });
            setBlockchainOperationInProgress(true);

            if (
              await metamaskCall(
                contractData.instance.setMetadataExtension(metadataExtension),
                'This feature might not be implemented yet!'
              )
            ) {
              Swal.fire('Success', 'General extension updated', 'success');
            }
            setBlockchainOperationInProgress(false);
          }}
          disabled={blockchainOperationInProgress || !contractData.instance}
          className="col-12 col-md-6 btn-stimorol btn">
          {blockchainOperationInProgress
            ? 'Sending data...'
            : `${metadataExtension === '' ? 'Uns' : 'S'}et extension`}
        </button>
      </details>
      <hr />
      <details>
        <summary className="col-12"> Unique metadata for each token </summary>
        <button onClick={pinAll} className="btn btn-stimorol">
          Pin and set metadata for all tokens
        </button>
        <br />
        or
        <br />
        <div className="col-12">
          You can set each NFT with an unique URI
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
                    className="btn btn-stimorol">
                    Add <i className="fas fa-plus" />
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
              Swal.fire({
                title: 'Updating URI',
                html: `Updating the URI of ${uniqueURIArray.length} NFT(s)`,
                icon: 'info',
                showConfirmButton: false
              });
              setBlockchainOperationInProgress(true);

              if (
                await metamaskCall(
                  contractData.instance.setUniqueURIBatch(
                    uniqueURIArray.map((item) =>
                      BigNumber.from(contractData.product.firstTokenIndex).add(
                        item.tokenId
                      )
                    ),
                    uniqueURIArray.map((item) => item.metadataURI)
                  ),
                  "Older versions of the RAIR contract don't have batch metadata update functionality!"
                )
              ) {
                Swal.fire('Success', 'Token URIs updated', 'success');
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
                Swal.fire({
                  title: 'Updating Contract URI',
                  html: 'Updating the URI visible to OpenSea',
                  icon: 'info',
                  showConfirmButton: false
                });
                setBlockchainOperationInProgress(true);

                if (
                  await metamaskCall(
                    contractData.instance.setContractURI(openSeaURI)
                  )
                ) {
                  Swal.fire('Success', 'Contract URI updated', 'success');
                }
                setBlockchainOperationInProgress(false);
              }}
              disabled={!contractData.instance}
              className="btn-stimorol w-100 btn">
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
