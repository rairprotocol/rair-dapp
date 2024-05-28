import { useSelector } from 'react-redux';

import { NftItem } from './ItemOffer';
import { IListOffersComponent } from './listOffers.types';

import { RootState } from '../../ducks';
import LoadingComponent from '../common/LoadingComponent';

const ListOffers: React.FC<IListOffersComponent> = ({ data }) => {
  const loading = useSelector<RootState, boolean>(
    (store) => store.nftDataStore.loading
  );

  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <div className={'list-button-wrapper'}>
      {data && data.length > 0 ? (
        data
          .filter((resaleOffer) => resaleOffer.status === '0')
          .map((resaleOffer, index) => {
            return (
              <NftItem
                key={`${index}-${resaleOffer.blockchain}`}
                blockchain={resaleOffer.blockchain}
                _id={resaleOffer._id}
                contract={resaleOffer.contract}
                operator={resaleOffer.operator}
                price={resaleOffer.price}
                status={resaleOffer.status}
                tokenId={resaleOffer.tokenId}
                tradeid={resaleOffer.tradeid}
              />
            );
          })
      ) : (
        <div className="list-wrapper-empty">
          <h2>No items to display</h2>
        </div>
      )}
    </div>
  );
};

export default ListOffers;
