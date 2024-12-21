//@ts-nocheck
import { FC, memo, useEffect, useState } from "react";
import { Hex } from "viem";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../../hooks/useReduxHooks";
import { dataStatuses } from "../../../../redux/commonTypes";
import { loadVideoList } from "../../../../redux/videoSlice";
import { CatalogVideoItem } from "../../../../types/commonTypes";
import LoadingComponent from "../../../common/LoadingComponent";
import VideoItem from "../../../video/videoItem";
// import cl from './PersonalProfileMyVideoTab.module.css';

interface IPersonalProfileMyVideoTabComponent {
  titleSearch: string;
  publicAddress?: Hex;
}

const PersonalProfileMyVideoTabComponent: FC<
  IPersonalProfileMyVideoTabComponent
> = ({ titleSearch, publicAddress }) => {
  const dispatch = useAppDispatch();

  const { videos, videoListStatus } = useAppSelector((store) => store.videos);
  const [unlockedVideos, setUnlockedVideos] = useState<CatalogVideoItem[]>([]);

  useEffect(() => {
    dispatch(
      loadVideoList({
        userAddress: publicAddress ? publicAddress : undefined,
      })
    );
  }, [dispatch, publicAddress]);

  useEffect(() => {
    if (publicAddress) {
      setUnlockedVideos(videos);
    }
    setUnlockedVideos(videos.filter((video) => video.isUnlocked));
  }, [videos, publicAddress]);

  if (videoListStatus !== dataStatuses.Complete) {
    return <LoadingComponent />;
  }
  return (
    <div className="PersonalProfileMyVideoTab-wrapper">
      <div
        className="list-button-wrapper tree-tab-unlocks"
        style={{ verticalAlign: "top" }}
      >
        {unlockedVideos.length ? (
          unlockedVideos
            ?.filter((video) =>
              video.title.toLowerCase().includes(titleSearch.toLowerCase())
            )
            .map((item, index) => {
              return <VideoItem key={index} item={item} />;
            })
        ) : (
          <h5 className="w-100 text-center">No files found</h5>
        )}
      </div>
    </div>
  );
};

export const PersonalProfileMyVideoTab = memo(
  PersonalProfileMyVideoTabComponent
);
