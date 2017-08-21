const testsContext = require.context(".", true, /_Test$/);
testsContext.keys().forEach(testsContext);
