import {Moralis} from "moralis";
import { store } from "../stores";
import { updateMoralisUser } from "../stores/loginReducer";

export async function intializeMoralis() {
    const serverUrl = "https://6p6l4bkklzk5.usemoralis.com:2053/server";
    const appId = "zOUPVnZgAXdqks5vHsMf77KWAhBUwzdFAl4NtKy9";
    Moralis.start({ serverUrl, appId });

    const user = Moralis.User.current();

    store.dispatch(updateMoralisUser(user));

}

export async function loginByMoralis() {
    await Moralis.authenticate({ signingMessage: "Log in using Moralis", })
        .then(function (user) {

        })
        .catch(function (error) {

        });
}