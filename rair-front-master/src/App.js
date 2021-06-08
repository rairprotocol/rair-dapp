import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Swal from 'sweetalert2';
import './App.css';
import Web3 from 'web3';

import VideoPlayer from './Views/VideoPlayer.jsx';
import ListItem from './Views/ListItem.jsx';
import AddMedia from './Views/AddMedia.jsx';

const App = () => {
  const [videos, setVideos] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [openVideo, setOpenVideo] = useState();

  const [ethAddress, setEthAddress] = useState();
  const [adminRights, setAdminRights] = useState(false);

  const getToken = async () => {
    let web3 = Web3 | undefined; // Will hold the web3 instance
    let user = null;
    let isAdmin = false;

    try {
      if (!web3) {
        // Get instance of Web3
        web3 = new Web3(window.ethereum);
      }

      const publicAddress = await web3.eth.getCoinbase();

      if (publicAddress) {
        // find user
        user = await fetch(`/api/users/${ publicAddress }`)
          .then(blob => blob.json());
      }

      if (!user) {
        user = await fetch('/api/users', {
          method: 'POST',
          body: JSON.stringify({ publicAddress, adminNFT: 'temp' }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
          .then(blob => blob.json());
      }

      if (!adminRights && publicAddress !== undefined) {
        try {
          const response = await fetch(`/api/auth/get_challenge/${ publicAddress }`)
            .then(blob => blob.json());
          const ethResponse = await window.ethereum.request({
            method: 'eth_signTypedData_v4',
            params: [publicAddress, JSON.stringify(response)],
            from: publicAddress
          });
          const adminResponse = await fetch(`/api/auth/admin/${ response.message.challenge }/${ ethResponse }/`)
            .then(blob => blob.json());
          setAdminRights(adminResponse.ok);
          isAdmin = adminResponse.ok;
        } catch (err) {
          console.log('Error', err)
          setAdminRights(false);
          isAdmin = false;
        }
      }

      const msg = `Sign in for RAIR by nonce: ${ user.nonce }`;

      // get signature
      const signature = await web3.eth.personal.sign(msg, publicAddress, '');

      const token = await fetch('/api/auth/authentication', {
        method: 'POST',
        body: JSON.stringify({ publicAddress, signature, adminRights: isAdmin }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(blob => blob.text());

      localStorage.setItem('token', token);
      setEthAddress(publicAddress);

      await Swal.fire('Success!', 'MetaMask connection ready', 'success');

    } catch (err) {
      console.log(err);
      setAdminRights(false);
      await Swal.fire('Error', 'Something went wrong', 'error');
    }
  }

  useEffect( () => {
    (async () => {
      const currentToken = localStorage.getItem('token');
      // Connect to Metamask
      if (window.ethereum) {
        if (!currentToken) {
          await getToken();
        } else {
          // get address
          const user = await fetch(`/api/auth/user_info`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'X-rair-token': currentToken
            }
          })
            .then(blob => blob.json());

          if (user.message === 'jwt expired') {
            localStorage.removeItem('token');
            setAdminRights(false);
            await getToken();
            const updatedToken = localStorage.getItem('token');
            const updatedUser = await fetch(`/api/auth/user_info`, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'X-rair-token': updatedToken
              }
            })
              .then(blob => blob.json());
            setEthAddress(updatedUser.publicAddress);
            setAdminRights(updatedUser.adminRights);

            return updatedUser;
          }

          setEthAddress(user.publicAddress);
          setAdminRights(user.adminRights);
        }
      }
    })();
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Update the video list
    fetch(`/api/media/list`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-rair-token': token
      }
    })
      .then(blob => blob.json())
      .then(res => {
        setVideos(res);
      })
  }, [refresh, ethAddress])

  return (
    <div className='bg-light align-top text-dark w-100 h-100' style={{minHeight: '100vh', minWidth: '100vw'}}>
      <div className='px-4 m-0 h3 bg-primary text-white align-middle py-3 row'>
        RAIR Node Dashboard
      </div>
      <div className='p-0 m-0 row'>
      <Router>
        <div className='col-3 px-0 mx-0'>
          <Link to='/videos'>
            <button onClick={e => setRefresh(!refresh)} className='btn col-12 btn-transparent'>
              Videos
            </button>
          </Link>
          <Link to='/books'>
            <button disabled className='btn col-12 btn-transparent'>
              Books (Coming Soon)
            </button>
          </Link>
          <Link to='/audio'>
            <button disabled className='btn col-12 btn-transparent'>
              Audio (Coming Soon)
            </button>
          </Link>

          {adminRights && <Link to='/upload'>
            <button className='btn col-12 btn-transparent'>
              Admin Panel
            </button>
          </Link>}
        </div>
        <div className='col-9 p-4'>
            <Switch>
              <Route exact path="/videos" render={() =>
                <>
                  <h1 className='col-12'> My Videos </h1>
                  <div className='col-12 row mx-0 p-3'>
                    <div className='col-10'/>
                    <button onClick={e => setRefresh(!refresh)} className='col-2 text-center btn btn-success'>
                      Refresh
                    </button>
                    {videos && Object.keys(videos).map((vid, index) => {
                      return <ListItem
                        setOpenVideo={setOpenVideo}
                        setRefresh={setRefresh}
                        admin={adminRights}
                        refresh={refresh}
                        videoData={videos[vid]}
                        cid={vid}
                        key={index}/>
                    })}
                  </div>
                </>
              }/>
              <Route exact path="/media" render={() => <VideoPlayer address={ethAddress} video={openVideo}/>} />
              {adminRights && <Route exact path="/upload" render={() => <AddMedia admin={adminRights} address={ethAddress}/>}/>}
            </Switch>
        </div>
      </Router>
      </div>
    </div>
  );
}

export default App;
