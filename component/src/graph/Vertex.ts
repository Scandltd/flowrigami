import Edge from '@app/graph/Edge';
import nanoid from 'nanoid';


export default class Vertex {
  id: string;
  edges: Edge[] = [];

  constructor() {
    this.id = nanoid();
  }

  public addEdge(edge: Edge) {
    this.edges = [...this.edges, edge];
  };

  public removeEdge(edge: Edge) {
    this.edges = this.edges.filter((it) => it.id !== edge.id);
  }

  public removeEdgeTo(vertex: Vertex) {
    this.edges = this.edges.filter((it) => !it.hasVertex(vertex));
  }
}
