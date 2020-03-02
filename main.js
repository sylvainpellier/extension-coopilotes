/*
load dependency
"CooPilotes": "file:../CooPilotes"
*/
//% color="#ECA40D" weight=20 icon="\uf1b9"
var CP;
(function (CP) {
    var froms;
    (function (froms) {
        froms[froms["Raspberry"] = 1] = "Raspberry";
        froms[froms["Intermediaire"] = 2] = "Intermediaire";
        froms[froms["Voiture"] = 3] = "Voiture";
        froms[froms["Remote"] = 4] = "Remote";
        froms[froms["Joystick"] = 5] = "Joystick";
    })(froms = CP.froms || (CP.froms = {}));
    var actions;
    (function (actions) {
        actions[actions["Avance"] = 1] = "Avance";
        actions[actions["Recule"] = 2] = "Recule";
        actions[actions["Gauche"] = 3] = "Gauche";
        actions[actions["Droite"] = 4] = "Droite";
        actions[actions["Stop"] = 5] = "Stop";
    })(actions = CP.actions || (CP.actions = {}));
    var types;
    (function (types) {
        types[types["Welcome"] = 1] = "Welcome";
        types[types["Moteurs"] = 2] = "Moteurs";
        types[types["Action"] = 3] = "Action";
        types[types["Moteur"] = 4] = "Moteur";
        types[types["Update"] = 5] = "Update";
    })(types = CP.types || (CP.types = {}));
    var remotes;
    (function (remotes) {
        remotes[remotes["Jaune"] = 0] = "Jaune";
        remotes[remotes["Orange"] = 1] = "Orange";
        remotes[remotes["Bleu"] = 2] = "Bleu";
        remotes[remotes["Transparent"] = 3] = "Transparent";
        remotes[remotes["Mode4Gauche"] = 4] = "Mode4Gauche";
        remotes[remotes["Mode4Droite"] = 5] = "Mode4Droite";
    })(remotes = CP.remotes || (CP.remotes = {}));
    var moteurs;
    (function (moteurs) {
        moteurs[moteurs["M1"] = 8] = "M1";
        moteurs[moteurs["M2"] = 10] = "M2";
        moteurs[moteurs["M3"] = 12] = "M3";
        moteurs[moteurs["M4"] = 14] = "M4";
        moteurs[moteurs["M5"] = 2] = "M5";
        moteurs[moteurs["M6"] = 13] = "M6";
    })(moteurs = CP.moteurs || (CP.moteurs = {}));
    CP.sizeBuffer = 9;
    var Data = /** @class */ (function () {
        function Data(data) {
            if (data === void 0) { data = pins.createBuffer(CP.sizeBuffer); }
            this.buffer = data;
        }
        Data.prototype.getFrom = function () {
            // @ts-ignore
            return this.buffer[0];
        };
        Data.prototype.isFrom = function (data) {
            // @ts-ignore
            return (this.buffer[0] === data);
        };
        Data.prototype.setFrom = function (value) {
            // @ts-ignore
            this.buffer[0] = value;
        };
        Data.prototype.getTo = function () {
            // @ts-ignore
            return this.buffer[8];
        };
        Data.prototype.isTo = function (data) {
            // @ts-ignore
            return (this.buffer[8] === data);
        };
        Data.prototype.setTo = function (value) {
            // @ts-ignore
            this.buffer[8] = value;
        };
        Data.prototype.getType = function () {
            // @ts-ignore
            return this.buffer[1];
        };
        Data.prototype.setType = function (value) {
            // @ts-ignore
            this.buffer[1] = value;
        };
        Data.prototype.isType = function (data) {
            // @ts-ignore
            return (this.buffer[1] === data);
        };
        Data.prototype.getParam = function () {
            // @ts-ignore
            return this.buffer[2];
        };
        Data.prototype.setParam = function (value) {
            // @ts-ignore
            this.buffer[2] = value;
        };
        Data.prototype.getVitesse = function (value) {
            // @ts-ignore
            return this.buffer[value + 4];
        };
        Data.prototype.getVitesses = function () {
            // @ts-ignore
            return [this.buffer[4], this.buffer[5], this.buffer[6], this.buffer[7]];
        };
        Data.prototype.setVitesse = function (rang, value) {
            // @ts-ignore
            this.buffer[rang + 4] = value;
        };
        Data.prototype.setVitesses = function (values) {
            // @ts-ignore
            this.buffer[4] = values[0];
            // @ts-ignore
            this.buffer[5] = values[1];
            // @ts-ignore
            this.buffer[6] = values[2];
            // @ts-ignore
            this.buffer[7] = values[3];
        };
        return Data;
    }());
    CP.Data = Data;
    var strip = neopixel.create(7 /* P0 */, 4, NeoPixelMode.RGB);
    CP.Roues = [
        { vitesse: 5, moteur: CP.moteurs.M1, led: strip.range(0, 1) },
        { vitesse: 5, moteur: CP.moteurs.M2, led: strip.range(0, 2) },
        { vitesse: 5, moteur: CP.moteurs.M3, led: strip.range(0, 3) },
        { vitesse: 5, moteur: CP.moteurs.M4, led: strip.range(0, 4) }
    ];
    function RoueFromMoteur(moteur) {
        var find = 99;
        CP.Roues.forEach(function (r, index) {
            if (r.moteur === moteur)
                find = index;
        });
        return find;
    }
    function RoueFromMoteurIndex(moteur) {
        var find = 99;
        CP.Roues.forEach(function (r, index) {
            if (r.moteur === moteur)
                find = index;
        });
        return find;
    }
    function remap(value, fromLow, fromHigh, toLow, toHigh) {
        return ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow) + toLow;
    }
    CP.remap = remap;
    var PCA9685_ADD = 0x40;
    var MODE1 = 0x00;
    var MODE2 = 0x01;
    var SUBADR1 = 0x02;
    var SUBADR2 = 0x03;
    var SUBADR3 = 0x04;
    var LED0_ON_L = 0x06;
    var LED0_ON_H = 0x07;
    var LED0_OFF_L = 0x08;
    var LED0_OFF_H = 0x09;
    var ALL_LED_ON_L = 0xFA;
    var ALL_LED_ON_H = 0xFB;
    var ALL_LED_OFF_L = 0xFC;
    var ALL_LED_OFF_H = 0xFD;
    var PRESCALE = 0xFE;
    var initialized = false;
    var yahStrip;
    var sons;
    (function (sons) {
        sons[sons["dadadum"] = 0] = "dadadum";
        sons[sons["entertainer"] = 1] = "entertainer";
        sons[sons["prelude"] = 2] = "prelude";
        sons[sons["ode"] = 3] = "ode";
        sons[sons["nyan"] = 4] = "nyan";
        sons[sons["ringtone"] = 5] = "ringtone";
        sons[sons["funk"] = 6] = "funk";
        sons[sons["blues"] = 7] = "blues";
        sons[sons["anniversaire"] = 8] = "anniversaire";
        sons[sons["mariage"] = 9] = "mariage";
        sons[sons["funereal"] = 10] = "funereal";
        sons[sons["punchline"] = 11] = "punchline";
        sons[sons["baddy"] = 12] = "baddy";
        sons[sons["chase"] = 13] = "chase";
        sons[sons["ba_ding"] = 14] = "ba_ding";
        sons[sons["wawawawaa"] = 15] = "wawawawaa";
        sons[sons["jump_up"] = 16] = "jump_up";
        sons[sons["jump_down"] = 17] = "jump_down";
        sons[sons["power_up"] = 18] = "power_up";
        sons[sons["power_down"] = 19] = "power_down";
    })(sons = CP.sons || (CP.sons = {}));
    var positions;
    (function (positions) {
        //% blockId="avance" block="avance"
        positions[positions["Avance"] = 1] = "Avance";
        //% blockId="recule" block="recule"
        positions[positions["Recule"] = 2] = "Recule";
        //% blockId="arret" block="arret"
        positions[positions["Stop"] = 3] = "Stop";
    })(positions = CP.positions || (CP.positions = {}));
    var servos;
    (function (servos) {
        servos[servos["S1"] = 0] = "S1";
        servos[servos["S2"] = 1] = "S2";
        servos[servos["S3"] = 2] = "S3";
        servos[servos["S4"] = 3] = "S4";
        servos[servos["S5"] = 4] = "S5";
        servos[servos["S6"] = 5] = "S6";
        servos[servos["S7"] = 6] = "S7";
        servos[servos["S8"] = 7] = "S8";
    })(servos = CP.servos || (CP.servos = {}));
    var deplacements;
    (function (deplacements) {
        //% blockId="Avance" block="Avance"
        deplacements[deplacements["Avance"] = 1] = "Avance";
        //% blockId="Recule" block="Recule"
        deplacements[deplacements["Recule"] = 2] = "Recule";
        //% blockId="MoveLeft" block="MoveLeft"
        deplacements[deplacements["Gauche"] = 3] = "Gauche";
        //% blockId="MoveRight" block="MoveRight"
        deplacements[deplacements["Droite"] = 4] = "Droite";
        //% blockId="Left_Front" block="Left_Front"
        deplacements[deplacements["AvantGauche"] = 5] = "AvantGauche";
        //% blockId="Right_Front" block="Right_Front"
        deplacements[deplacements["AvantDroite"] = 6] = "AvantDroite";
        //% blockId="Left_Back" block="Left_Back"
        deplacements[deplacements["ArriereGauche"] = 7] = "ArriereGauche";
        //% blockId="Right_Back" block="Right_Back"
        deplacements[deplacements["ArriereDroite"] = 8] = "ArriereDroite";
    })(deplacements = CP.deplacements || (CP.deplacements = {}));
    var sens;
    (function (sens) {
        //% blockId="Droite" block="Droite"
        sens[sens["Droite"] = 1] = "Droite";
        //% blockId="Gauche" block="Gauche"
        sens[sens["Gauche"] = 2] = "Gauche";
    })(sens = CP.sens || (CP.sens = {}));
    var drifts;
    (function (drifts) {
        //% blockId="Head_To_Left" block="Head_To_Left"
        drifts[drifts["AvantGauche"] = 1] = "AvantGauche";
        //% blockId="Head_To_Right" block="Head_To_Right"
        drifts[drifts["AvantDroite"] = 2] = "AvantDroite";
        //% blockId="Rear_To_Left" block="Rear_To_Left"
        drifts[drifts["ArriereGauche"] = 3] = "ArriereGauche";
        //% blockId="Rear_To_Right" block="Rear_To_Right"
        drifts[drifts["ArriereDroite"] = 4] = "ArriereDroite";
    })(drifts = CP.drifts || (CP.drifts = {}));
    var enWideAngleDrift;
    (function (enWideAngleDrift) {
        //% blockId="Left" block="Left"
        enWideAngleDrift[enWideAngleDrift["Gauche"] = 0] = "Gauche";
        //% blockId="Right" block="Right"
        enWideAngleDrift[enWideAngleDrift["Droite"] = 1] = "Droite";
    })(enWideAngleDrift = CP.enWideAngleDrift || (CP.enWideAngleDrift = {}));
    var formes;
    (function (formes) {
        //% blockId="Carre" block="Carre"
        formes[formes["Carre"] = 1] = "Carre";
        //% blockId="Parallelogramme" block="Parallelogramme"
        formes[formes["Parallelogramme"] = 2] = "Parallelogramme";
        //% blockId="Rhombus" block="Rhombus"
        formes[formes["Rhombus"] = 3] = "Rhombus";
        //% blockId="Flash1" block="Flash1"
        formes[formes["Flash1"] = 4] = "Flash1";
        //% blockId="Flash2" block="Flash2"
        formes[formes["Flash2"] = 5] = "Flash2";
    })(formes = CP.formes || (CP.formes = {}));
    function i2cwrite(addr, reg, value) {
        var buf = pins.createBuffer(2);
        // @ts-ignore
        buf[0] = reg;
        // @ts-ignore
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }
    function i2ccmd(addr, value) {
        var buf = pins.createBuffer(1);
        // @ts-ignore
        buf[0] = value;
        pins.i2cWriteBuffer(addr, buf);
    }
    function i2cread(addr, reg) {
        pins.i2cWriteNumber(addr, reg, 7 /* UInt8BE */);
        return pins.i2cReadNumber(addr, 7 /* UInt8BE */);
    }
    function initPCA9685() {
        i2cwrite(PCA9685_ADD, MODE1, 0x00);
        setFreq(50);
        initialized = true;
    }
    function getRoues() {
        return CP.Roues;
    }
    CP.getRoues = getRoues;
    function getVitesses() {
        return [CP.Roues[0].vitesse, CP.Roues[1].vitesse, CP.Roues[2].vitesse, CP.Roues[3].vitesse];
    }
    CP.getVitesses = getVitesses;
    function setFreq(freq) {
        // Constrain the frequency
        var prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        var prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        var oldmode = i2cread(PCA9685_ADD, MODE1);
        var newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cwrite(PCA9685_ADD, MODE1, newmode); // go to sleep
        i2cwrite(PCA9685_ADD, PRESCALE, prescale); // set the prescaler
        i2cwrite(PCA9685_ADD, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite(PCA9685_ADD, MODE1, oldmode | 0xa1);
    }
    function setPwm(channel, on, off) {
        if (channel < 0 || channel > 15)
            return;
        if (!initialized) {
            initPCA9685();
        }
        var buf = pins.createBuffer(5);
        // @ts-ignore
        buf[0] = LED0_ON_L + 4 * channel;
        // @ts-ignore
        buf[1] = on & 0xff;
        // @ts-ignore
        buf[2] = (on >> 8) & 0xff;
        // @ts-ignore
        buf[3] = off & 0xff;
        // @ts-ignore
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADD, buf);
    }
    function stopMotor(index) {
        CP.Roues[RoueFromMoteurIndex(index)].vitesse = 5;
        CP.Roues[RoueFromMoteurIndex(index)].led.showColor(neopixel.colors(NeoPixelColors.Red));
        setPwm(index, 0, 0);
        setPwm(index + 1, 0, 0);
    }
    function forward(vitesse) {
        ActiveMoteur(CP.moteurs.M1, vitesse);
        ActiveMoteur(CP.moteurs.M2, vitesse);
        ActiveMoteur(CP.moteurs.M3, vitesse);
        ActiveMoteur(CP.moteurs.M4, vitesse);
    }
    function back(vitesse) {
        ActiveMoteur(CP.moteurs.M1, -vitesse);
        ActiveMoteur(CP.moteurs.M2, -vitesse);
        ActiveMoteur(CP.moteurs.M3, -vitesse);
        ActiveMoteur(CP.moteurs.M4, -vitesse);
    }
    function moveLeft(vitesse) {
        ActiveMoteur(CP.moteurs.M1, -vitesse);
        ActiveMoteur(CP.moteurs.M2, vitesse);
        ActiveMoteur(CP.moteurs.M3, vitesse);
        ActiveMoteur(CP.moteurs.M4, -vitesse);
    }
    function moveRight(vitesse) {
        ActiveMoteur(CP.moteurs.M1, vitesse);
        ActiveMoteur(CP.moteurs.M2, -vitesse);
        ActiveMoteur(CP.moteurs.M3, -vitesse);
        ActiveMoteur(CP.moteurs.M4, vitesse);
    }
    function left_Front(vitesse) {
        ActiveMoteur(CP.moteurs.M1, 0);
        ActiveMoteur(CP.moteurs.M2, vitesse);
        ActiveMoteur(CP.moteurs.M3, vitesse);
        ActiveMoteur(CP.moteurs.M4, 0);
    }
    function left_Back(vitesse) {
        ActiveMoteur(CP.moteurs.M1, -vitesse);
        ActiveMoteur(CP.moteurs.M2, 0);
        ActiveMoteur(CP.moteurs.M3, 0);
        ActiveMoteur(CP.moteurs.M4, -vitesse);
    }
    function right_Front(vitesse) {
        ActiveMoteur(CP.moteurs.M1, vitesse);
        ActiveMoteur(CP.moteurs.M2, 0);
        ActiveMoteur(CP.moteurs.M3, 0);
        ActiveMoteur(CP.moteurs.M4, vitesse);
    }
    function right_Back(vitesse) {
        ActiveMoteur(CP.moteurs.M1, 0);
        ActiveMoteur(CP.moteurs.M2, -vitesse);
        ActiveMoteur(CP.moteurs.M3, -vitesse);
        ActiveMoteur(CP.moteurs.M4, 0);
    }
    function spin_Left(vitesse) {
        ActiveMoteur(CP.moteurs.M1, -vitesse);
        ActiveMoteur(CP.moteurs.M2, -vitesse);
        ActiveMoteur(CP.moteurs.M3, vitesse);
        ActiveMoteur(CP.moteurs.M4, vitesse);
    }
    function spin_Right(vitesse) {
        ActiveMoteur(CP.moteurs.M1, vitesse);
        ActiveMoteur(CP.moteurs.M2, vitesse);
        ActiveMoteur(CP.moteurs.M3, -vitesse);
        ActiveMoteur(CP.moteurs.M4, -vitesse);
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
        CP.Roues.forEach(function (r) {
            r.vitesse = 5;
            r.led.showColor(neopixel.colors(NeoPixelColors.Red));
        });
    }
    function MecanumRun(xvitesse, yvitesse, avitesse) {
        var vitessem1 = yvitesse + xvitesse - avitesse;
        var vitessem2 = yvitesse - xvitesse - avitesse;
        var vitessem3 = yvitesse - xvitesse + avitesse;
        var vitessem4 = yvitesse + xvitesse + avitesse;
        ActiveMoteur(CP.moteurs.M1, vitessem1);
        ActiveMoteur(CP.moteurs.M2, vitessem2);
        ActiveMoteur(CP.moteurs.M3, vitessem3);
        ActiveMoteur(CP.moteurs.M4, vitessem4);
    }
    //% blockId=Tourne block="Tourne|%rotation|vitesse %vitesse"
    //% weight=102
    //% blockGap=10
    //% group="Contrôle de la voiture"
    //% vitesse.min=0 vitesse.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    function Tourne(rotation, vitesse) {
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
    CP.Tourne = Tourne;
    //% blockId=Déplace block="Déplace|%direction|vitesse %vitesse"
    //% weight=102
    //% blockGap=10
    //% group="Contrôle de la voiture"
    //% vitesse.min=0 vitesse.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    function Deplace(direction, vitesse) {
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
    CP.Deplace = Deplace;
    //% blockId=Polygon block="Polygon|%polygon|vitesse %vitesse"
    //% weight=101
    //% blockGap=10
    //% group="Contrôle de la voiture"
    //% vitesse.min=0 vitesse.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    function Polygon(polygon, vitesse) {
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
    CP.Polygon = Polygon;
    //% blockId=Drift block="Drift|%direction|vitesse %vitesse"
    //% weight=100
    //% blockGap=10
    //% group="Contrôle de la voiture"
    //% vitesse.min=0 vitesse.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    function Drift(direction, vitesse) {
        if (!initialized) {
            initPCA9685();
        }
        if (vitesse <= 0) {
            vitesse = 0;
        }
        switch (direction) {
            case drifts.ArriereGauche:
                ActiveMoteur(CP.moteurs.M1, 0);
                ActiveMoteur(CP.moteurs.M2, vitesse);
                ActiveMoteur(CP.moteurs.M3, 0);
                ActiveMoteur(CP.moteurs.M4, -vitesse);
                break;
            case drifts.ArriereDroite:
                ActiveMoteur(CP.moteurs.M1, 0);
                ActiveMoteur(CP.moteurs.M2, -vitesse);
                ActiveMoteur(CP.moteurs.M3, 0);
                ActiveMoteur(CP.moteurs.M4, vitesse);
                break;
            case drifts.AvantGauche:
                ActiveMoteur(CP.moteurs.M1, -vitesse);
                ActiveMoteur(CP.moteurs.M2, 0);
                ActiveMoteur(CP.moteurs.M3, vitesse);
                ActiveMoteur(CP.moteurs.M4, 0);
                break;
            case drifts.AvantDroite:
                ActiveMoteur(CP.moteurs.M1, vitesse);
                ActiveMoteur(CP.moteurs.M2, 0);
                ActiveMoteur(CP.moteurs.M3, -vitesse);
                ActiveMoteur(CP.moteurs.M4, 0);
                break;
            default:
                break;
        }
    }
    CP.Drift = Drift;
    //% blockId=WideAngleDrift block="WideAngleDrift|%direction|vitesse_avant %vitesse_avant|vitesse_arriere %vitesse_arriere"
    //% weight=99
    //% blockGap=10
    //% group="Contrôle de la voiture"
    //% vitesse_avant.min=0 vitesse_avant.max=255
    //% vitesse_arriere.min=0 vitesse_arriere.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    function WideAngleDrift(direction, vitesse_avant, vitesse_arriere) {
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
                ActiveMoteur(CP.moteurs.M1, -vitesse_avant);
                ActiveMoteur(CP.moteurs.M2, vitesse_arriere);
                ActiveMoteur(CP.moteurs.M3, vitesse_avant);
                ActiveMoteur(CP.moteurs.M4, -vitesse_arriere);
                break;
            case enWideAngleDrift.Droite:
                ActiveMoteur(CP.moteurs.M1, vitesse_avant);
                ActiveMoteur(CP.moteurs.M2, -vitesse_arriere);
                ActiveMoteur(CP.moteurs.M3, -vitesse_avant);
                ActiveMoteur(CP.moteurs.M4, vitesse_arriere);
                break;
            default:
                break;
        }
    }
    CP.WideAngleDrift = WideAngleDrift;
    //% blockId=Manipuler block="Manipuler|x %x|y %y|rotation %leftOrRight"
    //% weight=98
    //% blockGap=10
    //% group="Contrôle de la voiture"
    //% leftOrRight.min=-1 leftOrRight.max=1
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    function Manipuler(x, y, leftOrRight) {
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
        var linearvitesse = 255;
        var angularvitesse = 255;
        x = x / 512;
        y = y / 512;
        MecanumRun(x * linearvitesse, y * linearvitesse, -leftOrRight * angularvitesse);
    }
    CP.Manipuler = Manipuler;
    //% blockId=LED block="LEC"
    //% weight=97
    //% blockGap=10
    //% group="Fonctionnalités de la voiture"
    //% advanced=true
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    function LED() {
        if (!yahStrip) {
            yahStrip = neopixel.create(19 /* P12 */, 4, NeoPixelMode.RGB);
        }
        return yahStrip;
    }
    CP.LED = LED;
    //% blockId=Musique block="Musique|%index"
    //% weight=96
    //% blockGap=10
    //% group="Fonctionnalités de la voiture"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    function Musique(index) {
        switch (index) {
            case sons.dadadum:
                music.beginMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.Once);
                break;
            case sons.anniversaire:
                music.beginMelody(music.builtInMelody(Melodies.Birthday), MelodyOptions.Once);
                break;
            case sons.entertainer:
                music.beginMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once);
                break;
            case sons.prelude:
                music.beginMelody(music.builtInMelody(Melodies.Prelude), MelodyOptions.Once);
                break;
            case sons.ode:
                music.beginMelody(music.builtInMelody(Melodies.Ode), MelodyOptions.Once);
                break;
            case sons.nyan:
                music.beginMelody(music.builtInMelody(Melodies.Nyan), MelodyOptions.Once);
                break;
            case sons.ringtone:
                music.beginMelody(music.builtInMelody(Melodies.Ringtone), MelodyOptions.Once);
                break;
            case sons.funk:
                music.beginMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.Once);
                break;
            case sons.blues:
                music.beginMelody(music.builtInMelody(Melodies.Blues), MelodyOptions.Once);
                break;
            case sons.mariage:
                music.beginMelody(music.builtInMelody(Melodies.Wedding), MelodyOptions.Once);
                break;
            case sons.funereal:
                music.beginMelody(music.builtInMelody(Melodies.Funeral), MelodyOptions.Once);
                break;
            case sons.punchline:
                music.beginMelody(music.builtInMelody(Melodies.Punchline), MelodyOptions.Once);
                break;
            case sons.baddy:
                music.beginMelody(music.builtInMelody(Melodies.Baddy), MelodyOptions.Once);
                break;
            case sons.chase:
                music.beginMelody(music.builtInMelody(Melodies.Chase), MelodyOptions.Once);
                break;
            case sons.ba_ding:
                music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once);
                break;
            case sons.wawawawaa:
                music.beginMelody(music.builtInMelody(Melodies.Wawawawaa), MelodyOptions.Once);
                break;
            case sons.jump_up:
                music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once);
                break;
            case sons.jump_down:
                music.beginMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.Once);
                break;
            case sons.power_up:
                music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once);
                break;
            case sons.power_down:
                music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.Once);
                break;
        }
    }
    CP.Musique = Musique;
    //% blockId=Servo block="Servo(180°)|num %num|valeur %value"
    //% weight=95
    //% blockGap=20
    //% advanced=true
    //% num.min=1 num.max=4 value.min=0 value.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    function Servo(num, value) {
        // 50hz: 20,000 us
        var us = (value * 1800 / 180 + 600); // 0.6 ~ 2.4
        var pwm = us * 4096 / 20000;
        setPwm(num, 0, pwm);
    }
    CP.Servo = Servo;
    //% blockId=Servo2 block="Servo(270°)|num %num|valeur %value"
    //% weight=94
    //% blockGap=20
    //% advanced=true
    //% num.min=1 num.max=4 value.min=0 value.max=270
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    function Servo2(num, value) {
        // 50hz: 20,000 us
        var newvalue = remap(value, 0, 270, 0, 180);
        var us = (newvalue * 1800 / 180 + 600); // 0.6 ~ 2.4
        var pwm = us * 4096 / 20000;
        setPwm(num, 0, pwm);
    }
    CP.Servo2 = Servo2;
    //% blockId=Servo3 block="Servo(360°)|num %num|pos %pos|valeur %value"
    //% weight=93
    //% blockGap=20
    //% advanced=true
    //% num.min=1 num.max=4 value.min=0 value.max=90
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    function Servo3(num, pos, value) {
        // 50hz: 20,000 us
        if (pos == positions.Stop) {
            var us = (86 * 1800 / 180 + 600); // 0.6 ~ 2.4
            var pwm = us * 4096 / 20000;
            setPwm(num, 0, pwm);
        }
        else if (pos == positions.Avance) { //0-90 -> 90 - 0
            var us = ((90 - value) * 1800 / 180 + 600); // 0.6 ~ 2.4
            var pwm = us * 4096 / 20000;
            setPwm(num, 0, pwm);
        }
        else if (pos == positions.Recule) { //0-90 -> 90 -180
            var us = ((90 + value) * 1800 / 180 + 600); // 0.6 ~ 2.4
            var pwm = us * 4096 / 20000;
            setPwm(num, 0, pwm);
        }
    }
    CP.Servo3 = Servo3;
    //% blockId=ActiveMoteur block="ActiveMoteur|%index|vitesse(-255~255) %vitesse"
    //% weight=92
    //% blockGap=10
    //% group="Fonctionnalités de la voiture"
    //% vitesse.min=-255 vitesse.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    function ActiveMoteur(index, vitesse) {
        if (vitesse >= 255) {
            vitesse = 255;
        }
        if (vitesse <= -255) {
            vitesse = -255;
        }
        var RoueActuelle = CP.Roues[RoueFromMoteur(index)];
        RoueActuelle.vitesse = remap(vitesse, -255, 255, 9, 1);
        if (RoueActuelle.vitesse > 5) {
            RoueActuelle.led.showColor(neopixel.colors(NeoPixelColors.Blue));
        }
        else if (RoueActuelle.vitesse < 5) {
            RoueActuelle.led.showColor(neopixel.colors(NeoPixelColors.Yellow));
        }
        else {
            RoueActuelle.led.showColor(neopixel.colors(NeoPixelColors.Red));
        }
        if (!initialized) {
            initPCA9685();
        }
        vitesse = remap(vitesse, -255, 255, -4095, 4095); // map 255 to 4095
        if (vitesse >= 4095) {
            vitesse = 4095;
        }
        if (vitesse <= -4095) {
            vitesse = -4095;
        }
        vitesse = vitesse * -1;
        var a = index;
        var b = index + 1;
        if (a > 10) {
            if (vitesse >= 0) {
                setPwm(a, 0, vitesse);
                setPwm(b, 0, 0);
            }
            else {
                setPwm(a, 0, 0);
                setPwm(b, 0, -vitesse);
            }
        }
        else {
            if (vitesse >= 0) {
                setPwm(b, 0, vitesse);
                setPwm(a, 0, 0);
            }
            else {
                setPwm(b, 0, 0);
                setPwm(a, 0, -vitesse);
            }
        }
    }
    CP.ActiveMoteur = ActiveMoteur;
    //% blockId=ArretMoteurs block="Arret des moteurs"
    //% weight=91
    //% blockGap=10
    //% group="Fonctionnalités de la voiture"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    function ArretMoteurs() {
        if (!initialized) {
            initPCA9685();
        }
        stopMotor(CP.moteurs.M1);
        stopMotor(CP.moteurs.M2);
        stopMotor(CP.moteurs.M3);
        stopMotor(CP.moteurs.M4);
    }
    CP.ArretMoteurs = ArretMoteurs;
})(CP || (CP = {}));
