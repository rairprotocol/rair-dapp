
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IVideoItem } from './video.types';
import { SvgKey } from '../MockUpPage/NftList/SvgKey';
import { SvgLock } from '../MockUpPage/NftList/SvgLock';

const VideoItem: React.FC<IVideoItem> = ({mediaList, item}) => {
	const history = useHistory();
	const [hovering, setHovering] = useState(false);
	return <button
		className='col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start video-wrapper'
		style={{height: '291px', width:'291px', border: 'none', backgroundColor: 'transparent'}} onClick={e => {
			history.push(`/watch/${mediaList[item]._id}/${mediaList[item].mainManifest}`);
		}}
		onMouseEnter={e => setHovering(mediaList[item].animatedThumbnail !== '')}
		onMouseLeave={e => setHovering(false)}
	>
		<div className='col-12 rounded' style={{top: 0, position: 'relative', height: '96%'}}>
			<img
				alt='thumbnail'
				src={`${mediaList[item].staticThumbnail}`}
				style={{position: 'absolute', bottom: 0, borderRadius: '16px', objectFit: 'contain', background: 'black'}}
				className='col-12 h-100 w-100' />
			<img
				alt='Animated thumbnail'
				src={`${mediaList[item].animatedThumbnail}`}
				style={{position: 'absolute', display: hovering ? 'block' : 'none', bottom: 0, borderRadius: '16px', objectFit: 'contain', background: 'black'}}
				className='col-12  h-100 w-100' />
			<div className='rounded-rair' style={{backgroundColor: 'var(--charcoal)', color: 'white', position: 'absolute', top: 233, right: 15, minWidth: '107px', height: '25px', textAlign: "center", borderRadius: '10px'}}>
				{mediaList[item].duration}
			</div>
			{ mediaList[item]?.isUnlocked ? 
				<SvgKey color={'#4E4D4D'} bgColor={'white'} /> :
				<SvgLock color={'white'} />}
		</div>
		<div className='col description-wrapper-video'>
		<span className='description-title'>
			{mediaList[item].title}
		</span>
		<br/>
		{/* <span className='description'>{mediaList[item].description.slice(0, 25)}{mediaList[item].description.length > 30 ? '...' : ''}<br></br></span> */}
		<span className='description'>{mediaList[item].author.slice(0, 7)}{mediaList[item].author.length > 10 ? '...' : ''}</span>
		</div>
	</button>
}

export default VideoItem;