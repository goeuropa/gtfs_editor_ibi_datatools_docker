// @flow

import type {Action} from '../../types/actions'
import type {ShapesState} from '../../types/reducers'

export const defaultState = {
  fetchStatus: {
    fetched: false,
    fetching: false,
    error: false
  },
  data: []
}

export default function reducer (
  state: ShapesState = defaultState,
  action: Action
): ShapesState {
  switch (action.type) {
    case 'SET_ACTIVE_FEEDVERSION':
      return defaultState
    case 'FETCH_GRAPHQL_SHAPES':
      return {
        fetchStatus: {
          fetched: false,
          fetching: true,
          error: false
        },
        data: []
      }
    case 'FETCH_GRAPHQL_SHAPES_REJECTED':
      return {
        fetchStatus: {
          fetched: false,
          fetching: false,
          error: true
        },
        data: []
      }
    case 'FETCH_GRAPHQL_SHAPES_FULFILLED':
      return {
        fetchStatus: {
          fetched: true,
          fetching: false,
          error: false
        },
        data: action.payload
      }
    default:
      return state
  }
}
