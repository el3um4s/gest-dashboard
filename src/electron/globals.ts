interface Globals {
  mainURL: string;
  preloadjs: string;
}

const globals: Globals = {
  mainURL: "index.html",
  preloadjs: "preload.js",
};

const get = {
  mainUrl: () => globals.mainURL,
  preloadjs: () => globals.preloadjs,
};

const set = {
  mainURL: (v: string) => {
    globals.mainURL = v;
    return v;
  },
  preloadjs: (v: string) => {
    globals.preloadjs = v;
    return v;
  },
};

export { get, set };
