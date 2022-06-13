//@ts-nocheck
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import setDocumentTitle from "../../../../utils/setTitle";
import "./VideoPlayer.css";
import { TAuthGetChallengeResponse } from "../../../../axios.responseTypes";

const VideoWindow = ({mediaAddress}) => {
  return (
    <div 
    className="col-12 row mx-0 h1"
    style={{
       justifyContent: "center"
    }}
    >
    <video
      // id={"vjs-" + videoName}
      className="video-player"
      controls
      preload="auto"
      data-setup="{}"
    >
      <source
        // autostart="false"
        src={mediaAddress}
        type="video/mp4"
      />
    </video>
  </div>
  )
}

const VideoWindowError = () => {
  return (
    <div className="col-12 row mx-0 bg-secondary h1">
      <p className="video-window-error"> Metamask Signature Required to Access Video</p>
    </div>
  )
}

const VideoPlayerBySignature = ({mediaAddress}) => {
  const { programmaticProvider } = useSelector((state) => state.contractStore);
  const [signature, setSignature] = useState(null)

  const requestChallenge = useCallback(async () => {
    let sign;
    let parsedResponse;

    if (window.ethereum) {
      let [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      let response = await axios.get<TAuthGetChallengeResponse>("/api/auth/get_challenge/" + account);
      parsedResponse = JSON.parse(response.data.response);
      try {
        sign = await window.ethereum.request({
          method: "eth_signTypedData_v4",
          params: [account, response.data.response],
          from: account,
        });
        setSignature(sign);
      }
      catch(error){
        console.log(error)
        Swal.fire("Error", "MetaMask signature required to stream video", "error");
      }
    }

      else if (programmaticProvider) {
      let response = await axios.get<TAuthGetChallengeResponse>("/api/auth/get_challenge/" + programmaticProvider.address);
      parsedResponse = JSON.parse(response.data.response);
      let { EIP712Domain, ...revisedTypes } = parsedResponse.types;
      try {
        sign = await programmaticProvider._signTypedData(
          parsedResponse.domain,
          revisedTypes,
          parsedResponse.message
        );
        setSignature(sign);
      }
      catch(error){
        console.log(error)
        Swal.fire("Error", "MetaMask signature required to stream video", "error");
      }
    }
      
    else {
      Swal.fire("Error", "Unable to decrypt videos", "error");
      return;
    }
    }, [programmaticProvider]);


  useEffect(() => {
    requestChallenge()
  }, [requestChallenge]);

  useEffect(() => {
    setDocumentTitle(`Streaming`);
  }, []);


  return (
    <>
    {signature ? <VideoWindow mediaAddress={mediaAddress}/> : <VideoWindowError/> }
    </>
  )
};

export default VideoPlayerBySignature;


