import { useState } from "react";

const useChartLegend = (firstDataKey, secondDataKey) => {
  const [strokeSize, setStrokeSize] = useState({
    [firstDataKey]: 1,
    [secondDataKey]: 1,
  });

  const handleMouseEnter = (o) => {
    const { dataKey } = o;

    setStrokeSize({ ...strokeSize, [dataKey]: 5 });
  };

  const handleMouseLeave = (o) => {
    const { dataKey } = o;

    setStrokeSize({ ...strokeSize, [dataKey]: 3 });
  };

  return { strokeSize, handleMouseEnter, handleMouseLeave };
};

export default useChartLegend;
