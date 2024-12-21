//@ts-nocheck
import { useAppSelector } from "../../hooks/useReduxHooks";
import { RairProtocol } from "../../images/index";
import "./DevSdkPage.css";
import LeaderBoard from "./LeaderBoard/LeaderBoard";
import EarnRewards from "./EarnRewards/EarnRewards";
import { useCallback, useEffect, useState } from "react";
import { rairSDK } from "../common/rairSDK";
import PaginationBox from "../MockUpPage/PaginationBox/PaginationBox";

const DevSdkPage = () => {
  const [allRewards, setAllRewards] = useState(false);

  const { currentUserAddress } = useAppSelector((store) => store.web3);
  const [currentPageBoard, setCurrentPageBoard] = useState(1);
  const [totalCountBoard, setTotalCountBoard] = useState(undefined);

  const [userList, setUserList] = useState<any>();

  const getUserData = useCallback(async (page) => {
    const response = await rairSDK.users.listUsers({
      itemsPerPage: 8,
      pageNum: page - 1,
    });
    if (response.data) {
      setUserList(response.data);
      setTotalCountBoard(response.totalCount);
    }
  }, []);

  const changePageLeaderBoard = (page) => {
    setCurrentPageBoard(page);
  };

  useEffect(() => {
    getUserData(currentPageBoard);
  }, [getUserData, currentUserAddress, currentPageBoard]);

  const titleColumn = [
    {
      id: 1,
      name: "Git Handle",
      hideMobile: false,
    },
    {
      id: 2,
      name: "Level",
      hideMobile: false,
    },
    {
      id: 3,
      name: "Availability",
      hideMobile: true,
      class: "availability-leader",
    },
    {
      id: 4,
      name: "Top Language",
      hideMobile: true,
      class: "language-leader",
    },
  ];

  return (
    <div className="wrapper-splash-page devApp">
      <div className="template-home-splash-page-dev">
        <div className="template-author-card-dev">
          <div className="left-side">
            <h3>
              <span>#Buidl</span> the next web3 unicorn and earn $RAIR
            </h3>
            <button>Connect Github</button>
          </div>
          <div className="right-side">
            <div className="block-title">
              <p>Developer</p>
              <p>Reward Network</p>
            </div>
            <img src={RairProtocol} alt="Rair Protocol" />
          </div>
        </div>
      </div>
      <div className="columns-stats">
        <div className="columns-stats-box">
          <div>Devs</div>
          <div
            className="columns-stats-box-numbers"
            style={{ color: "#A7A6A6", fontWeight: "bold" }}
          >
            3800
          </div>
        </div>
        <div className="columns-stats-box">
          <div>Levels Earned</div>
          <div
            className="columns-stats-box-numbers"
            style={{ color: "#95F619", fontWeight: "bold" }}
          >
            12187
          </div>
        </div>
        <div className="columns-stats-box">
          <div>Commits</div>
          <div
            className="columns-stats-box-numbers"
            style={{ color: "#fff", fontWeight: "bold" }}
          >
            5125 + 120 + 300
          </div>
        </div>
        <div className="columns-stats-box">
          <div>Integrations</div>
          <div
            className="columns-stats-box-numbers"
            style={{ color: "#fff", fontWeight: "bold" }}
          >
            87
          </div>
        </div>
      </div>
      <div className="title-dev-dapp">
        <div>Leaderboard</div>
      </div>
      <LeaderBoard tableData={userList} titleColumn={titleColumn} />
      <PaginationBox
        totalPageForPagination={totalCountBoard}
        changePage={changePageLeaderBoard}
        currentPage={currentPageBoard}
        itemsPerPageNotifications={8}
        whatPage={"notifications"}
      />
      <div className="title-dev-dapp">
        <div> Earn Rewards</div>
        <div>
          {!allRewards && (
            <button
              onClick={() => {
                setAllRewards(true);
              }}
            >
              {"All rewards  >>"}
            </button>
          )}
        </div>
      </div>
      <EarnRewards
        allRewards={allRewards}
        devDapp={true}
        setAllRewards={setAllRewards}
      />
      <div
        style={{
          width: "80vw",
        }}
      >
        <div className="title-dev-dapp">
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default DevSdkPage;
