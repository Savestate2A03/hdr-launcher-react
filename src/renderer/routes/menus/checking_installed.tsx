import { useEffect, useState } from 'react';
import { Backend } from '../../operations/backend';

export function CheckingInstalled(props: {
  onComplete: (installedVersion: string | null) => void;
}) {
  const [installed, setInstalled] = useState(null as null | string);
  const { onComplete } = props;

  useEffect(() => {
    Backend.instance()
      .getVersion()
      .then((version) => onComplete(version))
      .catch(async (e) => {
        const backend = Backend.instance();
        const root = await backend.getSdRoot();
        try {
          const prVersion = await backend.readFile(
            `${root}ultimate/mods/hdr-pr/ui/hdr_version.txt`,
          );
          const prEnabled = await backend.isModEnabled(
            'sd:/ultimate/mods/hdr-pr',
          );
          // if the PR build is enabled, then use that
          if (prEnabled) {
            onComplete(prVersion);
          } else {
            onComplete(null);
          }
        } catch (e) {
          console.error(`Error while checking if HDR is installed!\n${e}`);
          alert(`Error while checking if HDR is installed!\n${e}`);
          onComplete(null);
        }
      });
  }, [onComplete]);

  return <div>checking if HDR is installed...</div>;
}
