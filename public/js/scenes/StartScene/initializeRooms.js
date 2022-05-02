import { buildshipLevel2 } from "./projects/buildship/buildship";
import { coffeebarLevel2 } from "./projects/coffeebar/coffeebar";
import { cryptoDuckiesLevel2 } from "./projects/crypto-duckies/cryptoDuckies";
import { defaultLevel0, defaultLevel1 } from "./default-levels/defaultLevels";
import { guestLevel1 } from "./projects/Guest/guest";

const rooms = {
    "buildship": buildshipLevel2,
    "crypto-duckies": cryptoDuckiesLevel2,
    "coffeebar": coffeebarLevel2,
};
export function initializeRooms(self) {
    var room = window.location.href.split('/');
    self.room = room[room.length - 1];

    // check if room in rooms
    if (rooms[self.room]) {
        self.levels = [defaultLevel0, defaultLevel1, rooms[self.room]];
    } else {
        self.room = "coffeebar";
        self.levels = [defaultLevel0, defaultLevel1, coffeebarLevel2];
    }

}