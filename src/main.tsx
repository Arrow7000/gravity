import React from "react";
import { render } from "react-dom";

import {
  drawCircle,
  drawMomentumArrow,
  drawLineFromCenterToNode,
  drawAccelLine,
} from "./drawing";
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
import { initialiseNodes, getCombinedNodes } from "./stateActions";
import { Sidebar } from "./components/Sidebar";

window.onresize = sizeCanvasToWindow;
canvas.addEventListener("mousedown", mouseDownHandler);
canvas.addEventListener("mousemove", mouseMoveHandler);
canvas.addEventListener("mouseup", mouseUpHandler);

function onFrame() {
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

  setNodes(getCombinedNodes(state.nodes));

  state.nodes.forEach((node) => {
    drawCircle(ctx, node);
    // drawLineFromCenterToNode(ctx, node);
    // drawAccelLine(ctx, node);
    node.momentumMove();
  });

  onFrameHandler();

  requestAnimationFrame(onFrame);
}

// Start it off
sizeCanvasToWindow();
initialiseNodes();
onFrame();

// This needs to be in the same file because if different scripts are referenced from HTML `state` gets copied into two files and are treated as separate objects 🙄
const root = document.getElementById("sidebar-root");
render(<Sidebar />, root);
