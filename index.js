(()=>{
    const config = {
        dotMinRadius: 6,
        dotMaxRadius: 20,
        weightFactor: 0.002,
        defColor: `rgba(250, 10, 30, 0.9)`,
        mouseSize: 120,
        bigDotRadius: 35,
        smooth:  0.95,
        sphereRadius: 600
    }
    const TWO_PI = 2 * Math.PI;
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext(`2d`);

    let width, heigth, mouse, dots;

    class Dot {
        constructor(bigDotRadius){
            this.position = {
                x:mouse.x,
                y:mouse.y
            }
            this.velocity = {
                x: 0,
                y: 0
            }
            this.radius = bigDotRadius || random(config.dotMinRadius, config.dotMaxRadius);
            this.weight = this.radius * config.weightFactor;
            this.color = config.defColor;
        }
        draw(mouseX, mouseY){
            this.position.x = mouseX || this.position.x + this.velocity.x;
            this.position.y = mouseY || this.position.y + this.velocity.y;

            createCircle(this.position.x, this.position.y, this.radius, true, this.color);
            createCircle(this.position.x, this.position.y, this.radius, false, config.defColor);

        }
    }
    const updateDots = () => {
        for(let i = 1; i < dots.length; i++){
            let acceleration = {
                x: 0,
                y: 0
            }
            for(let j = 0; j < dots.length; j++) {
                if(i == j) continue;
                let [a, b] = [dots[i], dots[j]];

                let delta = {
                    x: b.position.x - a.position.x,
                    y: b.position.y - a.position.y
                }
                let destination = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
                let force = (destination - config.sphereRadius) / destination * b.weight;
                
                if(j == 0) {
                    let alpha = config.mouseSize / destination;
                    a.color = `rgba(250, 10, 30, ${alpha})`
                    destination < config.mouseSize ? force = (destination - config.mouseSize) * b.weight : force = a.weight;
                }

                acceleration.x += delta.x * force;
                acceleration.y += delta.y * force; 
            }
            dots[i].velocity.x = dots[i].velocity.x * config.smooth + acceleration.x * dots[i].weight;
            dots[i].velocity.y = dots[i].velocity.y * config.smooth + acceleration.y * dots[i].weight;
            
        }
        dots.map(e => e === dots[0]? e.draw(mouse.x, mouse.y) : e.draw());
    }
    const createCircle = (x, y, radius, fill, color )=>{
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TWO_PI);
        ctx.closePath();
        fill? ctx.fill() : ctx.stroke()
    }

    const random = (min, max) => Math.random() * (max - min) + min;

    const init = () => {
        width = canvas.width = innerWidth;
        heigth = canvas.height = innerHeight;
        mouse = {
            x: width / 2, 
            y: heigth / 2, 
            down: false
        }
        dots = [];
        dots.push(new Dot(config.bigDotRadius));
    }

    const loop = () => {
        ctx.clearRect(0,0, width, heigth);

        if(mouse.down) dots.push(new Dot());
        updateDots()
        window.requestAnimationFrame(loop);
    }
    const setPosition = ({layerX, layerY})=>{
        [mouse.x, mouse.y] = [layerX, layerY];

    }

    const isDown = ()=>{
        mouse.down = !mouse.down;
    }

    init();
    loop();
    canvas.addEventListener(`mousemove`, setPosition);
    window.addEventListener('mousedown', isDown);
    window.addEventListener('mouseup', isDown);
    function isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };
    if(isMobileDevice){
        canvas.addEventListener(`touchmove`, setPosition);
        window.addEventListener('touchend', isDown);
        window.addEventListener('touchstart', isDown);
    }

})()