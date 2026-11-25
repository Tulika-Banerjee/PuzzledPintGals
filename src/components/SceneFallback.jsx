import React, { Component } from 'react';

let webGLSupported;

function supportsWebGL() {
  if (webGLSupported !== undefined) return webGLSupported;
  try {
    const context = document.createElement('canvas').getContext('webgl2');
    webGLSupported = Boolean(context);
    context?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webGLSupported = false;
  }
  return webGLSupported;
}

export default class SceneFallback extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed || !supportsWebGL()) return this.props.fallback;
    return this.props.children;
  }
}
