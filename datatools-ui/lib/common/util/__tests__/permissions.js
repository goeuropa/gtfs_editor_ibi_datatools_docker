// @flow

import {deploymentsEnabledAndAccessAllowedForProject} from '../permissions'

import mockData from '../../../../__tests__/test-utils/mock-data'

const {mockAdminUser, mockProjectWithDeployment} = mockData.manager

describe('lib > common > util > permissions', () => {
  describe('> deploymentsEnabledAndAccessAllowedForProject', () => {
    const testCases = [
      {
        description: 'a null project and any user',
        expectedResult: false,
        project: null,
        user: mockAdminUser
      }, {
        description: 'a project with deployments and an admin user',
        expectedResult: true,
        project: mockProjectWithDeployment,
        user: mockAdminUser
      }
    ]

    testCases.forEach(testCase => {
      it(`should return ${
        String(testCase.expectedResult)
      } when given ${testCase.description}`, () => {
        expect(deploymentsEnabledAndAccessAllowedForProject(
          testCase.project,
          testCase.user
        )).toEqual(testCase.expectedResult)
      })
    })
  })
})
