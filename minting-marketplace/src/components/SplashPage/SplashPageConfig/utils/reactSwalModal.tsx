import WarningModal from '../../WarningModal/WarningModal';

export const handleReactSwal = (reactSwal) => () => {
  reactSwal.fire({
    title:
      'Watch out for sign requests that look like this. There are now gasless attack vectors that can set permissions to drain your wallet',
    html: <WarningModal className="genesis" />,
    customClass: {
      popup: `genesis-radius genesis-resp `,
      title: 'text-genesis'
    },
    showConfirmButton: false
  });
};
