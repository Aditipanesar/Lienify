
import React from 'react'
import { RotatingLines } from 'react-loader-spinner'

function Loader() {
  return (
    <div style={{
      display: "flex", justifyContent: "center",
      alignItems: "center", width: "100%", height: "420px",
    }}>
      <RotatingLines
        visible={true}
        height="56"
        width="56"
        strokeColor="#8b5cf6"
        strokeWidth="4"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
}

export default Loader;
