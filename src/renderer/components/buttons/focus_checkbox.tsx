import React, { useEffect, useState } from 'react';
import FocusTimer from '../../operations/focus_singleton';

export function FocusCheckbox(props: {
  onClick: () => Promise<void>;
  className: string;
  text: string;
  autofocus?: boolean;
  checkStatus?: () => Promise<boolean>;
  onFocus?: () => void;
}) {
  const [isChecked, setChecked] = useState(false);
  const { checkStatus, text, className, autofocus, onFocus, onClick } = props;

  useEffect(() => {
    if (checkStatus !== undefined) {
      checkStatus()
        .then((checked) => setChecked(checked))
        .catch((e) => alert(e));
    }
  }, [checkStatus]);

  return (
    <button
      type="button"
      key={text}
      // type="checkbox"
      className={className}
      // name={text}
      autoFocus={autofocus}
      onMouseMove={(e) => e.currentTarget.focus()}
      onMouseEnter={(e) => e.currentTarget.focus()}
      onMouseLeave={(e) => e.currentTarget.blur()}
      onBlur={(e) => {
        // if it hasn't been long enough since
        // the last focus transition, refocus
        // on the existing focused component.
        if (!FocusTimer.request()) {
          e.currentTarget.focus();
        }
      }}
      onFocus={() => {
        if (onFocus) {
          onFocus();
        }
      }}
      onClick={() => {
        onClick()
          .then(async () => {
            if (checkStatus !== undefined) {
              setChecked(await checkStatus());
            }
          })
          .catch((e) => alert(e));
      }}
    >
      {text}&nbsp;
      <input
        className="focus-check"
        type="checkbox"
        readOnly
        checked={isChecked}
      />
    </button>
  );
}
