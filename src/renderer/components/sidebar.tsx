import * as React from 'react';
import { LogWindow } from './logging/log_window';
import { FocusButton } from './buttons/focus_button';

enum ContentType {
  Logs,
  Twitter,
  Changelogs,
}

/**
 * header implementation
 */
export default class Sidebar extends React.PureComponent<
  {},
  { mode: ContentType }
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      mode: ContentType.Changelogs,
    };
  }

  getContent() {
    const { mode } = this.state;
    switch (mode) {
      case ContentType.Logs:
        return (
          <div className="sidebar-content">
            <LogWindow />
          </div>
        );
      default:
        return (
          <div className="sidebar-content">
            <LogWindow />
          </div>
        );
    }
  }

  render() {
    return (
      <div className="full sidebar">
        <div className="simple-buttons">
          <FocusButton
            className="simple-button inline"
            text="&nbsp;Latest Changes&nbsp;"
            onClick={() => this.setState({ mode: ContentType.Changelogs })}
          />
          <FocusButton
            className="simple-button inline"
            text="&nbsp;Logs&nbsp;"
            onClick={() => this.setState({ mode: ContentType.Logs })}
          />
        </div>

        {this.getContent()}
      </div>
    );
  }
}
