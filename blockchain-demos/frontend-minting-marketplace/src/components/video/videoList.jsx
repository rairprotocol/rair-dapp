import { useEffect, useState } from 'react';
import VideoItem from './videoItem.jsx';
import InputField from '../common/InputField.jsx';

const VideoList = props => {
	const [mediaList, setMediaList] = useState([]);
	const [titleSearch, setTitleSearch] = useState('');
	const updateList = async () => {
		let response = await (await fetch('/api/media/list', {
			headers: {
				'x-rair-token': localStorage.token
			}
		})).json()
		if (response.success) {
			setMediaList(response.list)
		} else if (response?.message === 'jwt expired') {
			localStorage.setItem('token', undefined);
		}
	}

	useEffect(() => {
		if (localStorage.token) {
			updateList();
		}
	}, [])

	return <>
		<details className='col-12'>
			<summary> Search </summary>
			<InputField getter={titleSearch} setter={setTitleSearch} />
		</details>
		{Object.keys(mediaList).filter(item => mediaList[item].title.toLowerCase().includes(titleSearch.toLowerCase())).map((item, index) => {
			return <VideoItem key={index} mediaList={mediaList} item={item} />
		})}
	</>
};

export default VideoList;