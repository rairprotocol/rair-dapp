import React, { memo } from "react";
import cl from "./Timeline.module.css";
import pic1 from "./img/pic1.png";
import pic2 from "./img/pic2.png";
import pic3 from "./img/pic3.png";
import pic4 from "../images/greyman.png";
import pic5 from "./img/pic5.png";
import pic6 from "./img/pic6.png";
import pic7 from "./img/pic7.png";

const TimelineComponent = () => {
  return (
    <div className={cl.root}>
      <div className={cl.timeline}>
        <ul>
          <li style={{ paddingBottom: "91px" }}>
            <div className={cl.right_content}>
              <img
                style={{
                  borderRadius: "16px",
                  display: "block",
                  width: "355px",
                  height: "355px",
                }}
                src={pic1}
                alt=""
              />
            </div>
            <div className={cl.left_content}>
              <h3>Physical Era</h3>
            </div>
          </li>
          <>
            <div style={{ paddingTop: "6rem" }} className={cl.right_content}>
              <p className={cl.p_content}>
                <strong>1994</strong> <br /> Cryptogreyman is born. A modern
                superhero in his combat against fun, humor, initiative, and
                creativity. Acrylic on linen. 90 x 90 cm. Part of Dadara’s No
                Fun exhibition in Amsterdam.
              </p>
            </div>
          </>
          <div className={cl.right_content_margin}>
            <div
              style={{
                display: "inline-flex",
              }}
              className={cl.right_content}
            >
              <img
                style={{
                  borderRadius: "16px",
                  display: "block",
                  width: "531px",
                  height: "237px",
                  zIndex: "1",
                }}
                src={pic2}
                alt=""
              />
              <p className={cl.p_content}>
                <strong>1996-98</strong> <br />
                Greyman became a series based on the same character with various
                traits and characteristics, such as the Grey Punk, Grey Angel,
                Tattooed Greyman etc. Sounds familiar nowadays in this age of
                10K collectibles and PFPs, doesn’t it?
              </p>
            </div>
          </div>
          <div
            style={{ marginBottom: "92px" }}
            className={cl.right_content_margin}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
              className={cl.right_content}
            >
              <img
                style={{
                  borderRadius: "16px",
                  display: "block",
                  width: "343px",
                  height: "441px",
                }}
                src={pic3}
                alt=""
              />
              <p
                style={{ paddingLeft: "5rem", wight: "353px" }}
                className={cl.p_content}
              >
                <strong>1998</strong> <br />
                Nine metres high Greyman Statue of No Liberty made out of
                concrete and bronze in front of Rijksmuseum in Amsterdam.
              </p>
            </div>
          </div>

          <div className={cl.right_content_1}>
            <p className={cl.right_content_p}>
              <strong>2002</strong> <br />
              140 paper maché Greymen traveled to the Nevada desert to the
              Burning Man festival where they surrounded an altar. People could
              customize them and make them less grey during the week after which
              they could burn them in a private ritual at the end, thus burning
              and freeing their Inner Greyman.
            </p>
            <img
              style={{
                borderRadius: "16px",
                display: "block",
                width: "460px",
                height: "373px",
              }}
              src={pic5}
              alt=""
            />
          </div>

          <li>
            <div className={cl.right_content}>
              <p className={cl.right_content_era_web2}>
                <strong>2002-2020</strong> <br />
                Greyman lies dormant and patiently waits for Web2 to develop
                into Web3
              </p>
            </div>
            <div className={cl.left_content}>
              <h3>Web2 Era </h3>
            </div>
          </li>
          <li>
            <div style={{ marginTop: "3rem" }} className={cl.right_content}>
              <img
                style={{
                  borderRadius: "16px",
                  display: "block",
                  width: "355px",
                  height: "355px",
                }}
                src={pic4}
                alt=""
              />
            </div>
            <div className={cl.left_content}>
              <h3>Web3 Era </h3>
            </div>
          </li>
          <>
            <div style={{ paddingTop: "6rem" }} className={cl.right_content}>
              <p
                style={{ marginTop: "5rem", marginLeft: "3rem" }}
                className={cl.p_content}
              >
                <strong>4 November 2021</strong> <br />
                Birth of the handpainted Cryptogreyman (NFT sold on Rarible for
                2.429 ETH, painting sold for 3208 Euro at auction)
              </p>
            </div>
          </>

          <div
            style={{ display: "inline-flex", paddingTop: "80px" }}
            className={cl.right_content_1}
          >
            <p className={cl.right_content_p_november}>
              <strong> 30 November 2021</strong> <br />
              Birth of the pure digital Cryptogreyman (NFT sold on Foundation
              for 0.7 ETH)
            </p>
            <img
              style={{
                borderRadius: "16px",
                display: "block",
                width: "355px",
                height: "356px",
              }}
              src={pic6}
              alt=""
            />
          </div>

          <li>
            <div
              style={{ boxShadow: "none", left: "-428px" }}
              className={cl.left_content}
            >
              <img
                style={{ display: "block", width: "358px", height: "464px" }}
                src={pic7}
                alt=""
              />
              {/* <h2>Sample Text</h2>
              <p>
                A paragraph is defined as “a group of sentences or a single
                sentence that forms a unit” (Lunsford and Connors 116). Length
                and appearance do not determine whether a section in a paper is
                a paragraph. For instance, in some styles of writing,
                particularly journalistic styles, a paragraph can be just one
                sentence long.
              </p> */}
            </div>
            <div className={cl.right_content}>
              <h3
                style={{
                  boxShadow: "0 0 0 3px rgb(59 112 239 / 30%)",
                  padding: "8px 16px",
                  borderRadius: "18px",
                  width: "min-content",
                }}
              >
                Beyond
              </h3>
            </div>
          </li>

          <>
            <div style={{ paddingTop: "6rem" }} className={cl.right_content}>
              <p
                style={{ marginTop: "5rem", marginLeft: "3rem" }}
                className={cl.p_content_last}
              >
                <strong>2022</strong> <br />
                Birth of 7.907.414.597 Greymen mintable on MATIC ready to turn
                the Metaverse into a Greyverse.
              </p>
            </div>
          </>
          <div style={{ clear: "both" }}></div>
        </ul>
      </div>
    </div>
  );
};

export const Timeline = memo(TimelineComponent);
