// @flow

import React, {Component} from 'react'
import {FormControl} from 'react-bootstrap'

import * as activeAlertActions from '../actions/activeAlert'
import {getFeed, getFeedId} from '../../common/util/modules'

import type {AlertEntity, Feed} from '../../types'

type Props = {
  entity: AlertEntity,
  feeds: Array<Feed>,
  updateActiveEntity: typeof activeAlertActions.updateActiveEntity
}

export default class AgencySelector extends Component<Props> {
  _onSelect = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    const {entity, feeds, updateActiveEntity} = this.props
    const feed = getFeed(feeds, evt.target.value)
    updateActiveEntity({entity, field: 'AGENCY', value: feed})
  }

  render () {
    const {feeds, entity} = this.props
    return (
      <div>
        <FormControl
          componentClass='select'
          value={entity.agency && getFeedId(entity.agency)}
          onChange={this._onSelect}>
          {feeds.map((feed) => (
            <option
              key={getFeedId(feed) || feed.id}
              value={getFeedId(feed) || feed.id}>
              {feed.name}
            </option>
          ))}
        </FormControl>
      </div>
    )
  }
}
