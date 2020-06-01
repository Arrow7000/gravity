import React, { FC } from "react";

import {
  makeBinarySystem,
  makeOneNode,
  makeBinaryBlackHoles,
  addLots,
} from "../userActions";

const SectionHeader: FC = ({ children }) => (
  <h1 className="text-xl mb-2 mt-2">{children}</h1>
);

const Button: FC<{ label: string; onPress: VoidFunction }> = ({
  label,
  onPress,
}) => (
  <button
    className="sidebar-button my-1 p-1 rounded bg-teal-800 text-gray-100"
    onClick={onPress}
  >
    {label}
  </button>
);

export function Sidebar() {
  return (
    <div className="sidebar absolute top-0 right-0 p-4 pt-0 bg-white bg-opacity-75 rounded m-5 flex flex-col items-stretch">
      <SectionHeader>Presets</SectionHeader>
      <Button label="One body" onPress={makeOneNode} />
      <Button label="Binary system" onPress={makeBinarySystem} />
      <Button label="Binary black holes" onPress={makeBinaryBlackHoles} />
      <SectionHeader>Add</SectionHeader>
      <Button label="Many small bodies" onPress={addLots} />
    </div>
  );
}
