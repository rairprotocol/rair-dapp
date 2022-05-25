
// import React from "react";
// import cl from "./AboutPage.module.css";
// import pic1 from "./assets/RAIR2.jpg";
// import pic2 from "./assets/RAIR5Ipfs.png";
// import pic3 from "./assets/RAIR6Eth.png";
// import pic4 from "./assets/RAIR7React.jpg";
// import pic5 from "./assets/RAIR8.jpg";
// import pic6 from "./assets/Ed.jpeg";
// import pic7 from "./assets/GARRETT.jpeg";
// import pic8 from "./assets/Gunther.jpeg";
// import pic9 from "./assets/Martin.jpeg";
// import pic10 from "./assets/MICHAEL.jpg";
// import pic11 from "./assets/David.jpeg";
// import pic12 from "./assets/Seth.jpeg";
// import pic13 from "./assets/Matthew.jpg";

// function AboutPage({ primaryColor, textColor }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignContent: "center",
//         justifyContent: "center",
//         alignItems: "flex-start",
//       }}
//     >
//       <div id={cl.mainPage}>
//         <div className={cl.mainPageWrapper}>
//           <div className={cl.logoWrapper}>
//             <img
//               className={cl.logo}
//               src="//images.squarespace-cdn.com/content/v1/5c87f76bfb182073b9f54e37/3c9824c2-7705-4ed2-a736-783abed3bb64/RAIR-Tech-Landscape-WHITE-02.png?format=1500w"
//               alt="Logo"
//             />
//           </div>
//           <div className={cl.descriptionWrapper}>
//             <h1>
//               <strong>DIGITAL OWNERSHIP ENCRYPTION</strong>
//             </h1>
//             <h3>
//               <strong>
//                 RAIR is a blockchain-based digital rights management platform
//                 that uses NFTs to gate access to streaming content
//               </strong>
//             </h3>
//           </div>
//           <div className={cl.btnDesc}>
//             <a href="#">read our new whitepaper on DDRM</a>
//           </div>
//         </div>
//       </div>

//       <div className={cl.second}>
//         <div className={cl.secondWrapper}>
//           <div className={cl.secondImgWrapper}>
//             <img className={cl.secondImg} src={pic1} alt="" />
//           </div>
//           <div className={cl.secondTextAllWrapper}>
//             <div className={cl.secondTextWrapper}>
//               <p
//                 style={{
//                   backgroundColor: `var(--${primaryColor})`,
//                   color: `var(--${textColor})`,
//                 }}
//                 className={cl.secondText}
//               >
//                 <strong
//                   style={{
//                     color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                   }}
//                 >
//                   FAANG Problem:{" "}
//                 </strong>
//                 Data monopolies like Amazon, YouTube, Google, Apple, and Netflix
//                 charge onerous fees, offer opaque analytics, and can change
//                 their terms of service at any time locking out creators and
//                 users alike.
//               </p>
//               <p
//                 style={{
//                   backgroundColor: `var(--${primaryColor})`,
//                   color: `var(--${textColor})`,
//                 }}
//                 className={cl.secondText}
//               >
//                 <br />
//                 <strong
//                   style={{
//                     color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                   }}
//                 >
//                   DIY Problem:{" "}
//                 </strong>
//                 DIY distribution meanwhile offers no protection, and cannot help
//                 package works into a scarce, valuable, tradeable framework.
//               </p>
//               <p
//                 style={{
//                   backgroundColor: `var(--${primaryColor})`,
//                   color: `var(--${textColor})`,
//                 }}
//                 className={cl.secondText}
//               >
//                 <br />
//                 <strong
//                   style={{
//                     color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                   }}
//                 >
//                   RAIR Solution:{" "}
//                 </strong>
//                 RAIR, through its decentralized key management node system,
//                 empowers anyone to create unique, controllable, and transferable
//                 digital assets tied to the actual underlying content.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className={cl.thirdSectionWrapper}>
//         <div className={cl.thirdSection}>
//           <h1 className={cl.thirdSectionTitle}>TECHNOLOGY</h1>
//         </div>
//       </div>

