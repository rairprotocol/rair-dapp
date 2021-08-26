import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const VideoItem = ({mediaList, item}) => {
	const history = useHistory();
	const [hovering, setHovering] = useState(false);
	return <button className='col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 p-1 text-start' style={{height: '30vh', border: 'none'}} onClick={e => {
		history.push(`/watch/${item}/${mediaList[item].mainManifest}`);
	}}
		onMouseEnter={e => setHovering(true)}
		onMouseLeave={e => setHovering(false)}
	>
		<div className='col-12 rounded h-75' style={{position: 'relative'}}>
			<img
				alt='thumbnail'
				src={`/thumbnails/${mediaList[item].thumbnail}.png`}
				style={{position: 'absolute', bottom: 0}}
				className='col-12 h-auto' />
			<img
				alt='Animated thumbnail'
				src={`/thumbnails/${mediaList[item].thumbnail}.gif`}
				style={{position: 'absolute', display: hovering ? 'block' : 'none', bottom: 0}}
				className='col-12 h-auto' />
		</div>
		{mediaList[item].title}<br/>
		{mediaList[item].description}
	</button>
}

export default VideoItem;