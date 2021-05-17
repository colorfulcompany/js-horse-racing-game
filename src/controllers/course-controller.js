import { Controller } from 'stimulus'
import Hogan from 'hogan.js'

/**
 * フィールド内のコースを管理するクラス
 * <p>
 * スタート地点での選択、実際に走る場所、ゴールのための場所を用意し、
 * 馬の再描画や勝った際の highlight, スタート後に操作不能になる
 * disable を実装
 * </p>
 * <p>
 * template は field の方から利用して複数の course を render するため
 * に static 変数として定義してある
 * <p>
 */
export class CourseController extends Controller {
  /** @member {Hogan.Template} */
  static template = Hogan.compile(`
  <tr
    class="field"
    data-app-target="course"
    data-controller="course"
    data-course-number-value="{{course}}"
    data-course-position-value="0">
    <td class="field-course-start" width="10%">
      <label><input type="radio" name="course" value="{{course}}"
        data-action="course#checked"
        data-course-target="radio">{{course}}</label>
    </td>
    <td class="field-course" data-course-target="course" width="{{maxPosition}}em"><span class="field-course-horse" data-course-target="horse">□</span></td>
    <td class="field-course-goal" width="10%"></td>              
  </tr>
`)

  /** @member {object} */
  static values = {
    number: Number,
    position: Number
  }

  /** @member {Array} */
  static targets = ['radio', 'horse', 'course']

  connect () {
    this.maxPosition = parseInt(this.courseTarget.getAttribute('width')) + 1
    this.element.addEventListener('reset', this.reset.bind(this))
    this.element.addEventListener('betsClosed', this.disable.bind(this))
    this.element.addEventListener('highlight', this.highlight.bind(this))
    this.element.addEventListener('unhighlight', this.unhighlight.bind(this))
    this.renderHorse()
  }

  //
  // visualizers
  //

  renderHorse () {
    this.horseTarget.style.left = this.positionValue + 'em'
  }

  //
  // actions
  //

  checked () {
    /**
     * @event CourseController~courseChecked
     * @fires CourseController~courseChecked
     */
    this.element.dispatchEvent(
      new CustomEvent('courseChecked', { detail: { number: this.numberValue } })
    )
  }

  //
  // event handlers
  //

  positionValueChanged (value) {
    this.renderHorse()
  }

  /**
   * @listens CourseController~reset
   */
  reset () {
    this.radioTarget.checked = false
    this.radioTarget.disabled = false
  }

  /**
   * @listens CourseController~betsClosed
   */
  disable () {
    this.radioTarget.disabled = true
  }

  /**
   * @listens CourseController~highlight
   */
  highlight () {
    this.element.classList.add('highlight')
  }

  /**
   * @listens CourseController~unhighlight
   */
  unhighlight () {
    this.element.classList.remove('highlight')
  }
}
