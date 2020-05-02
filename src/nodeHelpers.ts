import { range, randBetween } from "./helpers";
import { makeRandomVector } from "./canvasHelpers";
import { Vector } from "./Vector";
import { Node } from "./Node";

export function createLots(n: number) {
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
