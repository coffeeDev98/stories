import React, { FC } from "react";
import styled from "styled-components";
const RippleLoaderWrapper = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  div {
    position: absolute;
    border-width: 4px;
    border-style: solid;
    border-radius: 50%;
    animation: ripple-loader 1s ease-out infinite;
    &:nth-child(2) {
      animation-delay: -0.5s;
    }
  }
  @keyframes ripple-loader {
    0% {
      top: 32px;
      left: 32px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: 0;
      left: 0;
      width: 64px;
      height: 64px;
      opacity: 0;
    }
  }
`;
export const RippleLoader: FC<{ color?: string }> = ({ color }) => {
  return (
    <RippleLoaderWrapper>
      <div style={{ borderColor: color ? color : "#ccc" }} />
      <div></div>
    </RippleLoaderWrapper>
  );
};
