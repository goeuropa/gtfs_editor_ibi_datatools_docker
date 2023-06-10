// @flow

import DeploymentsPanel from '../DeploymentsPanel'
import {
  restoreDateNowBehavior,
  setDefaultTestTime
} from '../../../../__tests__/test-utils'
import mockData from '../../../../__tests__/test-utils/mock-data'

const {manager, store} = mockData

describe('lib > manager > DeploymentsPanel', () => {
  afterEach(restoreDateNowBehavior)

  it('should render with the list of deployments of a project with deployments', () => {
    setDefaultTestTime()
    const mockState = store.getMockStateWithProjectWithFeedsAndDeployment()
    const mockProject = mockState.projects.all[1]

    // add another deployment without any feed versions to the project deployments
    mockProject.deployments.push(manager.makeMockDeployment(mockProject))
    mockProject.pinnedDeploymentId = mockProject.deployments[0].id

    expect(
      store.mockWithProvider(
        DeploymentsPanel,
        {
          activeSubComponent: null,
          expanded: true,
          project: mockProject
        },
        mockState
      ).snapshot()
    ).toMatchSnapshot()
  })
})
