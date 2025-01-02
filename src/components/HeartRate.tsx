import { COLORS } from "../config";

type Props = {
  heartRate: number;
};

export const HeartRate = ({ heartRate }: Props) => {
  console.log({ heartRate });

  const width = 800;
  const height = 400;
  return (
    <svg
      viewBox={`0 0 ${width / 2} ${height / 2}`}
      xmlns="http://www.w3.org/2000/svg"
      fill={COLORS.BG}
    >
      <path
      d="
        M 100 200 
        V 50 
        H 200 
        A 50,50 90 0,1 200,150 
        A 50,50 90 0,1 100,150 
        Z"
      fill="red"
      transform="rotate(225,150,121)"
    />
      <text
      x="260"
      y="100"
      font-size="16"
      font-family="Arial, sans-serif"
      fill="#333"
      text-anchor="start"
      dominant-baseline="middle"
    >
      {heartRate}
    </text>
      <div style={{ fontSize: 100 }}>{heartRate}</div>
    </svg>
  );
};
