import AnchorPoint from '@app/flow/diagram/AnchorPoint';
import DiagramFactory from '@app/flow/diagram/DiagramFactory';
import Indicator from '@app/flow/diagram/Indicator';
import Link from '@app/flow/diagram/Link';
import Node from '@app/flow/diagram/Node';
import ExportObject from '@app/flow/exportimport/ExportObject';
import LinkExportObject from '@app/flow/exportimport/LinkExportObject';
import Coordinates from '@app/flow/graphics/canvas/Coordinates';
import ACTION from '@app/flow/store/ActionTypes';
import Store from '@app/flow/store/Store';


export default abstract class Diagram {
  public abstract name: string;
  public abstract nodes: string[];

  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public abstract get nodeFactory(): DiagramFactory;

  public abstract createNodeFactory(canvas: HTMLCanvasElement, htmlLayer: HTMLElement): DiagramFactory;

  public clear() {
    this.store.dispatch(ACTION.CLEAR_DIAGRAM);
  }

  public export(): ExportObject {
    return {
      version: '1.0',
      diagram: this.name,

      indicators: this.prepareIndicators(this.store.indicators),
      links: this.prepareLinks(this.store.connectorList, this.store.nodeList),
      nodes: this.prepareNodes(this.store.nodeList),
    };
  };

  protected prepareIndicators(indicator: Indicator[]) {
    return indicator.map((it: Indicator) => it.export());
  }

  protected prepareLinks(links: Link[], nodes: Node[]): LinkExportObject[] {
    return links.map((link) => {
      let linePoints;
      if (link.isOrthogonal) {
        linePoints = [link.points[0], link.points[link.points.length - 1]];
      } else {
        linePoints = link.points;
      }

      const fromPoint = linePoints[0];
      const fromCoordinates = { x: fromPoint.x, y: fromPoint.y };

      const toPoint = linePoints[linePoints.length - 1];
      const toCoordinates = { x: toPoint.x, y: toPoint.y };

      const from = nodes.find((node) => node.getConnectionPoint(fromCoordinates))!.id;
      const to = nodes.find((node) => node.getConnectionPoint(toCoordinates))!.id;

      return {
        from,
        to,
        points: linePoints.map((point) => ({ x: point.x, y: point.y }))
      };
    });
  }

  protected prepareNodes(nodes: Node[]) {
    return nodes.map((node: Node) => node.export());
  }

  public import(object: ExportObject) {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const indicators: Indicator[] = [];
    const links: Link[] = [];
    const nodes: Node[] = [];

    object.indicators.forEach((it) => {
      const indicator = this.nodeFactory.getIndicator(it.params);
      indicator.import(it);

      indicators.push(indicator);
    });

    object.nodes.forEach((it) => {
      const nodeType = it.name;
      const node = this.nodeFactory.getNode(nodeType, it.params);

      if (node) {
        node.import(it);
        nodes.push(node);
      }
    });

    object.links.forEach((it) => {
      const points = it.points.map(({ x, y }, i) => {
        const coordinates = new Coordinates(x, y);

        let connectionPoint;
        if (i === 0) {
          const from = nodes.find((node) => node.id === it.from);
          connectionPoint = from!.getConnectionPoint(coordinates);
        }
        if (i === it.points.length - 1) {
          const to = nodes.find((node) => node.id === it.to);
          connectionPoint = to!.getConnectionPoint(coordinates);
        }

        return connectionPoint || new AnchorPoint(ctx, { x: coordinates.x, y: coordinates.y });
      });

      const link = this.nodeFactory.getLink(points);
      links.push(link);
    });

    this.store.dispatch(ACTION.IMPORT, {
      indicators,
      links,
      nodes,
    });
  };
}
