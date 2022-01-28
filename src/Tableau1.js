
class Tableau1 extends Phaser.Scene{


    preload(){
        this.load.image('foin','assets/foin.png');
        this.load.image('poulet','assets/poulet.png');
        this.load.image('fond','assets/ferme.jpg');
        this.load.image('white','assets/white-flare.png');
        this.load.audio('music', ['asset/music.mp3'])
        //for(let j=1;j<=49;j++) {
        //    this.load.image('backg' + j, 'assets/fond/frame-' + j + '.jpg');
        //}
    }

    getFrames(prefix,length){
        let frames=[];
        for (let i=1;i<=length;i++){
            frames.push({key: prefix+i});
        }
        return frames;
    }

    create(){
        //this.foond =this.add.image(500,250,'fond');
        //this.foond.setDisplaySize(1000,550)



        this.fond = this.add.image(0, 0, 'fond').setOrigin(0,0);
        this.fond.setScale(1,0.8),
        //this.anims.create({
        //    key: 'backg',
        //    frames: this.getFrames('backg',49),
        //    frameRate: 32,
        //    repeat: -1
        //});

        this.hauteur = 720
        this.largeur = 1280
        this.speedX = 0
        while(this.speedX===0){
            this.speedX = 500*Phaser.Math.Between(-1,1)
        }
        this.speedY = Phaser.Math.Between(-500, 500)
        this.maxspeed = 1000

        this.balle = this.physics.add.sprite(this.largeur/2, this.hauteur/2, 'poulet')
        this.balle.setDisplaySize(60, 60)
        this.balle.body.setBounce(1.1,1);
        this.balle.body.setAllowGravity(false);

        this.haut = this.physics.add.sprite(0, 0, 'foin').setOrigin(0, 0)
        this.haut.setDisplaySize(this.largeur, 40)
        this.haut.body.setAllowGravity(false)
        this.haut.setImmovable(true);
        this.bas = this.physics.add.sprite(0, 720, 'foin').setOrigin(0, 1)
        this.bas.setDisplaySize(this.largeur, 40)
        this.bas.body.setAllowGravity(false)
        this.bas.setImmovable(true);
        this.player1 = this.physics.add.sprite(50, 360, 'foin')
        this.player1.setDisplaySize(50, 100)
        this.player1.body.setAllowGravity(false)
        this.player2 = this.physics.add.sprite(1240, 360, 'foin')
        this.player2.setDisplaySize(50, 100)
        this.player2.body.setAllowGravity(false)
        this.player1.setImmovable(true)
        this.player2.setImmovable(true)
        let me = this;
        this.physics.add.collider(this.player1, this.balle,function(){
            console.log('touche player 1')
            me.rebond(me.player1)
        })
        this.physics.add.collider(this.player2, this.balle,function(){
            console.log('touche player 2')
            me.rebond(me.player2)
        })

        this.physics.add.collider(this.balle, this.bas)
        this.physics.add.collider(this.balle, this.haut)

        this.balle.setMaxVelocity(this.maxspeed,this.maxspeed)

        this.physics.add.collider(this.haut, this.player1)
        this.physics.add.collider(this.bas, this.player1)

        this.physics.add.collider(this.haut, this.player2)
        this.physics.add.collider(this.bas, this.player2)

        this.player1Speed = 0
        this.player2Speed = 0

        this.joueurGauche = new Joueur('Robert le berger','joueurGauche')
        this.joueurDroite = new Joueur('Jean le berger','joueurDroite')
        console.log(this.joueurGauche)


        this.tweens.add({
            targets:[this.player1,this.player2],
            scaleY :0.2,
            ease :'Linear',
            yoyo : true,
            repeat:5000,
            duration:1200,
        });

        this.tweens.add({
            targets:[this.balle],
            rotation: 6,
            ease :'Repeat',
            repeat:1000000,
            duration:1000,
        })
        var particles = this.add.particles('white');

        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 0.1, end: 0 },
            blendMode: 'ADD'
        });

        emitter.startFollow(this.balle);





        this.balleAucentre();
        this.initKeyboard()
    }

    rebond(players){
        let me = this ;
        console.log(this.player1.y);
        console.log(me.balle.y);
        let hauteurPlayers = players.displayHeight;

        let positionRelativePlayers = (this.balle.y - players.y);
        let coeff = positionRelativePlayers;
        coeff = coeff*2-1



        //positionRelativePlayers= (positionRelativePlayers / hauteurPlayers)
        //positionRelativePlayers = positionRelativePlayers-1;

        this.balle.setVelocityY(this.balle.body.velocity.y + coeff * 2);

    }


    balleAucentre(){
        this.balle.x = this.largeur/2
        this.balle.y = this.hauteur/2
        this.speedX = 0

        this.balle.setVelocityX(Math.random()>0.5?-500:500)
        this.balle.setVelocityY(0)
    }

    /**
     *
     * @param {Joueur} joueur
     */
    win(joueur){
        //alert('Joueur '+joueur.name+' gagne')
        joueur.score ++;
        //alert('Le score est de '+this.joueurGauche.score+' a '+this.joueurDroite.score)
        this.balleAucentre();
    }

    update(){
        if(this.balle.x>this.largeur){
            this.win(this.joueurGauche);
        }
        if(this.balle.x<0){
            this.win(this.joueurDroite);
        }
        this.player1.y += this.player1Speed
        this.player2.y += this.player2Speed
    }


    initKeyboard(){
        let me = this
        this.input.keyboard.on('keydown', function (kevent) {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.S:
                    me.player1Speed = -2
                    break;
                case Phaser.Input.Keyboard.KeyCodes.X:
                    me.player1Speed = 2
                    break;
                case Phaser.Input.Keyboard.KeyCodes.J:
                    me.player2Speed = -2
                    break;
                case Phaser.Input.Keyboard.KeyCodes.N:
                    me.player2Speed = 2
                    break;
            }
        });
        this.input.keyboard.on('keyup', function (kevent) {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.S:
                    me.player1Speed = 0
                    break;
                case Phaser.Input.Keyboard.KeyCodes.X:
                    me.player1Speed = 0
                    break;
                case Phaser.Input.Keyboard.KeyCodes.J:
                    me.player2Speed = 0
                    break;
                case Phaser.Input.Keyboard.KeyCodes.N:
                    me.player2Speed = 0
                    break;
            }
        });
    }
}




