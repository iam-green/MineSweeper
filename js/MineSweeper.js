let game = {};

const MineSweeper = {
    Start : function(tag) {
        /*
            size.x : x position
            size.y : y position
        */
        tag.x=+tag.x;tag.y=+tag.y;tag.mine=+tag.mine;
        if(game.status) return 'This game is already started';
        if(tag.x<9 || tag.y<9) return 'Size is too small';
        //SET ARGUMENTS
        game = {
            'status':false,
            'map_player':[],
            'map':[],
            'mine':[],
            'clear':[],
            'guess':[],
			'wrong':[]
        };
        //SET SIZE
        for(let y=0;y<tag.y;y++) {
            game.map[y]=[];
            game.map_player[y]=[];
            for(let x=0;x<tag.x;x++) {
                game.map[y][x]=0;
                game.map_player[y][x]='n';
            }
        }
        //SET MINES
        for(let i=0;i<tag.mine;i++) {
            let rl = {'x':Math.random()*tag.x|0,'y':Math.random()*tag.y|0};
            if(game.map[rl.y][rl.x]=='m') i--;
            else {
				game.mine.push([rl.x,rl.y]);
                game.map[rl.y][rl.x]='m';
                for(let j=-1;j<2;j++) {
                    for(let k=-1;k<2;k++) {
                        if(rl.y+j>-1 && rl.y+j<tag.y && rl.x+k>-1 && rl.x+k<tag.x && game.map[rl.y+j][rl.x+k]!='m') game.map[rl.y+j][rl.x+k]++;
                        else continue;
                    }
                }
            }
        }
        //SET GAME CLEAR ARGUMENTS
        for(let y=0;y<tag.y;y++) {
            game.clear[y]=[];
            for(let x=0;x<tag.x;x++) game.clear[y].push(game.map[y][x]=='m'?'n':game.map[y][x]);
        }
		game.status=true;
        HTML.restart(0);//Hide Restart Button
		return true;
    },
    Map : function() {
		let res = [];
        let guess = game.guess;
		for(let y=0;y<game.map_player.length;y++) {
            res.push([]);
            for(let x=0;x<game.map_player[y].length;x++) res[y].push(game.wrong.find(e=>e[0]==x&&e[1]==y)?'w':game.guess.find(e=>e[0]==x&&e[1]==y)?'g':game.map_player[y][x]);
        }
		return res;
	},
    GameOver : function() {
        if(!game.status) return 'This game is not started';
        for(let i=0;i<game.mine.length;i++) game.map_player[game.mine[i][1]][game.mine[i][0]]='m';
		for(let i=0;i<game.guess.length;i++) if(!game.mine.find(e=>e[0]==game.guess[i][0]&&e[1]==game.guess[i][1])) game.wrong.push([game.guess[i][0],game.guess[i][1]]);
        game.status=false;
        HTML.restart(1);//Show Restart Button
        return alert('Game Over!');
    },
    Guess : function(x,y) {
		if(!game.status) return 'This game is not started';
        if(isNaN(x) || isNaN(y)) return 'Please input number';
        if(x<0 || x>game.map[0].length-1 || y<0 || y>game.map.length-1) return 'Invailed location';
        if(!game.guess.find(e=>e[0]==x&&e[1]==y)) {
            game.guess.push([x,y]);
            return "Guess added!";
        } else {
            game.guess.splice(game.guess.findIndex(e=>e[0]==x&&e[1]==y),1);
            return "Guess removed!";
        }
    },
    Place : function(x,y,re) {
        // TODO
        re=undefined||null?false:re;
        if(!game.status) return 'This game is not started';
        if(isNaN(x) || isNaN(y)) return 'Please input number';
        if(x<0 || x>game.map[y].length-1 || y<0 || y>game.map.length-1) return 'Invailed location';
        if(game.guess.find(e=>e[0]==x&&e[1]==y) && !re) return 'You cannot select where you guessed.';
        if(game.map_player[y][x]!='n') return 'Already Selected';
        let nomine=true,x_len=game.map_player[y]-1,y_len=game.map_player.length-1;
        if(game.map[y][x]=='m') this.GameOver();
        else {
            game.map_player[y][x]=game.map[y][x];
            if(game.guess.find(e=>e[0]==x&&e[1]==y)) game.guess.splice(game.guess.findIndex(e=>e[0]==x&&e[1]==y),1);
            for(let j=-1;j<2;j++) {
                for(let k=-1;k<2;k++) {
                    if(y+j<0 || y+j>y_len || x+k<0 && x+k>x_len && game.player[y+j][x+k]!='n') continue;
                    if(game.map[y+j][x+k]=='m') nomine=false;
                }
            }
            if(nomine) {
                for(let j=-1;j<2;j++) {
                    for(let k=-1;k<2;k++) {
                        if(y+j<0 || y+j>y_len || x+k<0 && x+k>x_len && game.player[y+j][x+k]!='n') continue;
                        if(nomine) this.Place(x+k,y+j,true);
                    }
                }
            }
        }
        if(JSON.stringify(game.clear)==JSON.stringify(game.map_player) && game.status) {
			for(let i=0;i<game.mine.length;i++) game.guess.push([game.mine[i][0],game.mine[i][1]]);
            game.status=false;
            HTML.restart(1);//Show Restart Button
            return alert("Congratulations! You have found all mines!");
        } else return true;
    }
}