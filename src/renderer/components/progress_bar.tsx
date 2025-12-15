import ProgressBar from '@ramonak/react-progress-bar';
import React from 'react';
import ReactModal from 'react-modal';
import { Progress } from 'nx-request-api';
import { Backend } from '../operations/backend';
import '../styles/progress.css';
import { LogPopout } from './logging/log_popout';
import SlidingBackground from './sliding_background';

ReactModal.setAppElement('#root');

const customStyles = {
  content: {},
  overlay: { zIndex: 1000 },
};

/**
 * progress bar implementation
 */
function ProgressDisplayInner(props: { progress: Progress; animate: boolean }) {
  const { progress, animate } = props;
  if (progress === undefined || progress == null) {
    return <div />;
  }

  return (
    <div className="overlay-progress">
      <div className="progress-block vertical-center">
        {animate ? <SlidingBackground /> : <div />}
        <h1>{progress.title}</h1>
        {/* <p>{progress.info}</p> */}
        <ProgressBar
          className="progress-wrapper"
          completed={progress.progress == null ? 0 : progress.progress * 100}
          transitionDuration="100ms"
          isLabelVisible={false}
          bgColor="var(--main-button-bg-color)"
          borderRadius="0px"
        />
      </div>
      <LogPopout />
    </div>
  );
}

export const ProgressDisplay = React.memo(ProgressDisplayInner);