//       <div className={cl.fourthSectionWrapper}>
//         <div className={cl.fourthSectionContent}>
//           <div
//             style={{
//               // backgroundColor: `var(--${primaryColor})`,
//               // color: `var(--${textColor})`,
//               color: "black",
//             }}
//             className={cl.fourthSection}
//           >
//             <div className={cl.fourthSectionTitleWrapper}>
//               <div className={cl.fourthSectionTitle}>
//                 <h1>RAIR is NFT + DRM</h1>
//               </div>
//               <div className={cl.fourthSectionPictIpfs}></div>
//             </div>
//             <div className={cl.hr}>
//               <hr />
//             </div>
//             <div className={cl.fourthSectionIpfsBoxWrapper}>
//               <div className={cl.fourthSectionIpfsBox}>
//                 <div className={cl.fourthSectionIpfsBoxPictWrapper}>
//                   <img
//                     className={cl.fourthSectionIpfsBoxPict}
//                     src={pic2}
//                     alt=""
//                   />
//                 </div>
//                 <div className={cl.fourthSectionIpfsBoxContentWrapper}>
//                   <h2>
//                     <strong>IPFS Repository (Storage)</strong>
//                   </h2>
//                   <p>
//                     A scalable decentralized infrastructure was chosen to host
//                     encrypted RAIR files in a fault-tolerant manner. By itself,
//                     IPFS does not offer immutability and tokenized smart
//                     contract features needed to create the entire solution, so a
//                     DLT must be used to manage the ledger of transactions.{" "}
//                   </p>
//                   <p>
//                     RAIR can be utilized with any file storage backend from
//                     traditional cloud providers like AWS and Azure, to
//                     distributed file storage systems like Siacoin and Burst via
//                     simple API integrations.{" "}
//                   </p>
//                 </div>
//               </div>
//               <div className={cl.hr}>
//                 <hr />
//               </div>
//               <div className={cl.fourthSectionIpfsBox}>
//                 <div className={cl.fourthSectionIpfsBoxPictWrapper}>
//                   <img
//                     className={cl.fourthSectionIpfsBoxPict}
//                     src={pic3}
//                     alt=""
//                   />
//                 </div>
//                 <div className={cl.fourthSectionIpfsBoxContentWrapper}>
//                   <h2>
//                     <strong>NFT Creation (Provenance)</strong>
//                   </h2>
//                   <p>
//                     A scalable decentralized infrastructure was chosen to host
//                     encrypted RAIR files in a fault-tolerant manner. By itself,
//                     IPFS does not offer immutability and tokenized smart
//                     contract features needed to create the entire solution, so a
//                     DLT must be used to manage the ledger of transactions.{" "}
//                   </p>
//                   <p>
//                     RAIR leverages the ERC-1155 standard to create unique
//                     Non-Fungible Tokens (NFTs) for each asset uploaded to the
//                     RAIR key management system. This allows users to seamlessly
//                     transfer assets on the blockchain, knowing they always have
//                     real ownership of their files that cannot be taken away from
//                     them, and they can sell and resell just like physical goods.
//                   </p>
//                 </div>
//               </div>
//               <div className={cl.hr}>
//                 <hr />
//               </div>
//               <div className={cl.fourthSectionIpfsBox}>
//                 <div className={cl.fourthSectionIpfsBoxPictWrapper}>
//                   <img
//                     className={cl.fourthSectionIpfsBoxPict}
//                     src={pic4}
//                     alt=""
//                   />
//                 </div>
//                 <div className={cl.fourthSectionIpfsBoxContentWrapper}>
//                   <h2>
//                     <strong>Encrypted Viewer (Access)</strong>
//                   </h2>
//                   <p>
//                     A browser-based file viewer is needed where access
//                     credentials are inputted, then encrypted content stored on
//                     IPFS is made viewable for common file types such as ebook
//                     readers, audio, and video players.
//                   </p>
//                   <p>
//                     The front facing user interface layer can be adapted to fit
//                     any use case by providing files via real time server side
//                     decryption. Browser based streaming decryption supports any
//                     device and OS with no DRM software bundling required.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div
//         style={
//           {
//             // backgroundColor: `var(--${primaryColor})`,
//             // color: `var(--${textColor})`,
//           }
//         }
//         className={cl.fifthSectionWrapper}
//       >
//         <div className={cl.fifthSectionContent}>
//           <div className={cl.fifthSectionTitleWrapper}>
//             <h1 className={cl.fifthSectionTitle}>Token Economics</h1>
//           </div>
//           <div className={cl.fifthSectionTextWrapper}>
//             <div className={cl.fifthSectionText}>
//               <h2 className={cl.fifthSectionTextTitle}>Initial Sale</h2>
//               <p className={cl.fifthSectionTextTitleP}>
//                 Creators have full control over the initial state of the
//                 contract, setting initial price, royalty rate, number of copies
//                 (keys) available, etc. Once purchased, buyers have full control
//                 to own their content forever, accessed via the RAIR decryption
//                 nodes.
//               </p>
//               <ol
//                 type="1"
//                 style={{
//                   color: `${primaryColor === "charcoal" ? "black" : ""}`,
//                 }}
//                 className={cl.fifthSectionList}
//               >
//                 <li>
//                   <p>
//                     eBook <strong>purchased</strong> for $10
//                   </p>
//                 </li>
//                 <li>
//                   <p>
//                     Creator receives $9 <strong>direct payment</strong>
//                   </p>
//                 </li>
//                 <li>
//                   <p>
//                     $1 <strong>converted to RAIR</strong> Tokens
//                   </p>
//                   <p>.1 RAIR ($.10) sent to node to process transaction</p>
//                   <p>
//                     .9 RAIR ($.90) sent to RAIR service for network expansion
//                   </p>
//                 </li>
//               </ol>
//             </div>
//             <div className={cl.fifthSectionPictWrapper}>
//               <img className={cl.fifthSectionPict} src={pic5} alt="" />
//             </div>
//           </div>

