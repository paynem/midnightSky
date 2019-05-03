import './general.js';

/* Create a class called MidnightSky
- Part 1 - Create and draw stationary stars
    - Initialize instance variables for all of the ui elements in the constructor
        -   this.$canvas = 
        -   this.$context = 
        -   this.$animationFrame; 
    - Initilize some other instance variables that are data related in the constructor
        this.defaults = {
            star: {
                color: 'rgba(255, 255, 255, .5)',
                width: 3,
                randomWidth: true
            },
            line: {
                color: 'rgba(255, 255, 255, .5)',
                width: 0.2
            },
            position: {
                x: 0,
                y: 0
            },
            width: window.innerWidth,
            height: window.innerHeight,
            velocity: 0.1,
            length: 100,
            distance: 120,
            radius: 150,
            stars: []
        };
        this.config = JSON.parse(JSON.stringify(this.defaults));
    - Write the method setCanvas
        -   set the width and the height of the canvas to the 
            width and the height in the config object
        -   bind the class to the method in the constructor
        -   call the method in the constructor
    - Write the method setContext
        -   set the strokeStyle, fileStyle and lineWidth properties of the context
            based on corresponding values in the config object
        -   bind the class to the method in the constructor
        -   call the method in the constructor
    - Write the method setInitialPosition
        -   set the x and y position in the config object to 
            half of the canvas width and height respectively
        -   bind the class to the method in the constructor
        -   call the method in the constructor
    - Write the method createStar
        -   make a copy of the default star characteristics
        -   add x to the star - random number relative to the canvas width
        -   add y to the star - random number relative to the canvas height
        -   add vx to the star - random velocity in the x direction
        -   add vy to the star - random velocity in the y direction
        -   add radius to the star - random size
        -   return the star
        -   bind the class to the method in the constructor
    - Write the method createStars
        -   repeatedly call the method createStar and add the new star to the
            array of stars in the config object.  The number of stars is in the
            length property of the config object.
        -   bind the class to the method in the constructor
        -   call the method in the constructor
    -   Write the method drawStar.  Pass in a star as a parameter
        -   it should draw one star
        -   bind the class to the method
    -   Write the method drawStars.  It should
        -   clear the canvas
        -   repeatedly call the method drawStar
        -   bind the class to the method
        -   call the method in the constructor
  END OF PART 1 - TEST AND DEBUG YOUR CODE - YOU SHOULD SEE STARS ON THE PAGE
- PART 2 - Animate the stars - you can do this with setInterval or an animation frame
    -   Write the method moveStar.  It should take a star as it's parameter and
        move the star based on it's x and y position as well as it's x and y velocities.
        When the star bumps into the edge of the canvas, it should reappear on the canvas
        in a reasonable place but don't worry too much about the physics!
    -   Write the method moveStars.  It should repeatedly call moveStar
    -   Write the method animateStars.  It should 
        -   clear the canvas
        -   move the stars
        -   draw the stars
    -   Setup the animation in the constructor.  It should call animateStart every 1/60th 
        of a second.
    -   NOTICE THAT I CREATE A NEW OBJECT WHEN YOU RESIZE THE PAGE.  YOU'LL WANT TO CANCEL
        THE ANIMATION WHERE I'VE WRITTEN THAT COMMENT.
  END OF PART 2 - TEST AND DEBUG YOUR CODE - YOU SHOULD SEE STARS MOVE ON THE PAGE 
  - PART 3 - Add lines between stars that are "close" to eachother and are near the mouse
    -   I've given you 2 methods highlight and drawLines that you can use.  Or you can write your own
    -   Write the method drawLines
    -   Call it in an appropriate place
    -   Write the method highlight
    -   Add a mousemove event handler to the canvas that references highlight.  drawLines
        takes the position of the mouse into account.
  END OF PART 3 - TEST AND DEBUG YOUR CODE - YOU SHOULD SEE CONSTELLATIONS ON YOUR PAGE       
*/
/****** 
 * class midnightsky
 * This program populates a canvas (which is essentially the size of a browser window) with different-sized stars.
 * It then animates them and has them move around the screen in random directions (i will elaborate more on this later).
 * Additionally, as you move your mouse pointer around the canvas, it draws lines that connect all of the stars 
 * that are within a certain distance/proximity
 ******/
