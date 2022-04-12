import React from 'react'
import { List, ListEditProfileMode } from '../NavigationItems/NavigationItems'

const MobileEditProfile = ({ primaryColor }) => {
    return (
        <ListEditProfileMode primaryColor={primaryColor}>
            Edit mode
        </ListEditProfileMode>
    )
}

export default MobileEditProfile