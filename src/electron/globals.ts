interface Globals {
  mainURL: string;
  preloadjs: string;
  browserViewBounds: BrowserViewBounds;
}

interface BrowserViewBounds {
  x: number;
  y: number;
  widthDelta: number;
  heightDelta: number;
}

const globals: Globals = {
  mainURL: "index.html",
  preloadjs: "preload.js",
  browserViewBounds: {
    x: 65,
    y: 33,
    widthDelta: 66,
    heightDelta: 58,
  },
};

const get = {
  mainUrl: (): string => globals.mainURL,
  preloadjs: (): string => globals.preloadjs,
  browserViewBounds: (): BrowserViewBounds => globals.browserViewBounds,
};

const set = {
  mainURL: (v: string): string => {
    globals.mainURL = v;
    return v;
  },
  preloadjs: (v: string): string => {
    globals.preloadjs = v;
    return v;
  },
  browserViewBounds: (bounds: BrowserViewBounds): BrowserViewBounds => {
    globals.browserViewBounds = { ...bounds };
    return { ...bounds };
  },
};

export { get, set };
