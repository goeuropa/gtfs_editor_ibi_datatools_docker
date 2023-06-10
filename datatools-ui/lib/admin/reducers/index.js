// @flow

import { combineReducers } from 'redux'

import organizations from './organizations'
import servers from './servers'
import users from './users'

export default combineReducers({
  organizations,
  servers,
  users
})
