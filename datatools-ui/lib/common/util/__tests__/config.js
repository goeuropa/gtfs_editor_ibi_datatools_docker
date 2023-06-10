// @flow

import {getComponentMessages} from '../config'

describe('lib > common > util > config', () => {
  describe('> getComponentMessages', () => {
    let oldConfig

    afterEach(() => {
      window.DT_CONFIG = oldConfig
    })

    beforeEach(() => {
      oldConfig = window.DT_CONFIG
      window.DT_CONFIG = {
        messages: {
          active: {
            components: {
              Breadcrumbs: {
                deployments: 'Deployments',
                projects: 'Projects',
                root: 'Explore'
              }
            }
          }
        }
      }
    })

    it('should return message properly', () => {
      expect(getComponentMessages('Breadcrumbs')('root')).toEqual('Explore')
    })
  })
})
