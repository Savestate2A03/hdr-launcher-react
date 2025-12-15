import * as React from 'react';
import { Level, Logs } from '../../operations/log_singleton';
import { LogListener } from '../../operations/log_listener';
import { LogList } from './log_list';
import type { LogList as LogListType } from '../../operations/log_singleton';

/**
 * log window implementation
 */
export class LogWindow
  extends React.Component<{}, { logs: LogListType }>
  implements LogListener
{
  /** constructor */
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = { logs: Logs.instance().getAll() };
    Logs.instance().registerChangeCallback(this);
  }

  componentWillUnmount(): void {
    Logs.instance().unregisterChangeCallback(this);
  }

  update() {
    this.setState({ logs: Logs.instance().getAll() });
  }

  render() {
    function getOption(level: Level | string) {
      return (
        <option value={level} key={level}>
          {level}
        </option>
      );
    }

    return (
      <div className="full">
        <select
          className="simple-button inline"
          name="loglevels"
          defaultValue={Logs.instance().getLevel()}
          id="loglevels"
          onChange={(item: { target: { value: string } }) => {
            Logs.instance().setLevel(item.target.value as Level);
          }}
        >
          {getOption('DEBUG')}
          {getOption('INFO')}
          {getOption('WARNING')}
          {getOption('ERROR')}
        </select>
        <button
          type="button"
          className="simple-button inline"
          onClick={() => {
            Logs.instance().clear();
          }}
        >
          &nbsp;Clear Logs&nbsp;
        </button>
        <button
          type="button"
          className="simple-button inline"
          onClick={async () => Logs.instance().save()}
        >
          &nbsp;Save Logs&nbsp;
        </button>
        <LogList />
      </div>
    );
  }
}
