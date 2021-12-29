let num = new URL(window.location.href).searchParams.get('dif');
let custom = new URL(window.location.href).searchParams.get('custom');
custom=custom?custom.split(':'):undefined;
num=num&&0<=num&&num<=2?+num:0;

const dif = [{'x':9,'y':9,'mine':10},{'x':16,'y':16,'mine':40},{'x':30,'y':16,'mine':99}];
let toggle_guess=false;

const HTML = {
    setGame : function(tag) {
        MineSweeper.Start(tag);
        this.loadMap();
    },
    loadMap : function() {
        let map = MineSweeper.Map();
		let x = map[0].length,y=map.length;
        let div = document.getElementById("board");
        res='';
        for(let j=0;j<y;j++) {
            for(let i=0;i<x;i++) res+=`<div id='${j}_${i}' class='cell img_${map[j][i]}'></div>`;
            // src='./img/skins/${map[j][i]}.svg'
            if(j!=map.length-1) res+='<br>\n';
        }
        div.innerHTML=res;
        for(let j=0;j<y;j++) for(let i=0;i<x;i++) {
            let img = document.getElementById(`${j}_${i}`);
            img.addEventListener('mousedown',(e)=>this.event(e,img,map.length));
        }
    },
    event : function(e,img,size) {
        let loc={'x':+img.id.split('_')[1],'y':+img.id.split('_')[0]};
		// alert(`x : ${loc.x}\ny : ${loc.y}\n${e.button=='0'?'Left':e.button=='2'?'Right':'Another'} Click`);
        if(!game.status) return;
        if( (toggle_guess || e.button==2) && game.map_player[loc.y][loc.x]=='n') MineSweeper.Guess(loc.x,loc.y);
        else if(e.button==0 && game.map_player[loc.y][loc.x]=='n') MineSweeper.Place(loc.x,loc.y);
        this.loadMap();
    },
    setDif : function(num) {
        let res = dif[+num];
        HTML.setGames(res[0],res[1]);
        HTML.loadMap();
    },
	wtf : function(wow) {
		game.guess=[];
		for(let y=0;y<game.map.length;y++) {
			for(let x=0;x<game.map[y].length;x++) {
				if(wow && game.mine.find(e=>e[0]==x&&e[1]==y)) game.guess.push([x,y]);
				else if(!wow && !game.mine.find(e=>e[0]==x&&e[1]==y) && game.map_player[y][x]=='n') game.guess.push([x,y]);
			}
		}
		HTML.loadMap();
	},
    toggleGuess : function() {
        if(toggle_guess) {
            toggle_guess=false;
            document.getElementById("toggle").innerText='Turn On Toggle Guess';
        } else {
            toggle_guess=true;
            document.getElementById("toggle").innerText='Turn Off Toggle Guess';
        }
        return true;
    },
    restart : function(value) {
        if(!value) {
            document.getElementById('restart').style.display='none';
            HTML.setGame(custom?{'x':custom[0],'y':custom[1],'mine':custom[2]}:dif[num]);
        } else {
            let button = document.getElementById('restart')
            button.style.display='block';
            button.addEventListener('click',(e)=>this.restart(0));
        }
    }
}

window.onload = function() {
    
    if(/iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)) {
        let div = document.getElementById("toggle");
        div.style.display='block';
        div.addEventListener('mousedown',(e)=>HTML.toggleGuess());
    } else document.getElementById("toggle").style.display='none';
    
    HTML.setGame(custom?{'x':custom[0],'y':custom[1],'mine':custom[2]}:dif[num]);
    
}