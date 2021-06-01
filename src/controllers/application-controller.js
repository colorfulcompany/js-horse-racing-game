import { Controller } from 'stimulus'
import { ApplicationModel } from '../lib/application-model.js'

/**
 * ゲーム全体を管理するクラス
 */
export class ApplicationController extends Controller {
  /** @member {Array} */
  static targets = ['field', 'course', 'button', 'result', 'congrats']

  /** @member {number} */
  intervalMs = 200
  /** @member {number} */
  intervalId

  connect () {
    this.model = new ApplicationModel()
    this.initEventHandler()
  }

  //
  // utility
  //

  /**
   * @returns {void}
   */
  initEventHandler () {
    this.fieldTarget.addEventListener('fieldDrew', this.fieldDrew.bind(this))

    const button = this.buttonTarget
    button.addEventListener('buttonDrew', this.buttonDrew.bind(this, button))
  }

  /**
   * @param {number} course
   * @returns {object}
   */
  specificCourseTarget (course) {
    return this.courseTargets.filter((c) => {
      return parseInt(c.dataset.courseNumberValue) === course
    })[0]
  }

  //
  // flow
  //

  /**
   * @returns {void}
   */
  betsClosed () {
    this.courseTargets.forEach((course) => {
      /**
       * @event CourseController~betsClosed
       * @fires CourseController~betsClosed
       */
      course.dispatchEvent(new CustomEvent('betsClosed'))
    })
  }

  /**
   * @param {object} head
   * @returns {void}
   */
  goal (head) {
    clearInterval(this.intervalId)

    this.model.setWinner(head)
    this.notifyBoardWinner(head.course)
    this.highlightCourse(head.course)
    if (this.model.youWon(head)) {
      this.bannerCongrats()
    }
    /**
     * @event ButtonController~goal
     * @fires ButtonController~goal
     */
    this.buttonTarget.dispatchEvent(new CustomEvent('goal'))
  }

  //
  // visualizers
  //

  // congrats message

  /**
   * @returns {void}
   */
  bannerCongrats () {
    this.congratsTarget.innerHTML = 'Congratulations !'
  }

  /**
   * @returns {void}
   */
  clearCongrats () {
    this.congratsTarget.innerHTML = '&nbsp;'
  }

  // board

  /**
   * @param {number} horse
   * @returns {void}
   */
  notifyBoardWinner (horse) {
    this.resultTarget.innerHTML = `Horse ${horse} Win !`
  }

  /**
   * @returns {void}
   */
  clearBoardWinner () {
    this.resultTarget.innerHTML = '&nbsp;'
  }

  // courses

  /**
   * @param {number} forcePosition
   * @returns {Array}
   */
  redrawCourses ({ forcePosition = undefined } = {}) {
    return this.courseTargets.map((course) => {
      const position = this.model.nextPosition({
        current: parseFloat(course.dataset.coursePositionValue),
        forcePosition
      })
      course.dataset.coursePositionValue = position

      return {
        course: parseInt(course.dataset.courseNumberValue),
        position: position
      }
    })
  }

  /**
   * @param {number} course
   * @returns {void}
   */
  highlightCourse (course) {
    const target = this.specificCourseTarget(course)

    if (target) {
      /**
       * @event CourseController~highlight
       * @fires CourseController~highlight
       */
      target.dispatchEvent(new CustomEvent('highlight'))
    }
  }

  /**
   * @param {number} course
   * @returns {void}
   */
  unhighlightCourse (course) {
    const target = this.specificCourseTarget(course)

    if (target) {
      /**
       * @event CourseController~unhighlight
       * @fires CourseController~unhighlight
       */
      target.dispatchEvent(new CustomEvent('unhighlight'))
    }
  }

  /**
   * @event ButtonController~disableNext
   * @fires ButtonController~disableNext
   */
  disableNextButton () {
    this.buttonTarget.dispatchEvent(new CustomEvent('disableNext'))
  }

  //
  // event handlers
  //

  /**
   * @listens ButtonController~buttonDrew
   * @param {HTMLElement} button
   */
  buttonDrew (button) {
    button.addEventListener('fireStart', this.start.bind(this))
    button.addEventListener('resetChecked', this.resetCheckedCourse.bind(this))
    button.addEventListener('nextGame', this.nextGame.bind(this))
  }

  /**
   * @listens FieldController~fieldDrew
   */
  fieldDrew () {
    this.courseTargets.forEach((course) => {
      course.addEventListener('courseChecked', this.storeCheckedCourse.bind(this))
    })
  }

  /**
   * @listens ButtonController~fireStart
   * @returns {void}
   */
  start () {
    if (this.model.notRunning() && this.model.hasBetted()) {
      const maxPosition = parseInt(this.fieldTarget.dataset.fieldMaxPositionValue)
      this.model.nextState('running')
      this.betsClosed()

      this.intervalId = setInterval(() => {
        const currentPositions = this.redrawCourses()
        const reachedHeadHorse = this.model.hasReached(currentPositions, maxPosition)

        if (reachedHeadHorse) {
          this.goal(reachedHeadHorse)
        }
      }, this.intervalMs)
    }
  }

  /**
   * @listens CourseController~courseChecked
   * @param {object} event
   * @returns {void}
   */
  storeCheckedCourse (event) {
    this.model.bet(event.detail.number)
  }

  /**
   * @listens ButtonController~resetChecked
   * @returns {void}
   */
  resetCheckedCourse () {
    if (this.model.notRunning()) {
      this.model.drop()
      const event = new CustomEvent('reset')
      this.courseTargets.forEach((course) => {
        /**
         * @event CourseController~reset
         * @fires CourseController~reset
         */
        course.dispatchEvent(event)
      })
    }
  }

  /**
   * @listens ButtonController~nextGame
   * @returns {void}
   */
  nextGame () {
    this.redrawCourses({ forcePosition: 0 })
    this.model.resetState()
    this.unhighlightCourse(this.model.winner.course)
    this.model.resetWinner()
    this.resetCheckedCourse()
    this.disableNextButton()
    this.clearBoardWinner()
    this.clearCongrats()
  }
}
