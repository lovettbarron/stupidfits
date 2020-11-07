import React, { useEffect, useState } from "react";

const FitStats = (props) => {
  return (
    <div className="stats">
      {props.weather && <div className="weather">{props.weather}</div>}
      <style jsx>{`
        .stats {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }

        .weather {
        }
      `}</style>
    </div>
  );
};
export default FitStats;
