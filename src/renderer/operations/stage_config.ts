import { Backend } from './backend';
import { Stage, StageInfo } from './stage_info';

export const ACTIVE_CONFIG_FILE = 'ultimate/hdr-config/tourney_mode.json';
export const BACKUP_STAGE_CONFIG =
  'ultimate/hdr-config/tourney_mode_backup.json';
export const OFFICIAL_STAGE_CONFIG =
  'ultimate/mods/hdr-stages/tourney_mode_official.json';
const CONFIG_PATH = 'ultimate/hdr-config/';

const stagePreviewContext = require.context(
  '../../../assets/stage_previews',
  false,
  /^\.\/stage_2_.*\.jpg$/,
);

// Pre-load all stage previews so webpack bundles them
new StageInfo().list().then(async (stages) => {
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    try {
      const imagePath = `./stage_2_${stage.name_id.toLowerCase()}.jpg`;
      stagePreviewContext(imagePath);
    } catch {
      console.warn(`Could not find stage preview for: ${stage.name_id}`);
    }
  }
});

export interface StageList {
  starters: Stage[];
  counterpicks: Stage[];
}

export interface Page extends StageList {
  name: string;
  useOfficial: boolean;
}

export interface StageConfig {
  enabled: boolean;
  pages: Page[];
  officialStageList?: StageList;
}

async function loadStageList(data: any): Promise<StageList> {
  try {
    const info = new StageInfo();
    const stageList: StageList = {
      starters: [],
      counterpicks: [],
    };
    // load starters
    const starters: string[] = data?.starters ?? [];
    for (let i = 0; i < starters.length; i++) {
      const nameId = starters[i];
      try {
        let stage = await info.getById(nameId);
        stage ||= (await info.list())[0]; // default to the first stage if the named stage could not be loaded
        stageList.starters.push(stage);
      } catch (e) {
        console.error(`Error loading stage ${nameId}: ${e}`);
      }
    }

    // load counterpicks
    const counterpicks: string[] = data?.counterpicks ?? [];
    for (let i = 0; i < counterpicks.length; i++) {
      const nameId = starters[i];
      try {
        let stage = await info.getById(nameId);
        stage ||= (await info.list())[0]; // default to the first stage if the named stage could not be loaded
        stageList.counterpicks.push(stage);
      } catch (e) {
        console.error(`Error loading stage ${nameId}: ${e}`);
      }
    }

    return stageList;
  } catch {
    return {
      starters: [],
      counterpicks: [],
    };
  }
}

async function loadOfficialStageList(): Promise<StageList | null> {
  try {
    const backend = Backend.instance();
    const root = await backend.getSdRoot();
    if (!(await backend.fileExists(root + OFFICIAL_STAGE_CONFIG))) {
      return null;
    }
    const json = await backend.readFile(root + OFFICIAL_STAGE_CONFIG);
    const data = JSON.parse(json);
    const stageList = await loadStageList(data);
    return stageList;
  } catch (e) {
    return null;
  }
}

async function loadPages(data: any): Promise<Page[]> {
  try {
    const pages: Page[] = [];
    for (let i = 0; i < data.pages.length; i++) {
      const name = data.pages[i]?.name ?? `Page ${i}`;
      const useOfficial = data.pages[i]?.useOfficial ?? false;
      const stageList = await loadStageList(data.pages[i]);
      pages.push({
        name,
        useOfficial,
        ...stageList,
      });
    }
    if (pages.length === 0) {
      pages.push({
        name: 'Page 1',
        useOfficial: false,
        starters: [],
        counterpicks: [],
      });
    }
    return pages;
  } catch {
    return [
      {
        name: 'Page 1',
        useOfficial: false,
        starters: [],
        counterpicks: [],
      },
    ];
  }
}

export async function loadStageConfig(
  location: string,
): Promise<StageConfig | null> {
  try {
    const backend = Backend.instance();
    const root = await backend.getSdRoot();

    // if the config doesn't already exist, default to empty
    if (!(await backend.fileExists(root + location))) {
      const officialStageList = await loadOfficialStageList();
      return {
        enabled: false,
        pages: [
          {
            name: 'Page 1',
            useOfficial: false,
            starters: [],
            counterpicks: [],
          },
        ],
        officialStageList: officialStageList ?? undefined,
      };
    }

    // load the config from the input file
    const json = await backend.readFile(root + location);
    const data = JSON.parse(json);
    const enabled: boolean = data.enabled ?? false;
    const pages: Page[] = await loadPages(data);
    const officialStageList = await loadOfficialStageList();
    return {
      enabled,
      pages,
      officialStageList: officialStageList ?? undefined,
    };
  } catch (e) {
    return null;
  }
}

export async function saveStageConfig(
  location: string,
  stageConfig: StageConfig,
): Promise<void> {
  try {
    const backend = Backend.instance();
    const root = await backend.getSdRoot();
    const config = {
      ...stageConfig,
      pages: stageConfig.pages.map((page) => {
        return {
          ...page,
          starters: page.starters.map((stage) => stage.name_id),
          counterpicks: page.counterpicks.map((stage) => stage.name_id),
        };
      }),
    };

    const json = JSON.stringify(config);
    const configDir = root + CONFIG_PATH;
    const exists = await backend.fileExists(configDir);
    if (!exists) {
      await backend.mkdir(configDir);
    }

    await Backend.instance().writeFile(root + location, json);
  } catch (e) {}
}
