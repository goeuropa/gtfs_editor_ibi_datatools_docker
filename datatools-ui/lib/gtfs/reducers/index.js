// @flow

import { combineReducers } from 'redux'

import filter from './filter'
import patterns from './patterns'
import routes from './routes'
import shapes from './shapes'
import stops from './stops'
import timetables from './timetables'
import validation from './validation'

export default combineReducers({
  filter,
  patterns,
  routes,
  shapes,
  stops,
  timetables,
  validation
})
