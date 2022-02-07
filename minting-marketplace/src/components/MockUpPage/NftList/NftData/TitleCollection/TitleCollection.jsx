import React, { useState } from 'react';
import "./TitleCollection.css";
import defaultUser from "./../../../assets/defultUser.png";
import { useParams } from 'react-router-dom';

const TitleCollection = ({ title, userName, currentUser }) => {
    console.log(currentUser.userData, 'currentUser');
    const params = useParams();

    return <div className="container-title-collection">
        <div className="block-title-share">
            <h2>{title === "none" ? `#${params.tokenId}` : title}</h2>
            <button>Share</button>
        </div>
        <div className="block-user-creator">
            <span>by:</span>
            <img src={defaultUser} alt="user" />
            <h5>{userName}</h5>
        </div>
        <div className="block-collection-desc">
            BAYC is a collection of 10,000 Bored Ape NFTs—unique digital collectibles
            living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht
            Club membership card, and grants access to members-only benefits, the first
            of which is access to THE BATHROOM, a collaborative graffiti board. Future
            areas and perks can be unlocked by the community through roadmap activation.
        </div>
    </div>;
};

export default TitleCollection;
