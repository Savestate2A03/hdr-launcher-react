export function FullScreenDiv(props: {
  children: JSX.Element[] | JSX.Element;
}) {
  const { children } = props;
  return <div className="overlay-progress scroll-hidden">{children}</div>;
}
