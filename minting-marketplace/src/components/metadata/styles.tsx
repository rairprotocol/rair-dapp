//@ts-nocheck
import styled from 'styled-components';
import { Steps } from 'antd';

export const ContentStep = styled.div`
    width: ${props => props.width ? props.width : '100%'};
`;

export const ContentSteps = styled(Steps)`
    width: 60%;
    margin: auto;

    .ant-steps-item-active .ant-steps-item-icon{
        color: #fff !important;
        border-color: #E882D5;
        background-color: #E882D5;
    }

    .ant-steps-icon{
        color: #fff !important;
    }

    .ant-steps-item-icon{
        background-color: #383637;
    }

    .ant-steps-item-finish .ant-steps-item-icon{
        border-color: #E882D5;
        background-color: #E882D5;
    }

    .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after {
        background-color: #383637;
    }

    .ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after{
        background-color: #383637;
    }

    .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after{
        background-color: #E882D5;
    }
`;

export const ContentButtons = styled.div`
    width: 100vw;
    height: 100px;
    position: fixed;
    bottom: 0;
    right: 0;
    border-top: 1px solid #383637;
    z-index: 999999;
    background-color: #222021;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const Button = styled.button`
    width: ${props => props.width ? props.width : '200px'};
    height: ${props => props.width ? props.width : '48px'};
    border-radius: 16px;
    outline: none;
    cursor: pointer;
    border: ${props => !props.border && 'none'};
    border-top-color: ${props => props.border ? '#806bdf99' : 'none'};
    border-bottom-color: ${props => props.border ? '#886bd699' : 'none'};
    border-left-color: ${props => props.border ? 'rgba(175,111,216,.6)' : 'none'};
    border-right-color: ${props => props.border ? 'rgba(140,99,218,.8)' : 'none'};
    background: ${props => props.bg ? props.bg : '#725BDB'};
    background: ${props => props.bg ? props.bg : '-webkit-linear-gradient(to right, #725BDB, #E882D5)'};
    background: ${props => props.bg ? props.bg : 'linear-gradient(to right, #725BDB, #E882D5)'};
    color: #fff;

`;