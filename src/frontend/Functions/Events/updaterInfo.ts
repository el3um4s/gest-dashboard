interface VersionNumber {
  version: string;
}

const getVersionNumber = async (
  callback?: (arg0: VersionNumber) => void
): Promise<VersionNumber> => {
  return new Promise((resolve, reject) => {
    globalThis.api.updaterInfo.receive("getVersionNumber", async (data) => {
      const { version } = await data;
      if (callback) {
        callback({ version });
      }
      resolve({ version });
    });
  });
};

const requestVersionNumber = async (
  callback?: (arg0: VersionNumber) => void
): Promise<VersionNumber> => {
  globalThis.api.updaterInfo.send("requestVersionNumber", null);
  return getVersionNumber(callback);
};

const updaterInfo = {
  requestVersionNumber,
  on: {
    getVersionNumber,
  },
};

export default updaterInfo;
