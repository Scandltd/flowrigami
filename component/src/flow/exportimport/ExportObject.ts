import IndicatorExportObject from '@app/flow/exportimport/IndicatorExportObject';
import LinkExportObject from '@app/flow/exportimport/LinkExportObject';
import NodeExportObject from '@app/flow/exportimport/NodeExportObject';


export default interface ExportObject {
  version: string;
  diagram: string;

  indicators: IndicatorExportObject[];
  links: LinkExportObject[];
  nodes: NodeExportObject[];
}
