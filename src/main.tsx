import React from "react";
import { render } from "react-dom";

import { drawCircle, drawMomentumArrow } from "./drawing";
import { allCombinations } from "./helpers";
import { getAttraction } from "./gravityForce";
import { sizeCanvasToWindow, canvas, ctx } from "./canvasHelpers";
import {
  state,
  initialiseNodes,
  mouseMoveHandler,
  mouseUpHandler,
  mouseDownHandler,
  setNodes
} from "./state";
import { setCrashedNodes } from "./stateActions";
import { Sidebar } from "./components/App";

window.onresize = sizeCanvasToWindow;
canvas.addEventListener("mousedown", mouseDownHandler);
canvas.addEventListener("mousemove", mouseMoveHandler);
canvas.addEventListener("mouseup", mouseUpHandler);

function onFrame(counter: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  allCombinations(state.nodes, (a, b) => {
    const forces = getAttraction(a, b);

    a.accelerate(forces.a);
    b.accelerate(forces.b);
  });

  const { newNode, location } = state.mouseState;
  if (newNode) {
    drawMomentumArrow(ctx, newNode, location);
    drawCircle(ctx, newNode);
  }

  setNodes(setCrashedNodes(state));

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
sizeCanvasToWindow();
initialiseNodes();
onFrame(0);

// This needs to be in the same file because if different scripts are referenced from HTML `state` gets copied into two files and are treated as separate objects 🙄
const root = document.getElementById("sidebar-root");
render(<Sidebar />, root);
