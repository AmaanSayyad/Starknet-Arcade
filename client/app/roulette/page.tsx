"use client";
import React from "react";
import { AiOutlineSound } from "react-icons/ai";
import { RiResetLeftFill } from "react-icons/ri";
import { ImSpinner4 } from "react-icons/im";
export default function RoulettePage() {
  return (
    <>
      <div className="website-wrapper font-techno" id="website-wrapper">
        <div className="roulette-table">
          <div className="top-bar">
            <div className="roulette-rolls-container">
              <div className="roll roll5"></div>
              <div className="roll roll4"></div>
              <div className="roll roll3"></div>
              <div className="roll roll2"></div>
              <div className="roll roll1"></div>
              <div className="roll roll-last"></div>
            </div>
            <div className="game-name">ROULETTE</div>
            <div className="min-max-bet">
              <div className="min-bet bet-size">
                <span className="text-color">MIN:</span> $5.00
              </div>
              <div className="max-bet bet-size">
                <span className="text-color">MAX:</span> $1000.00
              </div>
            </div>
          </div>
          <div className="roulette-wheel-container">
            <div className="roulette-wheel">
              <div className="roulette-wheel-main roulette-image"></div>
              <div className="roulette-center roulette-image"></div>
              <div className="roulette-cross-shadow roulette-image"></div>
              <div className="roulette-cross roulette-image">
                <div className="number-glow-container"></div>
              </div>
              <div className="ball-container"></div>
            </div>
          </div>

          <div className="betting-area">
            <div className="top-area">
              <div className="number number0 regular regular0 part"></div>
              <div className="number number3 black"></div>
              <div className="number number2 red"></div>
              <div className="number number1 black"></div>
              <div className="number number6 red"></div>
              <div className="number number5 black"></div>
              <div className="number number4 red"></div>
              <div className="number number9 black"></div>
              <div className="number number8 red"></div>
              <div className="number number7 black"></div>
              <div className="number number12 red"></div>
              <div className="number number11 black"></div>
              <div className="number number10 red"></div>
              <div className="number number15 black"></div>
              <div className="number number14 red"></div>
              <div className="number number13 black"></div>
              <div className="number number18 red"></div>
              <div className="number number17 black"></div>
              <div className="number number16 red"></div>
              <div className="number number21 black"></div>
              <div className="number number20 red"></div>
              <div className="number number19 black"></div>
              <div className="number number24 red"></div>
              <div className="number number23 black"></div>
              <div className="number number22 red"></div>
              <div className="number number27 black"></div>
              <div className="number number26 red"></div>
              <div className="number number25 black"></div>
              <div className="number number30 red"></div>
              <div className="number number29 black"></div>
              <div className="number number28 red"></div>
              <div className="number number33 black"></div>
              <div className="number number32 red"></div>
              <div className="number number31 black"></div>
              <div className="number number36 red"></div>
              <div className="number number35 black"></div>
              <div className="number number34 red"></div>
              <div className="number bet2to1-1 part"></div>
              <div className="number bet2to1-2 part"></div>
              <div className="number bet2to1-3 part"></div>
              <div className="top-area-overlay">
                <div className="part line line3 top-row"></div>
                <div className="part regular regular3 top-row"></div>
                <div className="part line line6 top-row"></div>
                <div className="part regular regular6 top-row"></div>
                <div className="part line line9 top-row"></div>
                <div className="part regular regular9 top-row"></div>
                <div className="part line line12 top-row"></div>
                <div className="part regular regular12 top-row"></div>
                <div className="part line line15 top-row"></div>
                <div className="part regular regular15 top-row"></div>
                <div className="part line line18 top-row"></div>
                <div className="part regular regular18 top-row"></div>
                <div className="part line line21 top-row"></div>
                <div className="part regular regular21 top-row"></div>
                <div className="part line line24 top-row"></div>
                <div className="part regular regular24 top-row"></div>
                <div className="part line line27 top-row"></div>
                <div className="part regular regular27 top-row"></div>
                <div className="part line line30 top-row"></div>
                <div className="part regular regular30 top-row"></div>
                <div className="part line line33 top-row"></div>
                <div className="part regular regular33 top-row"></div>
                <div className="part line line36 top-row"></div>
                <div className="part regular regular36 last top-row"></div>
                <div className="part corner corner3 line between"></div>
                <div className="part between between3"></div>
                <div className="part corner corner6 line between"></div>
                <div className="part between between6"></div>
                <div className="part corner corner9 line between"></div>
                <div className="part between between9"></div>
                <div className="part corner corner12 line between"></div>
                <div className="part between between12"></div>
                <div className="part corner corner15 line between"></div>
                <div className="part between between15"></div>
                <div className="part corner corner18 line between"></div>
                <div className="part between between18"></div>
                <div className="part corner corner21 line between"></div>
                <div className="part between between21"></div>
                <div className="part corner corner24 line between"></div>
                <div className="part between between24"></div>
                <div className="part corner corner27 line between"></div>
                <div className="part between between27"></div>
                <div className="part corner corner30 line between"></div>
                <div className="part between between30"></div>
                <div className="part corner corner33 line between"></div>
                <div className="part between between33"></div>
                <div className="part corner corner36 line between"></div>
                <div className="part last between between36"></div>
                <div className="part line line2 center"></div>
                <div className="part regular regular2 center"></div>
                <div className="part line line5 center"></div>
                <div className="part regular regular5 center"></div>
                <div className="part line line8 center"></div>
                <div className="part regular regular8 center"></div>
                <div className="part line line11 center"></div>
                <div className="part regular regular11 center"></div>
                <div className="part line line14 center"></div>
                <div className="part regular regular14 center"></div>
                <div className="part line line17 center"></div>
                <div className="part regular regular17 center"></div>
                <div className="part line line20 center"></div>
                <div className="part regular regular20 center"></div>
                <div className="part line line23 center"></div>
                <div className="part regular regular23 center"></div>
                <div className="part line line26 center"></div>
                <div className="part regular regular26 center"></div>
                <div className="part line line29 center"></div>
                <div className="part regular regular29 center"></div>
                <div className="part line line32 center"></div>
                <div className="part regular regular32 center"></div>
                <div className="part line line35 center"></div>
                <div className="part regular regular35 last center"></div>
                <div className="part corner corner2 line between"></div>
                <div className="part between between2"></div>
                <div className="part corner corner5 line between"></div>
                <div className="part between between5"></div>
                <div className="part corner corner8 line between"></div>
                <div className="part between between8"></div>
                <div className="part corner corner11 line between"></div>
                <div className="part between between11"></div>
                <div className="part corner corner14 line between"></div>
                <div className="part between between14"></div>
                <div className="part corner corner17 line between"></div>
                <div className="part between between17"></div>
                <div className="part corner corner20 line between"></div>
                <div className="part between between20"></div>
                <div className="part corner corner23 line between"></div>
                <div className="part between between23"></div>
                <div className="part corner corner26 line between"></div>
                <div className="part between between26"></div>
                <div className="part corner corner29 line between"></div>
                <div className="part between between29"></div>
                <div className="part corner corner32 line between"></div>
                <div className="part between between32"></div>
                <div className="part corner corner35 line between"></div>
                <div className="part last between between35"></div>
                <div className="part center line line1"></div>
                <div className="part center regular regular1"></div>
                <div className="part center line line4"></div>
                <div className="part center regular regular4"></div>
                <div className="part center line line7"></div>
                <div className="part center regular regular7"></div>
                <div className="part center line line10"></div>
                <div className="part center regular regular10"></div>
                <div className="part center line line13"></div>
                <div className="part center regular regular13"></div>
                <div className="part center line line16"></div>
                <div className="part center regular regular16"></div>
                <div className="part center line line19"></div>
                <div className="part center regular regular19"></div>
                <div className="part center line line22"></div>
                <div className="part center regular regular22"></div>
                <div className="part center line line25"></div>
                <div className="part center regular regular25"></div>
                <div className="part center line line28"></div>
                <div className="part center regular regular28"></div>
                <div className="part center line line31"></div>
                <div className="part center regular regular31"></div>
                <div className="part center line line34"></div>
                <div className="part center regular regular34 last"></div>
                <div className="part corner corner1 line between"></div>
                <div className="part between between1"></div>
                <div className="part corner corner4 line between"></div>
                <div className="part between between4"></div>
                <div className="part corner corner7 line between"></div>
                <div className="part between between7"></div>
                <div className="part corner corner10 line between"></div>
                <div className="part between between10"></div>
                <div className="part corner corner13 line between"></div>
                <div className="part between between13"></div>
                <div className="part corner corner16 line between"></div>
                <div className="part between between16"></div>
                <div className="part corner corner19 line between"></div>
                <div className="part between between19"></div>
                <div className="part corner corner22 line between"></div>
                <div className="part between between22"></div>
                <div className="part corner corner25 line between"></div>
                <div className="part between between25"></div>
                <div className="part corner corner28 line between"></div>
                <div className="part between between28"></div>
                <div className="part corner corner31 line between"></div>
                <div className="part between between31"></div>
                <div className="part corner corner34 line between"></div>
                <div className="part last between between34"></div>
              </div>
            </div>
            <div className="bottom-area">
              <div className="bottom-column bottom-column1 column-1st12 part"></div>
              <div className="bottom-column bottom-column2 column-2nd12 part"></div>
              <div className="bottom-column bottom-column3 column-3rd12 part"></div>
              <div className="bottom-column bottom-column4 column-1to18 part"></div>

              <div className="bottom-column bottom-column5 column-even part"></div>
              <div className="bottom-column bottom-column6 column-red part"></div>
              <div className="bottom-column bottom-column7 column-black part"></div>
              <div className="bottom-column bottom-column8 column-odd part"></div>
              <div className="bottom-column bottom-column9 column-19to36 part"></div>
            </div>
          </div>
          <div className="selections-container">
            <div className="betting-chips-container">
              <div
                className="betting-chip betting-chip-menu betting-chip-menu5 betting-chip5"
                id="chip5"
              >
                5
              </div>
              <div
                className="betting-chip betting-chip-menu betting-chip-menu10 betting-chip10"
                id="chip10"
              >
                10
              </div>
              <div
                className="betting-chip betting-chip-menu betting-chip-menu20 betting-chip20"
                id="chip20"
              >
                20
              </div>
              <div
                className="betting-chip betting-chip-menu betting-chip-menu50 betting-chip50"
                id="chip50"
              >
                50
              </div>
              <div
                className="betting-chip betting-chip-menu betting-chip-menu100 betting-chip100"
                id="chip100"
              >
                100
              </div>
              <div
                className="betting-chip betting-chip-menu betting-chip-menu200 betting-chip200"
                id="chip200"
              >
                200
              </div>
            </div>
            <div className="menu-container">
              <div className="button button-spin">
                <div className="circle">
                  <ImSpinner4 size={50} />
                </div>
                <div className="circle-overlay"></div>
                <div className="button-text">SPIN</div>
              </div>
              <div className="button button-reset">
                <div className="circle">
                  <RiResetLeftFill size={50}/>
                </div>
                <div className="circle-overlay"></div>

                <div className="button-text">RESET</div>
              </div>
              <div className="button button-sound">
                <div className="circle">
                  <AiOutlineSound size={50}/>
                </div>
                <div className="circle-overlay"></div>

                <div className="button-text">SOUNDS</div>
              </div>
            </div>
          </div>

          <div className="money-container">
            <div className="cash-area area">
              <div className="text">
                <span>CASH</span> $
              </div>
              <div className="cash-total"></div>
            </div>
            <div className="bet-area area">
              <div className="text">
                <span>BET</span> $
              </div>
              <div className="bet-total">0.00</div>
            </div>
          </div>

          <div className="alert-message-container alert-bets">
            <div className="alert-message">PLEASE PLACE YOUR BETS</div>
          </div>

          <div className="alert-message-container alert-money">
            <div className="alert-message">NOT ENOUGH MONEY</div>
          </div>

          <div className="alert-message-container alert-max-bet">
            <div className="alert-message">
              YOU SHOULD NOT EXCEED MAXIMUM BET OF $1000
            </div>
          </div>

          <div className="alert-message-container alert-spin-result">
            <div className="results">
              <div className="odd-even text">ODD</div>
              <div className="high-low text">HIGH</div>
              <div className="roll-number text">26</div>
              <div className="win-lose text">WIN</div>
              <div className="win-amount text">100</div>
            </div>
          </div>

          <div className="alert-message-container alert-game-over">
            <div className="alert-message">
              <div className="text text1">YOU ARE OUT OF MONEY.</div>
              <div className="text text2">WOULD YOU LIKE TO PLAY AGAIN?</div>
              <div className="answers">
                <div className="answer answer-no">NO</div>
                <div className="answer answer-yes">YES</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
