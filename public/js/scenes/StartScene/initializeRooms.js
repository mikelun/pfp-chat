import { buildship } from "./projects/buildship/buildship";
import { coffeebar } from "./projects/coffeebar/coffeebar";
import { cryptoDuckies } from "./projects/crypto-duckies/cryptoDuckies";
import { connectGoogleLevel, defaultLevel0, defaultLevel1, defaultLevel1WithGuestEnter } from "./default-levels/defaultLevels";
import { moonbirds } from "./projects/moonbirds/moonbirds";

const rooms = {
    "buildship": buildship,
    "crypto-duckies": cryptoDuckies,
    "coffeebar": coffeebar,
    "moonbirds": moonbirds,
};
export function initializeRooms(self) {
    self.id = window.location.href.split('/')[window.location.href.split('/').length - 1];

    self.planetName = "coffeebar";
    self.levels = [defaultLevel0, defaultLevel1WithGuestEnter, coffeebar];
}