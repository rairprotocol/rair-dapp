export const openModal = () => {
  const modalWrapper = document.getElementById('home-page-modal-filter');
  if (modalWrapper) {
    modalWrapper.style.height = '100%';
  }
};
export const closeModal = () => {
  const modalWrapper = document.getElementById('home-page-modal-filter');
  if (modalWrapper) {
    modalWrapper.style.height = 'fit-content';
  }
};
