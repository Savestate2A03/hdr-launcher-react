import { useEffect, useState } from 'react';
import { Backend } from '../../operations/backend';
import { FocusButton } from './focus_button';
import { ScrollFocusButton } from './scroll_focus_button';

export function PrereleaseBetaButton(props: {
  setInfo: (info: string) => void;
  onClick: (version: string) => void;
}) {
  const [version, setVersion] = useState('...');
  const { onClick, setInfo } = props;

  useEffect(() => {
    Backend.instance()
      .getVersion()
      .then((version) => {
        setVersion(version);
      })
      .catch((e) =>
        console.error(`Error while loading version for switch button: ${e}`),
      );
  }, []);

  let buttonText = '...';
  if (version.toLowerCase().includes('prerelease')) {
    buttonText = 'Beta';
  } else if (version.toLowerCase().includes('beta')) {
    buttonText = 'PreRelease';
  }

  return (
    <ScrollFocusButton
      text={`Install ${buttonText}\u00A0`}
      className="smaller-main-button"
      onClick={async () => {
        onClick(version);
        Backend.instance()
          .getVersion()
          .then((version) => {
            setVersion(version);
          })
          .catch((e) =>
            console.error(
              `Error while loading version for switch button: ${e}`,
            ),
          );
      }}
      onFocus={() => setInfo(`Switch to the ${buttonText} version of HDR`)}
    />
  );
}
