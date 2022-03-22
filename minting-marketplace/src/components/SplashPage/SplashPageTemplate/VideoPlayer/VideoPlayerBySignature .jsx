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
  const {signature, setSignature} = useState(null)

  const requestChallenge = useCallback(async () => {

    let sign;
    let parsedResponse;

    if (programmaticProvider) {
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
      return;
      
    } else {
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