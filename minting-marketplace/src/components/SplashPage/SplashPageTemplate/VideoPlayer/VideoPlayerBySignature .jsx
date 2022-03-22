import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import setDocumentTitle from "../../../../utils/setTitle";

const VideoWindow = ({mediaAddress}) => {
  return (
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
  )
}

const VideoWindowError = () => {
  return (
    <div className="col-12 row mx-0 bg-secondary h1">
      Metamask Signature Required to Access Video
    </div>
  )
}

const VideoPlayerBySignature = ({mediaAddress}) => {
  const { programmaticProvider } = useSelector((state) => state.contractStore);
  const [signature, setSignature] = useState(null)
  console.log("test")
  console.log(programmaticProvider)
  console.log(window.ethereum)

  const requestChallenge = useCallback(async () => {
    console.log("running -1")

    let sign;
    let parsedResponse;

    if (window.ethereum) {
      console.log("running - 2a")
      let [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      let response = await (
        await fetch("/api/auth/get_challenge/" + account)
      ).json();
      parsedResponse = JSON.parse(response.response);
      sign = await window.ethereum.request({
        method: "eth_signTypedData_v4",
        params: [account, response.response],
        from: account,
      });
      setSignature(sign);
      console.log("success - eth")
      }

      else if (programmaticProvider) {
      console.log("running - 2b")
      let response = await (
        await fetch("/api/auth/get_challenge/" + programmaticProvider.address)
      ).json();
      parsedResponse = JSON.parse(response.response);
      let { EIP712Domain, ...revisedTypes } = parsedResponse.types;
      sign = await programmaticProvider._signTypedData(
        parsedResponse.domain,
        revisedTypes,
        parsedResponse.message
      );
      setSignature(sign);
      console.log("success")
      return;
      
    } else {
      console.log("failure")
      Swal.fire("Error", "Unable to decrypt videos", "error");
      return;
    }
    }, [programmaticProvider]);


  useEffect(() => {
    requestChallenge()
  }, [requestChallenge]);

  useEffect(() => {console.log(signature)}, [signature])


  return (
    <>
    {signature ? <VideoWindow mediaAddress={mediaAddress}/> : <VideoWindowError/> }
    </>
  )
};

export default VideoPlayerBySignature;


/* stuff to put back in 
  useEffect(() => {
    setDocumentTitle(`Streaming`);
  }, [videoName]);

*/