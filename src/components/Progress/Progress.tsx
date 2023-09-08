import React from "react";
import ProgressWrapper from "./ProgressWrapper";

type Props = {
  width: number;
  count: number;
};
export default ({ width, count }: Props) => {
  // const getProgressStyle = ({ active }: { active: number }) => {
  //   switch (active) {
  //     case 2:
  //       return { width: "100%" };
  //     case 1:
  //       return { transform: `scaleX(${count})` };
  //     case 0:
  //       return { width: 0 };
  //     default:
  //       return { width: 0 };
  //   }
  // };

  return (
    <ProgressWrapper width={width}>
      <div
        style={{
          ...styles.inner,
          transform: `scaleX(${count / 100})`,
          // ...getProgressStyle({ active }),
        }}
      />
    </ProgressWrapper>
  );
};

const styles: any = {
  inner: {
    background: "#fff",
    height: "100%",
    maxWidth: "100%",
    borderRadius: 2,
    transformOrigin: "center left",

    WebkitBackfaceVisibility: "hidden",
    MozBackfaceVisibility: "hidden",
    msBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden",

    WebkitPerspective: 1000,
    MozPerspective: 1000,
    msPerspective: 1000,
    perspective: 1000,
  },
};
