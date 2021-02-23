import React from 'react';
// import './web.css';

/**
 * 值对应的显示文本
 */
const VALUE_TEXT = {
  0: '',
  1: 'O',
  2: 'X',
};

/**
 * 棋子单元格
 */
function Square(props) {
  return (
    <label
      className={`square ${props.active ? 'active' : ''}`}
      datarow={props.row}
      datacol={props.col}
    >
      {VALUE_TEXT[props.value]}
    </label>
  );
}

/**
 * 五子棋
 */
const Gomoku = (props) => {
  const { role, win, resultList, checkerboard, listenDownChessman } = props;

  /**
   * 下棋
   */
  const handleClick = (e) => {
    let target = e.target;
    if (win || !target.getAttribute('datarow')) {
      return;
    }

    let row = +target.getAttribute('datarow'),
      col = +target.getAttribute('datacol');
    if (checkerboard[row][col] !== 0) {
      console.log('当前单元格已被使用.');
      return;
    }
    listenDownChessman(row, col, role);
  };

  const setStaticState = (resultList) => {
    let result = [];
    if (resultList && resultList.length === 5) {
      resultList.forEach((item) => {
        result.push(`${item.x}-${item.y}`);
      });
    }
    return result;
  };

  let result = setStaticState(resultList);
  return (
    <div className="gomoku-box" onClick={handleClick}>
      <div className="game-box">
        <div className="square-box">
          {checkerboard.map((row, i) => {
            return (
              <div key={i} className="square-row">
                {row.map((cell, j) => {
                  let key = `${i}-${j}`;
                  return (
                    <Square
                      key={key}
                      active={win && result.includes(key)}
                      value={cell}
                      row={i}
                      col={j}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Gomoku;
