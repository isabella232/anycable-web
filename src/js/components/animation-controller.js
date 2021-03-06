import application from '../app';
import nodeY from '../utils/node-y';
import { FramesPlayer } from '../utils/frames-player';

application.component('.js-animation-controller', {
  init() {
    this.hooks = document.getElementsByClassName('js-animation-hook');

    this.eventHandler = this.updateAnimation.bind(this);

    this.watch();
    this.updateAnimation();
  },

  updateAnimation() {
    const activeHook = this.findActiveHook();
    if (!activeHook || (activeHook == this.prevHook)) return;

    activeHook.framesPlayer = activeHook.framesPlayer || new FramesPlayer(this.node, activeHook.dataset['frame'], activeHook.dataset['interval']);
    const activePlayer = activeHook.framesPlayer;

    if (this.prevHook) {
      this.prevHook.framesPlayer.stop();
    }

    activePlayer.play();

    this.prevHook = activeHook;
  },

  // active hook is an element,
  // which lies in the upper half of the window
  findActiveHook() {
    const viewTop = document.body.scrollTop || document.documentElement.scrollTop;
    const viewH = window.innerHeight;

    const threshold = viewTop + (1 / 2) * viewH;

    let dist = Infinity;
    let closestHook = this.hooks[0];

    for(let hook of this.hooks) {
      const hookDist = threshold - nodeY(hook);

      if (hookDist >= 0 && hookDist < dist) {
        dist = hookDist;
        closestHook = hook;
      }
    }

    return closestHook;
  },

  watch() {
    window.addEventListener('scroll', this.eventHandler);
    window.addEventListener('resize', this.eventHandler);
  },
});
