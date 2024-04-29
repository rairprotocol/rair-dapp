/* eslint-disable  */
import React, { memo, useEffect } from 'react';
import cl from './PrivacyPolicy.module.css';
import { IPrivacyPolicyComponent } from '../splashPage.types';

const PrivacyPolicyComponent: React.FC<IPrivacyPolicyComponent> = ({
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
      <h1>PRIVACY POLICY</h1>
      <div className="fe">
        <p>
          The websites located at {currentName.toLocaleLowerCase()}
          technologies.com, social media pages (which could include, without
          limitation, profiles operated by {currentName}
          Technology, Inc., software, tablet software, iOS and Android apps) “
          {currentName}” shall be referred to collectively as the “Web Site.”
        </p>
        <p>
          This Privacy Policy explains what information {currentName}{' '}
          Technologies, Inc. ("{currentName}," “Company” or "we") collects on
          the Web Site, how {currentName} uses that information, your choices
          and this Web Site's other privacy practices. This Privacy Policy only
          covers information collected at at this Web Site, and does not cover
          any information collected at any other web site or offline by{' '}
          {currentName}, any affiliated company or any other company (unless
          specifically stated). Please read this Privacy Policy carefully. In
          addition, please review this Web Site's “Terms and Conditions”, which
          governs your use of this Web Site.
        </p>
      </div>
      <div className="fsdf">
        <h3>INFORMATION COMPANY COLLECTS AND HOW COMPANY USES IT</h3>
        <p>
          <strong>Personally Identifiable Information: </strong>
          We may ask you to provide us with certain personally identifiable
          information, which is information that could reasonably be used to
          identify you personally (such as your name, address, e-mail address,
          social media username, and telephone number) when you register with us
          or at other times, such as when you buy products or services, if you
          choose to subscribe to a web forum or blog, or if you choose to
          participate in a contest, sweepstakes or other promotion. In addition,
          we may ask that you provide us with demographic information,
          information regarding your interests, or similar information when you
          submit a registration form on the Web Site. Providing us with
          information about yourself is voluntary, and you can always choose not
          to provide certain information, but then you may not be able to take
          advantage of some of the Web Site's features and services.
        </p>
        <p>
          The Web Site may also receive information about you from other
          sources, such as in connection with a promotion the Web Site is
          participating in that is offered on a third-party web site, and we may
          combine the information we receive from those other sources with
          information that we collect through this Web Site. In those cases, we
          apply this Privacy Policy to any personally identifiable information
          received.
        </p>
        <p>
          {currentName} may use your personally identifiable information to
          provide you with requested information or services, to contact you in
          connection with a promotion, or for other purposes disclosed when you
          provide your information. We may use your information for internal
          business purposes, such as to improve the Web Site and our business
          strategies, or to serve specific content or advertisements to you. If
          you choose to receive information from the Web Site, we may contact
          you with information regarding one of our services or events, or those
          of an affiliate or business partner. We may also contact you regarding
          any problems or questions we have relating to your use of the Web
          Site, or, in our discretion, notify you of changes to our Privacy
          Policy, Terms of Use or other policy or terms that affect you or your
          use of the Web Site
        </p>
        <p>
          If you submit to the Web Site a comment, photograph or other content
          to be published, online or offline, we may publish your name or other
          personally identifiable information in connection with publishing the
          content.
        </p>
        <p>
          If you provide us with personally identifiable information of a
          friend, or your friend provides personally identifiable information
          about you, to e-mail a feature from the Web Site, the e-mail addresses
          you or your friend supply us for those activities will not be used to
          used to send you or your friend other e-mail communications unless
          disclosed at the time you provide the information.
        </p>
        <p>
          Please note that information submitted to the Web Site via a "contact
          us," "help" or other similar e-mail address or form will not
          necessarily receive a response. We will not use the information
          provided to these e-mail addresses or forms for marketing purposes
          unrelated to your request.
        </p>
        <p>
          <strong>Note To Parents About Children: </strong>
          This Web Site is not directed to persons younger than 18, and does not
          knowingly collect any personally identifiable information from persons
          younger than 18. If you are younger than 18, do not send any
          information about yourself to the Web Site. If {currentName} discovers
          that a person younger than 18 has provided the Web Site with
          personally identifiable information, {currentName} will delete that
          person's personally identifiable information.
        </p>
        <p>
          <strong>Non-Personally Identifiable Information: </strong>
          When you visit or download information from this Web Site, our web
          servers may automatically collect web site usage information. Web site
          usage information is non-personally identifying information that
          describes how our visitors use the Web Site. It can include the number
          and frequency of visitors to each web page and the length of their
          stays, browser type, referrer data that identifies the web page
          visited prior and subsequent to visiting the Web Site, and IP
          addresses (see below for more information on IP addresses). We also
          may determine your screen resolution, device being used, location, and
          the technology available in order to serve you the most appropriate
          version of a web page, e-mail or similar service.
        </p>
        <p>
          <strong>Use Of IP Addresses: </strong>
          An internet protocol or IP address is a number that is assigned to
          your computer or network when you are on the internet. When you
          request pages from this Web Site, our servers may log your IP address.
          {currentName} may use IP addresses for a number of purposes, such as
          system administration, to generally determine your computer's server
          location, to report aggregate information to our business partners or
          to audit use of the Web Site.
        </p>
        <p>
          <strong>
            Use of Cookies, Web Beacons and Similar Technologies:{' '}
          </strong>
          This Web Site's pages or e-mail messages may contain cookies, web
          beacons (also known as clear gifs), or similar technologies as they
          become available. Cookies are information files that this Web Site may
          place on your computer to provide extended functionality. We may use
          cookies for a number of purposes, such as tracking usage patterns on
          the Web Site, measuring the effectiveness of advertising, limiting
          multiple responses and registrations, facilitating your ability to
          navigate the Web Site and as part of a verification or screening
          process. Most browsers are initially set up to accept cookies. You can
          your browser to refuse all cookies or to indicate when a cookie is
          being sent by indicating this in the preferences or options menu in
          your browser. However, it is possible that some parts of this Web Site
          will not operate correctly if you disable cookies and you may not be
          able to take advantage of some of this Web Site's features. You should
          consult with your browser's provider/manufacturer if you have any
          questions regarding disabling cookies.
        </p>
        <p>
          A web beacon is a small graphic image that allows the party that set
          the web beacon to monitor and collect certain information about the
          viewer of the web page, web-based document or e-mail message, such as
          the type of browser requesting the web beacon, the IP address of the
          computer that the web beacon is sent to and the time the web beacon
          viewed. Web beacons can be very small and invisible to the user, but,
          in general, any electronic image viewed as part of a web page or
          e-mail, including HTML based content, can act as a web beacon.{' '}
          {currentName}
          may use web beacons to count visitors to the web pages on the Web Site
          or to monitor how our users navigate the Web Site, and we may include
          web beacons in e-mail messages in order to count how many messages
          sent were actually opened, acted upon or forwarded.
        </p>
        <p>
          Our web pages may include advertisements for third parties and their
          products, and those third-party advertisements may include a cookie or
          web beacon served by the third party. {currentName} does not have
          control over the cookies or web beacons used by third parties and does
          not have access to whatever information they may collect.
        </p>
        <p>
          <strong>Do Not Track Features: </strong>
          Some browsers have a “do not track” feature that lets you tell
          websites that you do not want to have your online activities tracked.
          These features are not yet uniform, so we are not currently set up to
          respond to those signals.
        </p>
      </div>
      <div className="fasd">
        <h1>DISCLOSURE OF COLLECTED INFORMATION & THIRD PARTIES</h1>
        <p>
          {currentName} will not disclose non-personally identifying, aggregated
          user statistics to third parties. {currentName} does not share your
          personally identifiable information with third parties for their
          direct marketing purposes unless you first affirmatively agree to the
          disclosure. If you agree to receive communications from a third party,
          your information will be subject to the third party's privacy policy.
          Therefore, if you later decide that you do not want that third party
          to use your information, you will need to contact the third party
          directly.
        </p>
        <p>
          In addition, unless otherwise disclosed in this Privacy Policy or at
          the time you provide your information, {currentName} will only share
          your personally identifiable information with third parties under the
          following limited circumstances:
        </p>
        <p>
          <strong>Third parties providing services on our behalf:</strong>
          {currentName} may employ other companies and individuals to perform
          functions on our behalf. Examples include, without limitation, hosting
          and administering this Web Site, fulfilling orders, sending
          communications on our behalf, analyzing data, and administering
          promotions. These third parties may have access to this Web Site's
          user information, including personally identifiable information, in
          order to perform these functions on our behalf.
        </p>
        <p>
          <strong>Legal Protection:</strong>
          {currentName} may transfer and disclose information about our users,
          including personally identifiable information, and may use IP
          addresses to identify users in cooperation with internet service
          providers or law enforcement agencies, to comply with a legal
          obligation, at the request of governmental authorities conducting an
          investigation, to verify or enforce compliance with the policies
          governing the Web Site and applicable laws, or to protect the legal
          rights, interests, or safety of the Web Site, our users or others.
        </p>
        <p>
          <strong>Corporate change:</strong>
          {currentName} reserves the right to disclose and transfer user
          information, including personally identifiable information, in
          connection with a corporate merger, consolidation, restructuring, a
          sale of assets, or other fundamental corporate change.
        </p>
        <p>
          <strong>Sweepstakes, Contests and Promotions:</strong>
          If you choose to enter a sweepstakes, contest or other promotion, your
          personally identifiable information may be disclosed to third parties
          in connection with the administration of such promotion, including,
          without limitation, in connection with winner selection, prize
          fulfillment and as required by law, such as on a winners list. Also,
          entering a promotion, you are agreeing to the official rules that
          govern that promotion, which may contain specific requirements of you,
          including, except where prohibited by law, allowing the sponsor(s) of
          the promotion to use your name, voice or likeness in advertising or
          marketing associated with the promotion.
        </p>
      </div>
      <div className="your-choices">
        <h4>YOUR CHOICES</h4>
        <p>
          To update your account information, opt-in or opt-out of any of these
          policies, or to unsubscribe from the features you subscribed to on
          this Web Site, please email{' '}
          <a href="mailto:support@rairtechnologies.com?subject=Support%20from%20Privacy%20Policy">
            support@{currentName.toLocaleLowerCase()}technologies.com.
          </a>{' '}
          In addition, you can unsubscribe from receiving commercial e-mail from
          the Web Site by clicking the link contained within an e-mail sent to
          you. You should be aware that it is not always possible to completely
          remove or modify information in our databases. In addition, we may
          institute a policy in which user information is deleted after a amount
          of time, and therefore, your user information may no longer exist in
          {currentName}'s active database(s). In addition, even if you choose to
          unsubscribe or otherwise modify your user account settings,{' '}
          {currentName}
          reserves the right to contact you regarding your account and your use
          of this Web Site.
        </p>
      </div>
      <div className="security">
        <h4>SECURITY</h4>
        <p>
          No data transmission over the internet or electronic storage of
          information can be guaranteed to be 100% secure. Please note that{' '}
          {currentName}
          cannot ensure or warrant the security of any information you transmit
          to {currentName}, and you do so at your own risk.
        </p>
      </div>
      <div className="links">
        <h4>LINKS</h4>
        <p>
          The Web Site and communications sent by the Web Site may contain links
          that take you outside our services and are beyond our control. For
          example, you may encounter links from sponsors or partners, which may
          or may not include the {currentName} logo as part of a co-branding
          agreement. If you "click" on the link to a third party, the "click"
          takes you to party's web site or online content. These other web sites
          may set their own cookies, collect data, solicit personally
          identifiable information and/or have their own privacy policies.
        </p>
      </div>
      <div className="fwftyh">
        <h4>CONSENT TO TRANSFER</h4>
        <p>
          This Web Site is operated in the United States. If you are located in
          the European Union, Canada or elsewhere outside of the United States,
          please be aware that any information you provide to us will be
          transferred to the United States. By using the Web Site or providing
          us with your information, you consent to this transfer.
        </p>
      </div>
      <div className="f">
        <h4>ACCEPTANCE & PRIVACY POLICY CHANGES</h4>
        <p>
          By using this Web Site, you accept our privacy practices, as outlined
          in this Privacy Policy. {currentName} reserves the right to modify,
          alter or otherwise update this Privacy Policy at any time. We will
          post any new or revised policies on the Web Site. However,{' '}
          {currentName} will use your personally identifiable information in a
          manner consistent with the Policy in effect at the time you submitted
          the information, unless you consent to the new or revised policy.
        </p>
        <p>
          <strong>Notice to California Residents: </strong>
          California law grants you certain rights to receive information about
          the third parties, if any, with whom this Web Site shares personally
          identifiable information for those third parties' direct marketing
          purposes. As set forth below in this Web Site's Privacy Policy, we we
          comply with this law by not sharing your personally identifiable
          information with third parties for their direct marketing purposes
          unless you first affirmatively agree to the disclosure. For those
          California residents who want more information regarding our
          compliance with this law or your choices, please contact us at
          support@{currentName.toLocaleLowerCase()}technologies.com. You must
          include this Web Site as the subject line, and your full name, e-mail
          address, and postal address in your message. We will only respond to
          messages specifically requesting information regarding our compliance
          with this law or your your choices, and those that include the above
          information. We will also only respond to a request from you one time
          per calendar year.
        </p>
      </div>
      <div className="f">
        <h4>TERMS OF USE.</h4>
        <p>
          If you choose to visit the Web Site, your visit and any dispute over
          privacy is subject to this Policy and our Terms of Use, including
          limitations on damages, resolution of disputes, and application of the
          law of the state of California.
        </p>
      </div>
      <div className="f">
        <h6> The EFFECTIVE DATE of this Privacy Policy is: March 31, 2021</h6>
      </div>
    </div>
  );
};

export const PrivacyPolicy = memo(PrivacyPolicyComponent);
