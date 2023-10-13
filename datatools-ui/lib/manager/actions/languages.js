// @flow

import {createAction, type ActionType} from 'redux-actions'

export const setActiveLanguage = createAction(
  'SET_ACTIVE_LANGUAGE',
  (payload: string) => payload
)

export type LanguageActions = ActionType<typeof setActiveLanguage>
