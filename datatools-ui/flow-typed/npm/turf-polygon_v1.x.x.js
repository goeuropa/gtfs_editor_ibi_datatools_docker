// flow-typed signature: f745a75864c8e3f18e215f5102636b3d
// flow-typed version: da30fe6876/turf-polygon_v1.x.x/flow_>=v0.25.x

// @flow

type $npm$turfPolygon$LineRing = Array<[number, number]>;

type $npm$turfPolygon$Polygon = {
  type: "Polygon",
  coordinates: Array<$npm$turfPolygon$LineRing>,
  bbox?: Array<number>,
  crs?: { type: string, properties: mixed }
};

type $npm$turfPolygon$FeaturePolygon<Properties: Object> = {
  type: "Feature",
  geometry: $npm$turfPolygon$Polygon,
  properties: ?{ [key: string]: ?Properties },
  bbox?: Array<number>,
  crs?: { type: string, properties: mixed }
};

declare module "turf-polygon" {
  declare module.exports: <Properties: Object>(
    Array<Array<[number, number]>>,
    properties?: Properties
  ) => $npm$turfPolygon$FeaturePolygon<Properties>;
}
