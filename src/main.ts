import { Vector } from "./Vector";
import { Node } from "./Node";
import { drawCircle, drawMomentumArrow } from "./drawing";
import { allCombinations, randBetween, range } from "./helpers";
import { getAttraction } from "./gravityForce";
import { sizeCanvasToWindow, canvas, ctx } from "./canvasHelpers";
import {
  state,
  initialiseNodes,
  mouseDownHandler,
  mouseUpHandler
} from "./state";

sizeCanvasToWindow();

window.onresize = sizeCanvasToWindow;

canvas.addEventListener("mousedown", e => {
  state.mouseState.location = new Vector(e.clientX, e.clientY);
  state.mouseState.isDown = true;

  state.mouseState.determiningMass = true;
  state.mouseState.newNode = new Node(
    state.mouseState.location,
    2,
    Vector.origin.add(new Vector(0.01, 0.01))
  );
});

canvas.addEventListener("mousemove", mouseDownHandler);

canvas.addEventListener("mouseup", mouseUpHandler);

function onFrame(counter: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  allCombinations(state.nodes, (a, b) => {
    const forces = getAttraction(a, b);

    a.accelerate(forces.a);
    b.accelerate(forces.b);
  });

  const combinedNodes = state.nodes.reduce(
    (combinedNodes: Node[], node: Node) => {
      const closeNodes = combinedNodes.filter(
        (thisNode: Node) =>
          node.position.to(thisNode.position).length <
          (node.radius + thisNode.radius) / 2
      );

      if (closeNodes.length < 1) {
        return [...combinedNodes, node];
      } else {
        const combinedNode = [...closeNodes, node].reduce(
          (combinedNode, closeNode) => {
            const totalMass = combinedNode.mass + closeNode.mass;
            const centerOfMass = combinedNode.position
              .multiply(combinedNode.mass)
              .add(closeNode.position.multiply(closeNode.mass))
              .divide(totalMass);

            const newNode = new Node(centerOfMass, totalMass);
            newNode.acceleration = combinedNode.acceleration.add(
              closeNode.acceleration
            );

            return newNode;
          }
        );

        const withoutCombined = combinedNodes.filter(
          thisNode => !closeNodes.includes(thisNode)
        );

        return [...withoutCombined, combinedNode];
      }
    },
    []
  );

  const { newNode, location } = state.mouseState;
  if (newNode) {
    drawMomentumArrow(ctx, newNode, location);
    drawCircle(ctx, newNode);
  }

  state.nodes = combinedNodes;

  state.nodes.forEach(node => {
    drawCircle(ctx, node);
    // drawLineFromCenterToNode(ctx, node);

    node.momentumMove();
  });

  if (state.mouseState.isDown && newNode) {
    if (state.mouseState.determiningMass) {
      newNode.mass *= 1.05;
    } else {
      const oppositeVector = newNode.position
        .to(state.mouseState.location)
        .multiply(-1)
        .multiply(newNode.mass / 30);

      newNode.acceleration = oppositeVector;
    }
  }

  requestAnimationFrame(() => onFrame(counter + 1));
}

// Start it off
initialiseNodes();
onFrame(0);
