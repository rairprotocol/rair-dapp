import { useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppSelector } from './useReduxHooks';

const useSwal = () => {
  const { primaryColor, textColor } = useAppSelector((store) => store.colors);

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
