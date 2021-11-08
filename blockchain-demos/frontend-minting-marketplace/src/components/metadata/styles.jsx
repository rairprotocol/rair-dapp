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