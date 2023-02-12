let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let player = 0;
let colors = ["#ffffff","#ff0000", "#0000ff", "#ff0000", "#0000ff",  "#00ff00"]

class Cell{
    constructor(x,y,state){
        this.x = x;
        this.y = y;
        this.state = state;
        this.color = colors[state];
        this.voisins = [];
        this.estRelie = false;
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

function updateVoisins(){
    for (let i = 1; i < 12; i++){
        for (let j = 1; j < 12; j++){
            grid[i][j].voisins = [grid[i-1][j],grid[i-1][j+1],grid[i+1][j],grid[i+1][j-1],grid[i][j+1],grid[i][j-1]];
        }
    }
}

function check(i,j){
    for (let k = 0; k < 6; k++){
        if (grid[i][j].voisins[k].state == 5){
            grid[i][j].estRelie = true;
        }
        if (grid[i][j].voisins[k].estRelie == true && grid[i][j].voisins[k].state == grid[i][j].state){
            grid[i][j].estRelie = true;
        }
        if ((grid[i][j].voisins[k].state == 3 || grid[i][j].voisins[k].state == 4) && (grid[i][j].voisins[k].state - 2 == grid[i][j].state)){
            grid[i][j].estRelie = true;
        }
    }
}

function verifN(self){
    for(let i = 0; i < 6; i++){
        if (self.voisins[i].color == self.color  && self.voisins[i].estRelie != true){  //lui est vrai donc check les autres
            self.voisins[i].estRelie = true;
            verifN(self.voisins[i]);
        }
    }
}

function victoryCheck(){
    for (let i = 1; i < 12; i++){
        if (grid[i][0].estRelie == true){
            console.log("Victoire du joueur 1");
        }
    }
    for (let j = 1; j < 12; j++){
        if (grid[0][j].estRelie == true){
            console.log("Victoire du joueur 2");
        }
    }
}

function drawGrid(){
    for (let i = 0; i < 13; i++){  //final : remplacer 0 par 1 et 13 par 12 pour le swag
        for (let j = 0; j < 13; j++){
            ctx.fillStyle = grid[i][j].color;
            ctx.fillRect(i*50+(grid[i][j].y*25),j*50,50,50);
            ctx.fillStyle = 'black';
            ctx.fillRect(i*50+(grid[i][j].y*25),j*50,1,50);
            ctx.fillRect(i*50+(grid[i][j].y*25),j*50,50,1);
        }
    }
}

canvas.addEventListener("click", function(event) {
    let y = event.clientY - canvas.offsetTop;
    let x = event.clientX - canvas.offsetLeft - Math.round(y*25/50);
    let i = Math.round(x/50);
    let j = Math.floor(y/50);
    console.log(x,i,y,j);
    if (grid[i][j].state == 0){
        grid[i][j].state = player;
        grid[i][j].color = colors[player];
    }
    if (player==1){
        player=2;
    }
    else { 
        player=1; 
    }
    updateVoisins();
    check(i,j);
    victoryCheck();
    drawGrid();
});

drawGrid();
