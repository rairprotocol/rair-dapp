import BatchERC20Transfer from './BatchERC20Transfer';
import BlockChainSwitcher from './BlockchainSwitcher';
import ImportExternalContract from './ImportExternalContracts';
import TransferTokens from './transferTokens';
import UserManager from './UserManager';
const ImportAndTransfer = () => {
  return (
    <div>
      <div className="col-12">
        <BlockChainSwitcher />
      </div>
      <details>
        <summary className="h3">Manual token transfer</summary>
        <TransferTokens />
      </details>
      <hr />
      <details>
        <summary className="h3">Import external contract</summary>
        <ImportExternalContract />
      </details>
      <hr />
      <details>
        <summary className="h3">User manager</summary>
        <UserManager />
      </details>
      <hr />
      <details>
        <summary className="h3">ERC20 transfer tool</summary>
        <BatchERC20Transfer />
      </details>
    </div>
  );
};
export default ImportAndTransfer;
