import { useEffect, useState } from 'react';
import VideoItem from './videoItem.jsx';
import InputField from '../common/InputField.jsx';

const VideoList = ({mediaList, titleSearch,  primaryColor}) => {
	// const [mediaList, setMediaList] = useState();
	// const [titleSearch, setTitleSearch] = useState('');
	// const updateList = async () => {
	// 	let response = await (await fetch('/api/media/list', {
	// 		headers: {
	// 			'x-rair-token': localStorage.token
	// 		}
	// 	})).json()
	// 	if (response.success) {
	// 		setMediaList(response.list)
	// 	} else if (response?.message === 'jwt expired' || response?.message === 'jwt malformed') {
	// 		localStorage.removeItem('token');
	// 	} else {
	// 		console.log(response?.message);
	// 	}
	// }

	// useEffect(() => {
	// 	if (localStorage.token) {
	// 		updateList();
	// 	}
	// }, [])
	return <>
	<div className='input-search-wrapper list-button-wrapper'>
	{/* <InputField
				getter={titleSearch}
				setter={setTitleSearch}
				placeholder={'Search...'}
				customCSS={{backgroundColor: `var(--${primaryColor})`}}
				customClass= 'form-control input-styled' />
				<i className="fas fa-search fa-lg fas-custom" aria-hidden="true"></i> */}

	</div>
		{/* <details className='col-12'> */}
			{/* <summary> Search </summary> */}
			{/* <InputField
				getter={titleSearch}
				setter={setTitleSearch}
				placeholder={'Search'}
				customClass='form-control input-styled' /> */}
		{/* </details> */}
		<div className='list-button-wrapper'>
		{mediaList ? Object.keys(mediaList).filter(item => mediaList[item].title.toLowerCase().includes(titleSearch.toLowerCase())).map((item, index) => {
			return <VideoItem key={index} mediaList={mediaList} item={item} />
		}) : 'Searching...'}
		</div>
	</>
};

export default VideoList;