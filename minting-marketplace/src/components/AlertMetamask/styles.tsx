//@ts-nocheck
import styled from 'styled-components';

export const Alert = styled.div`
    width: 100%;
    height: 50px;
    position: fixed;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    background: var(--yellow-alert);
    z-index: 101;

    @media (max-width: 500px) {
        height: 100px;
        font-size: 14px;
    }

    svg {
        cursor: pointer;
    }
`