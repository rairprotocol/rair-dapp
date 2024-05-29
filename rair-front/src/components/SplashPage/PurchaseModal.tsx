//unused-component
import Modal from 'react-modal';

import './SplashPage.css';
import './GreymanSplashPageMobile.css';
import './../AboutPage/AboutPageNew/AboutPageNew.css';

const customStyles = {
  overlay: {
    zIndex: '1'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    fontFamily: 'Plus Jakarta Text',
    borderRadius: '16px'
  }
};

let subtitle;
let Metamask;
// Modal.setAppElement("#root");

// const [active, setActive] = useState({ policy: false, use: false });

// const [modalIsOpen, setIsOpen] = useState(false);
// const {currentUserAddress} = useSelector((store) => store.contractStore);

// const openModal = useCallback(() => {
//   setIsOpen(true);
// }, []);

// function afterOpenModal() {
//     subtitle.style.color = "#9013FE";
//   }

//   function closeModal() {
//     setIsOpen(false);
//     setActive((prev) => ({
//       ...prev,
//       policy: false,
//       use: false,
//     }));
//   }

const PurchaseModal = (props) => {
  const {
    modalIsOpen,
    afterOpenModal,
    closeModal,
    currentUserAddress,
    setActive
  } = props;
  return (
    <div className="btn-timer-nipsey">
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal">
        <h2
          style={{
            fontSize: '60px',
            fontWeight: 'bold',
            paddingTop: '3rem',
            cursor: 'default'
          }}
          ref={(_subtitle) => (subtitle = _subtitle)}>
          Terms of Service
        </h2>
        <div className="modal-content-wrapper">
          <div className="modal-form">
            <form>
              <div className="form-group">
                <input type="checkbox" id="policy" />
                <label
                  onClick={() =>
                    setActive((prev) => ({
                      ...prev,
                      policy: !prev.policy
                    }))
                  }
                  htmlFor="policy">
                  I agree to the{' '}
                </label>
                <span
                  onClick={() => window.open('/privacy', '_blank')}
                  style={{
                    color: '#9013FE',
                    fontSize: '24px',
                    paddingRight: '1rem',
                    marginLeft: '-2.5rem'
                  }}>
                  Privacy Policy
                </span>
              </div>
              <div className="form-group sec-group ">
                <input type="checkbox" className="dgdfgd" id="use" />
                <label
                  onClick={() =>
                    setActive((prev) => ({ ...prev, use: !prev.use }))
                  }
                  htmlFor="use">
                  I accept the{' '}
                </label>
                <span
                  onClick={() => window.open('/terms-use', '_blank')}
                  style={{
                    color: '#9013FE',
                    fontSize: '24px',
                    paddingRight: '2.3rem',
                    marginLeft: '-2.5rem'
                  }}>
                  Terms of Use
                </span>
              </div>
            </form>
          </div>
          <div className="modal-content-np">
            <div className="modal-btn-wrapper">
              <div className="modal-btn">
                <img
                  style={{ width: '100px', marginLeft: '-1rem' }}
                  className="metamask-logo modal-btn-logo"
                  src={Metamask}
                  alt="metamask-logo"
                />{' '}
                {currentUserAddress
                  ? "You're connected!"
                  : 'Connect your wallet!'}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
