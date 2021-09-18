const rFetch = async (route, options) => {
	return (await fetch(route, {
		headers: {
			...options?.headers,
			'X-rair-token': `${localStorage.getItem('token')}`
		},
		...options
	})).json()
}

export default rFetch