import { head, goToUp, h1, li } from "./directoryListeningHelper/elements";

// For generating a directory listing page for a folder

export const generateDirectoryListing = async (
  dirHandle: FileSystemDirectoryHandle,
  relativeUrl: string
) => {
  // Display folder with / at end
  if (relativeUrl && !relativeUrl.endsWith("/")) relativeUrl += "/";
  const countDir = (relativeUrl.match(/\//g) || []).length;
  const wwwPosition = "../" + Array(countDir).fill("../", 0).join("");
  console.log(wwwPosition);
  let str = `
<!DOCTYPE html>
<html style="background-color:#FAFAFA;">
${head(relativeUrl, wwwPosition)}

<body>
  <main>
  ${h1(relativeUrl)}
  
  <div class="list">
  ${goToUp(relativeUrl)}
  ${await li(dirHandle)}
  </div>
  </main>
</body>

</html>`;

  return new Blob([str], { type: "text/html" });
};
