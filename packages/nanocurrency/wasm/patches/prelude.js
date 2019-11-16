// START PRELUDE
let IS_NODE = false
try {
  IS_NODE =
    Object.prototype.toString.call(global.process) === '[object process]'
} catch (_e) {}
const TextDecoder = IS_NODE ? require('util').TextDecoder : self.TextDecoder
// END PRELUDE
