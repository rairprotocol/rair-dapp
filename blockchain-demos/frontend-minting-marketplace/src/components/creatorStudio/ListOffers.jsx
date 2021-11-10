import { useState } from 'react'
import { useSelector } from 'react-redux';
import InputField from '../common/InputField.jsx'

const OfferRow = ({index}) => {

	const [offerName, setOfferName] = useState('')

	const {primaryColor, secondaryColor} = useSelector(store => store.colorStore);

	return <div className='col-12 row px-0 mx-0'>
		<div className='col-1 px-1' >
			{index === 0 && <br />}
			<i style={{border: 'solid 1px white', verticalAlign: 'middle'}} className='pt-2 h-100 fas rounded-rair form-control fa-key' />
		</div>
		<div className='col-3 px-1' >
			<InputField
				getter={offerName}
				setter={setOfferName}
				label={index === 0 ? 'Item name' : undefined}
				labelClass='text-start w-100'
				customClass='form-control rounded-rair'
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</div>
		<div className='col-1 px-1' >
			<InputField
				getter={offerName}
				setter={setOfferName}
				label={index === 0 ? 'Item name' : undefined}
				labelClass='text-start w-100'
				customClass='form-control rounded-rair'
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</div>
		<div className='col-1 px-1' >
			<InputField
				getter={offerName}
				setter={setOfferName}
				label={index === 0 ? 'Item name' : undefined}
				labelClass='text-start w-100'
				customClass='form-control rounded-rair'
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</div>
		<div className='col-2 px-1' >
			<InputField
				getter={offerName}
				setter={setOfferName}
				label={index === 0 ? 'Item name' : undefined}
				labelClass='text-start w-100'
				customClass='form-control rounded-rair'
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</div>
		<div className='col-2 px-1' >
			<InputField
				getter={offerName}
				setter={setOfferName}
				label={index === 0 ? 'Item name' : undefined}
				labelClass='text-start w-100'
				customClass='form-control rounded-rair'
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</div>
		<div className='col-1 px-1' >
			<InputField
				getter={offerName}
				setter={setOfferName}
				label={index === 0 ? 'Item name' : undefined}
				labelClass='text-start w-100'
				customClass='form-control rounded-rair'
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</div>
		<div className='col-1 px-1' >
			<InputField
				getter={offerName}
				setter={setOfferName}
				label={index === 0 ? 'Item name' : undefined}
				labelClass='text-start w-100'
				customClass='form-control rounded-rair'
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</div>
	</div>
};

const ListOffers = () => {

	const [offerList, setOfferList] = useState([]);
	const {primaryColor} = useSelector(store => store.colorStore);

	const addOffer = () => {
		let aux = [...offerList];
		aux.push({
			name: '',
			starts: 0,
			ends: 0,
			price: 0,
		});
		setOfferList(aux);
	}

	return <div className='row px-0 mx-0'>
		<div className='col-12 my-5'>
			<div className='w-75 mx-auto px-0' style={{position: 'relative'}}>
				<div style={{border: `solid 1px var(--charcoal-60)`, width: '76%', right: '12%', top: '50%', position: 'absolute', zIndex: 0}} />
				<div style={{width: '100%', position: 'absolute', zIndex: 1}} >
					{[
						{label: 1, active: true},
						{label: 2, active: false},
						{label: 3, active: false},
						{label: 4, active: false},
					 ].map((item, index, array) => {
						return <div style={{width: `${100 / array.length}%`, display: 'inline-block'}}>
							<div style={{background: `var(--${item.active ? 'stimorol' : primaryColor})`, borderRadius: '50%', height: '1.5rem', width: '1.5rem', margin: 'auto', border: 'solid 1px var(--charcoal-60)'}}>
								{item.label}
							</div>
						</div>
					})}
				</div>
				<div style={{height: '1.5rem'}} />
			</div>
		</div>
		<div className='col-6 text-end'>
			<button className='btn btn-charcoal rounded-rair col-8'>
				Simple
			</button>
		</div>
		<div className='col-6 text-start'>
			<button className='btn btn-charcoal rounded-rair col-8'>
				Advanced
			</button>
		</div>
		{offerList.map((item, index) => {
			return <OfferRow />
		})}
	</div>
}

export default ListOffers;