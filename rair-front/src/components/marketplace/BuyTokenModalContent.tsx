import { useState } from 'react';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatEther } from 'ethers';

import BatchRow from './BatchRow';
import {
  TBatchMintDataType,
  TBuyTokenModalContentType
} from './marketplace.types';

import useContracts from '../../hooks/useContracts';
import { useAppSelector } from '../../hooks/useReduxHooks';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import csvParser from '../../utils/csvParser';
import InputField from '../common/InputField';

const BuyTokenModalContent: React.FC<TBuyTokenModalContentType> = ({
  // blockchain,
  start,
  end,
  price,
  offerIndex,
  rangeIndex,
  offerName,
  diamonds,
  buyTokenFunction,
  buyTokenBatchFunction
}) => {
  const [tokenIndex, setTokenIndex] = useState<string>(start);
  const [rows, setRows] = useState<TBatchMintDataType>([]);

  const [batchMode, setBatchMode] = useState<boolean>(false);
  const [batchPage, setBatchPage] = useState<number>(0);

  const { textColor, primaryButtonColor, secondaryButtonColor } =
    useAppSelector((store) => store.colors);
  const { diamondMarketplaceInstance } = useContracts();

  const reactSwal = useSwal();
  const { web3TxHandler } = useWeb3Tx();

  const rowsLimit = 100;

  const batchMint = async (data: TBatchMintDataType) => {
    if (!diamondMarketplaceInstance) {
      return;
    }
    const addresses = data.map((i) => i['Public Address']);
    const tokens = data.map((i) => i['NFTID']);
    if (
      await web3TxHandler(diamondMarketplaceInstance, 'buyTokenBatch', [
        offerIndex,
        rangeIndex,
        tokens,
        addresses,
        {
          value: (BigInt(price) * BigInt(tokens.length)).toString()
        }
      ])
    ) {
      reactSwal.close();
    }
  };

  const readCSVData = (data: File) => {
    if (!data) {
      return;
    }
    csvParser(data, setRows, ['Public Address', 'NFTID']);
    // Data to be read, Function to execute after parsing is done, specific columns to return (optional)
  };

  const addRow = () => {
    if (rows.length > Number(end) - Number(start)) {
      return;
    }
    const aux: TBatchMintDataType = [...rows];
    aux.push({
      'Public Address': '',
      NFTID: aux.length ? Number(aux[aux.length - 1].NFTID) + 1 : Number(start)
    });
    setRows(aux);
  };

  const deleteRow = (index: number) => {
    const aux: TBatchMintDataType = [...rows];
    aux.splice(index, 1);
    setRows(aux);
  };

  const paginatedRows = rows
    ? rows.slice(0 + batchPage * 100, 100 + batchPage * 100)
    : [];

  return (
    <>
      <div className="row w-100 px-0 mx-0">
        <button
          className={`btn col-${batchMode ? '2' : '9'} rair-button`}
          style={{
            border: 'none',
            borderTopRightRadius: '0px',
            borderBottomRightRadius: '0px',
            background: secondaryButtonColor,
            color: textColor
          }}
          onClick={() => setBatchMode(false)}>
          Buy one Token
        </button>
        <button
          className={'btn col rair-button'}
          style={{
            border: 'none',
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px',
            background: primaryButtonColor,
            color: textColor
          }}
          onClick={() => setBatchMode(true)}>
          Buy multiple tokens
        </button>
      </div>
      <hr />
      <div className="row px-0 mx-0 col-12">
        {!batchMode ? (
          <>
            <InputField
              label="Token Index"
              type="number"
              customClass="form-control"
              labelClass="w-100 text-start"
              getter={tokenIndex}
              setter={setTokenIndex}
              max={+end}
              min={+start}
            />
            <div className="col-2" />
            <button
              disabled={!diamondMarketplaceInstance}
              onClick={async () => {
                let result;
                if (diamonds) {
                  result = await buyTokenFunction?.(
                    offerIndex,
                    tokenIndex,
                    BigInt(price)
                  );
                } else {
                  if (!diamondMarketplaceInstance) {
                    return;
                  }
                  result = await web3TxHandler(
                    diamondMarketplaceInstance,
                    'buyToken',
                    [offerIndex, rangeIndex, tokenIndex, { value: price }]
                  );
                }
                if (result === true) {
                  reactSwal.close();
                }
              }}
              style={{
                background: primaryButtonColor,
                color: textColor
              }}
              className="btn rair-button col-8">
              Buy token #{tokenIndex} for {formatEther(price)}
            </button>
            <div className="col-2" />
          </>
        ) : (
          <>
            <button disabled className="btn col-12">
              Offer: <b>{offerName}</b>
            </button>
            <button
              disabled={rows.length > Number(end) - Number(start)}
              onClick={addRow}
              style={{
                background: secondaryButtonColor,
                color: textColor
              }}
              className="col-2 btn rair-button">
              Add <FontAwesomeIcon icon={faPlus} />
            </button>
            <div className="col">
              Total: {formatEther(BigInt(price) * BigInt(rows.length))}
            </div>
            <div
              className="col-12"
              style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
              {paginatedRows.map((item, index) => {
                return (
                  <BatchRow
                    key={index}
                    index={index + rowsLimit * batchPage}
                    deleter={() => deleteRow(index)}
                    array={rows}
                  />
                );
              })}
            </div>
            {rows.length >= rowsLimit && (
              <>
                <button
                  disabled={batchPage === 0}
                  onClick={() => setBatchPage(batchPage - 1)}
                  style={{
                    background: secondaryButtonColor,
                    color: textColor
                  }}
                  className="btn col-12 col-md-3 rair-button">
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <div className="col-12 col-md-6">
                  Page: {batchPage} of {Number((rows.length - 2) / rowsLimit)}
                </div>
                <button
                  disabled={batchPage + 1 >= (rows.length - 2) / rowsLimit}
                  onClick={() => setBatchPage(batchPage + 1)}
                  style={{
                    background: secondaryButtonColor,
                    color: textColor
                  }}
                  className="btn col-12 col-md-3 rair-button">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </>
            )}
            <div className="col-12">
              <InputField
                customClass="py-0 form-control mb-2"
                labelClass="mt-2"
                id="csv_import"
                type="file"
                setter={readCSVData}
                setterField={['files', 0]}
                label="Or load addresses with CSV file"
              />
            </div>
            <button
              onClick={() => {
                if (diamonds) {
                  buyTokenBatchFunction?.(
                    offerIndex,
                    paginatedRows.map((item) => item['NFTID']),
                    paginatedRows.map((item) => item['Public Address']),
                    BigInt(price)
                  );
                } else {
                  batchMint(paginatedRows);
                }
              }}
              disabled={!diamondMarketplaceInstance || !paginatedRows.length}
              style={{
                background: primaryButtonColor,
                color: textColor
              }}
              className="col btn rair-button">
              Batch Mint {paginatedRows.length} tokens!
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default BuyTokenModalContent;
