const EventEmitter = require("events");

class GlobEmiiter extends EventEmitter {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  static getInstance() {
    if (!GlobEmiiter.instance) {
      GlobEmiiter.instance = new GlobEmiiter();
    }

    return GlobEmiiter.instance;
  }
}

const globEmitterInstance = GlobEmiiter.getInstance();
module.exports = globEmitterInstance;
