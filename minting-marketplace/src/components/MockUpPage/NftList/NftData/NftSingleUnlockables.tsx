//@ts-nocheck
import React, { useEffect, useState } from "react";
import NftDifferentRarity from "./UnlockablesPage/NftDifferentRarity/NftDifferentRarity";

const NftSingleUnlockables = ({
  productsFromOffer,
  setTokenDataFiltered,
  primaryColor,
  setSelectVideo,
}) => {
  const [sections, setSections] = useState(null);
  const [rarity, setRarity] = useState([
    "Unlock Ultra Rair",
    "Unlock Rair",
    "Unlock Common",
  ]);

  useEffect(() => {
    const ope = productsFromOffer.some((i) => i.isUnlocked === true);
    if (ope) {
      setRarity(["Ultra Rair", "Rair", "Common"]);
    }
  }, [productsFromOffer]);

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
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "1600px",
      }}
    >
      {sections &&
        Object.entries(sections).map(([key, item]) => {
          return (
            <div key={key} style={{ width: "100%" }}>
              <NftDifferentRarity
                setTokenDataFiltered={setTokenDataFiltered}
                title={rarity[key]}
                isUnlocked={item.map((i) => i.isUnlocked)}
              />
              <div
                className="video-wrapper"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "center",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {item.map((v) => {
                  return (
                    <div
                      key={v._id}
                      style={{
                        margin: "1rem",
                      }}
                    >
                      <div
                        onClick={() => setSelectVideo(v)}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          borderRadius: "16px",
                          minWidth: "592px",
                          backgroundColor: `${
                            primaryColor === "rhyno"
                              ? "rgb(167, 166, 166)"
                              : "#4E4D4DCC"
                          }`,
                        }}
                      >
                        {v.isUnlocked ? (
                          <div
                            style={{
                              position: "relative",
                            }}
                          >
                            <img
                              style={{
                                width: "230px",
                                // opacity: "0.4",
                                height: "135px",
                                // filter: "blur(3px)",
                                borderTopLeftRadius: "16px",
                                borderBottomLeftRadius: "16px",
                              }}
                              src={`${v?.staticThumbnail}`}
                              alt=""
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                // background: "#CCA541",
                                border: "1px solid #E882D5",
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
                                  paddingLeft: "0",
                                  paddingTop: "7px",
                                }}
                                className="fa fa-lock"
                                aria-hidden="true"
                              ></i>
                              <p
                                style={
                                  v.description.length > 20
                                    ? {
                                        textAlign: "center",
                                        marginLeft: "-5.8rem",
                                        marginTop: "9px",
                                        width: "220px",
                                        height: "50px",
                                        wordBreak: "break-all",
                                        overflow: "auto",
                                        color: `${
                                          primaryColor === "rhyno"
                                            ? "black"
                                            : "#A7A6A6"
                                        }`,
                                      }
                                    : {
                                        textAlign: "center",
                                        marginLeft: "-85px",
                                        marginTop: "9px",
                                        width: "200px",
                                        color: `${
                                          primaryColor === "rhyno"
                                            ? "black"
                                            : "#A7A6A6"
                                        }`,
                                      }
                                }
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
                              alt=""
                            />
                          </div>
                        )}
                        <div
                          style={{
                            // borderLeft: "4px solid #CCA541",
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
                            <p
                              style={{
                                fontSize: 20,
                                color: `${
                                  primaryColor === "rhyno" ? "black" : "white"
                                }`,
                              }}
                            >
                              {v?.title}
                            </p>{" "}
                          </div>
                          <div>
                            <p
                              style={{
                                fontSize: 20,
                                color: `${
                                  primaryColor === "rhyno" ? "black" : "#A7A6A6"
                                }`,
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
            </div>
          );
        })}
    </div>
  );
};

export default NftSingleUnlockables;
