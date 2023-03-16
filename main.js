let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let player = 1;
let op = 2;
let colors = ["#ffffff","#f81717", "#1db6f0", "#f81717", "#1db6f0","#f81717", "#1db6f0",  "#660099"]

class Cell{
    constructor(x,y,state){
        this.x = x;
        this.y = y;
        this.state = state;
        this.color = colors[state];
        this.voisins = [];
        this.estRelieG = false;
		this.estRelieD = false;
    }
}

let grid = [];
for (let i = 0; i < 13; i++){
    grid.push([]);
    for (let j = 0; j < 13; j++){
        if ((i==0 && j==0) || (i==12 && j==12) || (i==0 && j==12) || (i==12 && j==0)){
            grid[i].push(new Cell(i,j,7));
        }
        else { 
            if (i==0){
                grid[i].push(new Cell(i,j,4));
            }
			else if (i==12){
                grid[i].push(new Cell(i,j,6));
            }
            else {
                if (j==0){
                    grid[i].push(new Cell(i,j,3));
                }
				else if (j==12){
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
        if (grid[i][j].voisins[k].state == 7){
            {}
        }
        else if ((grid[i][j].voisins[k].state == 3 || grid[i][j].voisins[k].state == 4) && grid[i][j].voisins[k].color === grid[i][j].color){
			verifG(grid[i][j]);
			console.log("gauche")
        }
		else if ((grid[i][j].voisins[k].state == 5 || grid[i][j].voisins[k].state == 6) && grid[i][j].voisins[k].color === grid[i][j].color){
			verifD(grid[i][j]);
			console.log("droite")
        }
		else if (grid[i][j].voisins[k].estRelieD && grid[i][j].voisins[k].color==grid[i][j].color == colors[player]){
			verifD(grid[i][j]);
			console.log(grid[i][j])
			if (grid[i][j].voisins[k].estRelieG && grid[i][j].voisins[k].color==grid[i][j].color == colors[player]){
				verifG(grid[i][j]);
				console.log(grid[i][j])
			}
		}
		else if (grid[i][j].voisins[k].estRelieG && grid[i][j].voisins[k].color==grid[i][j].color == colors[player]){
			verifG(grid[i][j]);
			console.log(grid[i][j])
			if (grid[i][j].voisins[k].estRelieD && grid[i][j].voisins[k].color==grid[i][j].color == colors[player]){
				verifD(grid[i][j]);
				console.log(grid[i][j])
			}
		}
    }
}

function verifG(self){
	self.estRelieG = true;
    for(let i = 0; i < self.voisins.length; i++){
        if (self.voisins[i].color == self.color  && self.voisins[i].estRelieG != true){  //lui est vrai donc check les autres   
            verifG(self.voisins[i]);  
        }
    }
}


function verifD(self){
	self.estRelieD = true;
    for(let i = 0; i < self.voisins.length; i++){
        if (self.voisins[i].color == self.color  && self.voisins[i].estRelieD != true){  //lui est vrai donc check les autres
            verifD(self.voisins[i]);  
        }
    }
}

function victoryCheck(){
    for (let i = 1; i < 12; i++){
		if (grid[i][0].estRelieG == true && grid[i][0].estRelieD==true){
			console.log("Victoire du joueur 1");
            
        }
    }
    for (let j = 1; j < 12; j++){
		if (grid[0][j].estRelieG == true && grid[0][j].estRelieD==true){
			console.log("Victoire du joueur 2");
            
        }
    }
}

function drawGrid(){
    for (let i = 0; i < 13; i++){  //final : remplacer 0 par 1 et 13 par 12 
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
console.log(grid[5][3]);
drawGrid();

canvas.addEventListener("click", function(event) {
    let y = event.clientY - canvas.offsetTop;
    let x = event.clientX - canvas.offsetLeft - Math.round(y*25/50);
    let i = Math.round(x/50);
    let j = Math.floor(y/50);
    console.log(x,i,y,j);
    if (grid[i][j].state == 0){
        grid[i][j].state = player;
        grid[i][j].color = colors[player];
		updateVoisins();
		check(i,j);
		victoryCheck();
		if (player==1){
			op=1;
			player=2;
		}
		else { 
			op=2;
			player=1; 
		}
	}
    drawGrid();
});

