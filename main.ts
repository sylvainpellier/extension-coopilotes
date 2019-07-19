/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from chengengyue
load dependency
"OmniBit": "file:../pxt-OmniBit"
*/

//% color="#ECA40D" weight=20 icon="\uf047"
namespace OmniBit {

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
    let yahStrip: neopixel.Strip;


    export enum enMusic {

        dadadum = 0,
        entertainer,
        prelude,
        ode,
        nyan,
        ringtone,
        funk,
        blues,

        birthday,
        wedding,
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

    export enum enPos {
        //% blockId="forward" block="forward"
        forward = 1,
        //% blockId="reverse" block="reverse"
        reverse = 2,
        //% blockId="stop" block="stop"
        stop = 3
    }

    export enum enServo {
        S1 = 0,
        S2,
        S3,
        S4,
        S5,
        S6,
        S7,
        S8
    }

    export enum enMotors {
        M1 = 8,
        M2 = 10,
        M3 = 12,
        M4 = 14
    }

    export enum enCarRun {
        //% blockId="Forward" block="Forward"
        Forward = 1,
        //% blockId="Back" block="Back"
        Back,
        //% blockId="MoveLeft" block="MoveLeft"
        MoveLeft,
        //% blockId="MoveRight" block="MoveRight"
        MoveRight,
        //% blockId="Spin_Left" block="Spin_Left"
        Spin_Left,
        //% blockId="Spin_Right" block="Spin_Right"
        Spin_Right,
        //% blockId="Left_Front" block="Left_Front"
        Left_Front,
        //% blockId="Right_Front" block="Right_Front"
        Right_Front,
        //% blockId="Left_Back" block="Left_Back"
        Left_Back,
        //% blockId="Right_Back" block="Right_Back"
        Right_Back,
        //% blockId="CarStop" block="CarStop"
        CarStop
    }

    export enum enCarDrift {
        //% blockId="Head_To_Left" block="Head_To_Left"
        Head_To_Left = 1,
        //% blockId="Head_To_Right" block="Head_To_Right"
        Head_To_Right,
        //% blockId="Rear_To_Left" block="Rear_To_Left"
        Rear_To_Left,
        //% blockId="Rear_To_Right" block="Rear_To_Right"
        Rear_To_Right
    }

    export enum enWideAngleDrift {
        //% blockId="Left" block="Left"
        Left,
        //% blockId="Right" block="Right"
        Right
    }

    export enum enPolygon {
        //% blockId="Square" block="Square"
        Square = 1,
        //% blockId="Parallelogram" block="Parallelogram"
        Parallelogram,
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
        let buf = pins.createBuffer(1)
        buf[0] = value
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


    function forward(speed: number) {
        MotorRun(enMotors.M1, speed);
        MotorRun(enMotors.M2, speed);
        MotorRun(enMotors.M3, speed);
        MotorRun(enMotors.M4, speed);
    }

    function back(speed: number) {
        MotorRun(enMotors.M1, -speed);
        MotorRun(enMotors.M2, -speed);
        MotorRun(enMotors.M3, -speed);
        MotorRun(enMotors.M4, -speed);
    }

    function moveLeft(speed: number) {
        MotorRun(enMotors.M1, -speed);
        MotorRun(enMotors.M2, speed);
        MotorRun(enMotors.M3, speed);
        MotorRun(enMotors.M4, -speed);
    }

    function moveRight(speed: number) {
        MotorRun(enMotors.M1, speed);
        MotorRun(enMotors.M2, -speed);
        MotorRun(enMotors.M3, -speed);
        MotorRun(enMotors.M4, speed);
    }

    function left_Front(speed: number) {
        MotorRun(enMotors.M1, 0);
        MotorRun(enMotors.M2, speed);
        MotorRun(enMotors.M3, speed);
        MotorRun(enMotors.M4, 0);
    }

    function left_Back(speed: number) {
        MotorRun(enMotors.M1, -speed);
        MotorRun(enMotors.M2, 0);
        MotorRun(enMotors.M3, 0);
        MotorRun(enMotors.M4, -speed);
    }

    function right_Front(speed: number) {
        MotorRun(enMotors.M1, speed);
        MotorRun(enMotors.M2, 0);
        MotorRun(enMotors.M3, 0);
        MotorRun(enMotors.M4, speed);
    }

    function right_Back(speed: number) {
        MotorRun(enMotors.M1, 0);
        MotorRun(enMotors.M2, -speed);
        MotorRun(enMotors.M3, -speed);
        MotorRun(enMotors.M4, 0);
    }

