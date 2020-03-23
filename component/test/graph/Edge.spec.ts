import Edge from '@app/graph/Edge';
import Vertex from '@app/graph/Vertex';
import { expect } from 'chai';


describe(`Graph: ${Edge.name}`, () => {
  let vertex1: Vertex;
  let vertex2: Vertex;
  let edge: Edge;

  beforeEach(() => {
    vertex1 = new Vertex();
    vertex2 = new Vertex();
    edge = new Edge(vertex1, vertex2);
  });

  it('should contain only connected vertices', () => {
    expect(edge.vertices).to.have.length(2);
    expect(edge.hasVertex(vertex1)).to.be.true;
    expect(edge.hasVertex(vertex2)).to.be.true;
    expect(edge.hasVertex(new Vertex())).to.be.false;
  });
});