//           <div className={cl.hr}>
//             <hr />
//           </div>

//           <div className={cl.fifthSectionTextWrapper + " " + cl.ss}>
//             <div className={cl.fifthSectionText}>
//               <h2 className={cl.fifthSectionTextTitle}>
//                 Resale/Affiliate Sales
//               </h2>
//               <p className={cl.fifthSectionTextTitleP}>
//                 RAIR tokens serve as fuel to transfer assets to new owners, and
//                 perform decryption services for the life of the contract. Never
//                 before have digital assets behaved like physical assets with
//                 one-to-one ownership, and an industry first resale model.
//               </p>
//               <ol
//                 type="1"
//                 className={cl.fifthSectionList}
//                 style={{
//                   color: `${primaryColor === "charcoal" ? "black" : ""}`,
//                 }}
//               >
//                 <li>
//                   <p>
//                     Buyer <strong>resells</strong> eBook for $8{" "}
//                     <em> (scarce eBooks could even appreciate)</em>
//                   </p>
//                 </li>
//                 <li>
//                   <p>
//                     Creator receives $2.40 <strong>royalty </strong>
//                     <em>(Original Creator sets royalty rate when published)</em>
//                   </p>
//                 </li>
//                 <li>
//                   <p>
//                     Buyer <strong>nets</strong> $4.80
//                   </p>
//                 </li>
//                 <li>
//                   <p>
//                     $0.80 <strong>converted to RAIR</strong> Tokens
//                   </p>
//                   <p>.08 RAIR sent to node to process transaction</p>
//                   <p>.72 RAIR sent to RAIR</p>
//                 </li>
//               </ol>
//             </div>
//             <div className={cl.fifthSectionPictWrapper}>
//               <img className={cl.fifthSectionPict} src={pic5} alt="" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className={cl.sixthSectionWrapper}>
//         <div className={cl.sixthSectionTitle}>
//           <h1>
//             {" "}
//             <strong>team</strong>{" "}
//           </h1>
//         </div>
//       </div>

