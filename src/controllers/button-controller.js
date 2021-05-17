import { Controller } from 'stimulus'

/**
 * button 周りのイベントとスタイルを管理するクラス
 */
export class ButtonController extends Controller {
  /** @member {Array} */
  static targets = ['next']

  connect () {
    /**
     * @event ButtonController~buttonDrew
     * @fires ButtonController~buttonDrew
     */
    this.element.dispatchEvent(new CustomEvent('buttonDrew'))
    this.element.addEventListener('goal', this.drawNext.bind(this))
    this.element.addEventListener('disableNext', this.disableNext.bind(this))
  }

  //
  // actions
  //

  fireStart () {
    /**
     * @event ButtonController~fireStart
     * @fires ButtonController~fireStart
     */
    this.element.dispatchEvent(new CustomEvent('fireStart'))
  }

  reset () {
    /**
     * @event ButtonController~resetChecked
     * @fires ButtonController~resetChecked
     */
    this.element.dispatchEvent(new CustomEvent('resetChecked'))
  }

  next () {
    /**
     * @event ButtonController~nextGame
     * @fires ButtonController~nextGame
     */
    this.element.dispatchEvent(new CustomEvent('nextGame'))
  }

  //
  // event handlers
  //

  /**
   * @listens ButtonController~goal
   */
  drawNext () {
    this.nextTarget.style.display = 'inline-block'
  }

  /**
   * @listens ButtonController~disableNext
   */
  disableNext () {
    this.nextTarget.style.display = 'none'
  }
}
