import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { RootState } from '../ducks';
import { ColorStoreType } from '../ducks/colors/colorStore.types';

const useSwal = () => {
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reactSwal = useCallback(
    withReactContent(
      Swal.mixin({
        background: primaryColor,
        color: textColor,
        customClass: {
          popup: `rounded-rair`
        }
      })
    ),
    [primaryColor, textColor]
  );

  return reactSwal;
};

export default useSwal;
