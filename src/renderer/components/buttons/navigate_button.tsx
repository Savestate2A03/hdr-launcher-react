import { useNavigate } from 'react-router-dom';
import { Pages } from 'renderer/constants';
import { FocusButton } from './focus_button';

export function NavigateButton(props: {
  text: string;
  page: Pages;
  className: string;
  onFocus?: () => void;
}) {
  const navigate = useNavigate();
  const { text, className, onFocus, page } = props;
  return (
    <FocusButton
      text={`${text}\u00A0`}
      className={className}
      onClick={() => {
        navigate(page);
      }}
      onFocus={onFocus}
    />
  );
}