class MidnightSky {

    constructor() {
       
        //this.$canvas = document.querySelector('#imgCanvas');
        this.$canvas = document.getElementById("imgCanvas");
        // By giving $context this value, we're essentially setting things up so that we can do 2d drawings on the canvas
        this.$context = this.$canvas.getContext('2d');
        //this.$animationFrame;

        // defaults is an object with all of the default data needed to set up the stars, the lines (for the mouse pointer effect),
        // and other misc. things.
        this.defaults = {
            star: {
                color: 'rgba(255, 255, 255, .5)',
                width: 3,
                randomWidth: true
            },
            line: {
                color: 'rgba(255, 255, 255, .5)',
                width: 0.2
            },
            position: {
                x: 0,
                y: 0
            },
            width: window.innerWidth,
            height: window.innerHeight,
            velocity: 0.1,
            length: 100,
            distance: 120,
            radius: 150,
            stars: []
        };
        // all of the data from defaults is copied over to the config object.  By using stringify and then parse, config becomes
        // its own object with a separate copy of all of the data from defaults (we don't want it to simply be a reference to the
        // contents of defaults, because we don't ever want to manipulate or change that data)
        this.config = JSON.parse(JSON.stringify(this.defaults));
        // These are calls to a series of methods that allow the constructor to populate (and animate) the canvas with stars
        this.setCanvas();
        this.setContext();
        this.setInitialPosition();
        this.createStars();
        this.drawStars();
        //  the constructor uses setInterval to call animate stars every 1/60th of a second (which redraws the stars and connecting lines
        // in different locations and gives the appearance that they moving around)
        setInterval(this.animateStars.bind(this), 1000/60);
        //  This is the event handler (or whatever) that allows the program to track and respond to mouse pointer movement on the canvas,
        // which is important for the line animation effect
        document.getElementById("imgCanvas").onmousemove = this.highlight.bind(this);
    }
    /******
    * setCanvas method
    * setCanvas sets the canvas height and width to the height and width values in config, which are the height and width of the 
    * browser window's content area
    ******/
    setCanvas() {
        this.$canvas.height = this.config.height;
        this.$canvas.width = this.config.width;


    }
    /******
    * setContext method
    * earlier we set $context equal to the getContext('2d') method, which allows us to make 2d drawings on the canvas
    * Linewidth, strokestyle, and fillstyle are all drawing tools/settings that we need to configure before we can start drawing.
    * linewidth (which is the width of the line that we will be drawing on the canvas) is set to the default value for a star
    * that we copied from the defaults object into config
    * strokestyle determines the color, gradient, or pattern for the outlines of our lines (we set it to the default value from config.star)
    * Fillstyle determines the color, gradient, or pattern to use inside of lines or shapes (set to default value from config.star)
    ******/
    setContext() {
       
        this.$context.lineWidth  = this.config.star.width;
        this.$context.strokeStyle = this.config.star.color;
        this.$context.fillStyle = this.config.star.color;
    }
    /******
    * setInitialPosition method
    * config.position.x/y are two variables that we will use to keep track of the position of the mouse pointer when it is on the canvas.
    * this method sets the initial value to the center of the canvas
    ******/
    setInitialPosition() {
        this.config.position.x = this.$canvas.width/2;
        this.config.position.y = this.$canvas.height/2;
    }
    /******
    * createStar method
    * This method creates and returns an object that has all of the information necessary for the program to create a star.  It takes default data
    * from config.star and then adds additional properties (positon of the star, velocity of the star, and radius of the star).
    * all of the additional properties have randomly generated numbers as values ( between -10 and 10 for velocity, and a random number
    * relative to the canvas width and height for the x and y coordinates. radius is a random number between 1 and 5)
    ******/
    createStar() {
        let num = Math.floor(Math.random()*10) + 1; 
            num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
            let num1 = Math.floor(Math.random()*10) + 1; 
            num1 *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
        let star = {
            color: this.config.star.color,
            width: this.config.star.width,
            randomWidth: this.config.star.randomWidth,
            x: Math.floor(Math.random() * this.$canvas.width) + 1,
            y: Math.floor(Math.random() * this.$canvas.height) + 1,
            vx: num, //Math.random(),
            vy: num1,//Math.random(),
            radius: Math.floor(Math.random()*5) + 1
        }
        return star;

    }
    /******
    * createStars method
    * createstars generates stars by repeatedly calling the createstar method. Everytime it generates a new star, it takes that information
    * and inserts it into the config.stars array (it does this 100 times)
    * This method is called by the constructor (in order to generate all of the stars)
    ******/
    createStars() {
        
        this.createStar = this.createStar.bind(this);
        
        
        for(let i = 0; i < this.config.length; i++ ) {
            
            this.config.stars[i] = this.createStar();
            
        }
    }
    /******
     * drawStar method
     * drawStaw draws a randomly sized (it uses the radius value of the star object that it is passed) star in the shape of a tiny x.
     * originally, I used this method to call drawLines, but then it dawned on me that running drawLines (which runs through a series
     * of nested if-statetements and for-loops thousands of times ) was unnecessarily resource intensive.  I decided to move drawLines to 
     * animateStars, which resulted in far better performance (and the lines are still drawn at a satisfactory rate)
     ******/
    drawStar(star) {
        
        this.$context.beginPath();
        this.$context.moveTo(star.x+star.radius, star.y+star.radius);
        this.$context.lineTo(star.x-star.radius, star.y-star.radius);
        /*this.$context.stroke();
        this.$context.closePath();
        this.$context.beginPath();*/
        this.$context.moveTo(star.x-star.radius, star.y+star.radius);
        this.$context.lineTo(star.x+star.radius, star.y-star.radius);
        this.$context.stroke();
        this.$context.closePath();
        /*this.$context.lineWidth  = this.config.line.width;
        this.drawLines = this.drawLines.bind(this);
        this.drawLines();
        this.$context.lineWidth  = this.config.star.width;*/


    }
    /******
     * drawStars method
     * This method makes a call (and passes a star object each time) to drawStar for each star in the 
     * config.stars array.  drawstar then takes the passed in star data and uses it to draw each star on the canvas.
     * It also clears the canvas before it begins the process of drawing (or redrawing) all of the stars
     * 
     ******/
    drawStars() {
        this.drawStar = this.drawStar.bind(this);
        this.$context.clearRect(0, 0, this.config.width, this.config.height);
        for (let i = 0; i < this.config.length; i++)
        {
            this.drawStar(this.config.stars[i]);
        }
        
        
    }
    /******
     * moveStar method
     * movestar use the velocity values that were generated when all of the stars were initially created and uses them to adjust the 
     * x and y values of each individual star
     ******/
    moveStar(star) {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x <= 0) {
            star.x = 1;
            star.vx = Math.floor(Math.random()*10) + 1;
        }
        else if (star.x >= this.config.width) {
            star.x = this.config.width -1;
            star.vx = (Math.floor(Math.random()*10) + 1) * -1;
        }
        if (star.y <= 0) {
            star.y = 1;
            star.vy = star.vx = Math.floor(Math.random()*10) + 1;
        }
        else if (star.y >= this.config.height) {
            star.y = this.config.height -1;
            star.vy = (Math.floor(Math.random()*10) + 1) * -1;
        }

    }
    /******
     * moveStars method
     * This method calls (and passes in a star object from the config.stars array) the moveStar method to change the X and y values
     * of each star on the canvas.
     ******/
    moveStars() {
        this.moveStar = this.moveStar.bind(this);
        for (let i = 0; i < this.config.length; i++)
        {
            this.moveStar(this.config.stars[i]);
        }

    }
    /******
     * animateStars method
     * animateStars clears the canvas.  It then calls moveStars, which uses the velocity values of each star on the canvas to change
     * their x and y values.  animateStars then calls drawStar for each individual star and redraws all of them on the canvas with the new position data.
     * the constructor is set to call animateStars every 1/60th of a second (so the stars are redrawn with updated position data frequently enough
     * to appear like they're moving).
     * It is also important to note that animateStars is also being used to draw connecting lines between all of the stars that are close
     * to the mouse pointer
     * ALSO, animateStars calls drawLines (and temporarily adjusts the linewidth to the setting in config.line). So, instead
     * of calling drawLines 6000 times a second (which is what happened when drawStar was the method that was calling drawLines), the program
     * only calls drawLines 60 times per second (which produces far better performance)
     ******/
    animateStars() {
        this.$context.clearRect(0, 0, this.config.width, this.config.height);
        this.moveStars = this.moveStars.bind(this);
        this.moveStars();
        for (let i = 0; i < this.config.length; i++)
        {
            this.drawStar(this.config.stars[i]);
        }
        this.$context.lineWidth  = this.config.line.width;
        this.drawLines = this.drawLines.bind(this);
        this.drawLines();
        this.$context.lineWidth  = this.config.star.width;
    }
    /******
     * highlight method
     * highlight is called everytime the onmousemove eventhandler (or whatever) fires.  This allows the program to keep track of the position
     * of the mouse pointer on the canvas.  It assigns the position data of the mouse pointer to the config.position.x/y properties
     * 
     ******/
    highlight(e) {
        this.config.position.x = e.pageX //- this.$canvas.offsetLeft;
        this.config.position.y = e.pageY //- this.$canvas.offsetTop;
    }
    /******
     * drawLines method
     * drawLines handles the bulk of the work of drawing connecting lines between stars that are close to the mouse pointer.
     * the config object has a radius value and a distance value.  The method picks a star (the istar) and then compares its position to every other
     * star (the jstars) on the canvas.  If the distance between the two stars falls within the range of the config.distance value, drawlines then
     * checks the distance between the istar and the mouse pointer.  If the distance between the istar and the mouse pointer falls within
     * the range of the config.radius value, it will draw a connecting line between the istar and the jstar.
     * This method is called by animateStars after it finishes redrawing each star with the drawStar method
     ******/
    drawLines () {
        for (let i = 0; i < this.config.length; i++) {
            for (let j = 0; j < this.config.length; j++) {
                let iStar = this.config.stars[i];
                let jStar = this.config.stars[j];
                /*if (((jStar.y - iStar.y)**2 + (jStar.x - iStar.x)**2)**(1/2) < this.config.distance) {
                    if (((this.config.position.y -iStar.y)**2 + (this.config.position.x - iStar.x)**2)**(1/2) < this.config.radius) {
                        this.$context.beginPath();
                        this.$context.moveTo(iStar.x, iStar.y);
                        this.$context.lineTo(jStar.x, jStar.y);
                        this.$context.stroke();
                        this.$context.closePath();
                    }
                }*/
                if ((iStar.x - jStar.x) < this.config.distance &&
                    (iStar.y - jStar.y) < this.config.distance &&
                    (iStar.x - jStar.x) > - this.config.distance &&
                    (iStar.y - jStar.y) > - this.config.distance) {
                    if ((iStar.x - this.config.position.x) < this.config.radius &&
                        (iStar.y - this.config.position.y) < this.config.radius &&
                        (iStar.x - this.config.position.x) > - this.config.radius &&
                        (iStar.y - this.config.position.y) > - this.config.radius) {
                        this.$context.beginPath();
                        this.$context.moveTo(iStar.x, iStar.y);
                        this.$context.lineTo(jStar.x, jStar.y);
                        this.$context.stroke();
                        this.$context.closePath();
                    }
                    }
            }
        }
    }
}

let midnightsky;
window.addEventListener('load', () => midnightsky = new MidnightSky());
window.addEventListener('resize', () => {
    // cancel the animation
    midnightsky = new MidnightSky();
});
