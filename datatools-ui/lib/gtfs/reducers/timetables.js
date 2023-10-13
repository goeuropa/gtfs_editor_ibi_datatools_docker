// @flow

import type {Action} from '../../types/actions'
import type {TimetablesState} from '../../types/reducers'

export const defaultState = {
  fetchStatus: {
    fetched: false,
    fetching: false,
    error: false
  },
  data: null
}

export default function reducer (
  state: TimetablesState = defaultState,
  action: Action
): TimetablesState {
  switch (action.type) {
    case 'SET_ACTIVE_FEEDVERSION':
      return defaultState
    case 'FETCH_GRAPHQL_TIMETABLES':
      return {
        fetchStatus: {
          fetched: false,
          fetching: true,
          error: false
        },
        data: null
      }
    case 'FETCH_GRAPHQL_TIMETABLES_REJECTED':
      return {
        fetchStatus: {
          fetched: false,
          fetching: false,
          error: true
        },
        data: null
      }
    case 'FETCH_GRAPHQL_TIMETABLES_FULFILLED':
      const {data} = action.payload

      return {
        fetchStatus: {
          fetched: true,
          fetching: false,
          error: false
        },
        data
      }
    default:
      return state
  }
}