    function spin_Left(speed: number) {
        MotorRun(enMotors.M1, -speed);
        MotorRun(enMotors.M2, -speed);
        MotorRun(enMotors.M3, speed);
        MotorRun(enMotors.M4, speed);
    }

    function spin_Right(speed: number) {
        MotorRun(enMotors.M1, speed);
        MotorRun(enMotors.M2, speed);
        MotorRun(enMotors.M3, -speed);
        MotorRun(enMotors.M4, -speed);
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

    function MecanumRun(xSpeed: number, ySpeed: number, aSpeed: number) {
        let speedm1 = ySpeed + xSpeed - aSpeed;
        let speedm2 = ySpeed - xSpeed - aSpeed;
        let speedm3 = ySpeed - xSpeed + aSpeed;
        let speedm4 = ySpeed + xSpeed + aSpeed;

        MotorRun(enMotors.M1, speedm1);
        MotorRun(enMotors.M2, speedm2);
        MotorRun(enMotors.M3, speedm3);
        MotorRun(enMotors.M4, speedm4);
    }

    //% blockId=OmniBit_CarRun block="CarRun|%direction|speed %speed"
    //% weight=102
    //% blockGap=10
    //% group="CarControl"
    //% speed.min=0 speed.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function CarRun(direction: enCarRun, speed: number): void {
        if (!initialized) {
            initPCA9685();
        }
        if (speed <= 0) {
            speed = 0;
        }
        switch (direction) {
            case enCarRun.Forward:
                forward(speed);
                break;
            case enCarRun.Back:
                back(speed);
                break;
            case enCarRun.MoveLeft:
                moveLeft(speed);
                break;
            case enCarRun.MoveRight:
                moveRight(speed);
                break;
            case enCarRun.Spin_Left:
                spin_Left(speed);
                break;
            case enCarRun.Spin_Right:
                spin_Right(speed);
                break;
            case enCarRun.Left_Front:
                left_Front(speed);
                break;
            case enCarRun.Left_Back:
                left_Back(speed);
                break;
            case enCarRun.Right_Front:
                right_Front(speed);
                break;
            case enCarRun.Right_Back:
                right_Back(speed);
                break;
            case enCarRun.CarStop:
                carStop();
                break;
            default:
                break;
        }
    }

    //% blockId=OmniBit_Polygon block="Polygon|%polygon|speed %speed"
    //% weight=101
    //% blockGap=10
    //% group="CarControl"
    //% speed.min=0 speed.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Polygon(polygon: enPolygon, speed: number): void {
        if (!initialized) {
            initPCA9685();
        }
        if (speed < 0) {
            speed = 0;
        }

        switch (polygon) {
            case enPolygon.Square:
                back(speed);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                moveRight(speed);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                forward(speed);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                moveLeft(speed);
                basic.pause(1000);
                carStop();
                basic.pause(10);
                break;
            case enPolygon.Parallelogram:
                right_Front(speed);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                moveRight(speed);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                left_Back(speed);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                moveLeft(speed);
                basic.pause(1000);
                carStop();
                basic.pause(10);
                break;
            case enPolygon.Rhombus:
                right_Front(speed);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                right_Back(speed);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                left_Back(speed);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                left_Front(speed);
                basic.pause(1000);
                carStop();
                basic.pause(10);
                break;
            case enPolygon.Flash1:
                right_Front(speed);
                basic.pause(1500);
                carStop();
                basic.pause(10);

                moveLeft(speed);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                right_Front(speed);
                basic.pause(1500);
                carStop();
                basic.pause(10);
                break;
            case enPolygon.Flash2:
                left_Back(speed);
                basic.pause(1500);
                carStop();
                basic.pause(10);

                moveRight(speed);
                basic.pause(1000);
                carStop();
                basic.pause(10);

                left_Back(speed);
                basic.pause(1500);
                carStop();
                basic.pause(10);
                break;
            default:
                break;
        }
    }


    //% blockId=OmniBit_CarDrift block="CarDrift|%direction|speed %speed"
    //% weight=100
    //% blockGap=10
    //% group="CarControl"
    //% speed.min=0 speed.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function CarDrift(direction: enCarDrift, speed: number): void {
        if (!initialized) {
            initPCA9685();
        }
        if (speed <= 0) {
            speed = 0;
        }
        switch (direction) {
            case enCarDrift.Rear_To_Left:
                MotorRun(enMotors.M1, 0);
                MotorRun(enMotors.M2, speed);
                MotorRun(enMotors.M3, 0);
                MotorRun(enMotors.M4, -speed);
                break;
            case enCarDrift.Rear_To_Right:
                MotorRun(enMotors.M1, 0);
                MotorRun(enMotors.M2, -speed);
                MotorRun(enMotors.M3, 0);
                MotorRun(enMotors.M4, speed);
                break;
            case enCarDrift.Head_To_Left:
                MotorRun(enMotors.M1, -speed);
                MotorRun(enMotors.M2, 0);
                MotorRun(enMotors.M3, speed);
                MotorRun(enMotors.M4, 0);
                break;
            case enCarDrift.Head_To_Right:
                MotorRun(enMotors.M1, speed);
                MotorRun(enMotors.M2, 0);
                MotorRun(enMotors.M3, -speed);
                MotorRun(enMotors.M4, 0);
                break;
            default:
                break;
        }
    }

