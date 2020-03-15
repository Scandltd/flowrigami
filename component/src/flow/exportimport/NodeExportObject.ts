import ShapeExportObject from '@app/flow/exportimport/ShapeExportObject';


export default interface NodeExportObject extends ShapeExportObject {
  params: {
    label: string;
    x: number;
    y: number;
  };
}
