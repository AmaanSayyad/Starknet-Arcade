import React from "react";

const RockPaperScissor = () => {
  return (
    <>
      <form>
        <input type="radio" id="rock-rock" name="rock-paper-scissors" />
        <input type="radio" id="rock-paper" name="rock-paper-scissors" />
        <input type="radio" id="rock-scissors" name="rock-paper-scissors" />
        <input type="radio" id="paper-rock" name="rock-paper-scissors" />
        <input type="radio" id="paper-paper" name="rock-paper-scissors" />
        <input type="radio" id="paper-scissors" name="rock-paper-scissors" />
        <input type="radio" id="scissors-rock" name="rock-paper-scissors" />
        <input type="radio" id="scissors-paper" name="rock-paper-scissors" />
        <input type="radio" id="scissors-scissors" name="rock-paper-scissors" />
        <div>
          <h1>CSS Rock-Paper-Scissors</h1>
          <div id="hands">
            <div className="hand" id="computer-hand">
              <div className="fist"></div>
              <div className="finger finger-1"></div>
              <div className="finger finger-2"></div>
              <div className="finger finger-3"></div>
              <div className="finger finger-4"></div>
              <div className="thumb"></div>
              <div className="arm"></div>
            </div>

            <div className="hand" id="user-hand">
              <div className="fist"></div>
              <div className="finger finger-1"></div>
              <div className="finger finger-2"></div>
              <div className="finger finger-3"></div>
              <div className="finger finger-4"></div>
              <div className="thumb"></div>
              <div className="arm"></div>
            </div>

            <div id="icons">
              <div>
                <label htmlFor="rock-rock">✊</label>
                <label htmlFor="paper-rock">✊</label>
                <label htmlFor="scissors-rock">✊</label>
              </div>
              <div>
                <label htmlFor="rock-paper">🖐️</label>
                <label htmlFor="paper-paper">🖐️</label>
                <label htmlFor="scissors-paper">🖐️</label>
              </div>
              <div>
                <label htmlFor="rock-scissors">✌</label>
                <label htmlFor="paper-scissors">✌</label>
                <label htmlFor="scissors-scissors">✌</label>
              </div>
            </div>
          </div>
        </div>

        <div id="message">
          <h2></h2>
          <input type="reset" value="Refresh Round" />
        </div>
      </form>
    </>
  );
};

export default RockPaperScissor;
