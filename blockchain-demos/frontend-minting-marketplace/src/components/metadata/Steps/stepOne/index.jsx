import React, { useState } from 'react'
import { Button, ColOrRow, Container, Input, ContentInput, Label } from './styles'

const StepOne = () => {
    const [selector, setSelector] = useState({
        simple: true,
        advance: false
    })

    const onChangeSelector = (select) => {
        if (select === 'simple') {
            setSelector({
                simple: true,
                advance: false
            })
        } else if (select === 'advance') {
            setSelector({
                simple: false,
                advance: true
            })
        }
    }

    return (
        <Container>
            <ColOrRow width='60%'>
                <Button
                    border={!selector.simple && '1px solid #4E4D4D'}
                    bg={!selector.simple && 'transparent'}
                    color={!selector.simple && '#A7A6A6'}
                    onClick={() => onChangeSelector('simple')}
                >
                    Simple
                </Button>
                <Button
                    border={!selector.advance && '1px solid #4E4D4D'}
                    bg={!selector.advance && 'transparent'}
                    color={!selector.advance && '#A7A6A6'}
                    onClick={() => onChangeSelector('advance')}
                    left='20px'
                >
                    Advance
                </Button>
            </ColOrRow>
            <ColOrRow width='100%' top='50px' justify='normal'>
                <ContentInput width='48px'>
                    <Input top='20px' />
                </ContentInput>

                <ContentInput width='200px' left='20px'>
                    <Label>Item name</Label>
                    <Input />
                </ContentInput>
                <ContentInput width='120px' left='20px'>
                    <Label>Starts</Label>
                    <Input />
                </ContentInput>
                <ContentInput width='120px' left='20px'>
                    <Label>Ends</Label>
                    <Input />
                </ContentInput>
                <ContentInput width='168px' left='20px'>
                    <Label>Price for each</Label>
                    <Input />
                </ContentInput>
                <ContentInput width='87px' left='20px'>
                    <Label>Limit</Label>
                    <Input />
                </ContentInput>
                <ContentInput width='48px' left='20px'>
                    <Input top='20px' />
                </ContentInput>
                <ContentInput width='48px' left='20px'>
                    <Input top='20px' />
                </ContentInput>
            </ColOrRow>

        </Container>
    )
}

export default StepOne
