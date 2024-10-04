import { useCallback, useState } from 'react';
import { formatEther, parseUnits } from 'ethers';

import useContracts from '../../hooks/useContracts';
import { useAppSelector } from '../../hooks/useReduxHooks';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import InputField from '../common/InputField';

const LicenseExchange = () => {
  const [tokenIndex, setTokenIndex] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [userAddress, setUserAddress] = useState('');
  const [signedHash, setSignedhash] = useState('');

  const { licenseExchangeInstance, mainTokenInstance } = useContracts();
  const { currentUserAddress } = useAppSelector((store) => store.web3);

  const { adminRights } = useAppSelector((store) => store.user);

  const { primaryButtonColor, secondaryButtonColor, textColor } =
    useAppSelector((store) => store.colors);

  const { web3TxHandler, web3TxSignMessage } = useWeb3Tx();
  const rSwal = useSwal();

  const generateLicenseHash = useCallback(async () => {
    if (!licenseExchangeInstance) {
      return;
    }
    const result = await web3TxHandler(
      licenseExchangeInstance,
      'generateLicenseHash',
      [tokenIndex, userAddress, parseUnits(tokenPrice.toString(), 18)]
    );
    const result2 = await web3TxSignMessage(result);
    if (result2) {
      setSignedhash(result2);
      navigator.clipboard.writeText(result2);
      rSwal.fire(
        'Hash ready',
        `'${result2}' has been copied to the clipboard`,
        'success'
      );
    }
  }, [
    licenseExchangeInstance,
    web3TxHandler,
    tokenIndex,
    userAddress,
    tokenPrice,
    web3TxSignMessage,
    rSwal
  ]);

  const purchaseLicense = useCallback(async () => {
    if (!licenseExchangeInstance || !mainTokenInstance) {
      return;
    }
    const tokenPriceBigNumber = parseUnits(tokenPrice.toString(), 18);
    rSwal.fire({
      title: 'Checking allowance',
      html: `Please wait`,
      showConfirmButton: false
    });
    const allowance = await web3TxHandler(mainTokenInstance, 'allowance', [
      currentUserAddress,
      await licenseExchangeInstance.getAddress()
    ]);
    if (allowance.lt(tokenPriceBigNumber)) {
      rSwal.fire({
        title: 'Awaiting approval',
        html: `Approve the exchange contract to take ${formatEther(
          tokenPriceBigNumber
        )}`,
        showConfirmButton: false
      });
      await web3TxHandler(mainTokenInstance, 'approve', [
        await licenseExchangeInstance.getAddress(),
        tokenPriceBigNumber
      ]);
    }
    rSwal.fire({
      title: 'Minting License NFT',
      html: `Minting License #${tokenIndex} for ${formatEther(
        tokenPriceBigNumber
      )} tokens`,
      showConfirmButton: false
    });
    if (
      await web3TxHandler(licenseExchangeInstance, 'mint', [
        tokenIndex,
        tokenPriceBigNumber,
        signedHash
      ])
    ) {
      rSwal.fire('Success', `You now own License #${tokenIndex}`, 'success');
    }
  }, [
    licenseExchangeInstance,
    web3TxHandler,
    tokenIndex,
    tokenPrice,
    signedHash,
    rSwal,
    mainTokenInstance,
    currentUserAddress
  ]);

  const connectERC20 = useCallback(async () => {
    if (!licenseExchangeInstance || !mainTokenInstance) {
      return;
    }
    await web3TxHandler(licenseExchangeInstance, 'setPurchasePeriod', [180]);
    await web3TxHandler(licenseExchangeInstance, 'updateERC20Address', [
      await mainTokenInstance.getAddress()
    ]);
  }, [licenseExchangeInstance, web3TxHandler, mainTokenInstance]);

  if (!licenseExchangeInstance) {
    return <>No exchange available</>;
  }

  return (
    <div className="row w-100 px-5">
      <h3>Licenses</h3>
      <div className="col-12 col-md-6">
        <InputField
          customClass="rounded-rair form-control"
          label={'License Number'}
          getter={tokenIndex}
          setter={setTokenIndex}
        />
      </div>
      <div className="col-12 col-md-6">
        <InputField
          customClass="rounded-rair form-control"
          label={'Token Price'}
          getter={tokenPrice}
          setter={setTokenPrice}
        />
      </div>
      {adminRights && (
        <div className="col-12 col-md-6">
          <InputField
            customClass="rounded-rair form-control"
            label={'User address'}
            getter={userAddress}
            setter={setUserAddress}
          />
        </div>
      )}
      <div className="col-12">
        <InputField
          customClass="rounded-rair form-control"
          label={'Signed Hash'}
          getter={signedHash}
          setter={setSignedhash}
        />
      </div>
      <hr className="my-2" />
      {adminRights && (
        <button
          className="btn col-12 col-md-3 rair-button"
          disabled={userAddress === ''}
          style={{ background: secondaryButtonColor, color: textColor }}
          onClick={generateLicenseHash}>
          Sign Hash (as admin)
        </button>
      )}
      {adminRights && (
        <button
          className="btn col-12 col-md-3 rair-button"
          style={{ background: secondaryButtonColor, color: textColor }}
          onClick={connectERC20}>
          Connect ERC20 to Exchange (as admin)
        </button>
      )}
      <div className="col-12 col-md" />
      <button
        className="btn col-12 h1 col-md-3 rair-button"
        style={{ background: primaryButtonColor, color: textColor }}
        onClick={purchaseLicense}>
        Purchase License (as user)
      </button>
    </div>
  );
};

export default LicenseExchange;
