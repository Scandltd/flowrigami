import Context from '@app/flow/Context';


enum DIAGRAM_API_ERRORS {
  DIAGRAM_WRONG_IMPORT_FORMAT = 'DIAGRAM_WRONG_IMPORT_FORMAT',
}

export default class DiagramApi {
  public static ERRORS = DIAGRAM_API_ERRORS;

  public clear: () => void;
  public export: () => string;
  public import: (json: string) => void;

  constructor(context: Context) {
    this.clear = () => {
      context.diagram.clear();
    };

    this.export = () => {
      const exportObject = context.diagram.export();

      return JSON.stringify(exportObject, null, 2);
    };

    this.import = (json: string) => {
      const importObject = JSON.parse(json);

      try {
        context.diagram.import(importObject);
      } catch (e) {
        console.error(e);
        throw new Error(DiagramApi.ERRORS.DIAGRAM_WRONG_IMPORT_FORMAT);
      }
    };
  }
}
