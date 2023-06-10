// @flow

import React, {Component} from 'react'
import {divIcon} from 'leaflet'

import * as activeActions from '../../actions/active'
import * as mapActions from '../../actions/map'
import * as tripPatternActions from '../../actions/tripPattern'
import {ARROW_MAGENTA} from '../../constants'
import ControlPointMarker from './ControlPoint'
import {isValidPoint} from '../../util/map'

import type {ControlPoint, Coordinates, GtfsStop, Pattern} from '../../../types'
import type {EditSettingsState} from '../../../types/reducers'

type Props = {
  activePattern: Pattern,
  controlPoints: Array<ControlPoint>,
  editSettings: EditSettingsState,
  handleControlPointDrag: typeof mapActions.handleControlPointDrag,
  handleControlPointDragEnd: typeof mapActions.handleControlPointDragEnd,
  handleControlPointDragStart: typeof mapActions.handleControlPointDragStart,
  patternCoordinates: Array<Coordinates>,
  patternSegment: number,
  removeControlPoint: typeof mapActions.removeControlPoint,
  setActivePatternSegment: typeof tripPatternActions.setActivePatternSegment,
  stops: Array<GtfsStop>,
  updateActiveGtfsEntity: typeof activeActions.updateActiveGtfsEntity
}

export default class ControlPointsLayer extends Component<Props> {
  render () {
    const {
      stops,
      activePattern,
      controlPoints,
      editSettings,
      patternCoordinates,
      patternSegment,
      setActivePatternSegment
    } = this.props
    const isEditing = stops && activePattern && patternCoordinates && editSettings.editGeometry && controlPoints
    return (
      <div ref='controlPoints'>
        {isEditing
          ? controlPoints.map((cp, index) => {
            // don't include controlPoint on end of segment (for now) or hidden controlPoints
            if (cp.stopId && editSettings.hideStopHandles) {
              return null
            }
            if (editSettings.hideInactiveSegments && (index > patternSegment + 1 || index < patternSegment - 1)) {
              // Do not render inactive control points if hide is enabled and
              // not adjacent to segment
              return null
            }
            const {point} = cp
            const isActive = index === patternSegment
            const color = isActive
              ? '#000'
              : index === patternSegment - 1 // control point before
                ? 'blue'
                : index === patternSegment + 1 // control point after
                  ? ARROW_MAGENTA
                  : '#888' // inactive
            const iconType = cp.stopId ? 'fa-square' : 'fa-times'
            if (!isValidPoint(point)) {
              return null
            }
            const {coordinates} = point.geometry
            const key = cp.stopId
              ? `${cp.id}-${cp.stopId}-${activePattern.id}`
              : `${cp.id}-${activePattern.id}`
            const icon: HTMLElement = divIcon({
              className: '',
              html: `<i class="fa ${iconType}" style="color: ${color}; margin-left: 1px"/>`
            })
            return (
              <ControlPointMarker
                position={[coordinates[1], coordinates[0]]}
                icon={icon}
                controlPoint={cp}
                key={key}
                stopId={cp.stopId}
                index={index}
                isActive={isActive}
                patternSegment={patternSegment}
                setActivePatternSegment={setActivePatternSegment}
                {...this.props} />
            )
          })
          : null
        }
      </div>
    )
  }
}