//       <div
//         style={{
//           backgroundColor: `var(--${primaryColor})`,
//           color: `var(--${textColor})`,
//         }}
//         className={cl.seventhSectionWrapper}
//       >
//         <div className={cl.seventhSectionContentWrapper}>
//           <div className={cl.seventhSectionContent}>
//             <div
//               style={{ color: `${primaryColor === "charcoal" ? "white" : ""}` }}
//               className={cl.seventhSectionTitle}
//             >
//               <h3>
//                 <strong>
//                   We are in this and created this because we seek to leave a
//                   legacy for our families, our friends, and for the generations
//                   to come. We also know that anything with sustained value comes
//                   from hard work matching our best intentions.
//                 </strong>
//               </h3>
//               <h3>
//                 <strong>
//                   We have deep relationships between us and with our partners,
//                   which greatly increases the probability of success. We are a
//                   tight unit with strong human values and leadership capacities
//                   reflected in the technology product we provide.
//                 </strong>
//               </h3>
//             </div>
//             <div className={cl.seventhSectionCardWrapper}>
//               <div className={cl.seventhSectionCardPict}>
//                 <img src={pic6} alt="" />
//               </div>
//               <div className={cl.seventhSectionCardInfo}>
//                 <div className={cl.seventhSectionCardText}>
//                   <h2>
//                     ED PRADO, <strong>CEO</strong>
//                   </h2>
//                   <p>
//                     Deep financial technology experience, having created the
//                     world’s first online bond trading platform, and owned two
//                     investment banks (broker dealers) which were active in the
//                     trading and underwriting of securities with volumes in the
//                     billions. Deep familiarity with consumer and investor
//                     protection laws, KYC/AML guidelines, and the fintech
//                     transaction landscape. Serial entrepreneur with strong
//                     operational acumen.
//                   </p>
//                 </div>
//                 <div className={cl.seventhSectionCardEmail}>
//                   <a
//                     style={{
//                       borderColor: `${
//                         primaryColor === "charcoal" ? "white" : ""
//                       }`,
//                       color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                     }}
//                     className={cl.seventhSectionCardEmailA}
//                     href="mailto:ed@rair.tech"
//                   >
//                     Email
//                   </a>
//                 </div>
//               </div>
//             </div>

//             <div className={cl.ss}></div>

//             <div className={cl.seventhSectionCardWrapper}>
//               <div className={cl.seventhSectionCardPict}>
//                 <img src={pic7} alt="" />
//               </div>
//               <div className={cl.seventhSectionCardInfo}>
//                 <div className={cl.seventhSectionCardText}>
//                   <h2>
//                     GARRETT MINKS, <strong>CTO</strong>
//                   </h2>
//                   <p>
//                     Deep expertise in distributed ledger technologies and their
//                     unique token economic incentive frameworks. An early adopter
//                     of blockchain innovations, digital collectibles, and DLT
//                     based media platforms. After writing his first book on
//                     distributed technologies, he realized no viable publishing
//                     platform using next wave distributed technologies existed
//                     where content could be sold and resold via immutable ledger
//                     tokens. Instead of using Kindle Direct Publishing and giving
//                     the majority of proceeds to a predatory intermediary, RAIR
//                     was born.
//                   </p>
//                 </div>
//                 <div className={cl.seventhSectionCardEmail}>
//                   <a
//                     style={{
//                       borderColor: `${
//                         primaryColor === "charcoal" ? "white" : ""
//                       }`,
//                       color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                     }}
//                     className={cl.seventhSectionCardEmailA}
//                     href="mailto:garrett@rair.tech?subject=Inquire%20from%20Website%20RAIR"
//                   >
//                     Email
//                   </a>
//                 </div>
//               </div>
//             </div>

//             <div className={cl.ss}></div>

