import { range, randBetween } from "./helpers";
import { makeRandomVector } from "./canvasHelpers";
import { Vector } from "./Vector";
import { Node } from "./Node";
import { G } from "./gravityForce";

export function createLotsOfNodes(n: number) {
  return range(
    n,
    () =>
      new Node(
        makeRandomVector(),
        2,
        new Vector(randBetween(-2, 2), randBetween(-2, 2))
      )
  );
}

// add functions for creating orbiting nodes

export const getCircularOrbitVelocity = (nodeA: Node, nodeB: Node) => {
  const distance = nodeA.position.to(nodeB.position).length;

  return Math.sqrt((G * (nodeA.mass + nodeB.mass)) / distance);
};
