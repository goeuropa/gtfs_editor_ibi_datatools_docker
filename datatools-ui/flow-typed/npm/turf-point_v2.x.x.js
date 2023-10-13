// flow-typed signature: 3457aa4eecf0797ededf7acbdec325e0
// flow-typed version: da30fe6876/turf-point_v2.x.x/flow_>=v0.25.x

// @flow

type $npm$Turf$Point$Point = {
  type: "Point",
  coordinates: [number, number],
  bbox?: Array<number>,
  crs?: { type: string, properties: mixed }
};

type $npm$Turf$Destination$FeaturePoint<Properties: Object> = {
  type: "Feature",
  geometry: $npm$Turf$Point$Point,
  properties: ?{ [key: string]: ?Properties },
  bbox?: Array<number>,
  crs?: { type: string, properties: mixed }
};

declare module "turf-point" {
  declare module.exports: <Properties: Object>(
    coordinates: [number, number],
    properties?: Properties
  ) => $npm$Turf$Destination$FeaturePoint<Properties>;
}
