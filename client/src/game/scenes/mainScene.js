import Phaser from 'phaser';
import { initializeSocket } from '../socket/initializeSocket';

export class MainScene extends Phaser.Scene {

    constructor(stream) {
        super({ key: 'MainScene' });
    }

    preload() {

    }
    
    create() {
        initializeSocket();
        
    }
}