import amplitude from 'amplitude-js';

export function initializeAmplitude() {
    var amplitudeApiKey;
    // if localhost then use amplitude api key for localhost
    if (window.location.hostname === 'localhost') {
        amplitudeApiKey = '6648b45165dd7c87186cdbde519806cd';
    } else {
        amplitudeApiKey = 'acfb0e38d497cecab0cb4218c7360b32';
    }
    var instance1 = amplitude.getInstance().init(amplitudeApiKey);
    amplitude.getInstance().logEvent('Player has entered the game');
}

export function sendEventToAmplitude(event) {
    amplitude.getInstance().logEvent(event);
}