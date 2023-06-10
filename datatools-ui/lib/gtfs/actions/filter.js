// @flow

import {createAction, type ActionType} from 'redux-actions'

import {createVoidPayloadAction} from '../../common/actions'

export const addActiveFeed = createAction(
  'ADD_ACTIVE_FEED',
  (payload: string) => payload
)
export const addAllActiveFeeds = createVoidPayloadAction('ADD_ALL_ACTIVE_FEEDS')
export const removeActiveFeed = createAction(
  'REMOVE_ACTIVE_FEED',
  (payload: string) => payload
)
export const removeAllActiveFeeds = createVoidPayloadAction('REMOVE_ALL_ACTIVE_FEEDS')
export const updateArrivalDisplay = createAction(
  'SHOW_ARRIVAL_CHANGE',
  (payload: boolean) => payload
)
export const updateDateTimeFilter = createAction(
  'UPDATE_GTFS_DATETIME_FILTER',
  (payload: {
    date?: string,
    from?: number,
    to?: number
  }) => payload
)
export const updateMapState = createAction(
  'UPDATE_GTFS_MAP_STATE',
  (payload: {
    bounds?: any,
    zoom?: number
  }) => payload
)
export const updatePatternFilter = createAction(
  'PATTERN_FILTER_CHANGE',
  (payload: ?string) => payload
)
export const updatePermissionFilter = createAction(
  'UPDATE_GTFS_PERMISSION_FILTER',
  (payload: string) => payload
)
export const updateRouteFilter = createAction(
  'ROUTE_FILTER_CHANGE',
  (payload: ?string) => payload
)
export const updateRouteOffset = createAction(
  'UPDATE_ROUTE_OFFSET',
  (payload: number) => payload
)
export const updateRoutesOnMapDisplay = createAction(
  'SHOW_ALL_ROUTES_ON_MAP_CHANGE',
  (payload: boolean) => payload
)
export const updateTimepointFilter = createAction(
  'TIMEPOINT_CHANGE',
  (payload: boolean) => payload
)

export type GtfsFilterActions = ActionType<typeof addActiveFeed> |
  ActionType<typeof addAllActiveFeeds> |
  ActionType<typeof removeActiveFeed> |
  ActionType<typeof removeAllActiveFeeds> |
  ActionType<typeof updateArrivalDisplay> |
  ActionType<typeof updateDateTimeFilter> |
  ActionType<typeof updateMapState> |
  ActionType<typeof updatePatternFilter> |
  ActionType<typeof updatePermissionFilter> |
  ActionType<typeof updateRouteFilter> |
  ActionType<typeof updateRouteOffset> |
  ActionType<typeof updateRoutesOnMapDisplay> |
  ActionType<typeof updateTimepointFilter>
