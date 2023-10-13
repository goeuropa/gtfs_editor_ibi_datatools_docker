// @flow

import React, {Component} from 'react'

import * as activeAlertActions from '../actions/activeAlert'
import GtfsSearch from '../../gtfs/components/gtfs-search'

import type {GtfsOption} from '../../gtfs/components/gtfs-search'
import type {AlertEntity, Feed, GtfsRoute, GtfsStop} from '../../types'

type Props = {
  clearable?: boolean,
  entity: AlertEntity,
  feeds: Array<Feed>,
  filterByRoute?: GtfsRoute,
  minimumInput?: number,
  stop: ?GtfsStop,
  updateActiveEntity: typeof activeAlertActions.updateActiveEntity
}

export default class StopSelector extends Component<Props> {
  _onChange = (value: GtfsOption) => {
    const {entity, updateActiveEntity} = this.props
    const field = 'STOP'
    if (value) updateActiveEntity({entity, field, value: value.stop, agency: value.agency})
    else updateActiveEntity({entity, field, value: null, agency: null})
  }

  render () {
    const {
      stop,
      feeds,
      minimumInput,
      filterByRoute,
      clearable,
      entity
    } = this.props
    const {agency: feed} = entity
    const agencyName = feed ? feed.name : 'Unknown agency'
    return (
      <GtfsSearch
        feeds={feeds}
        limit={100}
        minimumInput={minimumInput}
        filterByRoute={filterByRoute}
        entities={['stops']}
        clearable={clearable}
        onChange={this._onChange}
        value={stop
          ? {
            stop,
            value: stop.stop_id,
            label: `${stop.stop_name} (${agencyName})`,
            agency: feed
          }
          : ''
        } />
    )
  }
}
