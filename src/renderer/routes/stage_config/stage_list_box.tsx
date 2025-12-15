import { useCallback, useEffect, useState } from 'react';
import { FocusButton } from 'renderer/components/buttons/focus_button';
import { FocusCombo } from 'renderer/components/buttons/focus_combo';
import { Backend } from 'renderer/operations/backend';
import { Page } from 'renderer/operations/stage_config';
import { Stage, StageInfo } from 'renderer/operations/stage_info';
import { useStageConfig } from './stage_config_provider';

type Categories = 'Starter' | 'Counterpick';
const MAX_STAGES = 7;
const BACKGROUND_COLOR = 'var(--main-button-bg-color)';
const LEGACY_CONFIG_FILE =
  'ultimate/mods/hdr-stages/ui/param/database/ui_stage_db.prcxml';

/**
 * Represents a row in the stage list window, including a combo box (dropdown) and a 'remove' button
 * @param onChange what to do if the selection changes
 * @param onRemove what to do if the remove button is pressed
 * @param selected the selected value
 * @returns void
 */
function StageListItem(props: {
  options: string[];
  onChange: (item: { target: { value: string } }) => void;
  onRemove: () => void;
  selected: Stage;
  onHover?: (stage: Stage) => void;
  disabled?: boolean;
}) {
  const { disabled, onChange, selected, onHover, options, onRemove } = props;
  return (
    <div>
      <FocusCombo
        className="hover-color"
        style={{
          width: disabled ? '100%' : '90%',
          color: 'white',
          fontSize: 'large',
          paddingTop: 3,
          paddingBottom: 3,
        }}
        onChange={onChange}
        forcedValue={selected?.display_name}
        onFocus={() => {
          if (onHover) {
            onHover(selected);
          }
        }}
        options={options}
        disabled={disabled}
      />
      {!disabled && (
        <FocusButton
          className="hover-color"
          style={{
            width: '10%',
            color: 'pink',
            fontWeight: 'bold',
            fontSize: 'large',
            paddingTop: 3,
            paddingBottom: 1,
          }}
          text="X"
          onFocus={() => {
            if (onHover) {
              onHover(selected);
            }
          }}
          onClick={onRemove}
        />
      )}
    </div>
  );
}

export default function StageListBox(props: { category: Categories }) {
  const { category } = props;
  const {
    initialized,
    stages,
    setHoveredStage,
    pages,
    setPage,
    currentPage,
    officialStageList,
  } = useStageConfig();
  const page = pages[currentPage];
  const propName = category === 'Starter' ? 'starters' : 'counterpicks';
  const selectedStages = !page.useOfficial
    ? page[propName]
    : (officialStageList?.[propName] ?? []);
  const disabled = page.useOfficial;
  const getOptions = useCallback(() => {
    return stages.map((stage) => stage?.display_name);
  }, [stages]);
  const options = getOptions();

  return (
    <div style={{ height: '300px', position: 'relative', padding: 0 }}>
      <div
        className="thick-border"
        style={{
          position: 'relative',
          top: '2.5%',
          left: '2.5%',
          height: '95%',
          width: '97.5%',
        }}
      >
        <h2
          style={{
            color: 'white',
            backgroundColor: BACKGROUND_COLOR,
            padding: 5,
          }}
          className="border-bottom"
        >
          {category}s
        </h2>
        {options ? (
          selectedStages.map((entry, idx) => (
            <StageListItem
              options={options}
              selected={entry}
              onChange={async (item) => {
                const info = new StageInfo();
                const stage = await info.getByDisplay(item.target.value);
                selectedStages[idx] = stage;
                const newPage: Page = {
                  ...page,
                  [propName]: selectedStages,
                };
                setPage(currentPage, newPage);
              }}
              onHover={setHoveredStage}
              onRemove={() => {
                const newSelected: Stage[] = [];
                console.info(`ignoring: ${idx}`);
                selectedStages.forEach((entry, thisIdx) => {
                  if (idx !== thisIdx) {
                    newSelected.push(entry);
                  }
                });
                const newPage: Page = {
                  ...page,
                  [propName]: newSelected,
                };
                setPage(currentPage, newPage);
              }}
              disabled={disabled}
            />
          ))
        ) : (
          <div />
        )}
        {selectedStages.length < MAX_STAGES && !disabled ? (
          <FocusButton
            className="hover-color"
            text="+"
            style={{
              width: '100%',
              color: 'lightgreen',
              fontWeight: 'bold',
              fontSize: 'large',
              paddingTop: 3,
              paddingBottom: 1,
              paddingLeft: 10,
              paddingRight: 10,
            }}
            onClick={async () => {
              const newSelected = [];
              const info = new StageInfo();
              const firstAvailable = await info.getByDisplay(
                (await info.list())[0]?.display_name,
              );
              selectedStages.forEach((entry) => newSelected.push(entry));
              newSelected.push(firstAvailable);
              const newPage: Page = {
                ...page,
                [propName]: newSelected,
              };
              setPage(currentPage, newPage);
            }}
            onFocus={() => {}}
          />
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
