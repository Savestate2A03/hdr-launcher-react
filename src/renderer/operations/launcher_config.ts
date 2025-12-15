import { Backend } from './backend';

type BooleanSetting = 'skip_launcher' | 'ignore_music' | 'enable_dev_tools';

const CONFIG_PATH = 'ultimate/hdr-config';

export async function setBoolean(
  setting: BooleanSetting,
  enabled: boolean,
): Promise<void> {
  try {
    const backend = Backend.instance();
    const sdroot = await backend.getSdRoot();
    const configDir = sdroot + CONFIG_PATH;
    const exists = await backend.fileExists(`${configDir}/${setting}`);
    if (exists && !enabled) {
      // the file exists and should be removed.
      await backend.deleteFile(`${configDir}/${setting}`);
    } else if (!exists && enabled) {
      // the file does not exist and should be created.
      await backend.mkdir(configDir);
      await backend.writeFile(`${configDir}/${setting}`, 'foo');
    }
  } catch (e) {
    alert(`Could not set config setting ${setting}\n${e}`);
  }
}

export async function getBoolean(setting: BooleanSetting): Promise<boolean> {
  try {
    const backend = Backend.instance();
    const sdroot = await backend.getSdRoot();
    const configDir = sdroot + CONFIG_PATH;
    const exists = await backend.fileExists(`${configDir}/${setting}`);
    if (exists) {
      return true;
    }
    return false;
  } catch (e) {
    alert(`Could not get config setting ${setting}\n${e}`);
    return false;
  }
}
