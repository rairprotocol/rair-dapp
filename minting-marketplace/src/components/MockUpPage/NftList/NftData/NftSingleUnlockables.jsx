import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import NftDifferentRarity from "./UnlockablesPage/NftDifferentRarity/NftDifferentRarity";

const NftSingleUnlockables = ({
  productsFromOffer,
  // tokenData,
  setTokenDataFiltered,
}) => {
  const history = useHistory();
  const [sections, setSections] = useState(null);
  const rarity = ["Ultra Rair", "Rair", "Common"];

  useEffect(() => {
    const result = productsFromOffer.reduce((acc, item) => {
      const key = item.offer[0];
      const value = acc[key];

      if (value) {
        acc[key] = [...value, item];
      } else {
        acc[key] = [item];
      }
      return acc;
    }, {});
    setSections(result);
  }, [productsFromOffer]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        overflow: "hidden",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {sections &&
        Object.entries(sections).map(([key, item]) => {
          return (
            <div key={key}>
              <NftDifferentRarity
                setTokenDataFiltered={setTokenDataFiltered}
                title={rarity[key]}
              />
              {item.map((v) => {
                return (
                  <div
                    key={v._id}
                    style={{
                      margin: "1rem",
                    }}
                  >
                    <div
                      // onClick={
                        // () => history.push(`/watch/${v._id}/${v.mainManifest}`)
                        // history.push(
                        // `/unlockables/${blockchain}/${contract}/${product}/${selectedToken}`
                        // )
                      // }
                      style={{
                        display: "flex",
                        borderRadius: "16px",
                        minWidth: "592px",
                        backgroundColor: "#4E4D4DCC",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            background: "#CCA541",
                            borderRadius: "50%",
                            position: "absolute",
                            top: "35%",
                            left: "50%",
                            transform: "translate(-50%, -35%)",
                            zIndex: "1",
                          }}
                        >
                          <i
                            style={{
                              paddingLeft: "1px",
                              paddingTop: "8px",
                            }}
                            className="fa fa-lock"
                            aria-hidden="true"
                          ></i>
                          <p
                            style={{
                              textAlign: "center",
                              marginLeft: "-2rem",
                              marginTop: "9px",
                              width: "max-content",
                            }}
                          >
                            {v.description}
                          </p>
                        </div>
                        <img
                          style={{
                            width: "230px",
                            opacity: "0.4",
                            height: "135px",
                            filter: "blur(3px)",
                            borderTopLeftRadius: "16px",
                            borderBottomLeftRadius: "16px",
                          }}
                          src={`${v?.staticThumbnail}`}
                          // src={selectedData?.image}
                          alt=""
                        />
                      </div>
                      <div
                        style={{
                          borderLeft: "4px solid #CCA541",
                          display: "flex",
                          flexDirection: "column",
                          width: "inher",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          paddingLeft: "24px",
                        }}
                      >
                        <div>
                          {" "}
                          <p style={{ fontSize: 20 }}>
                            {v?.title}
                            {/* Video {selectedData?.name} */}
                          </p>{" "}
                        </div>
                        <div>
                          <p
                            style={{
                              color: "#A7A6A6",
                              fontSize: 20,
                            }}
                          >
                            {v?.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      {/* || (
          <div
            style={{
              margin: "1rem",
              height: "135px",
            }}
          >
            <div
              onClick={
                () => console.log("Cooming soon")
                history.push(
            `/watch/${productsFromOffer._id}/${productsFromOffer.mainManifest}`
            )
              }
            style={{
              display: "flex",
              borderRadius: "16px",
              width: "592px",
              backgroundColor: "#4E4D4DCC",
            }}
            >
            <div
              style={{
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "#CCA541",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "35%",
                  left: "50%",
                  transform: "translate(-50%, -35%)",
                  zIndex: "1",
                }}
              >
                <i
                  style={{
                    paddingLeft: "1px",
                    paddingTop: "8px",
                  }}
                  className="fa fa-lock"
                  aria-hidden="true"
                ></i>
                <p
                  style={{
                    textAlign: "center",
                    marginLeft: "-2rem",
                    marginTop: "9px",
                    width: "max-content",
                  }}
                >
                  Coming soon
                </p>
              </div>
              {productsFromOffer.length && productsFromOffer.map((v) => { return })}
              <img
                style={{
                  width: "230px",
                  opacity: "0.4",
                  height: "135px",
                  filter: "blur(3px)",
                }}
                src={`/thumbnails/${v?.thumbnail}.png`}
                src={selectedData?.image}
                alt=""
              />
            </div>
            <div
              style={{
                borderLeft: "4px solid #CCA541",
                display: "flex",
                flexDirection: "column",
                width: "inher",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingLeft: "24px",
              }}
            >
              <div>
                {" "}
                <p style={{ fontSize: 20 }}>

                  Video {selectedData?.name}
                </p>{" "}
              </div>
              <div>
                <p
                  style={{
                    color: "#A7A6A6",
                    fontSize: 20,
                  }}
                >
                  00:03:23
                </p>
              </div>
            </div>
          </div>
        ) */}
    </div>
  );
};

export default NftSingleUnlockables;
