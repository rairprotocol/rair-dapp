import React, { useState } from "react";
import Modal from "react-modal";
import { Carousel } from '@trendyol-js/react-carousel';
Modal.setAppElement("#root");

const NftItem = ({ pict }) => {
  let subtitle;

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#222021",
      width: "99%",
      height: "95%",
      borderRadius: "16px",
      zIndex: 20000,
      color: "white",
    },
  };

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "white";
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      <button
        onClick={openModal}
        className="col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start video-wrapper"
        style={{
          height: "291px",
          width: "291px",
          border: "none",
          backgroundColor: "transparent",
        }}
      >
        <div
          className="col-12 rounded"
          style={{
            top: 0,
            position: "relative",
            height: "96%",
            pointerEvents: "none",
          }}
        >
          <img
            alt="thumbnail"
            src={pict}
            style={{ position: "absolute", bottom: 0, borderRadius: "16px" }}
            className="col-12 h-100 w-100"
          />
          {/* <img
				alt='Animated thumbnail'
				src={`/thumbnails/${mediaList[item].thumbnail}.gif`}
				style={{position: 'absolute', display: hovering ? 'block' : 'none', bottom: 0, borderRadius: '16px'}}
				className='col-12  h-100 w-100' /> */}
        </div>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2
          ref={(_subtitle) => (subtitle = _subtitle)}
          style={{
            color: "white !Important",
            fontFamily: "Plus Jakarta Sans",
            fontSize: "40px",
            fontStyle: "normal",
            fontWeight: "700",
            lineHeight: "28px",
            letterSpacing: "0px",
            textAlign: "left",
            marginBottom: "3rem",
            marginTop: "1rem",
            marginLeft: "3px",
          }}
        >
          Description
        </h2>
        <button
          style={{
            float: "right",
            position: "relative",
            bottom: "6rem",
            border: "none",
            background: "transparent",
            color: "mediumpurple",
            transform: "scale(1.5)",
          }}
          onClick={closeModal}
        >
          &#215;
        </button>
        <div
          style={{
            maxWidth: "1600px",
            margin: "auto",
            backgroundColor: "#383637",
            borderRadius: "16px",
            padding: "24px 0",
          }}
        >
          <div
            style={{
              margin: "auto",
              backgroundImage: `url(${pict})`,
              width: "702px",
              height: "394px",
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
        <form>
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>
          
        </form>

        <Carousel show={3.5} slide={3} swiping={true} useArrowKeys={true} >
             <img style={{width: '291px', height: '291px'}}  src={pict} alt="ret" />
             <img style={{width: '291px', height: '291px'}}  src={pict} alt="erte" />
             <img style={{width: '291px', height: '291px'}} src={pict} alt="te" />
             <img style={{width: '291px', height: '291px'}} src={pict} alt="te" />
             <img style={{width: '291px', height: '291px'}} src={pict} alt="te" />


          </Carousel>
      </Modal>
    </>
  );
};
export default NftItem;
