
export const randomNum = (minNum, maxNum)=> {
    return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);
}

//操作表
export const operation = ()=> {
    return {
        moveUP:['ArrowUp','上移'],
        moveDOWN:['ArrowDown','下移'],
        moveLEFT:['ArrowLeft','左移'],
        moveRIGHT:['ArrowRight','右移'],

        FIRE:['KeyA','射击'],
        CUT:['KeyZ','斩击'],
        TOPSPIN:['KeyS','上旋子弹'],
        BOTTOMSPIN:['KeyD','下旋子弹'],
        LOADGUN:['KeyQ','重新上膛']
    }
    
}