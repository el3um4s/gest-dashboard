interface SystemInfo {
  chrome: string;
  node: string;
  electron: string;
}

const getSystemInfo = async (
  callback?: (arg0: SystemInfo) => void
): Promise<SystemInfo> => {
  return new Promise((resolve, reject) => {
    globalThis.api.systemInfo.receive("getSystemInfo", async (data) => {
      const { chrome, node, electron } = await data;
      if (callback) {
        callback({ chrome, node, electron });
      }
      resolve({ chrome, node, electron });
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
