import { Component, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  shouldHandleError: boolean;
}

class ScrollErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { shouldHandleError: false };
  }
  static getDerivedStateFromError() {
    return { shouldHandleError: true };
  }

  render() {
    return this.props.children ?? null;
  }
}
