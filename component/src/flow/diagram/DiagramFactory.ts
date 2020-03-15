import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import Indicator, { IndicatorParams } from '@app/flow/diagram/common/Indicator';
import Link from '@app/flow/diagram/Link';
import Node from '@app/flow/diagram/Node';


export default interface DiagramFactory {
  getLink(points: AnchorPoint[]): Link;

  getIndicator(params: IndicatorParams): Indicator;

  getNode(nodeName: string, nodeParams: any): Node | any;
}
