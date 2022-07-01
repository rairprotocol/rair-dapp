import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import InputField from '../../common/InputField';
import InputSelect from '../../common/InputSelect';
import Swal from 'sweetalert2';
import { web3Switch } from '../../../utils/switchBlockchain';
import { metamaskCall } from '../../../utils/metamaskUtils';
import { BigNumber } from 'ethers';
import {
  IIBlockchainURIManager,
  ITokenURIRow,
  TNextToken,
  TUniqueURIArray
} from '../creatorStudio.types';
import { RootState } from '../../../ducks';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { UsersContractsType } from '../../adminViews/adminView.types';

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
  collectionIndex
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
  const [rangeWideMetadata, setRangeWideMetadata] = useState<string>('');
  const [rangeOptions, setRangeOptions] = useState<UsersContractsType[]>([]);
  const [selectedRange, setSelectedRange] = useState<string>('null');
  const [appendTokenForRange, setAppendTokenForRange] =
    useState<boolean>(false);
  const [uniqueURIArray, setUniqueURIArray] = useState<TUniqueURIArray[]>([]);
  const [openSeaURI, setOpenSeaURI] = useState<string>('');
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
            className={`col-12 col-md-6 btn btn-${
              appendTokenForContract ? 'royal-ice' : 'warning'
            }`}>
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

              if (
                await metamaskCall(
                  contractData.instance.setBaseURI(
                    contractWideMetadata,
                    appendTokenForContract
                  )
                )
              ) {
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
            className={`col-12 col-md-6 btn btn-${
              appendTokenForCollection ? 'royal-ice' : 'warning'
            }`}>
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
              if (
                await metamaskCall(
                  contractData.instance.setProductURI(
                    collectionIndex,
                    collectionWideMetadata,
                    appendTokenForCollection
                  )
                )
              ) {
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
            className={`col-12 col-md-6 btn btn-${
              appendTokenForRange ? 'royal-ice' : 'warning'
            }`}>
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
      </details>
      <hr />
      <details>
        <summary className="col-12"> Unique metadata for each token </summary>
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
