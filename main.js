let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let player = 1;
let op = 2;
let colors = ["#ffffff","#f81717", "#1db6f0", "#f81717", "#1db6f0","#f81717","#1db6f0", "#660099"]

class Cell{
    constructor(x,y,state){
        this.x = x;
        this.y = y;
        this.state = state;
        this.color = colors[state];
        this.voisins = [];
        this.estRelieH = false;
        this.estRelieB = false;
    }
}

let grid = [];
for (let i = 0; i < 13; i++){
    grid.push([]);
    for (let j = 0; j < 13; j++){
        if ((i===0 && j===0) || (i===12 && j===12) || (i===0 && j===12) || (i===12 && j===0)){
            grid[i].push(new Cell(i,j,7));
        }
        else { 
            if (i===0){
                grid[i].push(new Cell(i,j,4));
            }
            else if(i===12){
                grid[i].push(new Cell(i,j,6));
            }
            else {
                if (j===0){
                    grid[i].push(new Cell(i,j,3));
                }
                else if (j===12){
                    grid[i].push(new Cell(i,j,5));
                }
                else {
                    grid[i].push(new Cell(i,j,0));
                }
            }
        }
    }
}

function updateVoisins(){
    grid[0][0].voisins = [grid[0][1],grid[1][0],grid[1][1]];
    grid[0][12].voisins = [grid[0][11],grid[1][11],grid[1][12]];
    grid[12][0].voisins = [grid[11][0],grid[11][1],grid[12][1]];
    grid[12][12].voisins = [grid[11][11],grid[11][12],grid[12][11]];
    for (let i = 1; i < 12; i++){
        grid[i][0].voisins = [grid[i-1][0],grid[i+1][0],grid[i-1][1],grid[i][1]];
        grid[i][12].voisins = [grid[i-1][12],grid[i+1][12],grid[i-1][11],grid[i][11]];
        for (let j = 1; j < 12; j++){
            grid[0][j].voisins = [grid[0][j-1],grid[0][j+1],grid[1][j-1],grid[1][j]];
            grid[12][j].voisins = [grid[12][j-1],grid[12][j+1],grid[11][j-1],grid[11][j]];
            grid[i][j].voisins = [grid[i-1][j],grid[i-1][j+1],grid[i+1][j],grid[i+1][j-1],grid[i][j+1],grid[i][j-1]];
        }
    }
}

function check(i,j){
    for (let k = 0; k < 6; k++){
        console.log(grid[i][j].voisins[k]);
        if (grid[i][j].voisins[k].state === 7){
            console.log("ok");
        }
        else if (grid[i][j].voisins[k].state in [3,4] == false && grid[i][j].voisins[k].color == grid[i][j].color){
            verifH(grid[i][j]);
            console.log("ok");
        }
        else if (grid[i][j].voisins[k].state in [5,6] == false && grid[i][j].voisins[k].color == grid[i][j].color){
            verifB(grid[i][j]);
            console.log("ok");
        }
        else if (grid[i][j].voisins[k].estRelieH === true && grid[i][j].color == grid[i][j].voisins[k].color){
            verifH(grid[i][j]);
            console.log("ok");
        }
        else if (grid[i][j].voisins[k].estRelieB === true && grid[i][j].color == grid[i][j].voisins[k].color){
            verifB(grid[i][j]);
            console.log("ok");
        }
    }
}

function verifH(self){
    self.estRelieH = true;
    for(let i = 0; i < self.voisins.length; i++){
        if (self.voisins[i].color == self.color  && self.voisins[i].estRelieH != true){  //lui est vrai donc check les autres  
            verifH(self.voisins[i]);  
        }
    }
}

function verifB(self){
    self.estRelieB = true;
    for(let i = 0; i < self.voisins.length; i++){
        if (self.voisins[i].color == self.color  && self.voisins[i].estRelieB != true){  //lui est vrai donc check les autres  
            verifB(self.voisins[i]);  
        }
    }
}

function victoryCheck(){
    for (let i = 1; i < 12; i++){
        if (grid[i][0].estRelieH === true && grid[i][0].estRelieB === true){
            for (let i1 = 1; i1 < 12; i1++){
                if (grid[i1][12].estRelieH === true && grid[i1][12].estRelieB === true){
                    console.log("Victoire du joueur 1");
                }
            }
        }
    }
    for (let j = 1; j < 12; j++){
        if (grid[0][j].estRelieH === true && grid[0][j].estRelieB === true){
            for (let j1 = 1; j1 < 12; j1++){
                if (grid[12][j1].estRelieH === true && grid[12][j1].estRelieB === true){
                    console.log("Victoire du joueur 2");
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
            ctx.fillStyle = 'black';
            ctx.fillRect(i*50+(grid[i][j].y*25),j*50,1,50);
            ctx.fillRect(i*50+(grid[i][j].y*25),j*50,50,1);
        }
    }
}

updateVoisins();
drawGrid();

canvas.addEventListener("click", function(event) {
    let y = event.clientY - canvas.offsetTop;
    let x = event.clientX - canvas.offsetLeft - Math.round(y*25/50);
    let i = Math.round(x/50);
    let j = Math.floor(y/50);
    console.log(x,i,y,j);
    if (grid[i][j].state === 0){
        grid[i][j].state = player;
        grid[i][j].color = colors[player];
        updateVoisins();
        check(i,j);
        victoryCheck();
        if (player===1){
            op=1;
            player=2;
        }
        else { 
            op=2;
            player=1; 
        }
        drawGrid();
    }
});

