import React from 'react';
import { Backend } from '../../operations/backend';
import '../../styles/sidebar.css';
import { FocusButton } from '../buttons/focus_button';
import { LogWindow } from './log_window';

export class LogPopout extends React.Component<
  {},
  { isOpen: boolean; contents: string }
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isOpen: false,
      contents: 'No logs.',
    };
  }

  render() {
    const { isOpen, contents } = this.state;
    return (
      <div className={`sidebar-container${isOpen ? ' wide' : ''}`}>
        <div className="button-container">
          <FocusButton
            className="open-button simple-button"
            onClick={() =>
              this.setState({
                isOpen: !isOpen,
                contents,
              })
            }
            text={isOpen ? 'Close Logs' : 'Open Logs'}
          />
        </div>
        {isOpen ? (
          <div
            className={`open-sidebar${
              Backend.isNode() ? ' blur-back' : ' opaque'
            }`}
          >
            <LogWindow />
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}
