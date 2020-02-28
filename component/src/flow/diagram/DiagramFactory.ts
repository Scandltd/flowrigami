import AnchorPoint from '@app/flow/diagram/AnchorPoint';
import Indicator, { IndicatorParams } from '@app/flow/diagram/Indicator';
import Link from '@app/flow/diagram/Link';
import NodeShape from '@app/flow/diagram/NodeShape';


export default interface DiagramFactory {
  getLink(points: AnchorPoint[]): Link;

  getIndicator(params: IndicatorParams): Indicator;

  getNode(nodeType: string, nodeParams: any): NodeShape | any;
}
