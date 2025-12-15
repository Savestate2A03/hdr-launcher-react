import { Remark } from 'react-remark';
import { PopupData } from '../operations/popup_data';
import { FocusButton } from './buttons/focus_button';

export function Popup(props: { data: PopupData }) {
  const { data } = props;
  return (
    <div className="overlay-progress">
      <div className="progress-block vertical-center">
        <Remark>{data.text}</Remark>
        {data.options.map((option, index) => {
          return (
            <FocusButton
              key={data.id}
              autofocus={index === 0}
              className="simple-button inline popup-button"
              onClick={() => data.onSelect(option)}
              text={option}
            />
          );
        })}
      </div>
    </div>
  );
}
