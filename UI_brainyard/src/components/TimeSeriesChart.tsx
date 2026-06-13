import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDateTime, formatTime } from "../utils/formatters";
import { EmptyState } from "./EmptyState";

export type ChartLine = {
  dataKey: string;
  name: string;
  color: string;
  unit?: string;
};

export type ChartDatum = {
  timestamp: string;
  [key: string]: string | number;
};

type TimeSeriesChartProps = {
  data: ChartDatum[];
  lines: ChartLine[];
  markers?: Array<{
    timestamp: string;
    label: string;
  }>;
  height?: number;
  yAxisLabel?: string;
};

export function TimeSeriesChart({
  data,
  lines,
  markers = [],
  height = 340,
  yAxisLabel = "Soil moisture (%)",
}: TimeSeriesChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No measurements yet"
        description="Measurements will appear here after sensor data is imported."
      />
    );
  }

  return (
    <div className="chart-shell" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 18, right: 28, bottom: 28, left: 18 }}>
          <CartesianGrid stroke="#dfe6df" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="timestamp"
            minTickGap={28}
            tickFormatter={formatTime}
            tick={{ fill: "#5d6b60", fontSize: 12 }}
            stroke="#95a097"
          >
            <Label value="Time" position="insideBottom" offset={-14} fill="#516056" />
          </XAxis>
          <YAxis
            domain={["dataMin - 2", "dataMax + 2"]}
            tick={{ fill: "#5d6b60", fontSize: 12 }}
            stroke="#95a097"
            width={56}
          >
            <Label
              value={yAxisLabel}
              angle={-90}
              position="insideLeft"
              offset={0}
              fill="#516056"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <Tooltip
            contentStyle={{
              border: "1px solid #d8ded6",
              borderRadius: 8,
              boxShadow: "0 12px 28px rgba(20, 41, 26, 0.12)",
            }}
            labelFormatter={(label) => formatDateTime(String(label))}
            formatter={(value, name) => {
              const line = lines.find((item) => item.name === name || item.dataKey === name);
              return [`${Number(value).toFixed(1)}${line?.unit ?? "%"}`, name];
            }}
          />
          <Legend verticalAlign="top" align="right" iconType="line" wrapperStyle={{ paddingBottom: 12 }} />
          {markers.map((marker) => (
            <ReferenceLine
              key={`${marker.timestamp}-${marker.label}`}
              x={marker.timestamp}
              stroke="#a5673f"
              strokeDasharray="5 4"
              label={{
                value: marker.label,
                position: "top",
                fill: "#7a4b2e",
                fontSize: 12,
              }}
            />
          ))}
          {lines.map((line) => (
            <Line
              activeDot={{ r: 6 }}
              dataKey={line.dataKey}
              dot={false}
              key={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={3}
              type="monotone"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
