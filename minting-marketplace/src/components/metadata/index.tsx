//@ts-nocheck
import React, { useState, useEffect } from 'react'
//import 'antd/dist/antd.css';
//import { ContentStep, ContentSteps, ContentButtons, Button } from './styles';
import StepOne from './Steps/stepOne'
import StepTwo from './Steps/stepTwo'
import StepThree from './Steps/stepThree'
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { setShowSidebarFalse } from '../../ducks/metadata';

const { Step } = ContentSteps;

const FormMetadata = () => {
    const [current, setCurrent] = useState(0);
    const dispatch = useDispatch();
    const location = useLocation();
    console.log(location.pathname.split('/'));

    useEffect(() => {
        dispatch(setShowSidebarFalse())
    }, [dispatch]);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    const steps = [
        {
            id: 1,
            content: <StepOne />,
        },
        {
            id: 2,
            content: <StepTwo />,
        },
        {
            id: 3,
            content: <StepThree />,
        },
    ];
    return (
        <>
            <ContentSteps size="small" current={current}>
                {steps.map(item => (
                    <Step key={item.id} />
                ))}
            </ContentSteps>
            <ContentStep className="steps-content">{steps[current].content}</ContentStep>
            <ContentButtons>
                <div className="steps-action">
                    {current > 0 && (
                        <Button bg='transparent' border style={{ margin: '0 8px' }} onClick={() => prev()}>
                            Back
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Proceed
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => alert('Processing complete!')}>
                            Done
                        </Button>
                    )}
                </div>
            </ContentButtons>
        </>
    )
}

export default FormMetadata
