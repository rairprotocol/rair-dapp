import React from 'react'
import SearchPanel from './SearchPanel'

const mockUpPage = ({item, primaryColor, textColor}) => {
    return (
    <div className={'mock-up-page-wrapper'}>
        <SearchPanel primaryColor={primaryColor} textColor={textColor} />
    </div>
    )
}
export default mockUpPage;