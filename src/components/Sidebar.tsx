import React from "react";

import { Node } from "../Node";
import { setNodes } from "../state";
import { Vector } from "../Vector";
import { getCanvasCentre } from "../canvasHelpers";
import { createLots } from "../nodeHelpers";

const setOneNode = () => {
  const nodesToSet = [new Node(new Vector(400, 400))];
  setNodes(nodesToSet);
};

const binarySystem = () => {
  const mass = 3000;
  const xOffset = 100;
  const centre = getCanvasCentre();
  const upVec = new Vector(0, -7500);
  const downVec = upVec.flipY();
  const left = new Node(centre.addX(-xOffset), mass, upVec);
  const right = new Node(centre.addX(xOffset), mass, downVec);

  const nodesToSet = [left, right];
  setNodes(nodesToSet);
};

const binaryBlackHoles = () => {
  const mass = 1000000;
  const xOffset = 150;
  const centre = getCanvasCentre();
  const upVec = new Vector(0, -50000000);
  const downVec = upVec.flipY();
  const left = new Node(centre.addX(-xOffset), mass, upVec);
  const right = new Node(centre.addX(xOffset), mass, downVec);

  const nodesToSet = [left, right];
  setNodes(nodesToSet);
};

const addLots = () => setNodes((nodes) => [...nodes, ...createLots(100)]);

export function Sidebar() {
  return (
    <div className="sidebar absolute top-0 right-0 p-4 bg-white bg-opacity-75 rounded m-5 flex flex-col items-stretch">
      <h1 className="text-xl mb-2">Presets</h1>
      <button
        className="sidebar-button my-1 p-1 rounded bg-teal-800 text-gray-100"
        onClick={setOneNode}
      >
        Set 1 planet
      </button>
      <button
        className="sidebar-button my-1 p-1 rounded bg-teal-800 text-gray-100"
        onClick={binarySystem}
      >
        Binary system
      </button>
      <button
        className="sidebar-button my-1 p-1 rounded bg-teal-800 text-gray-100"
        onClick={addLots}
      >
        Add lots
      </button>
      <button
        className="sidebar-button my-1 p-1 rounded bg-teal-800 text-gray-100"
        onClick={binaryBlackHoles}
      >
        Orbiting black holes
      </button>
    </div>
  );
}
