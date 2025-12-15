import { Progress } from 'nx-request-api';
import { useEffect, useState } from 'react';
import { Backend } from 'renderer/operations/backend';
import * as LauncherConfig from '../../operations/launcher_config';
import { ScrollFocusButton } from './scroll_focus_button';

export function CloneFolderForDev(props: {
  modName: string;
  setInfo: (info: string) => void;
  onComplete: () => void;
  showProgress: (p: Progress) => void;
  then?: () => Promise<void>;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    LauncherConfig.getBoolean('enable_dev_tools')
      .then((enabled) => {
        setEnabled(enabled);
      })
      .catch((e) =>
        console.error(`Error while if dev tools were enabled: ${e}`),
      );
  }, []);

  if (enabled) {
    const { modName, showProgress, onComplete, then, setInfo } = props;
    return (
      <ScrollFocusButton
        text={`Create ${modName}-dev\u00A0`}
        className="smaller-main-button"
        onClick={async () => {
          try {
            showProgress(
              new Progress(
                `Creating ${modName} folder`,
                `Creating ${modName} folder`,
                0,
              ),
            );
            await Backend.instance().cloneMod(modName, `${modName}-dev`);
            if (then !== undefined) {
              await then();
            }
            onComplete();
          } catch (e) {
            alert(`Error while cloning ${modName}: ${e}`);
          }
        }}
        onFocus={() =>
          setInfo(
            `Create an ${modName}-dev mod folder from your current ${modName} folder`,
          )
        }
      />
    );
  }
  return <div />;
}
