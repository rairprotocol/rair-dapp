import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Swal from 'sweetalert2';
import './App.css';

import VideoPlayer from './Views/VideoPlayer.jsx';
import ListItem from './Views/ListItem.jsx';
import AddMedia from './Views/AddMedia.jsx';

const App = () => {
  const [videos, setVideos] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [openVideo, setOpenVideo] = useState();

  const [ethAddress, setEthAddress] = useState();
  const [adminRights, setAdminRights] = useState(false);

  useEffect(() => {
    // Connect to Metamask
    if (window.ethereum) {
      try {
         window.ethereum.request({method: 'eth_requestAccounts'})
         .then((e) => {
            setEthAddress(e[0]);
            Swal.fire('Success!','MetaMask connection ready','success')
         })
         .catch(err => {
            Swal.fire('Error','User denied access to the DApp','error')
            setAdminRights(false)
         })
      } catch(e) {
          Swal.fire('Error','Something went wrong','error')
          setAdminRights(false)
      }
    }
  }, [])

  useEffect(() => {
    // Sign the admin rights challenge
    if (!adminRights && ethAddress !== undefined)
    {  
      fetch('/api/auth/get_challenge/'+ethAddress)
        .then(blob => blob.json())
        .then(response => {
              window.ethereum.request({
                  method: "eth_signTypedData_v4",
                  params: [ethAddress, JSON.stringify(response)],
                  from: ethAddress
              })
              .then(e => {
                  fetch('/api/auth/admin/'+response.message.challenge+'/'+e+'/')
                    .then(blob => blob.json())
                    .then(res => {
                      setAdminRights(res.ok)
                    })
                    .catch(err => {
                      console.log('Error',err)
                      setAdminRights(false)
                    })
              })
          })
      } 
  }, [adminRights, ethAddress])

  useEffect(() => {
    // Update the video list
    fetch('/api/media/list')
      .then(blob => blob.json())
      .then(res => {
        setVideos(res);
      })
  }, [refresh])

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