    //% blockId=OmniBit_WideAngleDrift block="WideAngleDrift|%direction|speed_front %speed_front|speed_back %speed_back"
    //% weight=99
    //% blockGap=10
    //% group="CarControl"
    //% speed_front.min=0 speed_front.max=255 
    //% speed_back.min=0 speed_back.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function WideAngleDrift(direction: enWideAngleDrift, speed_front: number, speed_back: number): void {
        if (!initialized) {
            initPCA9685();
        }
        if (speed_front <= 0) {
            speed_front = 0;
        }
        if (speed_back <= 0) {
            speed_back = 0;
        }

        switch (direction) {
            case enWideAngleDrift.Left:
                MotorRun(enMotors.M1, -speed_front);
                MotorRun(enMotors.M2, speed_back);
                MotorRun(enMotors.M3, speed_front);
                MotorRun(enMotors.M4, -speed_back);
                break;
            case enWideAngleDrift.Right:
                MotorRun(enMotors.M1, speed_front);
                MotorRun(enMotors.M2, -speed_back);
                MotorRun(enMotors.M3, -speed_front);
                MotorRun(enMotors.M4, speed_back);
                break;
            default:
                break;
        }
    }

    //% blockId=OmniBit_Handle block="Handle|x %x|y %y|rotation %leftOrRight"
    //% weight=98
    //% blockGap=10
    //% group="CarControl"
    //% leftOrRight.min=-1 leftOrRight.max=1
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Handle(x: number, y: number, leftOrRight: number): void {
        if (!initialized) {
            initPCA9685();
        }
        if (Math.abs(x) <= 10 && Math.abs(y) <= 10) {
            x = 0;
            y = 0;
        }
        if (leftOrRight != 0 && leftOrRight != 1 && leftOrRight != -1) {
            leftOrRight = 0;
        }
        let linearSpeed = 255;
        let angularSpeed = 255;
        x = x / 512;
        y = y / 512;
        MecanumRun(x * linearSpeed, y * linearSpeed, -leftOrRight * angularSpeed);
    }

    //% blockId=OmniBit_RGB_Program block="RGB_Program"
    //% weight=97
    //% blockGap=10
    //% group="BoardFuntion"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Program(): neopixel.Strip {
        if (!yahStrip) {
            yahStrip = neopixel.create(DigitalPin.P12, 4, NeoPixelMode.RGB);
        }
        return yahStrip;
    }

    //% blockId=OmniBit_Music block="Music|%index"
    //% weight=96
    //% blockGap=10
    //% group="BoardFuntion"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Music(index: enMusic): void {
        switch (index) {
            case enMusic.dadadum: music.beginMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.Once); break;
            case enMusic.birthday: music.beginMelody(music.builtInMelody(Melodies.Birthday), MelodyOptions.Once); break;
            case enMusic.entertainer: music.beginMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once); break;
            case enMusic.prelude: music.beginMelody(music.builtInMelody(Melodies.Prelude), MelodyOptions.Once); break;
            case enMusic.ode: music.beginMelody(music.builtInMelody(Melodies.Ode), MelodyOptions.Once); break;
            case enMusic.nyan: music.beginMelody(music.builtInMelody(Melodies.Nyan), MelodyOptions.Once); break;
            case enMusic.ringtone: music.beginMelody(music.builtInMelody(Melodies.Ringtone), MelodyOptions.Once); break;
            case enMusic.funk: music.beginMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.Once); break;
            case enMusic.blues: music.beginMelody(music.builtInMelody(Melodies.Blues), MelodyOptions.Once); break;
            case enMusic.wedding: music.beginMelody(music.builtInMelody(Melodies.Wedding), MelodyOptions.Once); break;
            case enMusic.funereal: music.beginMelody(music.builtInMelody(Melodies.Funeral), MelodyOptions.Once); break;
            case enMusic.punchline: music.beginMelody(music.builtInMelody(Melodies.Punchline), MelodyOptions.Once); break;
            case enMusic.baddy: music.beginMelody(music.builtInMelody(Melodies.Baddy), MelodyOptions.Once); break;
            case enMusic.chase: music.beginMelody(music.builtInMelody(Melodies.Chase), MelodyOptions.Once); break;
            case enMusic.ba_ding: music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once); break;
            case enMusic.wawawawaa: music.beginMelody(music.builtInMelody(Melodies.Wawawawaa), MelodyOptions.Once); break;
            case enMusic.jump_up: music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once); break;
            case enMusic.jump_down: music.beginMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.Once); break;
            case enMusic.power_up: music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once); break;
            case enMusic.power_down: music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.Once); break;
        }
    }

    //% blockId=OmniBit_Servo block="Servo(180°)|num %num|value %value"
    //% weight=95
    //% blockGap=20
    //% advanced=true
    //% num.min=1 num.max=4 value.min=0 value.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function Servo(num: enServo, value: number): void {

        // 50hz: 20,000 us
        let us = (value * 1800 / 180 + 600); // 0.6 ~ 2.4
        let pwm = us * 4096 / 20000;
        setPwm(num, 0, pwm);

    }

    //% blockId=OmniBit_Servo2 block="Servo(270°)|num %num|value %value"
    //% weight=94
    //% blockGap=20
    //% advanced=true
    //% num.min=1 num.max=4 value.min=0 value.max=270
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function Servo2(num: enServo, value: number): void {

        // 50hz: 20,000 us
        let newvalue = Math.map(value, 0, 270, 0, 180);
        let us = (newvalue * 1800 / 180 + 600); // 0.6 ~ 2.4
        let pwm = us * 4096 / 20000;
        setPwm(num, 0, pwm);

    }

    //% blockId=OmniBit_Servo3 block="Servo(360°)|num %num|pos %pos|value %value"
    //% weight=93
    //% blockGap=20
    //% advanced=true
    //% num.min=1 num.max=4 value.min=0 value.max=90
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function Servo3(num: enServo, pos: enPos, value: number): void {

        // 50hz: 20,000 us

        if (pos == enPos.stop) {
            let us = (86 * 1800 / 180 + 600); // 0.6 ~ 2.4
            let pwm = us * 4096 / 20000;
            setPwm(num, 0, pwm);
        }
        else if (pos == enPos.forward) { //0-90 -> 90 - 0
            let us = ((90 - value) * 1800 / 180 + 600); // 0.6 ~ 2.4
            let pwm = us * 4096 / 20000;
            setPwm(num, 0, pwm);
        }
        else if (pos == enPos.reverse) { //0-90 -> 90 -180
            let us = ((90 + value) * 1800 / 180 + 600); // 0.6 ~ 2.4
            let pwm = us * 4096 / 20000;
            setPwm(num, 0, pwm);
        }
    }

    //% blockId=OmniBit_MotorRun block="Motor|%index|speed(-255~255) %speed"
    //% weight=92
    //% blockGap=10
    //% group="BoardFuntion"
    //% speed.min=-255 speed.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function MotorRun(index: enMotors, speed: number): void {
        if (!initialized) {
            initPCA9685();
        }
        speed = Math.map(speed, 0, 255, 0, 4095); // map 255 to 4095
        if (speed >= 4095) {
            speed = 4095;
        }
        if (speed <= -4095) {
            speed = -4095;
        }

        let a = index;
        let b = index + 1;

        if (a > 10) {
            if (speed >= 0) {
                setPwm(a, 0, speed);
                setPwm(b, 0, 0);
            } else {
                setPwm(a, 0, 0);
                setPwm(b, 0, -speed);
            }
        }
        else {
            if (speed >= 0) {
                setPwm(b, 0, speed);
                setPwm(a, 0, 0);
            } else {
                setPwm(b, 0, 0);
                setPwm(a, 0, -speed);
            }
        }
    }

    //% blockId=OmniBit_MotorStopAll block="Motor Stop All"
    //% weight=91
    //% blockGap=10
    //% advanced=true
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function MotorStopAll(): void {
        if (!initialized) {
            initPCA9685();
        }
        stopMotor(enMotors.M1);
        stopMotor(enMotors.M2);
        stopMotor(enMotors.M3);
        stopMotor(enMotors.M4);
    }

    //% blockId=OmniBit_Reset block="Reset Motor and RGB lamp"
    //% weight=90
    //% blockGap=10
    //% group="BoardFuntion"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Reset(): void {
        if (!initialized) {
            initPCA9685();
        }
        RGB_Program().clear();
        RGB_Program().show();
        carStop();
    }
}
