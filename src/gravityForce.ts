import { Vector } from "./Vector";
import { Node } from "./Node";

export const G = 1; // gravitational constant

interface AttractionForces {
  a: Vector;
  b: Vector;
}

export function getAttraction(a: Node, b: Node): AttractionForces {
  const aToBDirection = a.position.to(b.position).unit;
  const bToADirection = b.position.to(a.position).unit;

  const distance = Math.max(a.position.to(b.position).length, 3);
  const force = (G * a.mass * b.mass) / distance ** 2;

  return {
    a: aToBDirection.multiply(force),
    b: bToADirection.multiply(force),
  };
}
