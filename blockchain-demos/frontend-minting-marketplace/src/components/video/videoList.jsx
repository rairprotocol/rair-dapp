import { useEffect, useState } from 'react';
import VideoItem from './videoItem.jsx';

const VideoList = props => {
	const [mediaList, setMediaList] = useState([]);
	const updateList = async () => {
		let response = await (await fetch('/api/media/list', {
			headers: {
				'x-rair-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldGhfYWRkciI6IjB4ZWMzMDc1OWQwYTNmM2NlMGE3MzA5MjBkYzI5ZDc0ZTQ0MWY0OTJjMyIsImFkbWluUmlnaHRzIjp0cnVlLCJpYXQiOjE2MjkzOTY4MDUsImV4cCI6MTYyOTQ4MzIwNX0.G6YY8mrTxCoMfA-oICKDuUQlGUhXKzCOMNxy_Kkscys'
			}
		})).json()
		if (response.success) {
			setMediaList(response.list)
		}
	}

	useEffect(() => {
		updateList();
	})

	return <>
		{Object.keys(mediaList).map((item, index) => {
			return <VideoItem key={index} mediaList={mediaList} item={item} />
		})}
	</>
};

export default VideoList;