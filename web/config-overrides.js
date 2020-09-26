/* config-overrides.js */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { override } = require('customize-cra');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { addReactRefresh } = require('customize-cra-react-refresh');

module.exports = override(addReactRefresh());
