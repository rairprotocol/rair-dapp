import { useSelector } from 'react-redux';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { IFixedBottomNavigation } from './creatorStudio.types';

const FixedBottomNavigation: React.FC<IFixedBottomNavigation> = ({
  forwardFunctions,
  backwardFunction,
  backwardDisabled
}) => {
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  if (!forwardFunctions && !backwardFunction) {
    return <></>;
  }

  return (
    <>
      <div className="py-3" />
      <div className={`w-100 bg-${primaryColor} py-4`}>
        <div style={{ position: 'relative' }}>
          <div className="btn" style={{ color: `var(--${primaryColor})` }}>
            {
              // Makes room for the other buttons
              '_'
            }
          </div>
          {backwardFunction && (
            <div
              style={{ position: 'absolute', left: '5rem', width: '10vw' }}
              className="border-stimorol btn rounded-rair p-0">
              <button
                style={{ border: 'none' }}
                disabled={backwardDisabled}
                className={`btn rounded-rair w-100 btn-${primaryColor}`}
                onClick={backwardFunction}>
                Back
              </button>
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              right: '5rem',
              display: 'inline-block'
            }}>
            {forwardFunctions &&
              forwardFunctions.length &&
              forwardFunctions
                .filter((item) => {
                  return item.visible === undefined || item.visible;
                })
                .map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="border-stimorol rounded-rair btn p-0 mx-2">
                      <button
                        style={{ border: 'none' }}
                        disabled={item.disabled}
                        className="btn rounded-rair btn-stimorol"
                        onClick={item.action}>
                        {item.label ? item.label : 'Proceed'}
                      </button>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
      <div className="py-3 my-5" />
    </>
  );
};

export default FixedBottomNavigation;
