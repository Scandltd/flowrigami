import ShapeExportObject from '@app/flow/exportimport/ShapeExportObject';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';


export default interface NodeExportObject extends ShapeExportObject {
  label: string;
  params: CoordinatePoint;
}
