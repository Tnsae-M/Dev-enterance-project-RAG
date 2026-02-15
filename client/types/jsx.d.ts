declare global {
  namespace JSX {
    interface IntrinsicElements {
      [tag: string]: any;
    }
  }
}

export {};
