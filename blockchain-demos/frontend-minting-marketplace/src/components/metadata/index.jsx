import React from 'react'
import 'antd/dist/antd.css';
import { ContentStep, ContentSteps } from './styles';
import StepOne from './Steps/stepOne'
import StepTwo from './Steps/stepTwo'
import StepThree from './Steps/stepThree'

const { Step } = ContentSteps;

const FormMetadata = () => {
    const [current, setCurrent] = React.useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    const steps = [
        {
            id: 1,
            content: <StepOne/>,
        },
        {
            id: 2,
            content: <StepTwo/>,
        },
        {
            id: 3,
            content: <StepThree/>,
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
            <div className="steps-action">
                {current < steps.length - 1 && (
                    <button type="primary" onClick={() => next()}>
                        Next
                    </button>
                )}
                {current === steps.length - 1 && (
                    <button type="primary" onClick={() => alert('Processing complete!')}>
                        Done
                    </button>
                )}
                {current > 0 && (
                    <button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        Previous
                    </button>
                )}
            </div>
        </>
    )
}

export default FormMetadata
