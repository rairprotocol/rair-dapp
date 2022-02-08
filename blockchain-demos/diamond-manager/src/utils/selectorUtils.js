function getSelectors (contract, usedSelectors) {
	const signatures = Object.keys(contract.interface.functions)
	const selectors = signatures.reduce((acc, val) => {
		if (val !== 'init(bytes)') {
			let selector = contract.interface.getSighash(val);
			if (usedSelectors[selector] !== undefined) {
				console.log('Function', val, 'already exists on', contract.address)	
				return acc;
			}
			usedSelectors[selector] = {
				address: contract.address,
				name: val,
				selector: selector
			};
			acc.push(selector)
		}
		return acc
	}, [])
	selectors.contract = contract
	selectors.remove = remove
	selectors.get = get
	return selectors
}

// used with getSelectors to remove selectors from an array of selectors
// functionNames argument is an array of function signatures
function remove (functionNames) {
  const selectors = this.filter((v) => {
	for (const functionName of functionNames) {
	  if (v === this.contract.interface.getSighash(functionName)) {
		return false
	  }
	}
	return true
  })
  selectors.contract = this.contract
  selectors.remove = this.remove
  selectors.get = this.get
  return selectors
}

// used with getSelectors to get selectors from an array of selectors
// functionNames argument is an array of function signatures
function get (functionNames) {
  const selectors = this.filter((v) => {
	for (const functionName of functionNames) {
	  if (v === this.contract.interface.getSighash(functionName)) {
		return true
	  }
	}
	return false
  })
  selectors.contract = this.contract
  selectors.remove = this.remove
  selectors.get = this.get
  return selectors
}

export {
	getSelectors,
	remove,
	get
}