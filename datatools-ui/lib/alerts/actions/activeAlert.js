// @flow

import {createAction, type ActionType} from 'redux-actions'

import type {AlertEntity} from '../../types'
import type {dispatchFn, getStateFn} from '../../types/reducers'

export const deleteActiveEntity = createAction(
  'DELETE_ACTIVE_ALERT_AFFECTED_ENTITY',
  (payload: any) => payload
)
const newEntity = createAction(
  'ADD_ACTIVE_ALERT_AFFECTED_ENTITY',
  (payload: {
    agency: any,
    type: string,
    [string]: any
  }) => payload
)
export const setActiveProperty = createAction(
  'SET_ACTIVE_ALERT_PROPERTY',
  (payload: { [string]: any }) => payload
)
export const setActivePublished = createAction(
  'SET_ACTIVE_ALERT_PUBLISHED',
  (payload: boolean) => payload
)
export const updateActiveEntity = createAction(
  'UPDATE_ACTIVE_ALERT_ENTITY',
  (payload: {
    agency?: any,
    entity: AlertEntity,
    field: string,
    value: any
  }) => payload
)

export type ActiveAlertActions = ActionType<typeof deleteActiveEntity> |
  ActionType<typeof newEntity> |
  ActionType<typeof setActiveProperty> |
  ActionType<typeof setActivePublished> |
  ActionType<typeof updateActiveEntity>

export function addActiveEntity (
  field: string = 'AGENCY',
  value: any = null,
  agency: any = null
) {
  return function (dispatch: dispatchFn, getState: getStateFn) {
    return dispatch(newEntity({
      type: field,
      agency,
      [field.toLowerCase()]: value
    }))
  }
}
