/*
 * 创建一个包含所有卡片的数组
 */
const items = ['fa-diamond','fa-paper-plane-o','fa-anchor','fa-bolt','fa-cube','fa-leaf','fa-bicycle','fa-bomb'];
//记忆时间
let show_seconds = 10;
//记录上一个点击的卡片
let pre_target = null;
//已完成的卡片
let solvedCard = 0;
//点击次数
let moves = 0;
//星级评分 最高评分点击16次完成为三星，之后每多点击10次减一星，最低一星
let stars = 3;
//总耗时
let cost_second = 0;
let stop_time_flag = false;
//设置一个bool值，快速点击三次卡片时的响应
let fobiden = false;
/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */
//随机生成新的游戏卡片
genericNewCards();
//展示倒计时
timeCount();


//倒计时10秒用于玩家记忆，10秒后隐藏卡片
function timeCount(){
    const panel = document.querySelector('.score-panel');
    if(show_seconds > 0){
        setTimeout(function () {
            timeCount();
        },1000);
        panel.innerHTML = show_seconds + ' seconds later to start!';
        show_seconds -= 1;
    }else{
        show_seconds = 10;
        const panel_html =  `<ul class='stars'>
                <li><i class='fa fa-star'></i></li>
            <li><i class='fa fa-star'></i></li>
            <li><i class='fa fa-star'></i></li>
            </ul>

            <span class='moves'>${moves}</span> Moves
            <span class="times">Time: ${cost_second} second</span>

                <div class='restart'>
                <i class='fa fa-repeat'></i>
                </div>`;
        panel.innerHTML = panel_html;
        const restart_btn = document.querySelector('.restart');
        restart_btn.addEventListener('click',function () {
            stopCountTime();
            pre_target = null;
            solvedCard = 0;
            moves = 0;
            stars = 3;
            cost_second = 0;
            fobiden = false;
            genericNewCards();
            timeCount();

        });
        hiddenCards();
        stop_time_flag = false;
        startCountTime();
    }

}

function refreshTimes(){
    const time_ele = document.getElementsByClassName('times')[0];
    time_ele.innerHTML = 'Time:  ' + cost_second + ' second';
}

function refreshStorePannel(){
    const move_ele = document.getElementsByClassName('moves')[0];
    move_ele.innerHTML = moves + '';
    if (moves > 25){
        let delta = Math.floor((moves - 16) / 10);
        stars = delta >= 3 ? 1 : (3 - delta);
    }
    const stars_ul = document.getElementsByClassName('stars')[0];
    stars_ul.innerHTML = "";
    for(let i = 0; i < stars; i++){
        const li = document.createElement('li');
        const li_item = document.createElement('i');
        li_item.classList.add('fa','fa-star');
        li.appendChild(li_item);
        stars_ul.appendChild(li);
    }
}

//生成新的卡片游戏deck
function genericNewCards(){
    clearCards();
    const r_items = items.concat(items);
    const cards = shuffle(r_items);
    const frag = document.createDocumentFragment();
    for(let i = 0; i < cards.length; i++){
        let li = document.createElement('li');
        li.classList.add('card','open','show');
        let li_item = document.createElement('i');
        li_item.classList.add('fa',cards[i]);
        li.appendChild(li_item);
        frag.appendChild(li);
    }
    const deck_table = document.querySelector('.deck');
    deck_table.appendChild(frag);
    deck_table.addEventListener('click',function (evn) {
        if(fobiden) return;
        if(evn.target.nodeName !== 'LI') return;
        if(evn.target.classList.contains('show','open','error','match')) return;
        moves += 1;
        refreshStorePannel();
        evn.target.classList.add('open');
        evn.target.classList.add('show');
        const now_target = evn.target;
       const targetCardId =now_target.children[0].classList[1];

       if(pre_target === null){
           pre_target = now_target;
       } else{
           const preCardId = pre_target.children[0].classList[1];
           if(preCardId === targetCardId){
               openCard(pre_target);
               openCard(now_target);
               pre_target = null;
               solvedCard += 2;
               if(solvedCard == 16){
                   showWinPage();
                   solvedCard = 0;
                   stopCountTime();
               }
           }else{
               fobiden = true;
               pre_target.classList.add('error');
               now_target.classList.add('error');
               setTimeout(function () {
                   hiddenCard(pre_target);
                   hiddenCard(now_target);
                   pre_target = null;
                   fobiden = false;
               },500);
           }
       }
    });
}

//隐藏卡片
function hiddenCards(){
    const cards = document.getElementsByClassName('card');
    for(let i = 0; i < cards.length; i++){
        hiddenCard(cards[i]);
    }
}

function hiddenCard(card){
    card.classList.remove('show');
    card.classList.remove('match');
    card.classList.remove('open');
    card.classList.remove('error');
}
//成功翻开一对卡片
function openCard(card){
    card.classList.add('match');
}
//清空卡片
function clearCards(){
    const deck = document.getElementsByClassName('deck')[0];
    deck.innerHTML = "";
}
//显示胜利页面
function showWinPage() {
    const win_store_para = document.getElementsByClassName('win_store_data')[0];
    win_store_para.textContent = `With ${moves} moves and ${stars} stars!`;
    const win_time_para = document.getElementsByClassName('win_time_data')[0];
    win_time_para.textContent =  `Total cost ${cost_second} seconds!`;
    const winPage = document.getElementsByClassName('win_page')[0];
    winPage.classList.remove('hidden_content');
    winPage.classList.add('show_content');
    const container = document.getElementsByClassName('container')[0];
    container.classList.remove('show_content');
    container.classList.add('hidden_content');
}
//再玩一次
function playAagain() {
    const winPage = document.getElementsByClassName('win_page')[0];
    winPage.classList.remove('show_content');
    winPage.classList.add('hidden_content');
    const container = document.getElementsByClassName('container')[0];
    container.classList.remove('hidden_content');
    container.classList.add('show_content');
    pre_target = null;
    solvedCard = 0;
    moves = 0;
    stars = 3;
    cost_second = 0;
    stop_time_flag = false;
    genericNewCards();
    timeCount();
}

//开始记时
function startCountTime(){
    if(!stop_time_flag){
        cost_second++;
        refreshTimes();
        setTimeout(startCountTime,1000);
    }
}
//结束计时
function stopCountTime(){
    stop_time_flag = true;
}

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}




/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */
