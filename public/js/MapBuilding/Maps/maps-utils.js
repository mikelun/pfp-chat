export function clearMapWithTransition(self, clearMapFunction) {
    self.slowTransition = self.add.rectangle(0, 0, 10000, 10000, 0x000000).setAlpha(0);
    // add timer while slow Transition alpha < 1
    const timer = self.time.addEvent({
        delay: 10,
        callback: () => {
            self.slowTransition.alpha += 0.03;
            if (self.slowTransition.alpha >= 1) {
                clearMapFunction(self);
                self.slowTransition.destroy();
                timer.destroy();
            }
        },
        callbackScope: self,
        loop: true
    });
}