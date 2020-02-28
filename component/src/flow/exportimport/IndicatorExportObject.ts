import { IndicatorParams } from '@app/flow/diagram/Indicator';
import ShapeExportObject from '@app/flow/exportimport/ShapeExportObject';


export default interface IndicatorExportObject extends ShapeExportObject {
  label: string;
  params: IndicatorParams;
}
