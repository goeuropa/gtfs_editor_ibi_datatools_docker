// @flow

import {createAction, type ActionType} from 'redux-actions'

import {createVoidPayloadAction, fetchGraphQL} from '../../common/actions'
import {decodeShapePolylines} from '../../common/util/gtfs'
import {shapes} from '../../gtfs/util/graphql'
import {updateRoutesOnMapDisplay} from './filter'

import type {dispatchFn, getStateFn} from '../../types/reducers'

export const errorFetchingShapes = createVoidPayloadAction(
  'FETCH_GRAPHQL_SHAPES_REJECTED'
)
export const fetchingShapes = createVoidPayloadAction('FETCH_GRAPHQL_SHAPES')
export const receiveShapes = createAction(
  'FETCH_GRAPHQL_SHAPES_FULFILLED',
  (payload: Array<[number, number]>) => payload
)

export type GtfsShapesActions = ActionType<typeof errorFetchingShapes> |
  ActionType<typeof fetchingShapes> |
  ActionType<typeof receiveShapes>

export function toggleShowAllRoutesOnMap (namespace: string) {
  return function (dispatch: dispatchFn, getState: getStateFn) {
    let state = getState()
    dispatch(updateRoutesOnMapDisplay(!state.gtfs.filter.showAllRoutesOnMap))
    state = getState()
    if (
      state.gtfs.filter.showAllRoutesOnMap &&
      !state.gtfs.shapes.fetchStatus.fetched &&
      !state.gtfs.shapes.fetchStatus.fetching
    ) {
      dispatch(fetchingShapes())
      return dispatch(fetchGraphQL({query: shapes, variables: {namespace}}))
        .then(data => {
          const {shapes_as_polylines: encodedShapes} = data.feed
          const shapes = encodedShapes.map(decodeShapePolylines)
          dispatch(receiveShapes(shapes))
        })
    }
  }
}
