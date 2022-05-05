# [PFPCHAT](https://meet.buildship.xyz)

Dress up your NFTs, create planets, bars and NPCs. This project is about creativity


## Clone repo, install deps

``` bash
git clone git@github.com:mikelun/open-metaverse.git
cd open-metaverse && npm install
```

## Run dev server

``` bash
npm run parcel
npm run start
```

## How to add planet for your NFT collection?
Сurrently, collections are supported only from eth mainnet. 
1. Generate the planet for your NFT collection here: [Planet Generator](https://deep-fold.itch.io/pixel-planet-generator). Make the field Pixels equal to 50. Generate your planet, then select spritesheet and set Frames(Width) equal to 50, Frames(Height) equal to 1. Then create the folder in ```public/assets/projects/``` with your collection name and save your planet there. You will have something like this 
```
public/assets/projects/[YOUR COLLECTION NAME]/`[YOUR PLANET NAME]-planet.png
```
Go to ```public/js/scenes/preloadScene.js``` and add this code to loadPlanets function.: 
```
this.load.spritesheet('[YOUR PLANET NAME]', '[YOUR PLANET NAME]-planet.png', {
    frameWidth: 50,
    frameHeight: 50,
});
``` 
2. Go to ```public/js/scenes/StartScene/projects```. Make folder with your NFT collection name and copy file 
```
public/js/scenes/StartScene/projects/example.js
``` 
to your folder. Change variables in setUpYourPlanet function. And finally change the name of function ```example``` to ```[YOUR COLLECTION NAME]```. You can check example in crypto-duckies folder.  

3. Add import for your planet here  ```public/scenes/StartScene/initializeRooms.js```
```
import { [YOUR COLLECTION NAME] } from "./projects/[YOUR COLLECTION NAME]/[YOUR COLLECTION NAME].js
```
   And at the end add to rooms variable
```
"[YOUR COLLECTION NAME]": [YOUR COLLECTION NAME]]
``` 

Congrats! Now you have your own room for your NFT collection. You can run code and check it here: ```localhost:3000/[YOUR COLLECTION NAME]```
**If you don't see your planet, restart parcel**

## How to change UI 
### Adding simple text
Phaser is very simple.

For example you want to add text 'Hello world!'.
In phaser it looks like.
``` js
this.add.text(x, y, 'Hello World!'). 
```
x, y - position on screen. 
this - scene where you want to add it. 

### Adding image
At first you should add image to public/assets. 
Then go to public/js/scenes/preloadScene.js. 
Add image to preload function. 
``` js
this.load.image('name', 'assets/name_of_your_image.jpg');
```
You are ready to add it to scene!  
``` js
this.add.image(x, y, 'name');
```
You can try it on GameUIScene or MainScene. 

## Learn more about Phaser 3 
You can check this link: https://phaser.io/examples/v3. 
There are a lot of simple projects those help you to understand how phaser 3 actually works.

---
Author: [mikelun.eth](https://twitter.com/mikelun_eth)
