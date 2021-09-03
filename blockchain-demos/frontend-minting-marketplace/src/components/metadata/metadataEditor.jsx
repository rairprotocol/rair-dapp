import {useState, useEffect} from 'react';
import InputField from '../common/InputField.jsx';

const AttributeRow = ({array, index, deleter, refetch}) => {
	const [name, setName] = useState(array[index].name);
	const [value, setValue] = useState(array[index].value);

	useEffect(() => {
		if (array[index].name !== name) {
			array[index].name = name;
			refetch();
		}
	}, [name]);

	useEffect(() => {
		if (array[index].value !== value) {
			array[index].value = value;
			refetch();
		}
	}, [value]);

	useEffect(() => {
		setName(array[index].name);
		setValue(array[index].value);
	}, [index, array]);

	return <div className='row px-0 mx-0 col-12'>
		<div className='col-5'>
			<InputField label='Name' getter={name} setter={setName}/>
		</div>
		<div className='col-5'>
			<InputField label='Value' getter={value} setter={setValue}/>
		</div>
		<button onClick={e => deleter(index)} className='btn btn-danger col-2'>
			<i className='fas fa-trash'/>
		</button>
	</div>
}

const MetadataEditor = (props) => {
	const [title, setTitle] = useState('Plan 9 From Outer Space');
	const [symbol, setSymbol] = useState('#');
	const [description, setDescription] = useState('From the brilliant mind of @Ed Wood comes.. How many plans are too many plans? Find out with edition # (URI) ');
	const [tokenNumber, setTokenNumber] = useState(0);
	const [attributes, setAttributes] = useState([]);
	const [refreshData, setRefreshData] = useState(true);
	const [image, setImage] = useState();

	const addAttribute = () => {
		let aux = [...attributes];
		aux.push({name: '', value: ''});
		setAttributes(aux);
	}

	const deleter = (index) => {
		let aux = [...attributes];
		aux.splice(index, 1);
		setAttributes(aux);
	}

	const imageSetter = async (e) => {
		let file = e.target.files[0];
		let reader = new FileReader();
		reader.onload = function () {
			setImage(reader.result);
        }
		let url = await reader.readAsDataURL(file);
	}

	return <div className='row w-100 px-0 mx-0'>
		<div className='col-6'>
			<div className='col-3' />
			<button disabled className='btn col-3 btn-primary'>
				Batch
			</button>
			<button className='btn col-3 btn-primary'>
				Single
			</button>
			<div className='col-3' />
			<div className='col-12'>
				<InputField label='Title' getter={title} setter={setTitle}/>
			</div>
			<div className='col-12'>
				<InputField label='Edition Symbol' getter={symbol} setter={setSymbol} />
			</div>
			<div className='col-12'>
				<label> Description: </label>
				<textarea value={description} onChange={e => setDescription(e.target.value)} />
			</div>
			<div className='col-12'>
				<input type='file' onChange={imageSetter} />
			</div>
			<div className='row mx-0 px-0 w-100'>
				<div className='col-8 py-2'>
					Attributes
				</div>
				<div className='col-4'>
					<button onClick={addAttribute} className='btn btn-success'>
						<i className='fas fa-plus' />
					</button>
				</div>
			</div>
			<div className='col-12'>
				<hr/>
				<div className='col-12 row px-0 mx-0'>
					{attributes.map((item, index) => {
						return <AttributeRow refetch={() => setRefreshData(!refreshData)} deleter={deleter} array={attributes} index={index} key={index} />
					})}
				</div>
				<hr/>
			</div>
		</div>
		<div className='col-6'>
			Preview
			<hr />
			<div className='col-12 row mx-0 px-0'>
				<div className='col-6'>
					{image && <img src={image} style={{filter: `hue-rotate(${tokenNumber}deg)`}} className='w-100 h-auto' />}
				</div>
				<div className='col-6'>
					<h2>
						{title} {symbol}{tokenNumber}
					</h2>
					{description}
					<hr />
				</div>
			</div>
				<div className='col-12 row px-0 mx-0'>
						{attributes.map((item, index) => {
							return <div key={index} className='col-4 my-2 p-1' >
								<div style={{border: 'solid red 1px', backgroundColor: '#F22A', borderRadius: '20px'}}>
									{item.name}: {item.value}
								</div>
							</div>
						})}
					</div>
				{false && <><button onClick={e => setTokenNumber(tokenNumber - 1)} className='btn btn-white'>
					<i className='fas fa-arrow-left' />
				</button>
				<button onClick={e => setTokenNumber(tokenNumber + 1)} className='btn btn-white'>
					<i className='fas fa-arrow-right' />
				</button></>}
				<div className='col-12'>
					<InputField label='Go To NFT #' type='number' getter={tokenNumber} setter={setTokenNumber} />
				</div>

		</div>
	</div>
}

export default MetadataEditor;