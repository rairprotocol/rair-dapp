//@ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { rFetch } from "../../../utils/rFetch";
import InputField from "../../common/InputField";
import InputSelect from "../../common/InputSelect";
import io from "socket.io-client";
import "./videoUpload.css";
import { getRandomValues } from "../../../utils/getRandomValues";
import axios from "axios";
import { TAuthGetChallengeResponse, TUploadSocket } from "../../../axios.responseTypes";
import { useSelector } from "react-redux";
const UPLOAD_PROGRESS_HOST = process.env.REACT_APP_UPLOAD_PROGRESS_HOST;

//TODO: alternative env 
// const hostname = window.location.hostname;
// console.log(hostname, 'hostname');


// Admin view to upload media to the server
const FileUpload = ({ address, primaryColor, textColor }) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	// const [author, setAuthor] = useState("");
	// const [token, setToken] = useState('')
	const [video, setVideo] = useState(undefined);
	const [uploading, setUploading] = useState(false);
	const [adminNFT, setAdminNFT] = useState("");
	const [thisSessionId, setThisSessionId] = useState("");
	const [socket, setSocket] = useState(null);
	const [status, setStatus] = useState(0);
	const [message, setMessage] = useState(0);
	const [/*part,*/ setPart] = useState(0);
	const [, setVPV] = useState();
	// const [productData,setProductData] = useState();
	const [product, setProduct] = useState("null");
	const [productOptions, setProductOptions] = useState();
	const [offersOptions, setOffersOptions] = useState();
	const [offer, setOffer] = useState("null");
	const [countOfSelects, setCountOfSelects] = useState(0);
	const [selects, setSelects] = useState([]);
	const [selectsData, setSelectsData] = useState({});
	const [contract, setContract] = useState('null');
	const [category, setCategory] = useState('null');
	const [storage, setStorage] = useState('null');
	const [contractID, setContractID] = useState('null');
	const [contractOptions, setContractOptions] = useState([]);
	const [offersData, setOffersData] = useState([]);
	const [collectionIndex, setCollectionIndex] = useState({});
	const [offersIndex, setOffersIndex] = useState([]);
	const [networkId, setNetworkId] = useState('');

	const currentToken = localStorage.getItem("token");

	const [categoryArray, setCategoryArray] = useState([]);
	const getCategories = useCallback(async () => {
		const { success, categories } = await rFetch('/api/categories');
		if (success) {
			setCategoryArray(categories.map(item => { return { label: item.name, value: item.name } }));
		}
	}, [])

	const currentUserAddress = useSelector<RootState, string>(state => state.contractStore.currentUserAddress);

	useEffect(() => {
		getCategories();
	}, [getCategories])

	const getContract = useCallback(async () => {
		const { success, contracts } = await rFetch("/api/contracts");

		if (success) {
			const contractData = contracts.map((item) => ({
				_id: item._id,
				blockchain: item.blockchain,
				value: item.contractAddress,
				label: `${item.title} (...${item.contractAddress.slice(-4)})`,
			}));
			setContractOptions(contractData);
		}
	}, [setContractOptions]);

	const getProduct = useCallback(async () => {
		const { success, products } = await rFetch(`api/contracts/network/${networkId}/${contract}/products`);

		if (success) {
			const names = products.map((product) => ({
				value: product.name,
				label: product.name,
			}));
			setProductOptions(names);
		}

		const collectionIndexInContract = products[0]?.collectionIndexInContract;
		setCollectionIndex(collectionIndexInContract);

		return products;
	}, [contract]);

	useEffect(() => {
		if (contract !== 'null') {
			getProduct();
		}
	}, [contract, getProduct]);

	const getOffers = useCallback(async () => {
		const responseOffer = await rFetch(`api/contracts/network/${networkId}/${contract}/products/offers`);

		const filteredOffer = responseOffer.products.filter(item => item.name === product);
		const offersNames = filteredOffer[0]?.offers.map(prod => {
			return {
				value: prod.offerName,
				label: prod.offerName,
			}
		})

		setOffersData(responseOffer.products[0]?.offers);
		setOffersOptions(offersNames);

		return offersNames;
	}, [contract, product]);

	useEffect(async () => {
		if (product !== 'null') {
			const offers = await getOffers();
			setCountOfSelects(offers?.length - 1);
		}
	}, [product, contract, getOffers]);

	useEffect(() => {
		if (selectsData) {
			Object.keys(selectsData).forEach((names) => {
				offersData.forEach((offers) => {
					if (selectsData[names] === offers.offerName) {
						setOffersIndex((prev) => [...prev, offers.offerIndex]);
					}
				});
			});
		}
	}, [selectsData, offer]);

	useEffect(async () => {
		await getContract();
		const sessionId = getRandomValues().toString(36).substr(2, 9);
		setThisSessionId(sessionId);
		const so = io(`${UPLOAD_PROGRESS_HOST}`, { transports: ["websocket"] });
		// const so = io(`http://localhost:5000`, { transports: ["websocket"] });

		setSocket(so);
		// so.on("connect", data => {
		//   console.log('Connected !');
		// });

		so.emit("init", sessionId);

		return () => {
			so.emit("end", sessionId);
		};
	}, []);

	if (socket) {
		socket.removeListener("uploadProgress");
		socket.on("uploadProgress", (data) => {
			if (data.part) {
				setPart(
					getRandomValues() / 10
				);
			}

			if (data.done) {
				setStatus(data.done);
			}

			if (data.part) {
				setStatus(getRandomValues() / 10);
			}

			setMessage(data.message);

			if (data.last) {
				socket.emit("end", thisSessionId);
				Swal.fire("Success", "Your file is being processed", "success");
				setUploading(false);
				setStatus(0);
				setTitle("");
				setDescription("");
				setVideo(undefined);
				setOffersIndex([]);
				setCollectionIndex({});
				setCategory("null");
				setStorage('null');
				setContractOptions([]);
				setProductOptions();
				setOffersOptions();
				getContract();
				document.getElementById("media_id").value = "";
				setMessage(0);
			}
		});
	}

	const handleChangeSelects = (value, name) => {
		setSelectsData({
			...selectsData,
			[name]: value,
		});
	};

	const createSelects = () => {
		if (countOfSelects) {
			setSelects([...selects, "select11"]);
			setCountOfSelects((prev) => prev - 1);
		}
	};

	const renderSelects = () => {
		return selects.map((item, i) => {
			return (
				<InputSelect
					customClass="form-control input-select-custom-style"
					customCSS={{
						backgroundColor: `var(--${primaryColor})`,
						color: `var(--${textColor})`,
					}}
					labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
					// optionCSS={{color: `var(--${primaryColor})`}}
					key={item + i}
					label="Offers"
					getter={selectsData[item + i]}
					setter={(e) => handleChangeSelects(e, item + i)}
					placeholder="Choose your offer"
					options={offersOptions}
				/>
			);
		});
	};

	const handleOffer = (value) => {
		setOffer(value);
		offersData.forEach((offer) => {
			if (value === offer.offerName) {
				offer.diamondRangeIndex
					?
					setOffersIndex((prev) => [...prev, offer.diamondRangeIndex])
					:
					setOffersIndex((prev) => [...prev, offer.offerIndex]);
			}
		});
	};

	let reusableStyle = {
		backgroundColor: `var(--${primaryColor})`,
		color: `var(--${textColor})`
	}

	return (
		<>
			<h1> Add Media </h1>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
				className="text-center mx-auto col-12"
			>
				<div className="col-8 py-1">
					<InputField
						customClass="form-control input-select-custom-style"
						customCSS={reusableStyle}
						labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
						label="Title"
						placeholder="Please input a title"
						getter={title}
						setter={setTitle}
					/>
				</div>
				{/* <div className="col-8 py-1">
					<InputField
						customClass="form-control input-select-custom-style"
						customCSS={reusableStyle}
						labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
						label="Author"
						placeholder="Please input an author"
						getter={author}
						setter={setAuthor}
					/>
				</div> */}
				<div className="col-8 py-1">
					<InputField
						label="Description"
						customClass="form-control input-select-custom-style"
						customCSS={reusableStyle}
						labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
						placeholder="Please input a description"
						getter={description}
						setter={setDescription}
					/>
				</div>
				<div className="col-8 py-1">
					<InputSelect
						customClass="form-control input-select-custom-style"
						customCSS={reusableStyle}
						labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
						label="Category"
						getter={category}
						setter={setCategory}
						placeholder="Choose a category"
						options={categoryArray}
					/>
				</div>
				<div className="col-8 py-1">
					<InputSelect
						customClass="form-control input-select-custom-style"
						customCSS={reusableStyle}
						labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
						label="Storage"
						getter={storage}
						setter={setStorage}
						placeholder="Select a storage method"
						options={[
							{ label: 'Google Cloud', value: 'gcp' },
							{ label: 'IPFS', value: 'ipfs' }
						]}
					/>
				</div>
				<div className="col-8 py-1">
					<InputSelect
						customClass="form-control input-select-custom-style"
						customCSS={reusableStyle}
						labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
						label="Contract"
						getter={contract}
						setter={e => {
							contractOptions.forEach((el) => {
								if (el.value === e) {
									setNetworkId(el.blockchain)
									setContractID(el._id)
								}
							})
							setContract(e);
							setProduct("null");
							setProductOptions([]);
							setOffer("null");
							setOffersOptions([]);
						}}
						placeholder="Choose a product"
						options={contractOptions}
					/>
				</div>
				{productOptions?.length > 0 ?
					<div className="col-8 py-1">
						<InputSelect
							customClass="form-control input-select-custom-style"
							customCSS={reusableStyle}
							labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
							label="Product"
							getter={product}
							setter={e => {
								setProduct(e);
								setOffer("null");
								setOffersOptions([]);
								setSelects([])
							}}
							placeholder="Choose a product"
							options={productOptions}
						/>
					</div> : <>
						No products available
						<br />
					</>}
				{offersOptions?.length > 0 ? <div className="col-8 py-1">
					<InputSelect
						customClass="form-control input-select-custom-style"
						customCSS={reusableStyle}
						labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
						label="Offers"
						getter={offer}
						setter={(value) => handleOffer(value)}
						placeholder="Choose a offer"
						options={offersOptions}
					/>
					<button
						style={reusableStyle}
						className="addButton"
						onClick={createSelects}
					>
						<i className='fas fa-plus' />
					</button>
					{renderSelects()}
				</div> : 'No offers available'}
				<div className="col-8 py-1">
					<label htmlFor="media_id">File:</label>
					<input
						className="form-control input-select-custom-style"
						style={{
							paddingLeft: "7px",
							...reusableStyle
						}}
						id="media_id"
						type="file"
						onChange={(e) =>
							setVideo(e.target.files ? e.target.files[0] : undefined)
						}
					/>
				</div>
				<button
					type="button"
					disabled={uploading || storage === 'null' || title === '' || description === '' ||/* author === '' || */  contract === 'null' || product === 'null' || offer === 'null' || video === undefined}
					className="btn py-1 col-8 btn-primary btn-submit-custom"
					onClick={(e) => {
						if (uploading) {
							return;
						}
						if (video && title && currentToken) {
							setVPV(URL.createObjectURL(video));
							let formData = new FormData();
							formData.append("video", video);
							formData.append("title", title);
							formData.append("description", description);
							formData.append("contract", contractID);
							formData.append("category", category);
							formData.append("storage", storage);
							formData.append("product", collectionIndex);
							formData.append("offer", JSON.stringify(offersIndex));
							setUploading(true);
							axios.post<TUploadSocket>(`/api/media/upload?socketSessionId=${thisSessionId}`, formData, {
								headers: {
									Accept: "application/json",
									"X-rair-token": currentToken,
								}
							})
								.then((res) => res.data)
								.then((response) => {
									// TODO: in time of uploading 
									// setUploading(false);
									// setTitle("");
									// setDescription("");
									// setVideo(undefined);
									// setOffersIndex([]);
									// setCollectionIndex({});
									// setCategory("null");
									// setStorage('null');
									// setContractOptions([]);
									// setProductOptions();
									// setOffersOptions();
									// getContract();
									// 	// setAuthor("");
								}
								)
								.catch((e) => {
									console.error(e);
									Swal.fire("Error", e, "error");
									setUploading(false);
								});
						} else {
							setVPV();
						}
					}}
				>
					{uploading ? "Upload in progress" : "Submit"}
				</button>
				<div />
				<div
					className="progress"
					style={{
						marginTop: "20px",
						width: "67%",
						backgroundColor: `var(--${primaryColor})`,
					}}
				>
					<div
						className="progress-bar"
						role="progressbar"
						style={{ width: `${status}%` }}
						aria-valuenow={status}
						aria-valuemin="0"
						aria-valuemax="100"
					>
						{status}%
					</div>
				</div>
				<div>{status !== 100 && status !== 0 ? `Step: ${message}` : ""}</div>
				<hr className="w-100 my-5" />
			</div>
			<h1> Manage Account </h1>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
				className="text-center mx-auto col-12"
			>
				<div className="col-8 py-1">
					<InputField
						customClass="form-control input-select-custom-style"
						customCSS={{
							backgroundColor: `var(--${primaryColor})`,
							color: `var(--${textColor})`,
						}}
						labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
						label="Admin Control NFT"
						getter={adminNFT}
						setter={setAdminNFT}
					/>
				</div>
				<button
					type="button"
					className="btn py-1 my-2 col-8 btn-primary btn-submit-custom"
					onClick={(e) => {
						if (adminNFT) {
							axios.get<TAuthGetChallengeResponse>("/api/auth/get_challenge/" + currentUserAddress)
								.then((res) => res.data)
								.then(({success, response }) => {
									window.ethereum
										.request({
											method: "eth_signTypedData_v4",
											params: [currentUserAddress, JSON.stringify(response)],
											from: currentUserAddress,
										})
										.then((e) => {
									console.log("inside post method");

											axios.post(
												"/api/auth/new_admin/" +
												JSON.parse(response).message.challenge +
												"/" +
												e +
												"/", JSON.stringify({
													adminNFT,
												}),
												{
													headers: {
														Accept: "application/json",
														"Content-Type": "application/json",
													},
												}
											)
												.then((res) => res.data)
												.then(({success, response }) => {
													setAdminNFT("");
													Swal.fire(
														success ? "Success" : "Error",
														response.message,
														success ? "success" : "error"
													);
												})
												.catch((e) => {
													console.error(e);
													Swal.fire("Error", e, "error");
												});
										});
								});
						}
					}}
				>
					{" "}
					Set new NFT{" "}
				</button>
			</div>
		</>
	);
};

export default FileUpload;
