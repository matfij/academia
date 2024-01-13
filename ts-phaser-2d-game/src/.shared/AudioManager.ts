export class AudioManager {
    private static musicElement = new Audio();
    private static progress = 0;

    static play({ url, volume, progress = 0 }: { url: string; volume: number; progress: number }) {
        const playWithDelay = () => {
            this.musicElement.src = url;
            this.musicElement.volume = volume;
            this.musicElement.play().catch(() => {
                setTimeout(playWithDelay, 1000);
            });
            this.musicElement.currentTime = progress;
            this.musicElement.addEventListener('timeupdate', () => {
                this.progress = this.musicElement.currentTime;
            });
        };
        playWithDelay();
    }

    static pause() {
        this.musicElement.pause();
    }

    static resume() {
        this.musicElement.play();
    }

    static getProgress() {
        return this.progress;
    }
}
