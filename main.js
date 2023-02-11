let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

class Cell{
    constructor(x,y,state){
        this.x = x;
        this.y = y;
        this.state = state;
        let colors = ["#ffffff","#ff0000", "#0000ff", "#ff0000", "#0000ff",  "#00ff00"];
        this.color = colors[state];
    }
}

let grid = [];
for (let i = 0; i < 13; i++){
    grid.push([]);
    for (let j = 0; j < 13; j++){
        if ((i==0 && j==0) || (i==12 && j==12) || (i==0 && j==12) || (i==12 && j==0)){
            grid[i].push(new Cell(i,j,5));
        }
        else { 
            if ((i==0) || (i==12)){
                grid[i].push(new Cell(i,j,4));
            }
            else {
                if ((j==0) || (j==12)){
                    grid[i].push(new Cell(i,j,3));
                }
                else {
                    grid[i].push(new Cell(i,j,0));
                }
            }
        }
    }
}

function drawGrid(){
    for (let i = 0; i < 13; i++){  //final : remplacer 0 par 1 et 13 par 12 pour le swag
        for (let j = 0; j < 13; j++){
            ctx.fillStyle = grid[i][j].color;
            ctx.fillRect(i*50+(grid[i][j].y*25),j*50,50,50);
        }
    }
}

canvas.addEventListener("click", function(event) {
    let y = event.clientY - canvas.offsetTop;
    let x = event.clientX - canvas.offsetLeft-Math.floor((y/50)*25);
    let i = Math.floor(x/50);
    let j = Math.floor(y/50);
    console.log(i,j);
    if (grid[i][j].state == 0){
        grid[i][j].state = 1;
        grid[i][j].color = "#ff0000";
    }
    drawGrid();
});

drawGrid();