//             <div className={cl.seventhSectionCardWrapper}>
//               <div className={cl.seventhSectionCardPict}>
//                 <img
//                   style={{ width: "230xp", height: "214px" }}
//                   src={pic8}
//                   alt=""
//                 />
//               </div>
//               <div className={cl.seventhSectionCardInfo}>
//                 <div className={cl.seventhSectionCardText}>
//                   <h2>
//                     GUNTHER SONNENFELD, <strong>CSO</strong>
//                   </h2>
//                   <p>
//                     Serial entrepreneur with deep technology, corporate and
//                     digital product experience having successfully built and
//                     operated companies with executive stints at large
//                     multinational companies such as Omnicom Group, and with
//                     customers such as Expedia, Orange, the UN, Unilever, Apple,
//                     Toyota, Bank of America, special project experience with the
//                     likes of Facebook, Google, YouTube and Amazon, as well as
//                     domain-relevant work with the likes of Virgin Media Group,
//                     Revolt TV, Hulu and Ustream. Advisor to the U.S. and
//                     Australian governments on technology innovation,
//                     specifically around cryptography and digital security
//                     applications. Co-developer of the world’s first Bitcoin POS
//                     (point of sale) system, co-developer of Skype’s small
//                     business network coefficiency model, and a recipient of a
//                     Forrester Groundswell Award for groundbreaking social
//                     analytics work with Adobe. Part of teams that resulted in
//                     several exits.{" "}
//                   </p>
//                 </div>
//                 <div className={cl.seventhSectionCardEmail}>
//                   <a
//                     style={{
//                       borderColor: `${
//                         primaryColor === "charcoal" ? "white" : ""
//                       }`,
//                       color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                     }}
//                     className={cl.seventhSectionCardEmailA}
//                     href="mailto:gunther@rair.tech?subject=Inquire%20from%20Website"
//                   >
//                     Email
//                   </a>
//                 </div>
//               </div>
//             </div>

//             <div className={cl.ss}></div>

//             <div className={cl.seventhSectionCardWrapper}>
//               <div className={cl.seventhSectionCardPict}>
//                 <img
//                   style={{ width: "180xp", height: "240px" }}
//                   src={pic9}
//                   alt=""
//                 />
//               </div>
//               <div className={cl.seventhSectionCardInfo}>
//                 <div className={cl.seventhSectionCardText}>
//                   <h2>
//                     <strong>
//                       MARTIN CASADO, Business Development & Branding Officer
//                     </strong>
//                   </h2>
//                   <p>
//                     Extensive expertise in conceptual design in functionality
//                     and aesthetics. Bridging the gap between what the users want
//                     and how markets visualize what is economically attractive.
//                     Experienced in logistics protocols, specifically in building
//                     and planning technologies to facilitate the transport and
//                     supply chain functions of both physical and digital goods.
//                     Built one of the first tracking and logistics integration
//                     applications for an international shipping company.
//                   </p>
//                 </div>
//                 <div className={cl.seventhSectionCardEmail}>
//                   <a
//                     style={{
//                       borderColor: `${
//                         primaryColor === "charcoal" ? "white" : ""
//                       }`,
//                       color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                     }}
//                     className={cl.seventhSectionCardEmailA}
//                     href="mailto:martin@rair.tech?subject=Inquire%20from%20Website%20"
//                   >
//                     Email
//                   </a>
//                 </div>
//               </div>
//             </div>

//             <div className={cl.bb}></div>

//             <div className={cl.seventhSectionAdv}>
//               <h1>ADVISORS</h1>
//             </div>

//             <div className={cl.bb}></div>

