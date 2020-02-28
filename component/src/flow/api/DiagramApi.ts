import Diagram from '@app/flow/diagram/Diagram';


enum DIAGRAM_API_ERRORS {
  DIAGRAM_WRONG_IMPORT_FORMAT = 'DIAGRAM_WRONG_IMPORT_FORMAT',
}

export default class DiagramApi {
  public static ERRORS = DIAGRAM_API_ERRORS;

  public clear: () => void;
  public export: () => string;
  public import: (json: string) => void;

  constructor(diagram: Diagram) {
    this.clear = () => {
      diagram.clear();
    };

    this.export = () => {
      const exportObject = diagram.export();

      return JSON.stringify(exportObject, null, 2);
    };

    this.import = (json: string) => {
      const importObject = JSON.parse(json);

      try {
        diagram.import(importObject);
      } catch (e) {
        console.log(e);
        throw new Error(DiagramApi.ERRORS.DIAGRAM_WRONG_IMPORT_FORMAT);
      }
    };
  }
}
