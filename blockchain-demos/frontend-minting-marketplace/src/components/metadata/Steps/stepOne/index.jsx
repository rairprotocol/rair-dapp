import React, { useState } from 'react'
import { Button, ColOrRow, Container, Input, ContentInput, Label, Icon } from './styles'

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

            <ColOrRow width='100%' top='50px' justify='center'>
                <ContentInput width='48px'>
                    <Input top='50px' />
                    <Icon bg='transparent' className="fas fa-key" />
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
                <ContentInput width='168px' left='20px' top='30px'>
                    <Label>Price for each</Label>
                    <Input pleft='40px' />
                    <Icon
                        color='#fff'
                        top='-40px'
                        left='-60px'
                        className="fab fa-ethereum"
                    />
                </ContentInput>
                <ContentInput width='87px' left='20px'>
                    <Label>Limit</Label>
                    <Input />
                </ContentInput>
                <ContentInput width='48px' left='20px' cursor>
                    <Input top='50px' />
                    <Icon color='#fff' bg='transparent' className="fas fa-lock" />
                </ContentInput>
                <ContentInput width='48px' left='20px' cursor>
                    <Input top='50px' />
                    <Icon color='#fff' bg='transparent' className="fas fa-trash-alt" />
                </ContentInput>
            </ColOrRow>

            <ColOrRow
                width='100%'
                top='50px'
                dashed='1px dashed#4E4D4D'
                height='80px'
                radius='16px'
            >
                <label
                    style={{marginLeft: '30px'}}
                ><b>First token:</b> 0</label>
                <label
                    style={{marginLeft: '30px'}}
                ><b>Last token:</b> 999</label>
                <label
                    style={{marginLeft: '30px'}}
                ><b>Mintable token left:</b> 1,000</label>
            </ColOrRow>
        </Container>
    )
}

export default StepOne
