import Coordinates from '@app/flow/diagram/bpmn/Coordinates';
import BoundaryInterrupting from '@app/flow/diagram/bpmn/node/events/message/BoundaryInterrupting';
import BoundaryNonInterrupting from '@app/flow/diagram/bpmn/node/events/message/BoundaryNonInterrupting';
import Catching from '@app/flow/diagram/bpmn/node/events/message/Catching';
import End from '@app/flow/diagram/bpmn/node/events/message/End';
import EventSubProcessInterrupting from '@app/flow/diagram/bpmn/node/events/message/EventSubProcessInterrupting';
import EventSubProcessNonInterrupting from '@app/flow/diagram/bpmn/node/events/message/EventSubProcessNonInterrupting';
import Standard from '@app/flow/diagram/bpmn/node/events/message/Standard';
import Throwing from '@app/flow/diagram/bpmn/node/events/message/Throwing';
import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import Indicator, { IndicatorParams } from '@app/flow/diagram/common/Indicator';
import DirectionalLink from '@app/flow/diagram/common/link/DirectionalLink';
import DiagramFactory from '@app/flow/diagram/DiagramFactory';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';


export enum BpmnNodes {
  End = 'End',
  BoundaryInterrupting = 'BoundaryInterrupting',
  BoundaryNonInterrupting = 'BoundaryNonInterrupting',
  EventSubProcessInterrupting = 'EventSubProcessInterrupting',
  EventSubProcessNonInterrupting = 'EventSubProcessNonInterrupting',
  Catching = 'Catching',
  Standard = 'Standard',
  Throwing = 'Throwing',
}

export default class BpmnNodeFactory implements DiagramFactory {
  private canvas: HTMLCanvasElement;
  private htmlLayer: HTMLElement;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement) {
    this.canvas = canvas;
    this.htmlLayer = htmlLayer;
  }

  public getAnchorPoint(point: CoordinatePoint) {
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    return new AnchorPoint(ctx, point)
  }

  public getLink(points: AnchorPoint[]) {
    return new DirectionalLink(this.canvas, this.htmlLayer, points, points.length === 2);
  }

  public getIndicator(params: IndicatorParams) {
    return new Indicator(this.canvas, this.htmlLayer, params);
  }

  public getNode(nodeName: string, nodeParams: any) {
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    const coordinates = new Coordinates(nodeParams.x, nodeParams.y);

    let node = null;

    switch (nodeName) {
      case BpmnNodes.End: {
        node = new End(ctx, coordinates);
        break;
      }
      case BpmnNodes.BoundaryInterrupting: {
        node = new BoundaryInterrupting(ctx, coordinates);
        break;
      }
      case BpmnNodes.BoundaryNonInterrupting: {
        node = new BoundaryNonInterrupting(ctx, coordinates);
        break;
      }
      case BpmnNodes.EventSubProcessInterrupting: {
        node = new EventSubProcessInterrupting(ctx, coordinates);
        break;
      }
      case BpmnNodes.EventSubProcessNonInterrupting: {
        node = new EventSubProcessNonInterrupting(ctx, coordinates);
        break;
      }
      case BpmnNodes.Catching: {
        node = new Catching(ctx, coordinates);
        break;
      }
      case BpmnNodes.Throwing: {
        node = new Throwing(ctx, coordinates);
        break;
      }
      case BpmnNodes.Standard: {
        node = new Standard(ctx, coordinates);
        break;
      }
      default: {
        break;
      }
    }

    return node;
  }
}
