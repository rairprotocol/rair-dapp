import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import SearchPanel from './SearchPanel'

const MockUpPage = ({item, primaryColor, textColor}) => {
    const dispatch = useDispatch()
    useEffect(() => {
		dispatch({
			type: 'SHOW_SIDEBAR_TRUE'
		})
	}, []);
    return (
    <div className={'mock-up-page-wrapper'}>
        <SearchPanel primaryColor={primaryColor} textColor={textColor} />
    </div>
    )
}
export default MockUpPage;