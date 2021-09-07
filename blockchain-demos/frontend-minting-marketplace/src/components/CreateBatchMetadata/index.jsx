import React, { useState } from 'react'
import styled from 'styled-components'

const CreateBatchMetadata = () => {
    const [data, setData] = useState({
        product_id: '',
        contact_address: '',
        csv: null
    })

    const onChangeValue = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = e => {
        e.preventDefault()
        if (data.product_id === '') {
            alert('You must add the product id')
        } else if (data.contact_address === '') {
            alert('You must add the contact address')
        } if (!data.csv) {
            alert('You must add the contact csv')
        } else {
            let formData = new FormData();
            formData.set('product_id', data.product_id);
            formData.set('contact_address', data.contact_address);
            formData.set('csv', data.csv);

            console.log(data)
        }
    }

    return (
        <Form onSubmit={onSubmit}>
            <h1>Create Batch Metadata</h1>
            <ContentInput>
                <Label>Product ID</Label>
                <Input
                    type="text"
                    value={data.product_id}
                    name="product_id"
                    onChange={onChangeValue}
                />
            </ContentInput>
            <ContentInput>
                <Label>Contact Address</Label>
                <Input
                    type="text"
                    value={data.contact_address}
                    name="contact_address"
                    onChange={onChangeValue}
                />
            </ContentInput>
            <ContentInput>
                <Label>CSV</Label>
                <Input
                    type="file"
                    value={data.csv}
                    name="csv"
                    onChange={onChangeValue}
                />
            </ContentInput>

            <ContentInput>
                <Input type="submit" value="Create Batch Metadata" />
            </ContentInput>
        </Form>
    )
};

const Form = styled.form`
    width: 80%;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const ContentInput = styled.div`
    width: 100%;
    margin: auto;
    margin-top: 20px;
`;

const Label = styled.label`
    float: left;
`;

const Input = styled.input`
    width: 100%;
    outline: none;
`;

export default CreateBatchMetadata
