/*
load dependency
"CooPilotes": "file:../CooPilotes"
*/


enum froms { Raspberry = 1, Intermediaire = 2, Voiture = 3, Remote = 4, Joystick = 5 }
enum actions { Avance = 1, Recule = 2, Gauche = 3, Droite = 4, Stop = 5 }
enum types { Welcome = 1, ChaqueMoteur = 2, Action = 3, MoteurSpecifique = 4 }
enum TypesRemote { Car, Remote }
enum Materiel { Wukong, Yahboom }
enum remotes { Un = 0, Deux = 1, Trois = 2, Quatre = 3, Cinq = 4, Six=5 }



class Vitesses {

    data: number[] = [5, 5, 5, 5];

    constructor() { }

    change(type: string, nouvelleValeur: number): void {
        let place = parseInt(type) - 1;
        if (type == "5") {
            this.data[0] = nouvelleValeur;
            this.data[1] = nouvelleValeur;
        } else if (type == "6") {
            this.data[2] = nouvelleValeur;
            this.data[3] = nouvelleValeur;
        } else {
            this.data[place] = nouvelleValeur;
        }

    }

    get(type: string): number {
        let place = parseInt(type) - 1;
        return this.data[place];
    }

    getFormatValue(): number {
        return this.get("1") * 1000 + this.get("2") * 100 + this.get("3") * 10 + this.get("4");
    }

}
const Vitesse = new Vitesses();

class Roue {
    moteur: CooPilotes.moteurs;
    led: neopixel.Strip;
    codeVitesse: string;
    constructor(moteur: CooPilotes.moteurs, led: neopixel.Strip, code: string) {
        this.moteur = moteur;
        this.led = led;
        this.codeVitesse = code;
    }

    active(): void {

        let vitesse = Vitesse.get(this.codeVitesse);
        let c = (vitesse == 5) ? NeoPixelColors.Yellow : (vitesse > 5) ? NeoPixelColors.Blue : NeoPixelColors.Red;

        if (typeMateriel === Materiel.Wukong) {
            wheelspeed(this.moteur, CooPilotes.map(vitesse, minPowerMotor, maxPowerMotor, -100, 100))
        } else if (typeMateriel === Materiel.Yahboom) {
            CooPilotes.ActiveMoteur(this.moteur, CooPilotes.map(vitesse, minPowerMotor, maxPowerMotor, 255, -255));
            this.led.showColor(c);

        }


    }

}



function wheelspeed(wheel: any, speed: any) {


    if (wheel === CooPilotes.moteurs.M1 || wheel === CooPilotes.moteurs.M2) {
        speed = speed * -1;
    }
    let buf = pins.createBuffer(4);

    if (wheel < 2) {
        if (speed == 0) {
            speed = 89
        }
        else {
            if (speed > 0) {
                speed = Math.map(speed, 1, 100, 90, 180)
            }
            if (speed < 0) {
                speed = speed * -1
                speed = Math.map(speed, 1, 100, 90, 0)
            }
        }
    }
    else {
        if (speed == 0) {
            speed = 89
        }
        else {
            if (speed > 0) {
                speed = Math.map(speed, 1, 100, 90, 0)
            }
            if (speed < 0) {
                speed = speed * -1
                speed = Math.map(speed, 1, 100, 90, 180)
            }
        }
    }


    if (wheel === CooPilotes.moteurs.M1) {
        buf[0] = 0x04; //ok
    } else if (wheel === CooPilotes.moteurs.M4) {
        buf[0] = 0x05; //ok
    } else if (wheel === CooPilotes.moteurs.M2) {
        buf[0] = 0x06; //ok
    }
    else if (wheel === CooPilotes.moteurs.M3) {
        buf[0] = 0x3;
    }

    buf[1] = speed;
    buf[2] = 0;
    buf[3] = 0;
    pins.i2cWriteBuffer(board_address, buf);

}


class dataAPI {
    from: froms;
    type: types;
    action: actions;
    param: number;
    vitesses: Array<number>;
    buffer: Buffer;

