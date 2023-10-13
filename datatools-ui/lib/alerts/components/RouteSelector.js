// @flow

import React, {Component} from 'react'

import * as activeAlertActions from '../actions/activeAlert'
import {getRouteNameAlerts} from '../../editor/util/gtfs'
import GtfsSearch from '../../gtfs/components/gtfs-search'

import type {GtfsOption} from '../../gtfs/components/gtfs-search'
import type {AlertEntity, Feed, GtfsRoute, GtfsStop} from '../../types'

type Props = {
  clearable?: boolean,
  entity: AlertEntity,
  feeds: Array<Feed>,
  filterByStop?: GtfsStop,
  minimumInput?: number,
  route?: GtfsRoute,
  updateActiveEntity: typeof activeAlertActions.updateActiveEntity
}

export default class RouteSelector extends Component<Props> {
  _onChange = (value: GtfsOption) => {
    const {entity, filterByStop, updateActiveEntity} = this.props
    const field = 'ROUTE'
    if (value) {
      updateActiveEntity({entity, field, value: value.route, agency: value.agency})
    } else if (value == null) {
      if (filterByStop) {
        updateActiveEntity({entity, field, value: null, agency: entity.agency})
      } else {
        updateActiveEntity({entity, field, value: null, agency: null})
      }
    }
  }

  render () {
    const {route, feeds, minimumInput, filterByStop, clearable, entity} = this.props
    const {agency: feed} = entity
    const agencyName = feed ? feed.name : 'Unknown agency'
    const routeName = route
      ? getRouteNameAlerts(route) || '[no name]'
      : '[route not found!]'
    const value = route
      ? {
        route,
        value: route.route_id,
        label: `${routeName} (${agencyName})`,
        agency: feed
      }
      : ''
    return (
      <GtfsSearch
        feeds={feeds}
        limit={100}
        minimumInput={minimumInput}
        filterByStop={filterByStop}
        clearable={clearable}
        entities={['routes']}
        onChange={this._onChange}
        value={value} />
    )
  }
}
