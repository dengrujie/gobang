import React, { useState, useEffect, useRef, useCallback } from 'react';
import Gobang from './gobang';
import CanvasGobang from '../component/canvas/index';
import Gomoku from '../component/web/index';
import '../component/web/web.css';





const GoBangCanvas = () => {
  const main = useRef(null);
  const [gobangGame, setGobangGame] = useState(null);
  const [show, setShow] = useState(false);
  const gobangCanvas = useRef(null);
  const [checkerboard, setCheckerboard] = useState([]);

  const doSetCheckerboard = (checkerboard) => {
    const newCheckerboard = JSON.parse(JSON.stringify(checkerboard));
    setCheckerboard(newCheckerboard);
  };

  const createGobang = useCallback(() => {
    const gobang = new Gobang({
      role: 2, // 角色 1黑色棋子 2白色棋子 ，这里是白色棋子先下
      gobangStyle: {
        padding: 30, // 边和边之间的距离 ,不可修改，这里没考虑到边距的问题
        count: 20, // 正方体的边数
        borderColor: '#bfbfbf', // 描边的颜色
      },
    });
    setGobangGame(gobang);
    setCheckerboard(gobang.checkerboard);
  }, []);

  const createCanvas = useCallback(() => {
    const gobangCanvasObj = new CanvasGobang({
      canvas: main.current, // 画布的id
      role: 2, // 角色 1黑色棋子 2白色棋子 ，这里是白色棋子先下
      gobangStyle: {
        // padding不允许改变哦
        padding: 30, // 边和边之间的距离 ,不可修改，这里没考虑到边距的问题
        count: 20, // 正方体的边数
        borderColor: '#bfbfbf', // 描边的颜色
      },
    });
    gobangCanvasObj.addDownChessmanCallback(gobangGame.listenDownChessman);
    gobangCanvasObj.getChessboard(gobangGame.checkerboard);
    gobangGame.addCheckerboardCallback(gobangCanvasObj.getChessboard);
    gobangGame.addCheckerboardCallback(doSetCheckerboard);
    // gobangGame.addDownChessCallback(doSetCheckerboard);
    gobangGame.addDownChessCallback(gobangCanvasObj.drawChessman);
    gobangGame.addRegretCallback(gobangCanvasObj.regretChess);
    gobangGame.addRevokedRegretCallback(gobangCanvasObj.revokedRegretChess);
    gobangGame.addWinCallback(gobangCanvasObj.changeWin);
    gobangCanvas.current = gobangCanvasObj;
  }, [gobangGame]);

  useEffect(() => {
    createGobang();
  }, [createGobang]);

  useEffect(() => {
    if (gobangGame) {
      createCanvas();
    }
  }, [gobangGame, createCanvas]);

  // 重新开始
  const restart = () => {
    gobangGame.init();
    gobangCanvas.current.init();
  };

  // 悔棋
  const goback = () => {
    gobangGame.regretChess();
  };

  // 撤销悔棋
  const regret = () => {
    gobangGame.revokedRegretChess();
  };

  const getVALUE_TEXT = () => {
    const VALUE_TEXT_CANVAS = {
        0: '',
        1: '黑棋',
        2: '白棋',
    };
    const VALUE_TEXT_WEB = {
        0: '',
        1: 'O',
        2: 'X',
    };
    if(show) {
        let msg = gobangGame.win ? `胜者: ${VALUE_TEXT_WEB[gobangGame.role === 1 ? 2 : 1]}`: `棋手: ${VALUE_TEXT_WEB[gobangGame.role]}`;
        return msg
    }
    let msg = gobangGame.win ? `胜者: ${VALUE_TEXT_CANVAS[gobangGame.role === 1 ? 2 : 1]}`: `棋手: ${VALUE_TEXT_CANVAS[gobangGame.role]}`;
    return msg
  }

  return (
    <>
      <div className="gomoku-bar">
        {
            gobangGame && (<label>{getVALUE_TEXT()}</label>)
        }
      </div>
      <div className='gobang'>
        <canvas ref={main} hidden={show}></canvas>
      </div>
      {gobangGame && show && (
        <Gomoku
          role={gobangGame.role}
          win={gobangGame.win}
          resultList={gobangGame.resultList}
          checkerboard={checkerboard}
          listenDownChessman={gobangGame.listenDownChessman}
        />
      )}
      <div className='footer'>
        <button onClick={() =>  setShow(!show)}>切换</button>
        <button onClick={restart}>重新开始</button>
        <button onClick={goback}>悔棋</button>
        <button onClick={regret}>撤销悔棋</button>
      </div>
    </>
  );
};

export default GoBangCanvas;