    constructor(data: Buffer | boolean) {

        this.buffer = (data) ? data : pins.createBuffer(8);
    }


    get getFrom(): number {
        return this.buffer[0];
    }


    setFrom(value: number): void {
        this.buffer[0] = value;
    }


    get getType(): number {
        return this.buffer[1];
    }

    setType(value: number): void {
        this.buffer[1] = value;
    }

    get getAction(): number {
        return this.buffer[2];
    }

    setAction(value: number): void {
        this.buffer[2] = value;
    }

    get getParam(): number {
        return this.buffer[3];
    }

    setParam(value: number): void {
        this.buffer[3] = value;
    }


    get getVitesse(value:number ):number {
        return this.buffer[value];
    }

    get getVitesses(): Array<number> {
        return [this.buffer[4], this.buffer[5], this.buffer[6], this.buffer[7]];
    }

    setVitesse(rang: number, value: number): void {
        this.buffer[rang + 4] = value;
    }

    setVitesses(values: Array<number>): void {
        this.buffer[4] = values[0];
        this.buffer[5] = values[1];
        this.buffer[6] = values[2];
        this.buffer[7] = values[3];
    }


}


namespace CooPilotes {

    //% color="#ECA40D" weight=20 icon="\uf1b9"


    let v1 = 5;
    let v2 = 5;
    let v3 = 5;
    let v4 = 5;



    const PCA9685_ADD = 0x40
    const MODE1 = 0x00
    const MODE2 = 0x01
    const SUBADR1 = 0x02
    const SUBADR2 = 0x03
    const SUBADR3 = 0x04

    const LED0_ON_L = 0x06
    const LED0_ON_H = 0x07
    const LED0_OFF_L = 0x08
    const LED0_OFF_H = 0x09

    const ALL_LED_ON_L = 0xFA
    const ALL_LED_ON_H = 0xFB
    const ALL_LED_OFF_L = 0xFC
    const ALL_LED_OFF_H = 0xFD

    const PRESCALE = 0xFE

    let initialized = false
    //let yahStrip: neopixel.Strip





    export enum sons {

        dadadum = 0,
        entertainer,
        prelude,
        ode,
        nyan,
        ringtone,
        funk,
        blues,

        anniversaire,
        mariage,
        funereal,
        punchline,
        baddy,
        chase,
        ba_ding,
        wawawawaa,
        jump_up,
        jump_down,
        power_up,
        power_down
    }

    export enum positions {
        //% blockId="avance" block="avance"
        Avance = 1,
        //% blockId="recule" block="recule"
        Recule = 2,
        //% blockId="arret" block="arret"
        Stop = 3
    }

    export enum servos {
        S1 = 0,
        S2,
        S3,
        S4,
        S5,
        S6,
        S7,
        S8
    }

    export enum moteurs {
        M1 = 8,
        M2 = 10,
        M3 = 12,
        M4 = 14,
        M5 = 2,
        M6 = 13
    }



    export enum deplacements {
        //% blockId="Avance" block="Avance"
        Avance = 1,
        //% blockId="Recule" block="Recule"
        Recule,
        //% blockId="MoveLeft" block="MoveLeft"
        Gauche,
        //% blockId="MoveRight" block="MoveRight"
        Droite,
        //% blockId="Left_Front" block="Left_Front"
        AvantGauche,
        //% blockId="Right_Front" block="Right_Front"
        AvantDroite,
        //% blockId="Left_Back" block="Left_Back"
        ArriereGauche,
        //% blockId="Right_Back" block="Right_Back"
        ArriereDroite,

    }

    export enum sens {
        //% blockId="Droite" block="Droite"
        Droite = 1,
        //% blockId="Gauche" block="Gauche"
        Gauche
    }

    export enum drifts {
        //% blockId="Head_To_Left" block="Head_To_Left"
        AvantGauche = 1,
        //% blockId="Head_To_Right" block="Head_To_Right"
        AvantDroite,
        //% blockId="Rear_To_Left" block="Rear_To_Left"
        ArriereGauche,
        //% blockId="Rear_To_Right" block="Rear_To_Right"
        ArriereDroite
    }

