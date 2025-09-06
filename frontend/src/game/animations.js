export function setupBalloonMovement(app, balloonContainer, bg) {
    let isMoving = true;
    let isShakingLeft = true;
    let isShakingRight = false;
    let count = 0;
    let rotSpeed = 0.001;
    let movingDown = false;
    let movedDown = 0;
    const moveDownLimit = 300;

    function startMovement() {
        isMoving = true;
        movingDown = true;
        movedDown = 0;
    }

    function stopMovement() {
        movingDown = false;
    }

    app.ticker.add(() => {
        if (!isMoving) return;

        if (isShakingLeft) {
            balloonContainer.rotation += rotSpeed;
            balloonContainer.position.y += 0.03;
            count++;
            if (count === 100) {
                isShakingLeft = false;
                isShakingRight = true;
                count = -100;
            }
        } else if (isShakingRight) {
            balloonContainer.rotation -= rotSpeed;
            balloonContainer.position.y -= 0.03;
            count++;
            if (count === 100) {
                isShakingRight = false;
                isShakingLeft = true;
                count = -100;
            }
        }

        if (movingDown) {
            bg.position.y += 3;
            movedDown++;
            if (movedDown >= moveDownLimit) stopMovement();
        }
    });

    return { startMovement, stopMovement };
}
