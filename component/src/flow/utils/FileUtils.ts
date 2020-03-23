const FILE_TYPE_JSON = 'application/json';


export default class FileUtils {
  public static downloadJson = (fileName: string, object: object) => {
    const a = document.createElement('a');
    a.onclick = () => {
      FileUtils.handleClickDownloadJson(a, fileName, object);
    };
    a.click();
  };


  public static handleClickDownloadJson = (a: HTMLAnchorElement, fileName: string, object: object) => {
    const blob = new Blob([JSON.stringify(object, null, 2)], { type: FILE_TYPE_JSON });
    const dataUrl = URL.createObjectURL(blob);

    return FileUtils.handleClickDownload(a, fileName, dataUrl);
  };

  public static handleClickDownload = (a: HTMLAnchorElement, fileName: string, dataUrl: string) => {
    a.download = fileName;
    a.href = dataUrl;

    setTimeout(() => {
      URL.revokeObjectURL(a.href);
    }, 0);
  };
}
