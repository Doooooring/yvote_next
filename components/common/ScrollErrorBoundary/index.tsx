interface Props {}

interface State {
  shouldHandleError: boolean;
}

class ScrollErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { shouldHandleError: false };
  }
  static getDerivedStateFromError(error: Error){}
}
