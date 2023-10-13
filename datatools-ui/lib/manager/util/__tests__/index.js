// @flow

import clone from 'lodash/cloneDeep'
import moment from 'moment'

import {feedSortOptions, parseBounds, versionStatusFilters} from '../'
import {
  restoreDateNowBehavior,
  setTestTime
} from '../../../../__tests__/test-utils'
import mockData from '../../../../__tests__/test-utils/mock-data'

import type {Feed} from '../../../types'

const {mockFeedWithVersion, mockFeedWithoutVersion} = mockData.manager

// create a third mock feed for sorting
const mockFeedWithVersion2 = clone(mockFeedWithVersion)
mockFeedWithVersion2.id = 'another test feed with a version that ends later'
mockFeedWithVersion2.name = 'another test feed with a version that ends later'
mockFeedWithVersion2.lastUpdated += 86400000
// it exists, but flow needs to know for sure
if (mockFeedWithVersion2.latestValidation) {
  mockFeedWithVersion2.latestValidation.errorCount = 12345
  mockFeedWithVersion2.latestValidation.startDate = '20190801'
  mockFeedWithVersion2.latestValidation.endDate = '20200801'
}

const mockFeeds = [
  mockFeedWithVersion,
  mockFeedWithVersion2,
  mockFeedWithoutVersion
]

function getFeedName (feed) {
  return feed.name
}

function setFeedValidDateName (feed: Feed): Feed {
  const newFeed = clone(feed)
  if (newFeed.latestValidation) {
    newFeed.name = `test feed valid from ${newFeed.latestValidation.startDate} - ${newFeed.latestValidation.endDate}`
  } else {
    newFeed.name = 'test feed with no version'
  }
  return newFeed
}

describe('manager > util > index >', () => {
  describe('parseBounds >', () => {
    describe('invalid >', () => {
      it('should fail to parse less than 3 values', () => {
        expect(parseBounds('1,2,3')).toMatchSnapshot()
      })

      it('should fail to parse invalid lat/lon coordinates', () => {
        expect(parseBounds('-200,-100,210,120')).toMatchSnapshot()
      })
    })

    describe('valid >', () => {
      it('should parse valid bounds', () => {
        expect(parseBounds('-122.723842, 45.503841, -122.696827, 45.525433')).toMatchSnapshot()
      })
    })
  })

  describe('versionStatusFilters', () => {
    const mockFeedsForSortTest = mockFeeds.map(setFeedValidDateName)

    afterEach(restoreDateNowBehavior)

    const filterTestCaseData = {
      'all': {
        expected: [
          'test feed valid from 20180801 - 20190801',
          'test feed valid from 20190801 - 20200801',
          'test feed with no version'
        ]
      },
      'active': {
        expected: ['test feed valid from 20180801 - 20190801'],
        mockDate: Date.UTC(2019, 0, 1)
      },
      'expiring': {
        expected: ['test feed valid from 20180801 - 20190801'],
        mockDate: Date.UTC(2019, 6, 19)
      },
      'expired': {
        expected: ['test feed valid from 20180801 - 20190801'],
        mockDate: Date.UTC(2020, 6, 19)
      },
      'future': {
        expected: ['test feed valid from 20190801 - 20200801'],
        mockDate: Date.UTC(2019, 6, 30)
      }
    }

    Object.keys(versionStatusFilters).forEach(optionKey => {
      const testCaseData = filterTestCaseData[optionKey]
      const filterOptionTestDate = testCaseData.mockDate
        ? testCaseData.mockDate
        : Date.UTC(2018, 6, 30)

      /**
       * Make sure filtering happens as expected. The snapshot created is based
       * off of an array of just the feed names.
       */
      it(`should filter feeds with '${optionKey}' strategy for date ${moment(filterOptionTestDate).toISOString()}`, () => {
        // override Date library to set a test time before each type of test
        setTestTime(filterOptionTestDate)

        const filtered = clone(mockFeedsForSortTest)
          .filter(feed => versionStatusFilters[optionKey](feed.latestValidation))
          .map(getFeedName)
        expect(filtered).toHaveLength(testCaseData.expected.length)
        expect(filtered).toEqual(expect.arrayContaining(testCaseData.expected))
      })
    })
  })

  describe('feedSortOptions', () => {
    Object.keys(feedSortOptions).forEach(optionKey => {
      /**
       * Make sure sorting happens as expected. The snapshot created is based
       * off of an array of just the feed names.
       */
      it(`should sort ${optionKey}`, () => {
        expect(
          clone(mockFeeds)
            .sort(feedSortOptions[optionKey])
            .map(getFeedName)
        ).toMatchSnapshot()
      })
    })
  })
})
