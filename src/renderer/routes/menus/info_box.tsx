import '../../styles/infobox.css';

export default function InfoBox(props: { text: string }) {
  const { text } = props;
  return (
    <div className="info-container">
      <div className="visible-box">
        <div>{text}</div>
      </div>
    </div>
  );
}
