export default class Gobang {
    constructor(options) {
      this.options = options;
      this.chessboard = options.canvas;
      this.downChessmanCallback = [];
  
      // 初始化
      this.init();
  
      this.lattice = {
        width: options.gobangStyle.padding,
        height: options.gobangStyle.padding,
      };
  
      this.regretChess = this.regretChess.bind(this);
      this.revokedRegretChess = this.revokedRegretChess.bind(this);
      this.changeWin = this.changeWin.bind(this);
      this.getChessboard = this.getChessboard.bind(this);
      this.drawChessman = this.drawChessman.bind(this);
    }
  
    // 初始化
    init() {
      const { options } = this;
      // 角色 ，1黑色棋子 2白色棋子
      this.role = options.role || 1;
      // 画出棋盘
      this.drawChessboard();
      // 落子
      this.listenDownChessman();
      //  初始棋盘矩阵
      // this.initChessboardMatrix();
    }
  
    // 判断角色，1黑色棋子 2白色棋子
    checkRole(role) {
      return role === 1;
    }
  
    // 画出棋盘
    drawChessboard() {
      const { options } = this;
      const context = this.chessboard.getContext('2d');
      const { count, padding, borderolor } = options.gobangStyle;
      this.chessboard.width = this.chessboard.height = padding * count;
      context.strokeStyle = borderolor;
      context.lineWidth = 2;
  
      for (let i = 0; i < count; i++) {
        context.moveTo(15 + i * padding, 15);
        context.lineTo(15 + i * padding, count * padding - 15);
        context.stroke();
        context.moveTo(15, 15 + i * padding);
        context.lineTo(count * padding - 15, 15 + i * padding);
        context.stroke();
      }
    }
  
    // 获取棋盘矩阵
    getChessboard(checkerboard) {
      this.checkerboard = JSON.parse(JSON.stringify(checkerboard));
    }
  
    // 刻画棋子
    drawChessman(x, y, role) {
      const isBlack = this.checkRole(role)
      const context = this.chessboard.getContext('2d');
      context.beginPath();
      context.arc(15 + x * 30, 15 + y * 30, 13, 0, 2 * Math.PI); // 画圆
      context.closePath();
      //渐变
      var gradient = context.createRadialGradient(
        15 + x * 30 + 2,
        15 + y * 30 - 2,
        13,
        15 + x * 30 + 2,
        15 + y * 30 - 2,
        0
      );
      if (isBlack) {
        // 黑子
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(1, '#636766');
      } else {
        // 白子
        gradient.addColorStop(0, '#d1d1d1');
        gradient.addColorStop(1, '#f9f9f9');
      }
      context.fillStyle = gradient;
      context.fill();
    }
    // 落子
    listenDownChessman() {
      this.chessboard.onclick = (event) => {
        // 获取棋子的位置(x,y) => (0,1)
        let { offsetX: x, offsetY: y } = event;
        x = Math.round((x - 15) / this.lattice.width);
        y = Math.round((y - 15) / this.lattice.height);
        // 空的位置才可以落子
        if (
          this.checkerboard[x][y] !== undefined &&
          Object.is(this.checkerboard[x][y], 0)
        ) {
          // 落子后更新矩阵,切换角色，并且记录
          this.checkerboard[x][y] = this.role;
          // 刻画棋子
          this.drawChessman(x, y, this.checkRole(this.role));
          // 保存坐标，切换角色和保存快照
          this.role = this.checkRole(this.role) ? 2 : 1;
          this.downChessmanCallback.forEach((cb) => cb(x, y, this.role));
        }
      };
    }
    // 悔棋
    regretChess(x, y, role) {
      // 找到最后一次记录，回滚到UI，更新矩阵
      // 销毁棋子
      this.minusStep(x, y);
      this.role = this.checkRole(role) ? 2 : 1;
    }
    // 撤销悔棋
    revokedRegretChess(x, y, role) {
      this.drawChessman(x, y, role === 1);
      this.role = this.checkRole(role) ? 2 : 1;
    }
    // 销毁棋子
    minusStep(x, y) {
      let { options } = this;
      const { count } = options.gobangStyle;
      const context = this.chessboard.getContext('2d');
      context.clearRect(x * 30, y * 30, 30, 30);
      // 重画该圆周围的格子,对边角的格式进行特殊的处理
      if (x <= 0 && y <= 0) {
        this.fixchessboard(15, 15, 15, 30, 15, 15, 30, 15);
      } else if (x >= count - 1 && y <= 0) {
        this.fixchessboard(
          count * 30 - 15,
          15,
          count * 30 - 30,
          15,
          count * 30 - 15,
          15,
          count * 30 - 15,
          30
        );
      } else if (y >= count - 1 && x <= 0) {
        this.fixchessboard(
          15,
          count * 30 - 15,
          15,
          count * 30 - 30,
          15,
          count * 30 - 15,
          30,
          count * 30 - 15
        );
      } else if (x >= count - 1 && y >= count - 1) {
        this.fixchessboard(
          count * 30 - 15,
          count * 30 - 15,
          count * 30 - 30,
          count * 30 - 15,
          count * 30 - 15,
          count * 30 - 15,
          count * 30 - 15,
          count * 30 - 30
        );
      } else if (x <= 0 && y > 0 && y < count - 1) {
        this.fixchessboard(
          15,
          30 * y + 15,
          30,
          30 * y + 15,
          15,
          30 * y,
          15,
          30 * y + 30
        );
      } else if (y <= 0 && x > 0 && x < count - 1) {
        this.fixchessboard(
          x * 30 + 15,
          15,
          x * 30 + 15,
          30,
          x * 30,
          15,
          x * 30 + 30,
          15
        );
      } else if (x >= count - 1 && y > 0 && y < count - 1) {
        this.fixchessboard(
          count * 30 - 15,
          y * 30 + 15,
          count * 30 - 30,
          y * 30 + 15,
          count * 30 - 15,
          y * 30,
          count * 30 - 15,
          y * 30 + 30
        );
      } else if (y >= count - 1 && x > 0 && x < count - 1) {
        this.fixchessboard(
          x * 30 + 15,
          count * 30 - 15,
          x * 30 + 15,
          count * 30 - 30,
          x * 30,
          count * 30 - 15,
          x * 30 + 30,
          count * 30 - 15
        );
      } else {
        this.fixchessboard(
          15 + x * 30,
          y * 30,
          15 + x * 30,
          y * 30 + 30,
          x * 30,
          y * 30 + 15,
          (x + 1) * 30,
          y * 30 + 15
        );
      }
    }
    // 修补删除后的棋盘
    fixchessboard(a, b, c, d, e, f, g, h) {
      const context = this.chessboard.getContext('2d');
      context.beginPath();
      context.lineWidth = 2;
      context.moveTo(a, b);
      context.lineTo(c, d);
      context.moveTo(e, f);
      context.lineTo(g, h);
      context.stroke();
    }
  
    changeWin(role) {
      this.win = true;
      let msg = (role === 1 ? '黑' : '白') + '子胜利✌️';
      // 提示信息
      this.result = msg;
      // 不允许再操作
      this.chessboard.onclick = null;
    }
  
    // 添加落子回调
    addDownChessmanCallback(cb) {
      this.downChessmanCallback.push(cb);
    }
  }
  