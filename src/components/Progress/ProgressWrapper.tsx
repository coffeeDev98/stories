import React, { useContext } from "react";
// import GlobalContext from "./../context/Global";

type Props = {
  children: any;
  width: number;
};

const ProgressWrapper = (props: Props) => {
  // const { progressWrapperStyles } = useContext<GlobalCtx>(GlobalContext);

  return (
    <div
      style={{
        ...styles.progress,
        ...getProgressWrapperStyle(props),
      }}
    >
      {props.children}
    </div>
  );
};

const getProgressWrapperStyle = ({ width }: { width: number }) => ({
  width: `${width * 100}%`,
});

const styles = {
  progress: {
    height: 2,
    maxWidth: "100%",
    background: "#555",
    margin: 2,
    borderRadius: 2,
    WebkitBackfaceVisibility: "hidden" as const,
    MozBackfaceVisibility: "hidden" as const,
    msBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden" as const,
  },
};

export default ProgressWrapper;