//             <div className={cl.seventhSectionCardWrapper}>
//               <div className={cl.seventhSectionCardPict}>
//                 <img
//                   style={{ width: "240px", height: "240px" }}
//                   src={pic10}
//                   alt=""
//                 />
//               </div>
//               <div className={cl.seventhSectionCardInfo}>
//                 <div className={cl.seventhSectionCardText}>
//                   <h2>
//                     <strong>
//                       MICHAEL TERPIN, STRATEGIC ADVISOR + INVESTOR
//                     </strong>
//                   </h2>
//                   <p>
//                     Michael Terpin is perhaps best known for founding
//                     Marketwire, which was funded by Sequoia Capital in 2000,
//                     then sold in 2006. Today, Michael is a pioneering investor
//                     and adviser to a multitude of blockchain, media, and
//                     technology companies, including ShapeShift, Bancor,
//                     <a
//                       style={{
//                         textDecoration: "none",
//                         cursor: "pointer",
//                         color: "#d88518",
//                         paddingBottom: ".05em",
//                         borderBottomWidth: "1px",
//                         borderBottomStyle: "solid",
//                         borderBottomColor: "rgba(216,133,24,.3)",
//                         transition:
//                           "border-color .15s ease-out,color .15s ease-out",
//                       }}
//                       href="http://purse.io/"
//                     >
//                       {" Purse.io "}
//                     </a>
//                     , and GoCoin. Michael's Transform Group, with over 50 ICOs
//                     done and counting, is the world leader in blockchain + ICO
//                     public relations and advisory services. In 2013, he also
//                     co-founded two of the now most influential brands in
//                     cryptocurrency: CoinAgenda and BitAngels. CoinAgenda was the
//                     first-ever conference for Bitcoin investors and is now the
//                     one place where the world's most knowledgeable
//                     cryptocurrency investors meet to exchange information.
//                   </p>
//                   <p>
//                     BitAngels was the first angel group for cryptocurrency
//                     investments. This was followed in early 2014 by the
//                     BitAngels Dapps Fund with David Johnston, which was the
//                     first digital currency fund ($6 million raised entirely in
//                     cryptocurrency). Additionally, Terpin, along with Gil
//                     Penchina and Nick Sullivan, co-founded the Bitcoin syndicate
//                     as part of Flight VC. He also co-founded e-commerce Bitcoin
//                     company incubator, bCommerce Labs, in 2015. In 2017, he
//                     joined Alphabit Fund, a $300 million digital currency fund,
//                     as special advisor, CMO and head of their ICO investment
//                     committee. RAIR is proud to have Michael as the strategic
//                     investment lead in its efforts to solve the problem of
//                     digital ownership.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className={cl.hr}></div>

//             <div className={cl.seventhSectionCardWrapper}>
//               <div className={cl.seventhSectionCardPict}>
//                 <img
//                   style={{ width: "214px", height: "240px" }}
//                   src={pic11}
//                   alt=""
//                 />
//               </div>
//               <div className={cl.seventhSectionCardInfo}>
//                 <div className={cl.seventhSectionCardText}>
//                   <h2>
//                     <strong>DAVID JENSEN, STRATEGIC ADVISOR + INVESTOR</strong>
//                   </h2>
//                   <p>
//                     David Jensen is an award-winning experience designer,
//                     futurist, and innovator who always asks, “What if?”
//                     Currently, he is authoring a book/podcast entitled
//                     “Structured Mischief” exploring the intersection of
//                     blockchain, design-centered thinking, and crypto-tech.
//                   </p>
//                   <p>
//                     Previously, David led EY’s Global Disruptive Innovation
//                     business and the creation of EY’s WAVESPACE innovation and
//                     experience network. Working at the intersection of
//                     innovation, technology, and design, he is a thought leader
//                     in the areas of experience design, radical growth, augmented
//                     media reality, artificial intelligence/machine learning,
//                     streaming data, and digital transformation. He orchestrates
//                     experiences and interactive product design across industries
//                     and business futures; all of this, he calls Structured
//                     MischiefTM.”
//                   </p>
//                   <p>
//                     He is a two-time Primetime Emmy award winner and has been
//                     elected to the Hollywood Reporter Digital 50, served on
//                     industry boards and organizations including Vice-Chair of
//                     the Producers Guild of America and Governor of the Academy
//                     of Television Arts and Sciences.
//                   </p>
//                   <p>
//                     He has been recognized as an architect, storyteller,
//                     innovator, and entrepreneur across the fields of design,
//                     innovation, technology, digital media, advertising, and
//                     television.
//                   </p>
//                   <p>
//                     Trained as an architect and filmmaker, he began his career
//                     working with architects Richard Meier and Zaha Hadid,
//                     combining physical space with media and technology to create
//                     “experience spaces.” He holds a MArch from Harvard
//                     University; CE Leadership from Harvard Business School, and
//                     BArch from the University of Houston.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className={cl.hr}></div>

