//@ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';
import { useSelector, Provider, useStore } from 'react-redux';
import { utils } from 'ethers';

const rSwal = withReactContent(Swal);

const ModalContent = () => {
  const [erc721Name, setERC721Name] = useState('');
  const [chainId, setChainId] = useState('null');
  const [price, setPrice] = useState(0);
  const [currentChainName, setCurrentChainName] = useState('');

  const [options /*setOptions*/] = useState([
    { value: '0x61', label: 'Binance Testnet' },
    { value: '0x5', label: 'Ethereum Goerly' },
    { value: '0x13881', label: 'Matic Mumbai' },
    { value: '0x89', label: 'Matic Mainnet' }
  ]);

  const { factoryInstance, erc777Instance, programmaticProvider } = useSelector(
    (store) => store.contractStore
  );

  const getPrice = useCallback(async () => {
    if (window.ethereum) {
      setChainId(window.ethereum.chainId);
    } else if (programmaticProvider) {
      setChainId(programmaticProvider.provider._network.chainId);
    }
    if (factoryInstance && erc777Instance) {
      setPrice(
        (
          await factoryInstance.deploymentCostForERC777(erc777Instance.address)
        ).toString()
      );
      setCurrentChainName(
        options.filter(
          (item) =>
            item.value ===
            `0x${(factoryInstance?.provider?._network?.chainId).toString(16)}`
        )[0]?.label
      );
    }
  }, [factoryInstance, erc777Instance, options, programmaticProvider]);

  useEffect(() => {
    getPrice();
  }, [getPrice]);

  useEffect(() => {
    if (chainId !== 'null') {
      if (window.ethereum) {
        if (chainId === window.ethereum.chainId) {
          return;
        }
        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainId }]
        });
      } else {
        Swal.fire(
          'Blockchain Switch is disabled on Programmatic Connections!',
          'Switch to the proper chain manually!'
        );
      }
      setPrice(0);
    }
  }, [chainId]);

  if (!price) {
    return <>Please wait...</>;
  }

  return (
    <>
      Deploy a new contract for {price} tokens!
      <hr />
      <InputSelect
        label="Blockchain"
        customClass="form-control"
        placeholder="Please select"
        labelClass="w-100 text-center"
        options={options}
        getter={chainId}
        setter={setChainId}
      />
      <br />
      <InputField
        label="Contract Name"
        customClass="form-control"
        labelClass="w-100 text-start"
        getter={erc721Name}
        setter={setERC721Name}
      />
      <button
        onClick={async () => {
          await erc777Instance.send(
            factoryInstance.address,
            price,
            utils.toUtf8Bytes(erc721Name)
          );
          rSwal.close();
        }}
        disabled={price === 0}
        className="btn my-3 btn-royal-ice">
        Deploy on {currentChainName}!
      </button>
    </>
  );
};

const DeployContracts = () => {
  const { factoryInstance } = useSelector((store) => store.contractStore);
  const { primaryColor, secondaryColor } = useSelector(
    (store) => store.colorStore
  );
  const store = useStore();

  return (
    <button
      disabled={factoryInstance === undefined || !window.ethereum}
      className="btn btn-stimorol col-2"
      style={{ position: 'absolute', top: 0, right: 0 }}
      onClick={async () => {
        rSwal.fire({
          html: (
            <Provider store={store}>
              <ModalContent />
            </Provider>
          ),
          showConfirmButton: false,
          customClass: {
            popup: `bg-${primaryColor}`,
            htmlContainer: `text-${secondaryColor}`
          }
        });
      }}>
      New Contract <i className="fas fa-plus" />
    </button>
  );
};

export default DeployContracts;
