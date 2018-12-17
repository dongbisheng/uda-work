//基类：玩家，敌人，宝物所有可以在地图上占据一格的物体
class Mark {
    static randomBetween(min,max){
        return  Math.floor(Math.random() * (max - min + 1)) + min;
    }
    constructor(row = 0, col = 0, sprite = ''){
        this.row = row;
        this.col = col;
        this.sprite = sprite;
    }
    get x(){
        return this.col * Mark.width;
    }
    get y(){
        return this.row * Mark.height - 20;
    }
    isCrash(mark){
        if(this.x >= mark.x + Mark.width
            || this.x + Mark.width <= mark.x
            || this.y >= mark.y + Mark.height
            || this.y + Mark.height <= mark.y){
            return false;
        }
        return true;
    }
    render(){
        ctx.drawImage(Resources.get(this.sprite),this.x,this.y);
    }
}
Mark.width = 101;
Mark.height = 83;
Mark.row_count = 6;
Mark.col_count = 5;


// 这是我们的玩家要躲避的敌人
class Enemy extends Mark{
    constructor(row = 0, col = 0, sprite = 'images/enemy-bug.png'){
        super(row,col,sprite);
        this.col = -1;
    }
    reset(){
        this.col = Mark.randomBetween(-10,-1);
        this.speed = Mark.randomBetween(1,10);
    }
    update(dt){
        if(this.col * Mark.width > Mark.col_count * Mark.width){
            this.reset();
        }else{
            this.run(dt);
        }
    }
    run(dt){
        this.col += dt * this.speed;
    }
    static genric_bugs(){
        const enemy_1 = new Enemy();
        enemy_1.row = 1;
        enemy_1.speed = 1;
        const enemy_2 = new Enemy();
        enemy_2.row = 2;
        enemy_2.speed = 2;
        const enemy_3 = new Enemy();
        enemy_3.row = 3;
        enemy_3.speed = 3;
        return [enemy_1,enemy_2,enemy_3];
    }
}

//玩家角色
class Player extends Mark{
    constructor(row = 5, col = 2, sprite = 'images/char-boy.png'){
        super(row, col, sprite);
    }
    update(){
        let that = this;
        let crash = allEnemies.some(function (bug) {
            return bug.isCrash(that);
        });
        if(crash){
            this.reset();
        }
    }
    reset(){
        this.row = 5;
    }
    handleInput(e){
        switch (e) {
            case 'up':
                if(this.y > 0){
                    if(this.row === 1){
                        //win!
                        this.reset();
                    }else{
                        this.row--;
                    }
                }
                break;
            case 'left':
                if(this.x > 0){
                    this.col--;
                }
                break;
            case 'down':
                if(this.y < 83 * 5 - 20){
                    this.row++;
                }
                break;
            case 'right':
                if(this.x < 404){
                    this.col++;
                }
                break;
        }
    }
}

//宝藏类
class StoreHouse extends Mark{
    constructor(row,col,time = 3, url = '', store = 1){
        super(col)
        this.sprite = url;
        this.time = time;
        this.store = store;
    }
    render(){

    }
}

/*
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
    this.reset();
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    if(this.x > 505){
        this.reset();
    }else{
        this.run(dt);
    }
};
Enemy.prototype.reset = function(){
    this.x = -101 - Math.random() * 101 * 10;
    this.speed = 200 + Math.random() * 100 ;
}
Enemy.prototype.run = function(dt){
    this.x += dt * this.speed;
}

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// 现在实现你自己的玩家类
var Player = function(){
    this.sprite = 'images/char-boy.png';
}
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
Player.prototype.update = function(){
    let that = this;
    let crash = allEnemies.some(function (bug) {
        return bug.isCrash(that);
    });
    if(crash){
        this.reset();
    }
};
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.reset = function(){
    this.y = 83 * 5 - 20;
}
Player.prototype.handleInput = function (e) {
    switch (e) {
        case 'up':
            if(this.y > 0){
                this.y -= 83;
            }
            break;
        case 'left':
            if(this.x > 0){
                this.x -= 101;
            }
            break;
        case 'down':
            if(this.y < 83 * 5 - 20){
                this.y += 83;
            }
            break;
        case 'right':
            if(this.x < 404){
                this.x += 101;
            }
            break;
    }
};
*/



let storeHouse = new StoreHouse('hello',10);


// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
const allEnemies = Enemy.genric_bugs();
// 把玩家对象放进一个叫 player 的变量里面
var player = new Player();
// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
