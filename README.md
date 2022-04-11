# OpenMetaverse

## Clone repo, install deps

```
git clone git@github.com:mikelun/open-metaverse.git
cd open-metaverse && npm install
```

## Run dev server

```
npm run parcel
npm run start
```

## How to change UI 
### Adding simple text
Phaser is very simple
For example you want to add text 'Hello world!'
In phaser it looks like 
```
this.add.text(x, y, 'Hello World!')
```
x, y - position on screen
this - scene where you want to add it

### Adding image
At first you should add image to public/assets
Then go to public/js/scenes/preloadScene.js
Add image to preload function
```
this.load.image('name', 'assets/name_of_your_image.jpg');
```
You are ready to add it to scene!
```
this.add.image(x, y, 'name');
```
You can try it on GameUIScene or MainScene