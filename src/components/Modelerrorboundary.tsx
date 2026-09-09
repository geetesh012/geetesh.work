import { Component, type ReactNode } from 'react';

interface Props {
  fallback: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// React error boundaries must be class components — there's no hook
// equivalent. Catches failures from the 3D canvas subtree (e.g. the .glb
// failing to fetch or parse) and renders `fallback` instead of crashing
// the section it's embedded in.
export default class ModelErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('3D model failed to load, using fallback:', error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}