const packageJSON = require('../../package.json');
import * as appInsights from 'applicationinsights';

const config = appInsights.setup('d87241c1-2091-4d9b-a457-40055d403ce9');
config.setInternalLogging(false, false);
appInsights.start();
appInsights.defaultClient.commonProperties = {
  version: packageJSON.version
};

export default appInsights.defaultClient;