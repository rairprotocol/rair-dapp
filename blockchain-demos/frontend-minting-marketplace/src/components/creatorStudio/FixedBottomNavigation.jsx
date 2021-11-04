import { useSelector } from 'react-redux';

const FixedBottomNavigation = ({forwardFunction, backwardFunction, forwardLabel, backwardDisabled, forwardDisabled}) => {
	const { primaryColor } = useSelector(store => store.colorStore);

	if (!forwardFunction && !backwardFunction) {
		return <></>
	}

	return <>
		<div className={`w-100 bg-${primaryColor} py-4`} style={{position: 'fixed', bottom: 0, left: 0, borderTop: `2px solid var(--charcoal-40)`}}>
			<div style={{position: 'relative'}}>
				<div className='btn' style={{color: `var(--${primaryColor})`}} disabled={true}>
					{
						// Makes room for the other buttons
						"_"
					}
				</div>
				{backwardFunction &&
					<button
						disabled={backwardDisabled}
						style={{position: 'absolute', left: '5rem'}}
						className={`btn btn-${primaryColor}`}
						onClick={backwardFunction}>
						Back
					</button>
				}
				{forwardFunction && 
					<button
						disabled={forwardDisabled}
						style={{position: 'absolute', right: '5rem'}}
						className='btn btn-stimorol'
						onClick={forwardFunction}>
						{forwardLabel ? forwardLabel : 'Proceed'}
					</button>
				}
			</div>
		</div>
	</>
}

export default FixedBottomNavigation;