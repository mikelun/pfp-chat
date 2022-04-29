import { buildshipLevel2 } from "./buildship/buildship";
import { cryptoDuckiesLevel2 } from "./crypto-duckies/cryptoDuckies";
import { defaultLevel0, defaultLevel1 } from "./default-levels/defaultLevels";

const rooms = ["guest", "buildship", "crypto-duckies"];

export function initializeRooms(self) {
    var room = window.location.href.split('/');
    self.room = room[room.length - 1];
    if (!rooms.includes(self.room)) {
        self.room = "guest";
    }
    self.levels = [defaultLevel0, defaultLevel1, buildshipLevel2];
    if (self.room == 'buildship') {
        self.levels = [defaultLevel0, defaultLevel1, buildshipLevel2];
    } else if (self.room == 'crypto-duckies') {
        self.levels = [defaultLevel0, defaultLevel1, cryptoDuckiesLevel2];
    } else {
        self.room = 'guest';
        self.levels = [defaultLevel0, defaultLevel1];
    }
    // if (self.room == 'ailoverse') {
    //     self.levels = [defaultLevel0, defaultLevel1, ailoverseLevel2];
    // } else if (self.room == 'pudgy-penguin' || self.room == 'pudgy-penguins') {
    //     self.levels = [defaultLevel0, defaultLevel1, pinguinLevel2];
    // } else if (self.room == 'cryptocoven') {
    //     self.levels = [defaultLevel0, defaultLevel1, witchesLevel2];
    // } else if (self.room == 'crypto-duckies') {
    //     self.levels = [defaultLevel0, defaultLevel1, cryptoDuckiesLevel2];
    // } else if (self.room == 'buildship') {
    //     self.room = 'buildship';
    //     self.levels = [defaultLevel0, defaultLevel1, buildshipLevel2];
    // } else if (self.room == 'dobey') {
    //     self.room = 'dobey';
    //     self.levels = [defaultLevel0, dobbyLevel1];
    // } else {      
    //     self.room = 'guest';
    //     self.levels = [defaultLevel0, guestLevel1];
    // }
}