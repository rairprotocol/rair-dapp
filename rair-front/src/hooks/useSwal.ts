import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { RootState } from '../ducks';
import { ColorStoreType } from '../ducks/colors/colorStore.types';

const useSwal = () => {
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  const reactSwal = withReactContent(
    Swal.mixin({
      background: primaryColor,
      color: textColor,
      customClass: {
        popup: `rounded-rair`,
        htmlContainer: `text-${textColor}`
      }
    })
  );
  return reactSwal;
};

export default useSwal;