//             <div className={cl.seventhSectionCardWrapper}>
//               <div className={cl.seventhSectionCardPict}>
//                 <img
//                   style={{ width: "178px", height: "245px" }}
//                   src={pic12}
//                   alt=""
//                 />
//               </div>
//               <div className={cl.seventhSectionCardInfo}>
//                 <div className={cl.seventhSectionCardText}>
//                   <h2>
//                     <strong>SETH SHAPIRO, STRATEGIC ADVISOR</strong>
//                   </h2>
//                   <p>
//                     Two-time Emmy® Award winner Seth Shapiro is a global leader
//                     in media and technology. He has worked on projects with
//                     partners including AT&T, Betfair UK, Comcast, De Telegraaf,
//                     DIRECTV, Disney, Goldman Sachs, Intel, IPG, IBM, NBC, Neo
//                     Cricket Mumbai, Nokia, RTL, SBS, Seachange, Showtime, Sun
//                     Microsystems, SVT Sweden, Telstra, Time Warner Cable, Turner
//                     Networks and Universal Pictures.{" "}
//                   </p>
//                   <p>
//                     An Adjunct Professor at USC’s School of Cinematic Arts, he
//                     served previously as a Governor at the Televison Academy
//                     (home of the Emmy’s) and a two-term member of its Executive
//                     Committee. He is author of TELEVISION: Innovation,
//                     Disruption, and the World’s Most Powerful Medium, an Amazon
//                     bestseller.{" "}
//                   </p>
//                   <p>
//                     An early proponent of blockchain technology , he is
//                     Entrepreneur in Residence at Alphabit Fund, a
//                     fully-regulated digital currency hedge fund in the U.K. with
//                     $400m AUM.{" "}
//                   </p>
//                   <p>
//                     Mr Shapiro has consulted on media matters before both the
//                     FCC and the Department of Justice. His opinions have been
//                     quoted in The Economist, The New York Times, CNBC, The LA
//                     Times, The Boston Globe, Bloomberg, The Associated Press,
//                     PBS and The Daily Mail UK. As Head of Production at DIRECTV
//                     Advanced Services, he oversaw over 25 service launches,
//                     including TiVo by DIRECTV, the world’s first major DVR
//                     platform.{" "}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className={cl.hr}></div>

