import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const VideoList = props => {

	const history = useHistory()

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
			return <div className='col-3 p-1 text-start' style={{height: '30vh'}} key={index} onClick={e => {
				history.push(`/watch/${item}/${mediaList[item].mainManifest}`);
			}}>
					<img alt='thumbnail' style={index === 1 ? {filter: 'grayscale(100%)'} : undefined} src={`/thumbnails/${mediaList[item].thumbnail}.png`} className='col-12 bg-secondary rounded h-75' />
				{mediaList[item].title}<br/>
				{mediaList[item].description}
			</div>
		})}
	</>
};

export default VideoList;