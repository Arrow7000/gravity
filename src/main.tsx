import React from "react";
import { render } from "react-dom";

import { drawCircle, drawMomentumArrow } from "./drawing";
import { allCombinations } from "./helpers";
import { getAttraction } from "./gravityForce";
import { sizeCanvasToWindow, canvas, ctx } from "./canvasHelpers";
import {
  state,
  mouseMoveHandler,
  mouseUpHandler,
  mouseDownHandler,
  setNodes,
  onFrameHandler,
} from "./state";
import { initialiseNodes, setCrashedNodes } from "./stateActions";
import { Sidebar } from "./components/Sidebar";

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

  state.nodes.forEach((node) => {
    drawCircle(ctx, node);
    // drawLineFromCenterToNode(ctx, node);
    node.momentumMove();
  });

  onFrameHandler();

  requestAnimationFrame(() => onFrame(counter + 1));
}

// Start it off
sizeCanvasToWindow();
initialiseNodes();
onFrame(0);

// This needs to be in the same file because if different scripts are referenced from HTML `state` gets copied into two files and are treated as separate objects 🙄
const root = document.getElementById("sidebar-root");
render(<Sidebar />, root);
