import React, {useState} from 'react';
import Swal from 'sweetalert2';
import {useHistory} from 'react-router-dom';

//Video list item
const ListItem = ({cid, videoData, refresh, setRefresh, setOpenVideo, admin}) => {
    const his = useHistory();
    const [hovered, setHovered] = useState(false);

    const [nftP1, nftP2] = videoData.author.split(':');

    if (!cid)
    {
      console.error('Missing CID for',videoData.title,'by',videoData.author);
      return <></>
    }

    return <div className='col-3 text-justify'>
    <button
      onClick={e => {
        setOpenVideo({...videoData, cid})
        his.push('/media')
      }}
      className='btn w-100 p-0 m-0'
      onMouseEnter={e => setHovered(true)}
      onMouseLeave={e => setHovered(false)}
      style={{
      }}>
      <div className='btn p-0 col-12'>
        <img
        className='col-12'
        style={{
          maxHeight: '100%',
          maxWidth: '100%',
          height: 'auto'
        }} src={'/thumbnails/'+videoData.thumbnail+(hovered ? '.gif' : '.png')} alt='' />
        <h5 className='mb-0 mt-2'>{videoData.name}</h5>
        <small className='text-muted'>{videoData.description && videoData.description.slice(0, 50)}</small>
      </div>
    </button>
    {videoData.nftIdentifier && <div className='col-12 mx-0 px-0 row'>
      <a rel='noreferrer'
          target="_blank"
          href={'http://app.rarible.com/token/'+videoData.nftIdentifier}
          className='btn btn-success col-4'>
            Buy
      </a>
      <a rel='noreferrer'
          target="_blank"
          href={'https://opensea.io/assets/'+nftP1+'/'+nftP2+'/sell'}
          className='btn text-center btn-primary col-4'>
            Sell
      </a>
      <a rel='noreferrer'
          target="_blank"
          href={'https://opensea.io/assets/'+nftP1+'/'+nftP2+'/transfer'}
          className='btn btn-primary text-center col-4'>
            Transfer
      </a>
    </div>}
    {admin && <button onClick={e => {
      let body = {file: videoData.file}
      const token = localStorage.getItem('token')
      fetch('/api/media/remove/'+cid,{
        body: JSON.stringify(body),
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-rair-token': token
        }
      })
      .then(blob => blob.json())
      .then(res => {
        if (res.ok)
        {
          Swal.fire('Success','Video file deleted and unpinned','success');
          setRefresh(!refresh);
        }
      })
    }} className='btn btn-danger col-6'>Delete</button>}
    {cid && admin && <a rel='noreferrer' target="_blank" href={'https://ipfs.io/ipfs/'+cid} className='btn btn-warning col-6'>IPFS</a>}
    </div>
  }

export default ListItem;
