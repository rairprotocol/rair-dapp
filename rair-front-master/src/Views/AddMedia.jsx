import React, {useState} from 'react';
import Swal from 'sweetalert2';
import InputField from './InputField.jsx';
import InputSelect from './InputSelect.jsx';

// Admin view to upload media to the server
const AddMedia = ({address}) => {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState()
    const [author, setAuthor] = useState('')
    const [token, setToken] = useState('0xd07dc4262bcdbf85190c01c996b4c06a461d2430:50984')
    const [category, setCategory] = useState('null')
    const [video, setVideo] = useState(undefined)
    const [uploading, setUploading] = useState(false);
    const [adminNFT, setAdminNFT] = useState('');
    const [, setVPV] = useState();

    return <>
    <h1> Add Media </h1>
    <div className='text-center mx-auto col-12'>
      <div className='col-8 py-1'>
        <InputField label='Title' getter={title} setter={setTitle} />
      </div>
      <div className='col-8 py-1'>
        <InputField label='Author' getter={author} setter={setAuthor} />
      </div>
      <div className='col-8 py-1'>
        <InputField label='Description' getter={description} setter={setDescription} />
      </div>
      <div className='col-8 py-1'>
        <InputField label='Access NFT' getter={token} setter={setToken} />
      </div>
      <div className='col-8 py-1'>
        <InputSelect label='Category' getter={category} setter={setCategory} placeholder='Coming Soon' options={[
          {value: 'Video', label: 'Video'},
          {value: 'Audio', label: 'Audio'},
          {value: 'Book', label: 'Book'}
        ]}/>
      </div>

      <div className='col-8 py-1'>
        <label htmlFor="media_id">File:</label>
        <input id='media_id' type="file" onChange={(e) => setVideo(e.target.files ? e.target.files[0] : undefined)} />
      </div>

      <button type='button' disabled={uploading} className='btn py-1 col-8 btn-primary' onClick={e => {
        if (uploading)
        {
          return
        }
        if (video && title && token)
        {
          setVPV(URL.createObjectURL(video))
          let formData = new FormData();

          formData.append('video', video)
          // formData.append('author', author)
          formData.append('title', title)
          formData.append('description', description)
          formData.append('token', token)
          formData.append('category', category)
          setUploading(true);
          fetch('/api/media/upload', {
            method: 'POST',
            body: formData
          })
          .then(blob => blob.json())
          .then(response => {
            setUploading(false);
            setTitle('');
            setAuthor('');
            setDescription('');
            setVideo(undefined);
            Swal.fire('Success','Your file is being processed','success');
          })
          .catch(e => {
            console.error(e);
            Swal.fire('Error',e,'error');
            setUploading(false);
          })
        }
        else
        {
          setVPV();
        }
      }}> {uploading ? 'Upload in progress' : 'Submit'} </button>
      <hr className='w-100 my-5' />
    </div>
    <h1> Manage Account </h1>
    <div className='text-center mx-auto col-12'>
      <div className='col-8 py-1'>
        <InputField label='Admin Control NFT' getter={adminNFT} setter={setAdminNFT} />
      </div>
      <button type='button' className='btn py-1 my-2 col-8 btn-primary' onClick={e => {
        if (adminNFT)
        {
          fetch('/api/auth/get_challenge/'+address)
                .then(blob => blob.json())
                .then(response => {
                    window.ethereum.request({
                          method: "eth_signTypedData_v4",
                          params: [address, JSON.stringify(response)],
                          from: address
                      })
                      .then(e => {
                          fetch('/api/auth/new_admin/'+response.message.challenge+'/'+e+'/',
                          {
                              method: 'POST',
                              body: JSON.stringify({
                                  adminNFT
                              }),
                              headers: {
                                  Accept: 'application/json',
                                  'Content-Type': 'application/json'
                              }
                          })
                          .then(blob => blob.json())
                          .then(response => {
                            setAdminNFT('');
                            Swal.fire(response.ok ? 'Success' : 'Error', response.message, response.ok ? 'success' : 'error');
                          })
                          .catch(e => {
                            console.error(e);
                            Swal.fire('Error',e,'error');
                          })
                      })
                })
        }
    }}> Set new NFT </button>
    </div>
  </>
}

export default AddMedia;
