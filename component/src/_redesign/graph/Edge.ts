import Vertex from '@app/_redesign/graph/Vertex';
import nanoid from 'nanoid';


export default class Edge {
  id: string;
  vertices: Vertex[];

  constructor(vertex1: Vertex, vertex2: Vertex) {
    this.id = nanoid();
    this.vertices = [vertex1, vertex2];
  }

  public hasVertex(vertex: Vertex) {
    return this.vertices.includes(vertex);
  }
}
