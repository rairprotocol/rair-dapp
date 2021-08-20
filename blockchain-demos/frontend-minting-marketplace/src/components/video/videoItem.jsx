import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const VideoItem = ({mediaList, item}) => {
	const history = useHistory();
	const [hovering, setHovering] = useState(false);
	return <button className='col-3 p-1 text-start' style={{height: '30vh', border: 'none'}} onClick={e => {
		history.push(`/watch/${item}/${mediaList[item].mainManifest}`);
	}}
		onMouseEnter={e => setHovering(true)}
		onMouseLeave={e => setHovering(false)}
	>
		<div className='w-100 bg-danger h-75 rounded' style={{position: 'relative'}}>
			<img
				alt='thumbnail'
				src={`/thumbnails/${mediaList[item].thumbnail}.png`}
				style={{position: 'absolute'}}
				className='col-12 h-100 w-100' />
			<img
				alt='Animated thumbnail'
				src={`/thumbnails/${mediaList[item].thumbnail}.gif`}
				style={{position: 'absolute', display: hovering ? 'block' : 'none'}}
				className='col-12 h-100 w-100' />
		</div>
		{mediaList[item].title}<br/>
		{mediaList[item].description}
	</button>
}

export default VideoItem;