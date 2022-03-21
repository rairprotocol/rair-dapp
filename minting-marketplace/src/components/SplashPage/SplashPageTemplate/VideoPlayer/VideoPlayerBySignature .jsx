import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import setDocumentTitle from "../../../../utils/setTitle";

const VideoPlayerBySignature = ({mediaAddress}) => {
  const { programmaticProvider } = useSelector((state) => state.contractStore);
  const [videoName] = useState(Math.round(Math.random() * 10000));

  const requestChallenge = useCallback(async () => {
    let signature;
    let parsedResponse;
    if (window.ethereum) {
      let [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      let response = await (
        await fetch("/api/auth/get_challenge/" + account)
      ).json();
      parsedResponse = JSON.parse(response.response);
      signature = await window.ethereum.request({
        method: "eth_signTypedData_v4",
        params: [account, response.response],
        from: account,
      });
    } else if (programmaticProvider) {
      let response = await (
        await fetch("/api/auth/get_challenge/" + programmaticProvider.address)
      ).json();
      parsedResponse = JSON.parse(response.response);
      let { EIP712Domain, ...revisedTypes } = parsedResponse.types;
      signature = await programmaticProvider._signTypedData(
        parsedResponse.domain,
        revisedTypes,
        parsedResponse.message
      );
    } else {
      Swal.fire("Error", "Unable to decrypt videos", "error");
      return;
    }
    }, [videoName, programmaticProvider]);

  useEffect(() => {
    try {
        requestChallenge()
    }
    catch(error){
        console.log(error);
        Swal.fire("Metamask Signature Requested");
    }
  }, [requestChallenge]);

  useEffect(() => {
    setDocumentTitle(`Streaming`);
  }, [videoName]);

  return (
    <>
      <div className="col-12 row mx-0 bg-secondary h1">
        <video
          // id={"vjs-" + videoName}
          // className="video-js vjs-16-9"
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
    </>
  );
};

export default VideoPlayerBySignature;
