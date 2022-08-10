interface SystemInfo {
  chrome: string;
  node: string;
  electron: string;
  app: string;
}

const getSystemInfo = async (
  callback?: (arg0: SystemInfo) => void
): Promise<SystemInfo> => {
  return new Promise((resolve, reject) => {
    globalThis.api.systemInfo.receive("getSystemInfo", async (data) => {
      const { chrome, node, electron, app } = await data;
      if (callback) {
        callback({ chrome, node, electron, app });
      }
      resolve({ chrome, node, electron, app });
    });
  });
};

const requestSystemInfo = async (
  callback?: (arg0: SystemInfo) => void
): Promise<SystemInfo> => {
  globalThis.api.systemInfo.send("requestSystemInfo", null);
  return getSystemInfo(callback);
};

const systemInfo = {
  requestSystemInfo,

  on: {
    getSystemInfo,
  },
};

export default systemInfo;