//             <div className={cl.seventhSectionCardWrapper}>
//               <div className={cl.seventhSectionCardPict}>
//                 <img
//                   style={{ width: "214px", height: "215px" }}
//                   src={pic13}
//                   alt=""
//                 />
//               </div>
//               <div className={cl.seventhSectionCardInfo}>
//                 <div className={cl.seventhSectionCardText}>
//                   <h2>
//                     MATTHEW A. NECO
//                     <strong>, STRATEGIC ADVISOR</strong>
//                   </h2>
//                   <p>
//                     Matt is a business and technology lawyer and mediator with
//                     depth and breadth in law. Over the course of more than 25
//                     years, he has worked on deals, dispute resolution,
//                     bankruptcies, and many aspects of starting, running,
//                     growing, and buying and selling businesses and assets, with
//                     a focus on
//                     <strong
//                       style={{
//                         color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                       }}
//                     >
//                       {" "}
//                       tech and intellectual property
//                     </strong>
//                     , among other areas.Entrepreneurial, he co-founded a
//                     music-related tech start-up. He segued into in-house general
//                     counsel roles, primarily in new and disruptive tech, more
//                     than 15 years ago, including in decentralized P2P media
//                     distribution apps and ad tech, a UGC and publisher
//                     growth-stage tech start-up acquired by Intuit, and an
//                     ad-tech company with multiple consumer apps (including P2P)
//                     also acquired by a public company.He is involved in
//                     blockchain, NFTs, and De-Fi.Matt has been{" "}
//                     <strong
//                       style={{
//                         color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                       }}
//                     >
//                       product counsel{" "}
//                     </strong>
//                     for many apps, SaaS, and web and mobile sites and platforms,
//                     including compliance with HIPPA, DMCA, CDA 230, and ADA. An
//                     Adjunct Professor at USC’s School of Cinematic Arts, he
//                     served previously as a Governor at the Televison Academy
//                     (home of the Emmy’s) and a two-term member of its Executive
//                     Committee.He is author of TELEVISION: Innovation,
//                     Disruption, and the World’s Most Powerful Medium, an Amazon
//                     bestseller.
//                   </p>
//                   <p>
//                     Matt managed
//                     <strong
//                       style={{
//                         color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                       }}
//                     >
//                       {" "}
//                       high-stakes copyright litigation{" "}
//                     </strong>
//                     through the U.S. Supreme Court. He taught
//                     <strong
//                       style={{
//                         color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                       }}
//                     >
//                       {" "}
//                       IP Licensing{" "}
//                     </strong>
//                     law at Pepperdine Law School. He has worked closely and
//                     extensively with outside counsel and effectively managed
//                     multiple millions of dollars of focused legal spending. He
//                     prepares and takes an entity smoothly through financing and
//                     <strong
//                       style={{
//                         color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                       }}
//                     >
//                       {" "}
//                       M&A{" "}
//                     </strong>
//                     deals with outside and co-counsel. Matt has negotiated,
//                     drafted, reviewed, revised, and worked on successfully
//                     implementing and fulfilling countless
//                     <strong
//                       style={{
//                         color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                       }}
//                     >
//                       {" "}
//                       contracts and licenses{" "}
//                     </strong>
//                     (in and out-bound), MSAs, Terms, Conditions, Privacy
//                     Policies, and internal policies, guidelines, and procedures,
//                     and as a C-Suite member works closely with other executives,
//                     as well as developers (including on IP issues involving
//                     open-source software) and with other teams (sales, bus dev.,
//                     HR, customer satisfaction, etc.) to close business deals,
//                     and help the business excel.
//                   </p>
//                   <p>
//                     Matt is strong at win-win outcomes, dispute mitigation,
//                     avoidance, and resolution counsel. He produces
//                     <strong
//                       style={{
//                         color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                       }}
//                     >
//                       {" "}
//                       actionable{" "}
//                     </strong>
//                     , understandable items and measured advice, and has
//                     experience in ambassadorial
//                     <strong
//                       style={{
//                         color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                       }}
//                     >
//                       {" "}
//                       reputation{" "}
//                     </strong>
//                     management,
//                     <strong
//                       style={{
//                         color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                       }}
//                     >
//                       {" "}
//                       Board of Directors{" "}
//                     </strong>
//                     work, including meeting preparation, participation,
//                     counseling, and Corporate Secretary work. Matt has extensive
//                     legal strategy, tactics, and execution experience within
//                     fast-growing, disruptive, technology companies, strong
//                     business
//                     <strong
//                       style={{
//                         color: `${primaryColor === "charcoal" ? "white" : ""}`,
//                       }}
//                     >
//                       {" "}
//                       judgment, operational{" "}
//                     </strong>
//                     experience, and cultural values, and partners well with all
//                     levels of management, business, and technology teams. Matt
//                     is driven to contribute to, and motivated by, outstanding
//                     leadership, products and services, and customer-oriented
//                     values and commitments to teamwork, diversity, equality and
//                     inclusion.
//                   </p>
//                   <p>
//                     <em>
//                       (As an outside “advisor” Matt does not provide legal
//                       services or advice to RAIR Tech, investors, business
//                       partners, etc., particularly, but not exclusively, with
//                       regard to laws or regulatory requirements regarding
//                       investments, investment vehicles, securities, AML, KYC,
//                       CFT, MSBs, and blockchain entities, technologies, and
//                       tokens. RAIR engages other outside counsel.)
//                     </em>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AboutPage;
// Used the export {} line to mark it as an external module.
export {};
