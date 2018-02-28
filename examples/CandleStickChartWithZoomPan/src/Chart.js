import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart, ZoomButtons } from "react-stockcharts";
import { BarSeries, CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  EdgeIndicator,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

class CandleStickChartWithZoomPan extends React.Component {
  constructor(props) {
    super(props);
    this.saveNode = this.saveNode.bind(this);
    this.resetYDomain = this.resetYDomain.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }
  componentWillMount() {
    this.setState({
      suffix: 1
    });
  }
  saveNode(node) {
    this.node = node;
  }
  resetYDomain() {
    this.node.resetYDomain();
  }
  handleReset() {
    this.setState({
      suffix: this.state.suffix + 1
    });
  }
  render() {
    const { type, width, ratio } = this.props;
    const { mouseMoveEvent, panEvent, zoomEvent, zoomAnchor } = this.props;
    const { clamp } = this.props;

    const { data: initialData } = this.props;

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      d => d.date
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      initialData
    );

    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length - 150)]);
    const xExtents = [start, end];

    const margin = { left: 70, right: 0, top: 20, bottom: 30 };

    const height = 355;

    const gridHeight = height - margin.top - margin.bottom;
    const gridWidth = width - margin.left - margin.right;

    const showGrid = false;
    const yGrid = showGrid
      ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2 }
      : {};
    const xGrid = showGrid
      ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2 }
      : {};

    return (
      <ChartCanvas
        ref={this.saveNode}
        height={height}
        ratio={ratio}
        width={width}
        margin={{ left: 0, right: 45, top: 10, bottom: 30 }}
        mouseMoveEvent={mouseMoveEvent}
        panEvent={panEvent}
        zoomEvent={zoomEvent}
        clamp={clamp}
        zoomAnchor={zoomAnchor}
        type={type}
        seriesName={`MSFT_${this.state.suffix}`}
        data={data}
        xScale={xScale}
        xExtents={xExtents}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
      >
        <Chart id={1} yExtents={d => [d.high, d.low]}>
          <XAxis
            axisAt="bottom"
            orient="bottom"
            stroke={"#ffffff"}
            opacity={0.2}
            tickStroke={"rgba(255,255,255,0.2)"}
            fontSize={9}
            zoomEnabled={zoomEvent}
            {...xGrid}
          />
          <YAxis
            axisAt="right"
            orient="right"
            ticks={3}
            stroke={"#ffffff"}
            opacity={0.2}
            tickStroke={"rgba(255,255,255,0.2)"}
            fontSize={9}
            zoomEnabled={zoomEvent}
            {...yGrid}
          />

          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            lineStroke={"#ffffff"}
            lineOpacity={0.2}
            yAccessor={d => d.close}
            fill={d => (d.close > d.open ? "#0aaf39" : "#e04728")}
          />

          <CandlestickSeries
            stroke={d => (d.close > d.open ? "#0aaf39" : "#e04728")}
            wickStroke={d => (d.close > d.open ? "#0aaf39" : "#e04728")}
            fill={d => (d.close > d.open ? "#0aaf39" : "#e04728")}
            opacity={1}
          />
          <ZoomButtons onReset={this.handleReset} />
        </Chart>
      </ChartCanvas>
    );
  }
}

CandleStickChartWithZoomPan.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

CandleStickChartWithZoomPan.defaultProps = {
  type: "hybrid",
  mouseMoveEvent: true,
  panEvent: true,
  zoomEvent: true,
  clamp: false
};

CandleStickChartWithZoomPan = fitWidth(CandleStickChartWithZoomPan);

export default CandleStickChartWithZoomPan;
