// services/SoundService.ts
import Sound from 'react-native-sound';

const soundCache: {[key: string]: Sound | null} = {}; // Cache to avoid reloading sounds repeatedly

class SoundService {
  // Method to play a sound, using the cache to avoid reloading
  public playSound(soundName: 'green' | 'red' | 'yellow' | 'blue' | 'wrong') {
    // If the sound is already in the cache, stop the current sound and replay it
    if (soundCache[soundName]) {
      soundCache[soundName]?.stop(() => {
        soundCache[soundName]?.play((success: boolean) => {
          if (!success) {
            console.error(`Error playing sound: ${soundName}`);
          }
        });
      });
      return;
    }

    // Load the sound if it's not cached
    const sound = new Sound(`${soundName}.mp3`, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('Failed to load the sound', error);
        return;
      }

      // Cache the loaded sound
      soundCache[soundName] = sound;

      sound.play((success: boolean) => {
        if (!success) {
          console.error(`Error playing sound: ${soundName}`);
        }
      });
    });
  }

  // You can add other utility methods as needed, such as stopping all sounds
  public stopAllSounds() {
    Object.values(soundCache).forEach(sound => {
      sound?.stop();
    });
  }
}

export const soundService = new SoundService();
