//@ts-nocheck
import useLongPress from "../hooks/useLongPress.tsx";

const PhysicalMovements = () => {
  const onKeyLongPress = (type, key, keyCode, code) => {
    document.dispatchEvent(
      new KeyboardEvent(type, {
        key: key,
        keyCode: keyCode,
        code: code,
        which: keyCode,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false,
      })
    );
  };

  const longWPressEvent = useLongPress(
    () => onKeyLongPress("keydown", "W", 87, "KeyW"),
    null,
    {
      shouldPreventDefault: true,
      delay: 0,
      onClear: () => onKeyLongPress("keyup", "W", 87, "KeyW"),
    }
  );

  const longSPressEvent = useLongPress(
    () => onKeyLongPress("keydown", "S", 83, "KeyS"),
    null,
    {
      shouldPreventDefault: true,
      delay: 0,
      onClear: () => onKeyLongPress("keyup", "S", 83, "KeyS"),
    }
  );

  const longDPressEvent = useLongPress(
    () => onKeyLongPress("keydown", "D", 68, "KeyD"),
    null,
    {
      shouldPreventDefault: true,
      delay: 0,
      onClear: () => onKeyLongPress("keyup", "D", 68, "KeyD"),
    }
  );

  const longAPressEvent = useLongPress(
    () => onKeyLongPress("keydown", "A", 65, "KeyA"),
    null,
    {
      shouldPreventDefault: true,
      delay: 0,
      onClear: () => onKeyLongPress("keyup", "A", 65, "KeyA"),
    }
  );

  return (
    <div className="d-pad">
      <button {...longWPressEvent} id="up">
        &#9650;
      </button>
      <button {...longDPressEvent} id="right">
        &#9658;
      </button>
      <button id="center" />
      <button {...longSPressEvent} id="down">
        &#9660;
      </button>
      <button {...longAPressEvent} id="left">
        &#9668;
      </button>
    </div>
  );
};

export default PhysicalMovements;