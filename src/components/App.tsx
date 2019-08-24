import React from "react";

import { Node } from "../Node";
import { setNodes } from "../state";
import { Vector } from "../Vector";
import { getCanvasCentre } from "../canvasHelpers";

const setOneNode = () => {
  const nodesToSet = [new Node(new Vector(400, 400))];
  setNodes(nodesToSet);
};

const binarySystem = () => {
  const centre = getCanvasCentre();
  const upVec = new Vector(0, -7500);
  const downVec = upVec.flipY();
  const left = new Node(centre.addX(-100), 3000, upVec);
  const right = new Node(centre.addX(100), 3000, downVec);

  const nodesToSet = [left, right];
  setNodes(nodesToSet);
};

export function Sidebar() {
  return (
    <div className="sidebar">
      <button onClick={setOneNode}>Set 1 planet</button>
      <button onClick={binarySystem}>Binary system</button>
    </div>
  );
}
