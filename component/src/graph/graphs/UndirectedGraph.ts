import Edge from '@app/graph/Edge';
import Graph from '@app/graph/Graph';
import Vertex from '@app/graph/Vertex';


export default class UndirectedGraph implements Graph {
  edges: Edge[] = [];
  vertices: Vertex[] = [];

  public addVertex(vertex: Vertex) {
    if (this.vertices.includes(vertex)) {
      throw new Error(`Failed to add vertex ${vertex.id}: it already exists in the graph`);
    }

    this.vertices = [...this.vertices, vertex];
  };

  public removeVertex(vertex: Vertex) {
    if (!this.vertices.includes(vertex)) {
      throw new Error(`Failed to remove vertex ${vertex.id}: it does not exist in the graph`);
    }

    this.vertices.forEach((it) => it.removeEdgeTo(vertex));

    this.edges = this.edges.filter((it) => !it.hasVertex(vertex));
    this.vertices = this.vertices.filter((it) => it.id !== vertex.id);
  }

  public addEdge(edge: Edge) {
    if (this.edges.includes(edge)) {
      throw new Error(`Failed to add edge ${edge.id}: it already exists in the graph`);
    }

    const [vertex1, vertex2] = edge.vertices;
    if (!this.vertices.includes(vertex1) || !this.vertices.includes(vertex2)) {
      throw new Error(`Failed to add edge ${edge.id}: edge's vertices do not exist in the graph`);
    }

    vertex1.addEdge(edge);
    vertex2.addEdge(edge);

    this.edges = [...this.edges, edge];
  }

  public removeEdge(edge: Edge) {
    if (!this.edges.includes(edge)) {
      throw new Error(`Failed to remove edge ${edge.id}: it does not exist in the graph`);
    }

    const [vertex1, vertex2] = edge.vertices;
    vertex1.removeEdge(edge);
    vertex2.removeEdge(edge);

    this.edges = this.edges.filter((it) => it.id !== edge.id);
  }
}
