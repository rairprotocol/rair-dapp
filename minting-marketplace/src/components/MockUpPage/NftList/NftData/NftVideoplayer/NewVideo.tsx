import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import contribQualityLevels from 'videojs-contrib-quality-levels';
import qualitySelector from 'videojs-hls-quality-selector';

export default function NewVideo({ videoData, selectVideo, videoIdName }) {
  const videoRef = useRef(null);
  const playerRef = useRef<any>(null);
  const poster = selectVideo && selectVideo.staticThumbnail;
  videojs.registerPlugin('hlsQualitySelector', qualitySelector);
  videojs.registerPlugin('qualityLevels', contribQualityLevels);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      playerRef.current = videojs(video, {
        autoplay: true,
        controls: true,
        preload: 'auto',
        fluid: true,
        responsive: true,
        playbackRates: [0.5, 1, 1.5, 2, 2.5],
        userActions: {
          hotkeys: true
        },
        controlBar: {
          pictureInPictureToggle: true
        },
        poster: poster,
        // sources: [{ src }],
        // sources: [{ videoData }],
        techOrder: ['html5'],
        html5: {
          vhs: {
            overrideNative: true
          },
          nativeAudioTracks: false,
          nativeVideoTracks: false
        }
      });
      playerRef.current.hlsQualitySelector({ displayCurrentQuality: true });

      // start
      const qualityLevels = playerRef.current.qualityLevels();
      // disable quality levels with less than 720 horizontal lines of resolution when added
      // to the list.
      qualityLevels.on('addqualitylevel', function (event) {
        const qualityLevel = event.qualityLevel;

        if (qualityLevel.height >= 720) {
          qualityLevel.enabled = true;
        } else {
          qualityLevel.enabled = false;
        }
      });

      // example function that will toggle quality levels between SD and HD, defining and HD
      // quality as having 720 horizontal lines of resolution or more
      // const toggleQuality = (function () {
      //   let enable720 = true;

      //   return function () {
      //     for (let i = 0; i < qualityLevels.length; i++) {
      //       const qualityLevel = qualityLevels[i];
      //       if (qualityLevel.height >= 720) {
      //         qualityLevel.enabled = enable720;
      //       } else {
      //         qualityLevel.enabled = !enable720;
      //       }
      //     }
      //     enable720 = !enable720;
      //   };
      // })();

      // const currentSelectedQualityLevelIndex = qualityLevels.selectedIndex; // -1 if no level selected

      // Listen to change events for when the player selects a new quality level
      qualityLevels.on('change', function () {
        // console.info('Quality Level changed!');
        // console.info('New level:', qualityLevels[qualityLevels.selectedIndex]);
      });
      //end

      // playerRef.current.chromecast();
      // playerRef.current.airPlay();

      playerRef.current.on('play', () => {
        playerRef.current.bigPlayButton.hide();
      });

      playerRef.current.on('pause', () => {
        playerRef.current.bigPlayButton.show();
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [videoRef, poster]);

  return (
    <video
      id={'vjs-' + videoIdName}
      ref={videoRef}
      autoPlay
      className="video video-js"
      playsInline>
      <source src={videoData} type="application/x-mpegURL" />
    </video>
  );
}
