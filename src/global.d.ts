declare global {
  interface Window {
    loadPage: (page: string) => Promise<void>;
  }
}

export {};
