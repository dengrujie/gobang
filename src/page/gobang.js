export default class Gobang {
  constructor(options) {
    this.options = options;
    this.checkerboard = [];
    this.resultList = [];
    this.downChessCallback = [];
    this.CheckerboardCallback = [];
    this.regretCallback = [];
    this.revokedRegretCallback = [];
    this.winCallback = [];
    this.listenDownChessman = this.listenDownChessman.bind(this);
    // this.regretChess = this.regretChess.bind(this);
    // this.revokedRegretChess = this.revokedRegretChess.bind(this);
    // 初始化
    this.init();
  }

  // 初始化
  init() {
    const { options } = this;
    // 角色 ，1黑色棋子 2白色棋子
    this.role = options.role || 1;
    // 是否已经分出了胜负
    this.win = false;
    // 走棋的记录
    this.history = [];
    // 当前步
    this.currentStep = 0;
    // 结果提示信息
    this.result = '';
    // 落子
    // this.listenDownChessman();
    //  初始棋盘矩阵
    this.initChessboardMatrix();
  }

  // 初始棋盘矩阵
  initChessboardMatrix() {
    const { options } = this;
    const checkerboard = [];
    for (let x = 0; x < options.gobangStyle.count; x++) {
      checkerboard[x] = [];
      for (let y = 0; y < options.gobangStyle.count; y++) {
        checkerboard[x][y] = 0;
      }
    }
    this.checkerboard = checkerboard;
    this.CheckerboardCallback.forEach((cb) => cb(this.checkerboard));
  }

  // 落子
  listenDownChessman(x, y) {
    // 空的位置才可以落子
    if (
      this.checkerboard[x][y] !== undefined &&
      this.checkerboard[x][y] === 0
    ) {
      // 落子后更新矩阵,切换角色，并且记录
      this.checkerboard[x][y] = this.role;
      // 落子完之后有可能悔棋之后落子，这种情况下应该重置历史记录
      this.history.length = this.currentStep;
      this.history.push({
        x,
        y,
        role: this.role,
      });
      // 保存坐标，切换角色和保存快照
      this.currentStep++;
      this.role = Object.is(this.role, 1) ? 2 : 1;
    }
    const role = this.role;
    this.downChessCallback.forEach((cb) => cb(x, y, role));
    this.CheckerboardCallback.forEach((cb) => cb(this.checkerboard));
    this.checkWin(x, y, this.role);
  }

  // 悔棋
  regretChess() {
    // 找到最后一次记录，回滚到UI，更新矩阵
    if (this.history.length && !this.win) {
      const prev = this.history[this.currentStep - 1];
      if (prev) {
        const { x, y, role } = prev;
        // 销毁棋子
        this.regretCallback.forEach((cb) => {
          cb(x, y, role);
        });
        this.checkerboard[prev.x][prev.y] = 0;
        this.currentStep--;
        this.role = Object.is(this.role, 1) ? 2 : 1;
        this.CheckerboardCallback.forEach((cb) => cb(this.checkerboard));
      }
    }
  }
  // 撤销悔棋
  revokedRegretChess() {
    const next = this.history[this.currentStep];
    if (next) {
      this.revokedRegretCallback.forEach((cb) => {
        cb(next.x, next.y, next.role);
      });
      this.checkerboard[next.x][next.y] = next.role;
      this.currentStep++;
      this.role = Object.is(this.role, 1) ? 2 : 1;
      this.CheckerboardCallback.forEach((cb) => cb(this.checkerboard));
    }
  }

  // 判断输赢
  checkWin(x, y, role) {
    if (x === undefined || y === undefined || role === undefined) return;
    // 连续棋数
    const { checkerboard } = this;
    let countContinuous = 0;
    const XContinuous = checkerboard.map((x, i) => ({ x: i, y, value: x[y] }));
    const YContinuous = checkerboard[x].map((value, y) => ({ x, y, value }));
    const S1Continuous = [];
    const S2Continuous = [];
    checkerboard.forEach((item, index) => {
      // 左斜线
      const S1Item = item[y - (x - index)];
      if (S1Item !== undefined) {
        S1Continuous.push({
          x: index,
          y: y - (x - index),
          value: S1Item,
        });
      }
      // 右斜线
      const S2Item = item[y + (x - index)];
      if (S2Item !== undefined) {
        S2Continuous.push({
          x: index,
          y: y + (x - index),
          value: S2Item,
        });
      }
    });
    let resultList;
    // 当前落棋点所在的X轴/Y轴/交叉斜轴，只要有能连起来的5个子的角色即有胜者
    [XContinuous, YContinuous, S1Continuous, S2Continuous].forEach((axis) => {
      if (axis.length < 5) return;
      let index;
      if (
        axis.some((x, j) => {
          if (j >= 2) {
            index = j;
            return (
              axis[j].value !== 0 &&
              axis[j - 2].value === axis[j - 1].value &&
              axis[j - 1].value === axis[j].value &&
              axis[j].value === axis[j + 1].value &&
              axis[j + 1].value === axis[j + 2].value
            );
          }
          return false;
        })
      ) {
        resultList = [
          axis[index - 2],
          axis[index - 1],
          axis[index],
          axis[index + 1],
          axis[index + 2],
        ];
        countContinuous++;
      }
    });

    // 如果赢了就给出提示
    if (countContinuous) {
      this.win = true;
      let msg = (role === 1 ? '黑' : '白') + '子胜利✌️';
      // 提示信息
      this.result = msg;
      this.resultList = resultList;
      this.winCallback.forEach((cb) => cb(role, msg, resultList));
    }
  }

  // 棋盘数据变化回调
  addCheckerboardCallback(cb) {
    this.CheckerboardCallback.push(cb);
  }

  // 添加落子回调
  addDownChessCallback(cb) {
    this.downChessCallback.push(cb);
  }

  // 添加游戏结束回调
  addWinCallback(cb) {
    this.winCallback.push(cb);
  }

  // 添加悔棋回调队列
  addRegretCallback(cb) {
    this.regretCallback.push(cb);
  }

  // 添加撤销悔棋回调队列
  addRevokedRegretCallback(cb) {
    this.revokedRegretCallback.push(cb);
  }
}
