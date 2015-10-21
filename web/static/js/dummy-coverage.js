export default {
  "name": "lib/policy-manager.js",
  "source": "'use strict';\n\nconst _                   = require('lodash');\nconst assert              = require('assert');\nconst Policy              = require('./policy');\nconst Executor            = require('./executor');\nconst AuthenticationError = require('./authentication-error');\n\nfunction PolicyManager(policies, defaultStrategies) {\n  if (defaultStrategies) {\n    this._defaultExecutor = new Executor(defaultStrategies);\n  }\n\n  this._policies = [];\n\n  policies = policies || [];\n  assert(_.isArray(policies), 'policies should be an array');\n\n  for (let policy of policies) {\n    this.addPolicy(policy);\n  }\n}\n\n_.extend(PolicyManager.prototype, {\n  policiesFor: function (path, method) {\n    let policies = [];\n    for (let policy of this._policies) {\n      if (policy.appliesTo(path, method)) {\n        policies.push(policy);\n      }\n    }\n    return policies;\n  },\n\n  applyPolicies: function *(context) {\n    let policies = this.policiesFor(context.path, context.method);\n    let entities = {};\n    for (let policy of policies) {\n      if (entities[policy.scope]) {\n        continue;\n      }\n      entities[policy.scope] = yield this.applyPolicy(policy, context);\n    }\n    return entities;\n  },\n\n  applyPolicy: function *(policy, context) {\n    let entity, errMessage;\n    try {\n      entity = yield policy.executor.authenticate(context, policy.scope);\n    } catch (err) {\n      if (err instanceof AuthenticationError) {\n        errMessage = err.message;\n      } else {\n        throw err;\n      }\n    }\n    if (!entity && policy.enforce) {\n      throw new AuthenticationError(errMessage || 'authentication failed', policy);\n    }\n    return entity;\n  },\n\n  addPolicy: function (policy) {\n    if (!(policy instanceof Policy)) {\n      policy = new Policy(policy);\n    }\n    if (policy.strategies) {\n      policy.executor = new Executor(policy.strategies);\n    } else {\n      policy.executor = this._defaultExecutor;\n    }\n    assert(policy.executor,\n      'you must provide a default strategy or a strategy for each policy');\n    this._policies.push(policy);\n  },\n\n  policies: function () {\n    return Object.create(this._policies);\n  }\n});\n\nmodule.exports = PolicyManager;\n",
  "coverage": [
    null,
    null,
    1,
    1,
    1,
    1,
    1,
    null,
    1,
    10,
    10,
    null,
    null,
    10,
    null,
    10,
    10,
    null,
    10,
    2,
    null,
    null,
    null,
    1,
    null,
    15,
    15,
    85,
    16,
    null,
    null,
    15,
    null,
    null,
    null,
    10,
    10,
    10,
    10,
    0,
    null,
    10,
    null,
    4,
    null,
    null,
    null,
    13,
    13,
    13,
    null,
    2,
    1,
    null,
    1,
    null,
    null,
    12,
    6,
    null,
    6,
    null,
    null,
    null,
    65,
    56,
    null,
    65,
    27,
    null,
    38,
    null,
    65,
    null,
    65,
    null,
    null,
    null,
    12,
    null,
    null,
    null,
    1,
    null
  ]
}