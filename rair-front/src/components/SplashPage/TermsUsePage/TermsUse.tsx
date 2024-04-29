/* eslint-disable  */
import React, { memo, useEffect } from 'react';
import { ITermsUseComponent } from '../splashPage.types';
import cl from './TermsUse.module.css';

const TermsUseComponent: React.FC<ITermsUseComponent> = ({
  setIsSplashPage
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsSplashPage(false);
  }, [setIsSplashPage]);

  const currentName =
    import.meta.env.VITE_TESTNET === 'true' ? 'HotDrops' : 'Rair';

  return (
    <div className={cl.main}>
      <div className="header">
        <h1>TERMS OF USE</h1>
        <p>Last revised on 03/31/2021</p>
        <strong style={{ paddingBottom: '20px', display: 'inline-block' }}>
          Welcome to {currentName}, operated by {currentName} Technologies, Inc.
          (“us,” “we,” the “Company” or “{currentName}”).
        </strong>
      </div>
      <div className={cl.content}>
        <ol>
          <li>
            <h3>Acceptance of Terms of Use Agreement.</h3>
            <p>
              By creating a {currentName} account whether through a mobile
              device, mobile application or computer (collectively, the
              “Service”) you agree to be bound by (i) these Terms of Use and
              (ii) our Privacy Policy each of which is incorporated by reference
              into this Agreement, and (iii) any terms disclosed and agreed to
              by you if you purchase additional features, products or services
              we offer on the Service (collectively, this “Agreement”). If you
              do not accept and agree to be bound by all of the terms of this
              Agreement, please do not use the Service.
            </p>
            <p>
              We may make changes to this Agreement and to the Services from
              time to time. We may do this for a variety of reasons including to
              reflect changes in or requirements of the law, new features, or
              changes in business practices. The most recent version of this
              Agreement will be posted on the Services under Settings and also
              on restlessnites.com, and you should regularly check for the most
              recent version. The most recent version is the version that
              applies. If the changes include material changes that affect your
              rights or obligations, we will notify you in advance of the
              changes by reasonable means, which could include notification
              through the Services or via email. If you continue to use the
              Services after the changes become effective, then you agree to the
              revised Agreement.
            </p>
          </li>
          <li>
            <h3>Eligibility.</h3>
            <p>
              You must be at least 18 years of age to create an account on{' '}
              {currentName}
              and use the Service. By creating an account and using the Service,
              you represent and warrant that:
            </p>
            <ul>
              <li>you can form a binding contract with {currentName}</li>
              <li>
                you are not a person who is barred from using the Service under
                the laws of the United States or any other applicable
                jurisdiction–meaning that you do not appear on the U.S. Treasury
                Department’s list of Specially Designated Nationals or face any
                other similar prohibition,
              </li>
              <li>
                you will comply with this Agreement and all applicable local,
                state, national and international laws, rules and regulations,
                and
              </li>
              <li>
                you have never been convicted of a felony and that you are not
                required to register as a sex offender with any state, federal
                or local sex offender registry.
              </li>
            </ul>
          </li>
          <li>
            <h3>Your Account.</h3>
            <p>
              In order to use {currentName}, you must sign in using your
              Non-custodial <strong>Web 3 wallet (such as MetaMask)</strong>.
              For more information regarding the information we collect from you
              and how we use it, please consult our Privacy Policy.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your
              login credentials you use to sign up for our Services, and you are
              solely responsible for all activities that occur under those
              credentials. If you think someone has gained access to your
              account, please immediately contact{' '}
              <a href="mailto:support@help@rairtechnologies.com?subject=Support%20from%20Terms%20of%20Use">
                help@{currentName.toLocaleLowerCase()}technologies.com.
              </a>{' '}
              Please note that {currentName} does not control your MetaMask
              wallet, or any information necessary to access any crypto wallet
              that you may use in conjunction with the Service.
            </p>
            <p>
              {currentName} charges the following fees in connection with the
              sale and/or purchase of Digital Content (defined below): any
              creator, author, or authorized seller (“Creator”) of Digital
              Content will receive XX% of each sale, and {currentName} retains
              the remainder. These fees will be processed through the blockchain
              and you may incur additional related to the processing of the
              transaction through the blockchain. Many transactions on{' '}
              {currentName}, including without limitation minting, tokenizing,
              bidding, listing, offering, purchasing, or confirming, are
              facilitated by smart contracts existing on the Ethereum network.
              The Ethereum network requires the payment of a transaction fee (a
              “Gas fee”) for every for every transaction that occurs on a public
              blockchain network, and thus every transaction occurring on{' '}
              {currentName}. The value of the Gas Fee changes, often
              unpredictably, and is entirely outside of the control of{' '}
              {currentName}. You acknowledge that under no circumstances will a
              contract, agreement, offer, sale, bid, or other transaction on
              {currentName} be invalidated, revocable, retractable, or otherwise
              unenforceable on the basis that the Gas Fee for the given
              transaction was unknown, too high, or otherwise unacceptable.
            </p>
            <p>
              You are responsible to pay any and all sales, use, value-added and
              other taxes, duties, and assessments now or hereafter claimed or
              imposed by any governmental authority, “associated with your use
              of {currentName} (including, without limitation, any taxes that
              may become payable as the result of your ownership, transfer,
              purchase, sale, or creation of any artworks).​
            </p>
          </li>
          <li>
            <h3>Modifying the Services and Termination.</h3>
            <p>
              {currentName} is always striving to improve the Services and bring
              you additional functionality that you will find engaging and
              useful. This means we may add new product features or enhancements
              from time to time as well as remove some features, and if these
              actions do not materially affect your rights or obligations, we
              may not provide you with notice before taking them. We may even
              suspend the Services entirely, in which event we may notify you in
              advance unless extenuating circumstances prevent us from doing so.
            </p>
            <p>
              Account access is managed by blockchain verification and therefore
              is not terminable by a user; however, any authorized users (or
              governing body of such user account) hosting content on{' '}
              {currentName}’s platform may terminate their hosting account at
              any time, for any reason, by contacting {currentName}.{' '}
              {currentName} may terminate your account at any without notice if
              it believes that you have violated this Agreement. Upon such
              termination, you will not be entitled to any refund for any
              purchases. After your account is terminated, this Agreement will
              terminate, except that the following provisions will still apply
              to you and {currentName}: Section 5, Section 6, and Sections 13
              through 20.
            </p>
            <p>
              In no event shall {currentName} be liable to you or to any
              third-party for any modification, price change, suspension or
              discontinuance of the Service.
            </p>
          </li>
          <li>
            <h3>Safety; Your Interactions with Other Users.</h3>
            <p>
              Though {currentName} strives to encourage a respectful user
              experience, it is not responsible for the conduct of any user on
              or off of the Services. You agree to use caution in all
              interactions with other users, particularly if you decide to
              communicate off the Service Service or meet in person. You should
              not provide your financial information (for example, your credit
              card or bank account information), or wire or otherwise send
              money, to other users.
            </p>
            <strong>
              YOU ARE SOLELY RESPONSIBLE FOR YOUR INTERACTIONS WITH OTHER USERS.
              YOU UNDERSTAND THAT {currentName} DOES NOT CONDUCT CRIMINAL
              BACKGROUND CHECKS ON ITS USERS OR OTHERWISE INQUIRE INTO THE
              BACKGROUND OF ITS USERS. {currentName} MAKES NO REPRESENTATIONS OR
              WARRANTIES AS TO THE CONDUCT OF USERS. {currentName} RESERVES THE
              RIGHT TO CONDUCT ANY CRIMINAL BACKGROUND CHECK OR OTHER SCREENINGS
              (SUCH AS SEX OFFENDER REGISTER SEARCHES) AT ANY TIME USING
              AVAILABLE PUBLIC RECORDS.
            </strong>
          </li>
          <li>
            <h3>Rights {currentName} Grants You.</h3>
            <p>
              {currentName} grants you a personal, worldwide, royalty-free,
              non-assignable, nonexclusive, revocable, and non-sublicensable
              license to access and use the Services. This license is for the is
              for the sole purpose of letting you use and enjoy the Services’
              benefits as intended by {currentName} and permitted by this
              Agreement. Therefore, you agree not to:
            </p>
            <ul>
              <li>
                use the Service or any content contained in the Service for any
                commercial purposes without our written consent.
              </li>
              <li>
                <strong>
                  copy, modify, transmit, create any derivative works from, make
                  use of, or reproduce in any way any copyrighted material,
                  images, trademarks, trade names, service marks, or other
                  intellectual property, content or proprietary information
                  accessible through the Service without {currentName}’s prior
                  written consent.
                </strong>
              </li>
              <li>
                express or imply that any statements you make are endorsed by
                {currentName}.
              </li>
              <li>
                use any robot, bot, spider, crawler, scraper, site
                search/retrieval application, proxy or other manual or automatic
                device, method or process to access, retrieve, index, “data
                index, “data mine,” or in any way reproduce or circumvent the
                navigational structure or presentation of the Service or its
                contents.
              </li>
              <li>
                use the Services in any way that could interfere with, disrupt
                or negatively affect the Service or the servers or networks
                connected to the Service.
              </li>
              <li>
                upload viruses or other malicious code or otherwise compromise
                the security of the Services.
              </li>
              <li>
                forge headers or otherwise manipulate identifiers in order to
                disguise the origin of any information transmitted to or through
                the Service.
              </li>
              <li>
                “frame” or “mirror” any part of the Service without{' '}
                {currentName}’s prior written authorization.
              </li>
              <li>
                use meta tags or code or other devices containing any reference
                to {currentName} or the Service (or any trademark, trade name,
                service mark, logo or slogan of {currentName}) to direct any
                person to any other website for any purpose.
              </li>
              <li>
                modify, adapt, sublicense, translate, sell, reverse engineer,
                decipher, decompile or otherwise disassemble any portion of the
                Service, or cause others to do so.
              </li>
              <li>
                use or develop any third-party applications that interact with
                the Services or other users’ Content or information without our
                written consent.
              </li>
              <li>
                use, access, or publish the {currentName} application
                programming interface without our written consent.
              </li>
              <li>
                probe, scan or test the vulnerability of our Services or any
                system or network.
              </li>
              <li>
                Encourage, facilitate, provide equipment for, or promote any
                activity that violates this Agreement.
              </li>
            </ul>
            <p>
              The Company may investigate and take any available legal action in
              response to illegal and/ or unauthorized uses of the Service,
              including termination of your account and banning of your IP
              address.
            </p>
            <p>
              Any software that we provide you may automatically download and
              install upgrades, updates, or other new features. Depending upon
              your device, you may be able to adjust these automatic downloads
              through your device’s settings.
            </p>
          </li>
          <li>
            <h3>Rights you Grant {currentName}.</h3>
            <p>
              By creating an account, you grant to {currentName} a worldwide,
              transferable, perpetual, sub-licensable, royalty-free, right and
              license to host, store, use, copy, display, reproduce, adapt,
              edit, publish, modify and distribute information as well as any
              information you post, upload, display or otherwise make available
              (collectively, “post”) on the Service or transmit to other users
              (collectively, “Content”). Our license to your Content is subject
              to your rights under applicable law (for example laws regarding
              personal data protection to the extent any Content contains
              personal information as defined by those laws) and is for the
              limited purpose of operating, developing, providing, promoting,
              and improving the Service, associated events and promoted content
              on the Service, and researching and developing new ones. You agree
              that any Content you place or that you authorize us to place on
              the Service may be viewed by other users and may be viewed by any
              person viewing, using, visiting or participating in the Service.
            </p>
            <p>
              If you use {currentName} to tokenize, store, publish, display,
              and/or sell an original NFT, encrypted data container, or Digital
              Content (which may include, without limitation, visual art,
              videos, digital files) (“Digital Content”), you agree you have
              not, will not, and will not cause another to sell, tokenize, or
              create another cryptographic token representing a digital
              collectible for the same Digital Content, excepting, without
              limitation, the your ability to sell, tokenize, or create a
              cryptographic token or other digital asset representing a legal,
              economic, or other interest relating to any of the exclusive
              rights belonging to the you under copyright law.
            </p>
            <p>
              You agree that all information that you submit upon creation of
              your account is accurate and truthful and you have the right to
              post the Content on the Service and grant the license to{' '}
              {currentName}
              above.
            </p>
            <p>
              You understand and agree that we may monitor or review any Content
              you post as part of a Service. We may delete any Content, in whole
              or in part, that in our sole judgment violates this Agreement or
              may harm the reputation of the Service.
            </p>
            <p>
              When communicating with our customer care representatives, you
              agree to be respectful and kind. If we feel that your behavior
              towards any of our customer care representatives or other
              employees is at any time threatening or offensive, we reserve the
              right to immediately terminate your account.
            </p>
            <p>
              In consideration for {currentName} allowing you to use the
              Services, you agree that we, our affiliates, and our third-party
              partners may place advertising on the Services. By submitting
              suggestions or feedback to {currentName} regarding our Services,
              you agree that {currentName} may use and share such feedback for
              any purpose without compensating you.
            </p>
            <p>
              You agree that {currentName} may access, preserve and disclose
              your account information and Content if required to do so by law
              or in a good faith belief that such access, preservation or
              disclosure is reasonably necessary, such as to: (i) comply with
              legal process; process; (ii) enforce this Agreement; (iii) respond
              to claims that any Content violates the rights of third parties;
              (iv) respond to your requests for customer service; or (v) protect
              the rights, property or personal safety of the Company or any
              other person.
            </p>
          </li>
          <li>
            <h3>Community Rules.</h3>
            <p>By using the Services, you agree that you will not:</p>
            <ul>
              <li>
                use the Service for any purpose that is illegal or prohibited by
                this Agreement [including but not limited to the U.S. Department
                of Treasury’s Office of Foreign Assets Control (“OFAC”)]
              </li>
              <li>spam, solicit money from or defraud any users.</li>
              <li>
                Solicit personal information from users, especially those under
                the age of 18
              </li>

              <li>
                impersonate any person or entity or post any images of another
                person without his or her permission.
              </li>
              <li>bully, “stalk,” intimidate, harass or defame any person.</li>
              <li>
                post any Content that violates or infringes anyone’s rights,
                including rights of publicity, privacy, copyright, trademark or
                other intellectual property or contract right.
              </li>
              <li>
                post any Content that is hate speech, threatening, sexually
                explicit or pornographic; incites violence; or contains nudity
                or graphic or gratuitous violence.
              </li>
              <li>
                solicit passwords for any purpose, or personal identifying
                information for commercial or unlawful purposes from other users
                or disseminate another person’s personal information without his
                or her permission.
              </li>
              <li>use another user’s account.</li>
              <li>
                create another account if we have already terminated your
                account, unless you have our permission.
              </li>
              <li>
                Manipulate the price of any product available for sale on the
                Service (including your own items)
              </li>
              <li>Use the Services to conceal financial activity</li>
              <li>
                Use the Services to create a product or service that is
                competitive with {currentName}.
              </li>
            </ul>
            <p>
              {currentName} reserves the right to investigate and/ or terminate
              your account without a refund of any in app purchases if you have
              misused the Service or behaved in a way that {currentName} regards
              as regards as inappropriate or unlawful, including actions or
              communications that occur off the Service but involve users you
              meet through the Service.
            </p>
          </li>
          <li>
            <h3>Other Users’ Content.</h3>
            <p>
              Although {currentName} reserves the right to review and remove
              Content that violates this Agreement, such Content is the sole
              responsibility of the user who posts it, and {currentName} cannot
              guarantee that all Content will comply with this Agreement. If you
              see Content on the Services that violates this Agreement, please
              report it within the via{' '}
              <a href="mailto:support@help@help@goRair.com?subject=Support%20from%20Terms%20of%20Use">
                help@go{currentName}.com.
              </a>{' '}
            </p>
          </li>
          <li>
            <h3>Purchase.</h3>
            <p>
              <strong>Generally.</strong> From time to time, {currentName} may
              offer products and services for purchase (“Purchases”) through
              application platforms authorized by {currentName} (each, a
              “Software “Software Store”). If you choose to make an Purchase,
              you will be prompted to enter details for your account with your
              Software Store (“your IAP Account”), and your IAP Account will be
              charged for the Purchase in accordance with the terms disclosed to
              you at the time of purchase as well as the general terms for
              Purchases that apply to your IAP Account. Some Software Stores may
              charge you sales tax, depending on where you live.
            </p>
            <p>
              {currentName} reserve the right to refuse any Purchase you place
              Service. We may, in our sole discretion, limit or cancel
              quantities purchased per person, per household or per order. These
              order. These restrictions may include orders placed by or under
              the same customer account, the same credit card, and/or orders
              that use the same billing and/or shipping address. In the event
              that we make a change to or cancel an order, we may attempt to
              notify you by contacting the e-mail and/or billing address/phone
              number provided at the time the order was made. We reserve the
              right to limit or prohibit orders that, in our sole judgment,
              appear to be placed by dealers, resellers or distributors.
            </p>
            <p>
              You agree to provide current, complete and accurate purchase and
              account information for all purchases made at our store. You agree
              to promptly update your account and other information, including
              your email address and credit card numbers and expiration dates,
              dates, so that we can complete your transactions and contact you
              as needed.
            </p>
            <p>
              Certain purchases available through {currentName} and the Services
              will be based on a public blockchain network through something
              called “Smart Contracts.” These Purchases are outside of the
              control of any one party, including {currentName}, and are subject
              to many risks and and uncertainties. We neither own nor control
              MetaMask, Coinbase, OpenSea, the Ethereum network, your browser,
              or any other third party site, blockchain network, cryptocurrency,
              exchange platform, product, or service that you might access,
              visit, or use for the purpose of enabling you to use the various
              features of the Services. We will not be liable for the acts or
              omissions of any such third parties, nor will we be liable for any
              damage that you may suffer as a result of your transactions or any
              other interaction with any such third parties. You understand that
              your public blockchain address will be made publicly visible
              whenever you engage in a transaction on the Services.
            </p>
            <p>
              If you purchase, view, or access <strong>Digital Content</strong>{' '}
              through the Services, you may receive a cryptographic token
              representing the Creator’s Digital Content as a piece of property,
              but you do not own the creative work itself. You may display and
              share the Digital Content, but you do not have any legal
              ownership, right, or title to any copyrights, trademarks, or other
              intellectual property rights to the Digital Content, excepting the
              limited license to the Digital Content granted by these Terms and
              Conditions. Upon collecting a Digital Content, you will receive a
              limited, worldwide, non-assignable, non-sublicensable,
              royalty-free license to display the Digital Content legally owned
              and properly obtained by you.
            </p>
            <strong>
              Your limited license to display the Digital Content, includes, but
              is not limited to, the right to display the Digital Content
              privately or publicly: (i) for the purpose of promoting or sharing
              the your purchase, ownership, or interest, (ii) for the purpose of
              sharing, promoting, discussing, or commenting on the Digital
              Content; (iii) on third party marketplaces, exchanges, platforms,
              or applications in association with an offer to sell, or trade,
              the Digital Content; and (iv) within decentralized virtual
              environments, virtual worlds, virtual galleries, virtual museums,
              or other navigable and perceivable virtual environments. This
              license may be further limited by the seller of the Digital
              Content.
            </strong>
            <p>
              You have the right to sell, trade, transfer, or use their Digital
              Content, but you may not make “commercial use” of the Digital
              Content.
            </p>
            <p>
              You may not, nor permit any third party, to do or attempt to do
              any of the foregoing without the express prior written consent of
              the original author/creator of the Digital Content in each case:
              (i) modify, distort, mutilate, or perform any other modification
              to the Digital Content which would be prejudicial to the author’s
              or reputation; (ii) use the Digital Content to advertise, market,
              or sell any third party product or service; (iii) use the Digital
              Content in connection with images, videos, or other forms of media
              that depict +hatred, intolerance, violence, cruelty, or anything
              else that could reasonably be found to constitute hate speech or
              otherwise infringe upon the rights of others; (iv) incorporate the
              Digital Content in movies, videos, video games, or any other forms
              of media for a commercial purpose; (v) sell, distribute for
              commercial gain, or otherwise commercialize merchandise that
              includes, contains, or consists of the Digital Content; (vi)
              attempt to trademark, copyright, or otherwise otherwise acquire
              additional intellectual property rights in or to the Digital
              Content; (vii) attempt to mint, tokenize, or create an additional
              cryptographic token representing the same Digital Content; (viii)
              falsify, misrepresent, or conceal the authorship of the Digital
              Content; or (ix) otherwise utilize the Digital Content for the
              your or any third party’s commercial benefit.
            </p>
            <p>
              You irrevocably release, acquit, and forever discharge{' '}
              {currentName} and its subsidiaries, affiliates, officers, and
              successors of any liability for direct or indirect copyright or
              trademark infringement for {currentName} use of a Digital Content
              in accordance with Terms and Conditions.
            </p>
            <p>
              Access to your Digital Content is not guaranteed via {currentName}{' '}
              and/or its websites in perpetuity. Purchasers of Digital Content
              will retain their ownership, but it is your responsibility to
              ensure that you have downloaded local copies of your Digital
              Content, if Content, if available. {currentName}’s hosting of
              Digital Content is subject to the terms and conditions herein as
              well (and access may be restricted for violating the terms and
              conditions) as the agreed upon terms between {currentName} and the
              party who entered into a hostin agreement with {currentName}.
            </p>
          </li>
          <li>
            <h3>Refunds.</h3>
            <p>
              Generally, all charges for in Purchases are nonrefundable, and
              there are no refunds or credits for partially used periods. We may
              make an exception or if the laws applicable in your jurisdiction
              provide for refunds.
            </p>
            <strong>
              For {currentName} services that are on a subscription basis, any
              subscribers residing in the EU or European Economic Area, in
              accordance with local law, you are entitled to a full refund
              refund during the 14 days after the your begin your subscription
              begins. Please note that this 14-day period commences when the
              subscription starts.
            </strong>
            <strong>
              For subscribers residing in Arizona, California, Connecticut,
              Illinois, Iowa, Minnesota, New York, North Carolina, Ohio and
              Wisconsin, the terms below apply:
            </strong>
            <strong>
              You may cancel your subscription, without penalty or obligation,
              at any time prior to midnight of the third business day following
              the original date of your subscription, excluding Sundays and
              holidays. In the event that you die before the end of your
              subscription period, your estate shall be entitled to a refund of
              that portion of any payment you had made for your subscription
              which is allocable to the period after your death. In the event
              that you become disabled (such that you are unable to use the
              services of {currentName}) before the end of your subscription
              period, you shall be entitled to a refund of that portion of any
              payment you had made for your subscription which is allocable to
              the period after your disability by providing the company notice
              in the same same manner as you request a refund as described
              below.
            </strong>
            <h3>
              Purchases of Digital Content or any other virtual items are FINAL
              AND NON-REFUNDABLE.
            </h3>
          </li>
          <li>
            <h3>
              Notice and Procedure for Making Claims of Copyright Infringement.
            </h3>
            <p>
              If you believe that your work has been copied and posted on the
              Service in a way that constitutes copyright infringement, please
              provide our Copyright Agent with the following information:
            </p>
            <ul>
              <li>
                an electronic or physical signature of the person authorized to
                act on behalf of the owner of the copyright interest;
              </li>
              <li>
                a description of the copyrighted work that you claim has been
                infringed;
              </li>
              <li>
                a description of where the material that you claim is infringing
                is located on the Service (and such description must be
                reasonably sufficient to enable us to find the alleged alleged
                infringing material);
              </li>
              <li>
                your contact information, including address, telephone number
                and email address;
              </li>
              <li>
                a written statement by you that you have a good faith belief
                that the disputed use is not authorized by the copyright owner,
                its agent, or the law; and
              </li>
              <li>
                a statement by you, made under penalty of perjury, that the
                above information in your notice is accurate and that you are
                the copyright owner or authorized to act on the copyright
                owner’s behalf.
              </li>
            </ul>
            <p>
              If you believe your content that was removed (or to which access
              was disabled) is not infringing, or that you have the
              authorization from the copyright owner, the copyright owner’s
              owner’s agent, or pursuant to the law, to upload and use the
              content in your content, you may send a written counter-notice
              containing the following information to the Copyright Agent:
            </p>
            <ul>
              <li>your physical or electronic signature;</li>
              <li>
                identification of the content that has been removed or to which
                access has been disabled and the location at which the content
                appeared before it was removed or disabled;
              </li>
              <li>
                a statement that you have a good faith belief that the content
                was removed or disabled as a result of mistake or a
                misidentification of the content; and
              </li>
              <li>
                your name, address, telephone number, and email address, a
                statement that you consent to the jurisdiction of the federal
                court located within Central District of California and a
                statement that you will accept service of process from the who
                provided notification of the alleged infringement.
              </li>
            </ul>
            <p>
              If a counter-notice is received by the Copyright Agent,{' '}
              {currentName} will send a copy of the counter-notice to the
              original complaining party informing that person that it may
              replace the removed content or cease disabling it in 10 business
              days. Unless the copyright owner files an action seeking a court
              order against the content provider, member or user, the removed
              content may be replaced, or access to it restored, in 10 to 14
              business days or more after receipt of the counter-notice, at our
              sole discretion.​
            </p>
            <p>
              In accordance with the DMCA and other applicable law,{' '}
              {currentName} has adopted a policy of terminating, in appropriate
              circumstances and at {currentName}’s sole discretion, any users
              who are deemed to be repeat infringers (whether through a single
              account or several). {currentName} may may also at its sole
              discretion limit access to the Services and/or terminate the
              accounts of any users who infringe any intellectual property
              rights of others, whether or not there is any repeat
              infringement.​
            </p>
          </li>
          <li>
            <h3>Disclaimers.</h3>
            <strong>
              {currentName} PROVIDES THE SERVICE ON AN “AS IS” AND “AS
              AVAILABLE” BASIS AND TO THE EXTENT PERMITTED BY APPLICABLE LAW,
              GRANTS NO WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED,
              STATUTORY OR OTHERWISE WITH RESPECT TO THE SERVICE (INCLUDING ALL
              CONTENT CONTAINED THEREIN), INCLUDING, WITHOUT LIMITATION, ANY
              IMPLIED WARRANTIES OF SATISFACTORY QUALITY, MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE OR NON-INFRINGEMENT.{' '}
              {currentName} DOES NOT REPRESENT OR WARRANT THAT (A) THE SERVICE
              WILL BE UNINTERRUPTED, SECURE OR ERROR FREE, (B) ANY DEFECTS OR
              ERRORS IN THE SERVICE WILL BE CORRECTED, OR (C) THAT ANY CONTENT
              OR INFORMATION YOU OBTAIN ON OR THROUGH THE SERVICES WILL BE
              ACCURATE.
            </strong>
            <strong>
              {currentName} TAKES NO RESPONSIBILITY FOR ANY CONTENT THAT YOU OR
              ANOTHER USER OR THIRD PARTY POSTS, SENDS OR RECEIVES THROUGH THE
              SERVICES. ANY MATERIAL DOWNLOADED OR OTHERWISE OBTAINED THROUGH
              THE USE OF THE SERVICE IS ACCESSED AT YOUR OWN DISCRETION AND
              RISK.
            </strong>
          </li>
          <li>
            <h3>Third Party Services.</h3>
            <p>
              The Service may contain advertisements and promotions offered by
              third parties and links to other web sites or resources.{' '}
              {currentName} is not responsible for the availability (or lack of
              availability) of such external websites or resources. If you
              choose to interact interact with the third parties made available
              through our Service, such party’s terms will govern their
              relationship with you. {currentName} is not responsible or liable
              for such third parties’ terms or actions.
            </p>
          </li>
          <li>
            <h3>Limitation of Liability.</h3>
            <strong>
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
              WILL {currentName}, ITS AFFILIATES, EMPLOYEES, LICENSORS OR
              SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT, CONSEQUENTIAL,
              EXEMPLARY, INCIDENTAL, SPECIAL OR PUNITIVE DAMAGES, INCLUDING,
              WITHOUT LIMITATION, LOSS OF PROFITS, WHETHER INCURRED DIRECTLY OR
              INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER
              INTANGIBLE LOSSES, RESULTING FROM: (I) YOUR ACCESS TO OR USE OF OR
              INABILITY TO ACCESS OR USE THE SERVICES, (II) THE CONDUCT OR
              CONTENT OF OTHER USERS OR THIRD PARTIES ON, THROUGH, OR FOLLOWING
              USE OF THE SERVICES; OR (III) UNAUTHORIZED ACCESS, USE OR
              ALTERATION OF YOUR CONTENT, EVEN IF {currentName} HAS BEEN ADVISED
              OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT WILL {currentName}
              ’S AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS RELATING TO THE
              SERVICE EXCEED THE AMOUNT PAID, IF ANY, BY YOU TO {
                currentName
              }{' '}
              FOR THE SERVICE WHILE YOU HAVE AN ACCOUNT.
            </strong>
            <strong>
              SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF
              CERTAIN DAMAGES, SO SOME OR ALL OF THE EXCLUSIONS AND LIMITATIONS
              IN THIS SECTION MAY NOT APPLY TO YOU.
            </strong>
            <strong>
              IF YOU ARE A USER FROM NEW JERSEY, THE FOREGOING SECTIONS TITLED
              “DISCLAIMER OF WARRANTIES” AND “LIMITATION OF LIABILITY” ARE
              INTENDED TO BE ONLY AS BROAD AS IS PERMITTED UNDER THE LAWS OF THE
              STATE OF NEW JERSEY. IF ANY PORTION OF THESE SECTIONS IS HELD TO
              BE INVALID UNDER THE LAWS OF THE STATE OF NEW JERSEY, THE
              INVALIDITY OF SUCH PORTION SHALL NOT AFFECT THE VALIDITY OF THE
              REMAINING PORTIONS OF THE APPLICABLE SECTIONS.
            </strong>
          </li>
          <li>
            <h3>Arbitration, Class-Action Waiver, and Jury Waiver.</h3>
            <p>
              Except for users residing within the European Union, Norway and
              elsewhere where prohibited by applicable law:
            </p>
            <ul className={cl.adc}>
              <li>
                The exclusive means of resolving any dispute or claim arising
                out of or relating to this Agreement (including any alleged
                breach thereof) or the Service shall be BINDING ARBITRATION
                administered by the American Arbitration Association under the
                Consumer Arbitration Rules. The one exception to the exclusivity
                of arbitration is that you have the right to bring an individual
                claim against the Company in a small-claims court of competent
                jurisdiction. But whether you choose arbitration or small-claims
                small-claims court, you may not under any circumstances commence
                or maintain against the Company any class action, class
                arbitration, or other representative action or proceeding.
              </li>
              <li>
                By using the Service in any manner, you agree to the above
                arbitration agreement. In doing so, YOU GIVE UP YOUR RIGHT TO GO
                TO COURT to assert or defend any claims between you and the
                Company (except for matters that may be taken to small-claims
                court). YOU ALSO GIVE UP YOUR RIGHT TO PARTICIPATE IN A CLASS
                ACTION OR OTHER CLASS PROCEEDING. Your rights will be determined
                by a NEUTRAL ARBITRATOR, NOT A JUDGE OR JURY, and the arbitrator
                shall determine all issues regarding the arbitrability of the
                the dispute. You are entitled to a fair hearing before the
                arbitrator. The arbitrator can grant any relief that a court
                can, but you should note that arbitration proceedings are
                usually simpler and more streamlined than trials and other
                judicial proceedings. Decisions by the arbitrator are
                enforceable in court and may be overturned by a court only for
                very limited reasons. All costs and attorney’s fees associated
                with the arbitration shall be borne by each party individually.
              </li>
              <li>
                Any proceeding to enforce this arbitration agreement, including
                any proceeding to confirm, modify, or vacate an arbitration
                award, may be commenced in any court of competent jurisdiction.
                In the event that this arbitration agreement is for any reason
                reason held to be unenforceable, any litigation against the
                Company (except for small-claims court actions) may be commenced
                only in the federal or state courts located in Los Angeles,
                California. You hereby irrevocably consent to the jurisdiction
                of those courts for such purposes.
              </li>
              <li>
                This Agreement, and any dispute between you and the Company,
                shall be governed by the laws of the state of California without
                regard to principles of conflicts of law, provided that this
                arbitration agreement shall be governed by the Federal
                Arbitration Act.
              </li>
            </ul>
          </li>
          <li>
            <h3>Governing Law.</h3>
            <p>
              For users residing in the European Union, Norway or elsewhere
              where our arbitration agreement is prohibited by law, the laws of
              California, U.S.A., excluding California’s conflict of laws rules,
              will apply to any disputes arising out of or relating to this
              Agreement or the Services. For the avoidance of doubt, the choice
              of California governing law shall not supersede any mandatory
              consumer protection legislation in such jurisdictions.
            </p>
          </li>
          <li>
            <h3>Venue.</h3>
            <p>
              Except for users residing in the European Union or Norway, who may
              bring claims in their country of residence in accordance with
              applicable law, all claims arising out of or relating to this
              Agreement or the Services will be litigated exclusively in the
              federal or state courts of Los Angeles County, California, U.S.A.,
              and you and {currentName} consent to personal jurisdiction in
              those courts.
            </p>
          </li>
          <li>
            <h3>Indemnity by You.</h3>
            <p>
              You agree, to the extent permitted under applicable law, to
              indemnify, defend and hold harmless {currentName}, our affiliates,
              and their and our respective officers, directors, agents, and
              agents, and employees from and against any and all complaints,
              demands, claims, damages, losses, costs, liabilities and expenses,
              including attorney’s fees, due to, arising out of, or relating in
              any way to your access to or use of the Services, your Content, or
              your breach of this Agreement.
            </p>
          </li>
          <li>
            <h3>Entire Agreement. Other.</h3>
            <p>
              This Agreement along with the Privacy Policy and any terms
              disclosed and agreed to by you if you purchase additional
              features, products or services we offer on the Service, contains
              contains the entire agreement between you and {currentName}{' '}
              regarding the use of the Service. If any provision of this
              Agreement is held invalid, the remainder of this Agreement shall
              continue in full force and effect. The failure of the Company to
              exercise or enforce any right or provision of this Agreement shall
              not constitute a waiver of such right or provision. You agree that
              your {currentName} account is non-transferable and all of your
              rights to your account and its Content terminate upon your death.
              No agency, partnership, joint venture or employment is created as
              a result of this Agreement and you may not make any
              representations or bind
              {currentName} in any manner.
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
};

export const TermsUse = memo(TermsUseComponent);
