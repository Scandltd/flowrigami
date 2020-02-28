import AnchorPoint from '@app/flow/diagram/AnchorPoint';
import DiagramFactory from '@app/flow/diagram/DiagramFactory';
import Indicator, { IndicatorParams } from '@app/flow/diagram/Indicator';
import DirectionalLink from '@app/flow/diagram/uml/link/DirectionalLink';
import ActivityNode from '@app/flow/diagram/uml/node/ActivityNode';
import DecisionNode from '@app/flow/diagram/uml/node/DecisionNode';
import EndNode from '@app/flow/diagram/uml/node/EndNode';
import HorizontalForkJoinNode from '@app/flow/diagram/uml/node/HorizontalForkJoinNode';
import StartNode from '@app/flow/diagram/uml/node/StartNode';
import TextNode from '@app/flow/diagram/uml/node/TextNode';
import VerticalForkJoinNode from '@app/flow/diagram/uml/node/VerticalForkJoinNode';


export enum UmlNodes {
  ActivityNode = 'ActivityNode',
  DecisionNode = 'DecisionNode',
  EndNode = 'EndNode',
  HorizontalForkJoinNode = 'HorizontalForkJoinNode',
  StartNode = 'StartNode',
  TextNode = 'TextNode',
  VerticalForkJoinNode = 'VerticalForkJoinNode',
}

export default class UmlDiagramFactory implements DiagramFactory {
  private canvas: HTMLCanvasElement;
  private htmlLayer: HTMLElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement) {
    this.canvas = canvas;
    this.htmlLayer = htmlLayer;

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  public getLink(points: AnchorPoint[]) {
    return new DirectionalLink(this.ctx, points, points.length === 2);
  }

  public getIndicator(params: IndicatorParams) {
    return new Indicator(this.canvas, this.htmlLayer, params);
  }

  public getNode(nodeType: string, nodeParams: any) {
    const coordinates = { x: nodeParams.x, y: nodeParams.y };

    let node = null;

    switch (nodeType) {
      case UmlNodes.ActivityNode: {
        node = new ActivityNode(this.canvas, this.htmlLayer, nodeParams);
        break;
      }
      case UmlNodes.DecisionNode: {
        node = new DecisionNode(this.canvas, this.htmlLayer, coordinates);
        break;
      }
      case UmlNodes.EndNode: {
        node = new EndNode(this.canvas, this.htmlLayer, coordinates);
        break;
      }
      case UmlNodes.HorizontalForkJoinNode: {
        node = new HorizontalForkJoinNode(this.canvas, this.htmlLayer, coordinates);
        break;
      }
      case UmlNodes.StartNode: {
        node = new StartNode(this.canvas, this.htmlLayer, coordinates);
        break;
      }
      case UmlNodes.TextNode: {
        const textParams = { placeholder: 'Text', text: '', ...coordinates};
        node = new TextNode(this.canvas, this.htmlLayer, textParams);
        break;
      }
      case UmlNodes.VerticalForkJoinNode: {
        node = new VerticalForkJoinNode(this.canvas, this.htmlLayer, coordinates);
        break;
      }
      default: {
        break;
      }
    }

    return node;
  }
}