    export enum enWideAngleDrift {
        //% blockId="Left" block="Left"
        Gauche,
        //% blockId="Right" block="Right"
        Droite
    }

    export enum formes {
        //% blockId="Carre" block="Carre"
        Carre = 1,
        //% blockId="Parallelogramme" block="Parallelogramme"
        Parallelogramme,
        //% blockId="Rhombus" block="Rhombus"
        Rhombus,
        //% blockId="Flash1" block="Flash1"
        Flash1,
        //% blockId="Flash2" block="Flash2"
        Flash2,
    }

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1);
        buf[0] = value;
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function initPCA9685(): void {
        i2cwrite(PCA9685_ADD, MODE1, 0x00)
        setFreq(50);
        initialized = true
    }

    export function getVitesses(): string {

        if(v1<1) v1 = 1;
        if(v1<2) v2 = 1;
        if(v1<3) v3 = 1;
        if(v1<4) v4 = 1;

        if(v1>9) v1 = 9;
        if(v1>9) v2 = 9;
        if(v1>9) v3 = 9;
        if(v1>9) v4 = 9;

        return v1.toString()+v2.toString()+v3.toString()+v4.toString();
    }

    export function getVitessesArray(): Array<number> {

        if(v1<1) v1 = 1;
        if(v1<2) v2 = 1;
        if(v1<3) v3 = 1;
        if(v1<4) v4 = 1;

        if(v1>9) v1 = 9;
        if(v1>9) v2 = 9;
        if(v1>9) v3 = 9;
        if(v1>9) v4 = 9;

        return [v1,v2,v3,v4];
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cread(PCA9685_ADD, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cwrite(PCA9685_ADD, MODE1, newmode); // go to sleep
        i2cwrite(PCA9685_ADD, PRESCALE, prescale); // set the prescaler
        i2cwrite(PCA9685_ADD, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite(PCA9685_ADD, MODE1, oldmode | 0xa1);
    }

    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;
        if (!initialized) {
            initPCA9685();
        }
        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADD, buf);
    }

    function stopMotor(index: number) {
        setPwm(index, 0, 0);
        setPwm(index + 1, 0, 0);
    }


    function forward(vitesse: number) {
        ActiveMoteur(moteurs.M1, vitesse);
        ActiveMoteur(moteurs.M2, vitesse);
        ActiveMoteur(moteurs.M3, vitesse);
        ActiveMoteur(moteurs.M4, vitesse);
    }

    function back(vitesse: number) {
        ActiveMoteur(moteurs.M1, -vitesse);
        ActiveMoteur(moteurs.M2, -vitesse);
        ActiveMoteur(moteurs.M3, -vitesse);
        ActiveMoteur(moteurs.M4, -vitesse);
    }

    function moveLeft(vitesse: number) {
        ActiveMoteur(moteurs.M1, -vitesse);
        ActiveMoteur(moteurs.M2, vitesse);
        ActiveMoteur(moteurs.M3, vitesse);
        ActiveMoteur(moteurs.M4, -vitesse);
    }

    function moveRight(vitesse: number) {
        ActiveMoteur(moteurs.M1, vitesse);
        ActiveMoteur(moteurs.M2, -vitesse);
        ActiveMoteur(moteurs.M3, -vitesse);
        ActiveMoteur(moteurs.M4, vitesse);
    }

    function left_Front(vitesse: number) {
        ActiveMoteur(moteurs.M1, 0);
        ActiveMoteur(moteurs.M2, vitesse);
        ActiveMoteur(moteurs.M3, vitesse);
        ActiveMoteur(moteurs.M4, 0);
    }

    function left_Back(vitesse: number) {
        ActiveMoteur(moteurs.M1, -vitesse);
        ActiveMoteur(moteurs.M2, 0);
        ActiveMoteur(moteurs.M3, 0);
        ActiveMoteur(moteurs.M4, -vitesse);
    }

    function right_Front(vitesse: number) {
        ActiveMoteur(moteurs.M1, vitesse);
        ActiveMoteur(moteurs.M2, 0);
        ActiveMoteur(moteurs.M3, 0);
        ActiveMoteur(moteurs.M4, vitesse);
    }

    function right_Back(vitesse: number) {
        ActiveMoteur(moteurs.M1, 0);
        ActiveMoteur(moteurs.M2, -vitesse);
        ActiveMoteur(moteurs.M3, -vitesse);
        ActiveMoteur(moteurs.M4, 0);
    }

    function spin_Left(vitesse: number) {
        ActiveMoteur(moteurs.M1, -vitesse);
        ActiveMoteur(moteurs.M2, -vitesse);
        ActiveMoteur(moteurs.M3, vitesse);
        ActiveMoteur(moteurs.M4, vitesse);
    }

    function spin_Right(vitesse: number) {
        ActiveMoteur(moteurs.M1, vitesse);
        ActiveMoteur(moteurs.M2, vitesse);
        ActiveMoteur(moteurs.M3, -vitesse);
        ActiveMoteur(moteurs.M4, -vitesse);
    }

    function carStop() {
        if (!initialized) {
            initPCA9685();
        }
        setPwm(8, 0, 0);
        setPwm(9, 0, 0);
        setPwm(10, 0, 0);
        setPwm(11, 0, 0);

        setPwm(12, 0, 0);
        setPwm(13, 0, 0);
        setPwm(14, 0, 0);
        setPwm(15, 0, 0);
    }

    function MecanumRun(xvitesse: number, yvitesse: number, avitesse: number) {
        let vitessem1 = yvitesse + xvitesse - avitesse;
        let vitessem2 = yvitesse - xvitesse - avitesse;
        let vitessem3 = yvitesse - xvitesse + avitesse;
        let vitessem4 = yvitesse + xvitesse + avitesse;

        ActiveMoteur(moteurs.M1, vitessem1);
        ActiveMoteur(moteurs.M2, vitessem2);
        ActiveMoteur(moteurs.M3, vitessem3);
        ActiveMoteur(moteurs.M4, vitessem4);
    }

    //% blockId=Tourne block="Tourne|%rotation|vitesse %vitesse"
    //% weight=102
    //% blockGap=10
    //% group="Contrôle de la voiture"
    //% vitesse.min=0 vitesse.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Tourne(rotation: sens, vitesse: number): void {
        if (!initialized) {
            initPCA9685();
        }
        if (vitesse <= 0) {
            vitesse = 0;
        }
        switch (rotation) {

            case sens.Gauche:
                spin_Left(vitesse);
                break;
            case sens.Droite:
                spin_Right(vitesse);
                break;
            default:
                break;
        }
    }


    //% blockId=Déplace block="Déplace|%direction|vitesse %vitesse"
    //% weight=102
    //% blockGap=10
    //% group="Contrôle de la voiture"
    //% vitesse.min=0 vitesse.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Deplace(direction: deplacements, vitesse: number): void {
        if (!initialized) {
            initPCA9685();
        }
        if (vitesse <= 0) {
            vitesse = 0;
        }
        switch (direction) {
            case deplacements.Avance:
                forward(vitesse);
                break;
            case deplacements.Recule:
                back(vitesse);
                break;
            case deplacements.Gauche:
                moveLeft(vitesse);
                break;
            case deplacements.Droite:
                moveRight(vitesse);
                break;

            case deplacements.AvantGauche:
                left_Front(vitesse);
                break;
            case deplacements.ArriereGauche:
                left_Back(vitesse);
                break;
            case deplacements.AvantDroite:
                right_Front(vitesse);
                break;
            case deplacements.ArriereDroite:
                right_Back(vitesse);
                break;

            default:
                break;
        }
    }

    //% blockId=Polygon block="Polygon|%polygon|vitesse %vitesse"
    //% weight=101
    //% blockGap=10
    //% group="Contrôle de la voiture"
    //% vitesse.min=0 vitesse.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Polygon(polygon: formes, vitesse: number): void {
        if (!initialized) {
            initPCA9685();
        }
        if (vitesse < 0) {
            vitesse = 0;
        }

        switch (polygon) {
            case formes.Carre:
                back(vitesse);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                moveRight(vitesse);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                forward(vitesse);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                moveLeft(vitesse);
                basic.pause(1000);
                carStop();
                basic.pause(10);
                break;
            case formes.Parallelogramme:
                right_Front(vitesse);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                moveRight(vitesse);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                left_Back(vitesse);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                moveLeft(vitesse);
                basic.pause(1000);
                carStop();
                basic.pause(10);
                break;
            case formes.Rhombus:
                right_Front(vitesse);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                right_Back(vitesse);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                left_Back(vitesse);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                left_Front(vitesse);
                basic.pause(1000);
                carStop();
                basic.pause(10);
                break;
            case formes.Flash1:
                right_Front(vitesse);
                basic.pause(1500);
                carStop();
                basic.pause(10);

                moveLeft(vitesse);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                right_Front(vitesse);
                basic.pause(1500);
                carStop();
                basic.pause(10);
                break;
            case formes.Flash2:
                left_Back(vitesse);
                basic.pause(1500);
                carStop();
                basic.pause(10);

                moveRight(vitesse);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                left_Back(vitesse);
                basic.pause(1500);
                carStop();
                basic.pause(10);
                break;
            default:
                break;
        }
    }


    //% blockId=Drift block="Drift|%direction|vitesse %vitesse"
    //% weight=100
    //% blockGap=10
    //% group="Contrôle de la voiture"
    //% vitesse.min=0 vitesse.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Drift(direction: drifts, vitesse: number): void {
        if (!initialized) {
            initPCA9685();
        }
        if (vitesse <= 0) {
            vitesse = 0;
        }
        switch (direction) {
            case drifts.ArriereGauche:
                ActiveMoteur(moteurs.M1, 0);
                ActiveMoteur(moteurs.M2, vitesse);
                ActiveMoteur(moteurs.M3, 0);
                ActiveMoteur(moteurs.M4, -vitesse);
                break;
            case drifts.ArriereDroite:
                ActiveMoteur(moteurs.M1, 0);
                ActiveMoteur(moteurs.M2, -vitesse);
                ActiveMoteur(moteurs.M3, 0);
                ActiveMoteur(moteurs.M4, vitesse);
                break;
            case drifts.AvantGauche:
                ActiveMoteur(moteurs.M1, -vitesse);
                ActiveMoteur(moteurs.M2, 0);
                ActiveMoteur(moteurs.M3, vitesse);
                ActiveMoteur(moteurs.M4, 0);
                break;
            case drifts.AvantDroite:
                ActiveMoteur(moteurs.M1, vitesse);
                ActiveMoteur(moteurs.M2, 0);
                ActiveMoteur(moteurs.M3, -vitesse);
                ActiveMoteur(moteurs.M4, 0);
                break;
            default:
                break;
        }
    }

    //% blockId=WideAngleDrift block="WideAngleDrift|%direction|vitesse_avant %vitesse_avant|vitesse_arriere %vitesse_arriere"
    //% weight=99
    //% blockGap=10
    //% group="Contrôle de la voiture"
    //% vitesse_avant.min=0 vitesse_avant.max=255
    //% vitesse_arriere.min=0 vitesse_arriere.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function WideAngleDrift(direction: enWideAngleDrift, vitesse_avant: number, vitesse_arriere: number): void {
        if (!initialized) {
            initPCA9685();
        }
        if (vitesse_avant <= 0) {
            vitesse_avant = 0;
        }
        if (vitesse_arriere <= 0) {
            vitesse_arriere = 0;
        }

        switch (direction) {
            case enWideAngleDrift.Gauche:
                ActiveMoteur(moteurs.M1, -vitesse_avant);
                ActiveMoteur(moteurs.M2, vitesse_arriere);
                ActiveMoteur(moteurs.M3, vitesse_avant);
                ActiveMoteur(moteurs.M4, -vitesse_arriere);
                break;
            case enWideAngleDrift.Droite:
                ActiveMoteur(moteurs.M1, vitesse_avant);
                ActiveMoteur(moteurs.M2, -vitesse_arriere);
                ActiveMoteur(moteurs.M3, -vitesse_avant);
                ActiveMoteur(moteurs.M4, vitesse_arriere);
                break;
            default:
                break;
        }
    }

    //% blockId=Manipuler block="Manipuler|x %x|y %y|rotation %leftOrRight"
    //% weight=98
    //% blockGap=10
    //% group="Contrôle de la voiture"
    //% leftOrRight.min=-1 leftOrRight.max=1
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Manipuler(x: number, y: number, leftOrRight: number): void {
        if (!initialized) {
            initPCA9685();
        }
        if (Math.abs(x) <= 50 && Math.abs(y) <= 50) {
            x = 0;
            y = 0;
        }
        if (leftOrRight != 0 && leftOrRight != 1 && leftOrRight != -1) {
            leftOrRight = 0;
        }
        let linearvitesse = 255;
        let angularvitesse = 255;
        x = x / 512;
        y = y / 512;
        MecanumRun(x * linearvitesse, y * linearvitesse, -leftOrRight * angularvitesse);
    }

    //% blockId=LED block="LEC"
    //% weight=97
    //% blockGap=10
    //% group="Fonctionnalités de la voiture"
    //% advanced=true
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    // export function LED(): neopixel.Strip {
    //     if (!yahStrip) {
    //         yahStrip = neopixel.create(DigitalPin.P12, 4, NeoPixelMode.RGB);
    //     }
    //     return yahStrip;
    // }

    //% blockId=Musique block="Musique|%index"
    //% weight=96
    //% blockGap=10
    //% group="Fonctionnalités de la voiture"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Musique(index: sons): void {
        switch (index) {
            case sons.dadadum: music.beginMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.Once); break;
            case sons.anniversaire: music.beginMelody(music.builtInMelody(Melodies.Birthday), MelodyOptions.Once); break;
            case sons.entertainer: music.beginMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once); break;
            case sons.prelude: music.beginMelody(music.builtInMelody(Melodies.Prelude), MelodyOptions.Once); break;
            case sons.ode: music.beginMelody(music.builtInMelody(Melodies.Ode), MelodyOptions.Once); break;
            case sons.nyan: music.beginMelody(music.builtInMelody(Melodies.Nyan), MelodyOptions.Once); break;
            case sons.ringtone: music.beginMelody(music.builtInMelody(Melodies.Ringtone), MelodyOptions.Once); break;
            case sons.funk: music.beginMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.Once); break;
            case sons.blues: music.beginMelody(music.builtInMelody(Melodies.Blues), MelodyOptions.Once); break;
            case sons.mariage: music.beginMelody(music.builtInMelody(Melodies.Wedding), MelodyOptions.Once); break;
            case sons.funereal: music.beginMelody(music.builtInMelody(Melodies.Funeral), MelodyOptions.Once); break;
            case sons.punchline: music.beginMelody(music.builtInMelody(Melodies.Punchline), MelodyOptions.Once); break;
            case sons.baddy: music.beginMelody(music.builtInMelody(Melodies.Baddy), MelodyOptions.Once); break;
            case sons.chase: music.beginMelody(music.builtInMelody(Melodies.Chase), MelodyOptions.Once); break;
            case sons.ba_ding: music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once); break;
            case sons.wawawawaa: music.beginMelody(music.builtInMelody(Melodies.Wawawawaa), MelodyOptions.Once); break;
            case sons.jump_up: music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once); break;
            case sons.jump_down: music.beginMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.Once); break;
            case sons.power_up: music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once); break;
            case sons.power_down: music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.Once); break;
        }
    }

    //% blockId=Servo block="Servo(180°)|num %num|valeur %value"
    //% weight=95
    //% blockGap=20
    //% advanced=true
    //% num.min=1 num.max=4 value.min=0 value.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function Servo(num: servos, value: number): void {

        // 50hz: 20,000 us
        let us = (value * 1800 / 180 + 600); // 0.6 ~ 2.4
        let pwm = us * 4096 / 20000;
        setPwm(num, 0, pwm);

    }

    //% blockId=Servo2 block="Servo(270°)|num %num|valeur %value"
    //% weight=94
    //% blockGap=20
    //% advanced=true
    //% num.min=1 num.max=4 value.min=0 value.max=270
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function Servo2(num: servos, value: number): void {

        // 50hz: 20,000 us
        let newvalue = Math.map(value, 0, 270, 0, 180);
        let us = (newvalue * 1800 / 180 + 600); // 0.6 ~ 2.4
        let pwm = us * 4096 / 20000;
        setPwm(num, 0, pwm);

    }

    //% blockId=Servo3 block="Servo(360°)|num %num|pos %pos|valeur %value"
    //% weight=93
    //% blockGap=20
    //% advanced=true
    //% num.min=1 num.max=4 value.min=0 value.max=90
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function Servo3(num: servos, pos: positions, value: number): void {

        // 50hz: 20,000 us

        if (pos == positions.Stop) {
            let us = (86 * 1800 / 180 + 600); // 0.6 ~ 2.4
            let pwm = us * 4096 / 20000;
            setPwm(num, 0, pwm);
        }
        else if (pos == positions.Avance) { //0-90 -> 90 - 0
            let us = ((90 - value) * 1800 / 180 + 600); // 0.6 ~ 2.4
            let pwm = us * 4096 / 20000;
            setPwm(num, 0, pwm);
        }
        else if (pos == positions.Recule) { //0-90 -> 90 -180
            let us = ((90 + value) * 1800 / 180 + 600); // 0.6 ~ 2.4
            let pwm = us * 4096 / 20000;
            setPwm(num, 0, pwm);
        }
    }

    //% blockId=ActiveMoteur block="ActiveMoteur|%index|vitesse(-255~255) %vitesse"
    //% weight=92
    //% blockGap=10
    //% group="Fonctionnalités de la voiture"
    //% vitesse.min=-255 vitesse.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function ActiveMoteur(index: moteurs, vitesse: number): void {

        if (index === moteurs.M1) v1 = Math.map(vitesse, -255, 255, 1, 9);
        if (index === moteurs.M2) v2 = Math.map(vitesse, -255, 255, 1, 9);
        if (index === moteurs.M3) v3 = Math.map(vitesse, -255, 255, 1, 9);
        if (index === moteurs.M4) v4 = Math.map(vitesse, -255, 255, 1, 9);

        if (!initialized) {
            initPCA9685();
        }
        vitesse = Math.map(vitesse, 0, 255, 0, 4095); // map 255 to 4095
        if (vitesse >= 4095) {
            vitesse = 4095;
        }
        if (vitesse <= -4095) {
            vitesse = -4095;
        }

        let a = index;
        let b = index + 1;

        if (a > 10) {
            if (vitesse >= 0) {
                setPwm(a, 0, vitesse);
                setPwm(b, 0, 0);
            } else {
                setPwm(a, 0, 0);
                setPwm(b, 0, -vitesse);
            }
        }
        else {
            if (vitesse >= 0) {
                setPwm(b, 0, vitesse);
                setPwm(a, 0, 0);
            } else {
                setPwm(b, 0, 0);
                setPwm(a, 0, -vitesse);
            }
        }
    }

    //% blockId=ArretMoteurs block="Arret des moteurs"
    //% weight=91
    //% blockGap=10
    //% group="Fonctionnalités de la voiture"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function ArretMoteurs(): void {
        if (!initialized) {
            initPCA9685();
        }

        v1 = 5;
        v2 = 5;
        v3 = 5;
        v4 = 5;

        stopMotor(moteurs.M1);
        stopMotor(moteurs.M2);
        stopMotor(moteurs.M3);
        stopMotor(moteurs.M4);
    }

    export function map(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number {
        return ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow) + toLow;
    }

}
