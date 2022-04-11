export function addJoysticIfAndroid(self) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        self.joyStick = self.plugins.get('rexvirtualjoystickplugin').add(self, {
            x: 400,
            y: 470,
            radius: 50,
            base: self.add.circle(0, 0, 50, 0x888888),
            thumb: self.add.circle(0, 0, 25, 0xcccccc),
        });
        self.cursorKeys = self.joyStick.createCursorKeys();
    }
}