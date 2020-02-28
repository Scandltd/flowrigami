import Edge from '@app/_redesign/graph/Edge';
import Vertex from '@app/_redesign/graph/Vertex';
import { expect } from 'chai';


describe(`Graph: ${Vertex.name}`, () => {
  let vertex: Vertex;

  beforeEach(() => {
    vertex = new Vertex();
  });

  it('should add edge', () => {
    const vertex2 = new Vertex();
    const edge = new Edge(vertex, vertex2);
    vertex.addEdge(edge);

    expect(vertex.edges).to.contain(edge);
  });

  it('should remove edge', () => {
    const vertex2 = new Vertex();
    const edge = new Edge(vertex, vertex2);
    vertex.addEdge(edge);

    expect(vertex.edges).to.contain(edge);

    vertex.removeEdge(edge);

    expect(vertex.edges).not.contain(edge);
  });

  it('should remove edge connected to given vertex', () => {
    const vertex2 = new Vertex();
    const edge = new Edge(vertex, vertex2);
    vertex.addEdge(edge);

    expect(vertex.edges).to.contain(edge);

    vertex.removeEdgeTo(vertex2);

    expect(vertex.edges).not.contain(edge);
  });
});
