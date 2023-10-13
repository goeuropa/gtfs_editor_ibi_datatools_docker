// @flow
import React from 'react'
import {
  DropdownButton
} from 'react-bootstrap'

import {FREQUENCY_INTERVALS} from '../../common/constants'
import MenuItem from '../../common/components/MenuItem'
import {getComponentMessages} from '../../common/util/config'

import type {FetchFrequency} from '../../types'

type Props = {
  fetchFrequency?: FetchFrequency,
  fetchInterval?: number,
  onSelectFetchFrequency: FetchFrequency => void,
  onSelectFetchInterval: number => void
}

/**
 * Renders a set of dropdown form elements used to set a the auto-fetch
 * interval/frequency properties for a FeedSource (i.e., how often data tools
 * should check for an updated GTFS file at the fetch URL).
 */
const FeedFetchFrequency = (props: Props) => {
  const {onSelectFetchFrequency, onSelectFetchInterval} = props
  let {fetchFrequency, fetchInterval} = props
  // If frequency and interval are not defined, use default of one fetch per day.
  if (!fetchFrequency) fetchFrequency = 'DAYS'
  const intervals = FREQUENCY_INTERVALS[fetchFrequency]
  if (!fetchInterval) fetchInterval = intervals[0]
  const messages = getComponentMessages('FeedFetchFrequency')
  return (
    <div>
      {messages('fetchFeedEvery')}
      {' '}
      <DropdownButton
        title={fetchInterval}
        id='fetch-interval-dropdown'
        onSelect={onSelectFetchInterval}>
        {intervals.map(value =>
          <MenuItem
            eventKey={value}
            key={value}
            selected={fetchInterval === value}
          >
            {value}
          </MenuItem>)
        }
      </DropdownButton>
      {' '}
      <DropdownButton
        title={messages(fetchFrequency)}
        id='fetch-frequency-dropdown'
        onSelect={onSelectFetchFrequency}>
        {Object.keys(FREQUENCY_INTERVALS).map((value) =>
          <MenuItem
            eventKey={value}
            key={value}
            selected={fetchFrequency === value}
          >
            {messages(value)}
          </MenuItem>)
        }
      </DropdownButton>
    </div>
  )
}

export default FeedFetchFrequency
