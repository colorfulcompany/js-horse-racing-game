import { Controller } from 'stimulus'
import { CourseController } from './course-controller.js'

/**
 * フィールド全体を管理するクラス
 *
 * <p>
 * デザイン的にフィールド全体を表現するための DOM と紐付き、コース全体
 * の描画完了を通知するもの
 * </p>
 * <p>
 * maxPosition は ApplicationController と共有するためにわざと values に入れてある
 * </p>
 */
export class FieldController extends Controller {
  /** @member {object} */
  static values = {
    courses: Number,
    maxPosition: Number
  }

  /** @member {Array} */
  static targets = ['courses']

  connect () {
    this.coursesValue = 6
    this.maxPositionValue = 20
    this.generateCourses()
    /**
     * @event FieldController~fieldDrew
     * @fires FieldController~fieldDrew
     */
    this.element.dispatchEvent(new CustomEvent('fieldDrew'))
  }

  /**
   * @returns {Array}
   */
  coursesArray () {
    return Array.from({ length: this.coursesValue }, (e, i) => i + 1)
  }

  /**
   * @returns {void}
   */
  generateCourses () {
    const courseTemplate = CourseController.template
    this.coursesTarget.innerHTML = this.coursesArray().map((course) => {
      return courseTemplate.render({ maxPosition: this.maxPositionValue, course })
    }).join('')
  }
}
