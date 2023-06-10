// @flow

import clone from 'lodash/cloneDeep'

import {sortAndFilterTrips} from '../'
import {expectArrayToMatchContents} from '../../../../__tests__/test-utils'
import {mockTripWithoutStopTimes} from '../../../../__tests__/test-utils/mock-data/editor'

describe('editor > util > index', () => {
  describe('sortAndFilterTrips', () => {
    it('should sort trips where there are no stop times', () => {
      const mockTrips = [
        clone(mockTripWithoutStopTimes),
        clone(mockTripWithoutStopTimes)
      ]
      mockTrips[0].id = 2
      mockTrips[0].tripId = 'test-trip-id-2'
      expectArrayToMatchContents(
        sortAndFilterTrips(mockTrips, undefined)
          .map(trip => trip.tripId),
        ['test-trip-id-2', 'test-trip-id-1']
      )
    })

    it('should sort trips where one of the trips has no stop times', () => {
      const mockTrips = [
        clone(mockTripWithoutStopTimes),
        clone(mockTripWithoutStopTimes)
      ]
      mockTrips[0].id = 2
      mockTrips[0].tripId = 'test-trip-id-2'
      mockTrips[0].stopTimes.push({
        arrivalTime: 12345,
        departureTime: 12345,
        id: 1,
        shape_dist_traveled: 0,
        stopHeadsign: '',
        stopId: '1',
        stopSequence: 1
      })
      expectArrayToMatchContents(
        sortAndFilterTrips(mockTrips, undefined)
          .map(trip => trip.tripId),
        ['test-trip-id-1', 'test-trip-id-2']
      )
    })

    it('should sort trips where both of the trips have stop times', () => {
      const mockTrips = [
        clone(mockTripWithoutStopTimes),
        clone(mockTripWithoutStopTimes)
      ]
      mockTrips[0].id = 2
      mockTrips[0].tripId = 'test-trip-id-2'
      mockTrips[0].stopTimes.push({
        arrivalTime: 12345,
        departureTime: 12345,
        id: 1,
        shape_dist_traveled: 0,
        stopHeadsign: '',
        stopId: '1',
        stopSequence: 1
      })
      mockTrips[1].stopTimes.push({
        arrivalTime: 45678,
        departureTime: 45678,
        id: 1,
        shape_dist_traveled: 0,
        stopHeadsign: '',
        stopId: '1',
        stopSequence: 1
      })
      expectArrayToMatchContents(
        sortAndFilterTrips(mockTrips, undefined)
          .map(trip => trip.tripId),
        ['test-trip-id-2', 'test-trip-id-1']
      )
    })
  })
})
