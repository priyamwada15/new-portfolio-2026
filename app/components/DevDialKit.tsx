"use client";

import { DialRoot } from "dialkit";
import "dialkit/styles.css";

export default function DevDialKit() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <DialRoot
      position="bottom-left"
      defaultOpen
      theme="light"
      productionEnabled
    />
  );
}
