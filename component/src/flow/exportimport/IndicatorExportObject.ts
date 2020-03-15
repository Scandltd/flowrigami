import { IndicatorParams } from '@app/flow/diagram/common/Indicator';
import ShapeExportObject from '@app/flow/exportimport/ShapeExportObject';


export default interface IndicatorExportObject extends ShapeExportObject {
  label: string;
  params: IndicatorParams;
}
