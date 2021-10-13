import { useEffect, useState } from 'react';
import VideoItem from './videoItem.jsx';
import InputField from '../common/InputField.jsx';
import setDocumentTitle from '../../utils/setTitle';
import { rFetch } from '../../utils/rFetch';
import { useSelector } from 'react-redux';

const VideoList = ({endpoint, responseLabel}) => {
	const [mediaList, setMediaList] = useState();
	const [titleSearch, setTitleSearch] = useState('');
	const {primaryColor} = useSelector(state => state.colorStore);
	const updateList = async () => {
		let response = await (await rFetch(endpoint ? endpoint : '/api/media/list'));
		if (response.success) {
			setMediaList(responseLabel ? response[responseLabel] : response.list);
		} else if (response?.message === 'jwt expired' || response?.message === 'jwt malformed') {
			localStorage.removeItem('token');
		} else {
			console.log(response?.message);
		}
	}

	useEffect(() => {
		if (localStorage.token) {
			updateList();
		}
		setDocumentTitle(`Videos`);
	}, [])

	return <>
	<div className='input-search-wrapper list-button-wrapper'>
	{mediaList?.length > 0 && <>
		<InputField
			getter={titleSearch}
			setter={setTitleSearch}
			placeholder={'Search...'}
			customCSS={{backgroundColor: `var(--${primaryColor})`}}
			customClass= 'form-control input-styled' />
		<i className="fas fa-search fa-lg fas-custom" aria-hidden="true" />
	</>}
	</div>
		<div className='list-button-wrapper'>
		{mediaList ? 
			mediaList?.length > 0 ?
				Object.keys(mediaList).filter(item => mediaList[item].title.toLowerCase().includes(titleSearch.toLowerCase())).map((item, index) => {
					return <VideoItem key={index} mediaList={mediaList} item={item} />
			}) :
				<h5 className='w-100 text-center'>
					No files found
				</h5>
			: 'Searching...'}
		</div>
	</>
};

export default VideoList;