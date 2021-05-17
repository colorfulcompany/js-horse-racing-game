/**
 * ゲーム全体のパラメータ、計算処理、状態の判定など
 */
export class ApplicationModel {
  /** @member {string|undefined} */
  state = undefined
  /** @member {number|undefined} */
  betted = undefined
  /** @member {object|undefined} */
  winner = undefined
  /** @member {number} */
  positionStep = 1.5

  /**
   * @param {string|undefined} state
   * @returns {void}
   */
  nextState (state) {
    this.state = state
  }

  /**
   * @returns {void}
   */
  resetState () {
    this.state = undefined
  }

  /**
   * @returns {boolean}
   */
  notRunning () {
    return this.state !== 'running'
  }

  /**
   * @param {number} horse
   * @returns {void}
   */
  bet (horse) {
    this.betted = horse
  }

  /**
   * @returns {void}
   */
  drop () {
    this.betted = undefined
  }

  /**
   * @returns {boolean}
   */
  hasBetted () {
    return typeof this.betted !== 'undefined'
  }

  /**
   * currentPositions は以下のような形式を期待
   *
   * [{ positon: x, course: y }, { }]
   *
   * @param {Array} currentPositions
   * @param {number} maxPosition
   * @returns {object | null}
   */
  hasReached (currentPositions, maxPosition) {
    const positions = currentPositions.map((e) => e)

    positions.sort((a, b) => b.position - a.position)
    const head = positions[0]

    return (head.position > maxPosition)
      ? head
      : null
  }

  /**
   * @param {object} params
   * @param {number} params.current
   * @param {number} params.forcePosition
   * @returns {number}
   */
  nextPosition ({ current, forcePosition = undefined }) {
    return (typeof forcePosition !== 'undefined')
      ? forcePosition
      : current + Math.random() * this.positionStep
  }

  /**
   * @param {object} headHorse
   * @returns {boolean}
   */
  youWon (headHorse) {
    return this.betted === headHorse.course
  }

  /**
   * @param {object} headHorse
   * @returns {void}
   */
  setWinner (headHorse) {
    this.winner = headHorse
  }

  /**
   * @returns {void}
   */
  resetWinner () {
    this.winner = undefined
  }
}
