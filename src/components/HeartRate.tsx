import { COLORS } from "../config";

type Props = {
  heartRate: number;
};

let validatedHeartRate = 0;

export const HeartRate = ({ heartRate }: Props) => {
  const width = 1200;
  const height = 600;

  if (!!heartRate) {
    validatedHeartRate = heartRate;
  }

  return (
    <svg
      viewBox={`0 -60 ${width / 2} ${height / 2}`}
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
        fill={COLORS.HEART}
        transform="rotate(225,150,121)"
      />
      <text
        x="260"
        y="140"
        fontSize="140"
        fontFamily="Helvetica"
        fill={COLORS.FG}
        textAnchor="start"
        dominantBaseline="middle"
      >
        {validatedHeartRate}
      </text>
      <div style={{ fontSize: 100 }}>{heartRate}</div>
    </svg>
  );
};
