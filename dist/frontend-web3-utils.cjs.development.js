'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var immer = require('immer');
var isEqual = _interopDefault(require('lodash/isEqual'));
var logger = require('@ethersproject/logger');
var properties = require('@ethersproject/properties');
var ethers = require('ethers');
var types = require('@web3-react/types');
var coinbaseWallet = require('@web3-react/coinbase-wallet');
var core$1 = require('@web3-react/core');
var gnosisSafe = require('@web3-react/gnosis-safe');
var metamask$1 = require('@web3-react/metamask');
var walletconnectV2 = require('@web3-react/walletconnect-v2');
var dayjs = _interopDefault(require('dayjs'));

function _regeneratorRuntime() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */

  _regeneratorRuntime = function () {
    return exports;
  };

  var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }

  try {
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
    return generator._invoke = function (innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");

        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }

        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);

          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }

          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }(innerFn, self, context), generator;
  }

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  exports.wrap = wrap;
  var ContinueSentinel = {};

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {}

  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if ("throw" !== record.type) {
        var result = record.arg,
            value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }

      reject(record.arg);
    }

    var previousPromise;

    this._invoke = function (method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    };
  }

  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (undefined === method) {
      if (context.delegate = null, "throw" === context.method) {
        if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
        context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }

  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;

          return next.value = undefined, next.done = !0, next;
        };

        return next.next = next;
      }
    }

    return {
      next: doneResult
    };
  }

  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }

  return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (object) {
    var keys = [];

    for (var key in object) keys.push(key);

    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }

      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function () {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) throw exception;
      var context = this;

      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
            record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function (record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      }

      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

(function (LocalStorageKeys) {
  LocalStorageKeys["LastConnectedWallet"] = "LastConnectedWallet";
  LocalStorageKeys["TransactionPool"] = "TransactionPool";
})(exports.LocalStorageKeys || (exports.LocalStorageKeys = {}));

var setLocalStorageTxPool = function setLocalStorageTxPool(pool) {
  var stringifiedPool = JSON.stringify(pool);
  localStorage.setItem(exports.LocalStorageKeys.TransactionPool, stringifiedPool);
};
var getLocalStorageTxPool = function getLocalStorageTxPool() {
  return localStorage.getItem(exports.LocalStorageKeys.TransactionPool);
};
var setLocalStorageWallet = function setLocalStorageWallet(walletType) {
  localStorage.setItem(exports.LocalStorageKeys.LastConnectedWallet, walletType);
};
var deleteLocalStorageWallet = function deleteLocalStorageWallet() {
  localStorage.removeItem(exports.LocalStorageKeys.LastConnectedWallet);
};
var clearWalletConnectLocalStorage = function clearWalletConnectLocalStorage() {
  localStorage.removeItem('walletconnect');
  localStorage.removeItem('-walletlink:https://www.walletlink.org:version');
  localStorage.removeItem('-walletlink:https://www.walletlink.org:session:id');
  localStorage.removeItem('-walletlink:https://www.walletlink.org:session:secret');
  localStorage.removeItem('-walletlink:https://www.walletlink.org:session:linked');
  localStorage.removeItem('-walletlink:https://www.walletlink.org:AppVersion');
  localStorage.removeItem('-walletlink:https://www.walletlink.org:Addresses');
  localStorage.removeItem('-walletlink:https://www.walletlink.org:walletUsername');
};

var selectAllTransactions = function selectAllTransactions(state) {
  return Object.values(state.transactionsPool).sort(function (a, b) {
    return Number(a.localTimestamp) - Number(b.localTimestamp);
  });
};
var selectPendingTransactions = function selectPendingTransactions(state) {
  return selectAllTransactions(state).filter(function (tx) {
    return tx.pending;
  });
};
var selectTXByKey = function selectTXByKey(state, key) {
  return state.transactionsPool[key];
};
var selectTXByHash = function selectTXByHash(state, hash) {
  var txByKey = selectTXByKey(state, hash);

  if (txByKey) {
    return txByKey;
  }

  return selectAllTransactions(state).find(function (tx) {
    return tx.hash == hash;
  });
};
var selectAllTransactionsByWallet = function selectAllTransactionsByWallet(state, from) {
  return selectAllTransactions(state).filter(function (tx) {
    return tx.from == from;
  });
};
var selectPendingTransactionByWallet = function selectPendingTransactionByWallet(state, from) {
  return selectPendingTransactions(state).filter(function (tx) {
    return tx.from == from;
  });
};
var selectLastTxByTypeAndPayload = function selectLastTxByTypeAndPayload(state, from, type, payload) {
  var allTransactions = selectAllTransactionsByWallet(state, from);
  var filteredTransactions = allTransactions.filter(function (tx) {
    return tx.type === type && isEqual(tx.payload, payload);
  });
  var lastFilteredTransaction = filteredTransactions[filteredTransactions.length - 1];

  if (lastFilteredTransaction) {
    if (isGelatoBaseTx(lastFilteredTransaction)) {
      return selectTXByKey(state, lastFilteredTransaction.taskId);
    } else {
      if (lastFilteredTransaction.hash) {
        return selectTXByKey(state, lastFilteredTransaction.hash);
      } else {
        return undefined;
      }
    }
  } else {
    return undefined;
  }
};
var selectTxExplorerLink = function selectTxExplorerLink(state, getChainParameters, txHash) {
  var tx = selectTXByHash(state, txHash);

  if (!tx) {
    return '';
  }

  var gnosisSafeLinksHelper = {
    1: 'https://app.safe.global/eth:',
    5: 'https://app.safe.global/gor:'
  };

  if (tx.walletType !== 'GnosisSafe') {
    return (// eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getChainParameters(tx.chainId).blockExplorerUrls[0] + "/tx/" + txHash
    );
  } else {
    return "" + gnosisSafeLinksHelper[tx.chainId] + tx.from + "/transactions/tx?id=multisig_" + tx.from + "_" + txHash;
  }
};
var selectIsGelatoTXPending = function selectIsGelatoTXPending(gelatoStatus) {
  return gelatoStatus == undefined || gelatoStatus == 'CheckPending' || gelatoStatus == 'WaitingForConfirmation' || gelatoStatus == 'ExecPending';
};

function isGelatoTx(tx) {
  return tx.taskId !== undefined;
}
function isGelatoBaseTx(tx) {
  return tx.taskId !== undefined;
}
function isGelatoBaseTxWithoutTimestamp(tx) {
  return tx.taskId !== undefined;
}
var GelatoAdapter = function GelatoAdapter(get, set) {
  var _this = this;

  this.transactionsIntervalsMap = {};

  this.executeTx = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(params) {
      var activeWallet, chainId, type, tx, from, gelatoTX, txPool;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              activeWallet = params.activeWallet, chainId = params.chainId, type = params.type;
              tx = params.tx;
              from = activeWallet.accounts[0];
              gelatoTX = {
                from: from,
                chainId: chainId,
                type: type,
                taskId: tx.taskId,
                payload: params.payload
              };
              txPool = _this.get().addTXToPool(gelatoTX, activeWallet.walletType);

              _this.startTxTracking(tx.taskId);

              return _context.abrupt("return", txPool[tx.taskId]);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();

  this.startTxTracking = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(taskId) {
      var tx, isPending, newGelatoInterval;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // TODO: need fix typing for transactions pool
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              tx = _this.get().transactionsPool[taskId];
              isPending = selectIsGelatoTXPending(tx.gelatoStatus);

              if (isPending) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return");

            case 4:
              _this.stopPollingGelatoTXStatus(taskId);

              newGelatoInterval = setInterval(function () {
                _this.fetchGelatoTXStatus(taskId); // TODO: maybe change timeout for gelato

              }, 2000);
              _this.transactionsIntervalsMap[taskId] = Number(newGelatoInterval);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  this.stopPollingGelatoTXStatus = function (taskId) {
    var currentInterval = _this.transactionsIntervalsMap[taskId];
    clearInterval(currentInterval);
    _this.transactionsIntervalsMap[taskId] = undefined;
  };

  this.fetchGelatoTXStatus = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(taskId) {
      var response, gelatoStatus, isPending, tx;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return fetch("https://api.gelato.digital/tasks/status/" + taskId + "/");

            case 2:
              response = _context3.sent;

              if (response.ok) {
                _context3.next = 6;
                break;
              }

              _context3.next = 12;
              break;

            case 6:
              _context3.next = 8;
              return response.json();

            case 8:
              gelatoStatus = _context3.sent;
              isPending = selectIsGelatoTXPending(gelatoStatus.task.taskState);

              _this.updateGelatoTX(taskId, gelatoStatus);

              if (!isPending) {
                _this.stopPollingGelatoTXStatus(taskId);

                tx = _this.get().transactionsPool[taskId];

                _this.get().txStatusChangedCallback(tx);
              }

            case 12:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }();

  this.updateGelatoTX = function (taskId, statusResponse) {
    _this.set(function (state) {
      return immer.produce(state, function (draft) {
        var tx = draft.transactionsPool[taskId];
        tx.gelatoStatus = statusResponse.task.taskState;
        tx.pending = selectIsGelatoTXPending(statusResponse.task.taskState);
        tx.hash = statusResponse.task.transactionHash;
        tx.status = statusResponse.task.taskState == 'ExecSuccess' ? 1 : tx.pending ? undefined : 0;

        if (statusResponse.task.executionDate) {
          tx.timestamp = new Date(statusResponse.task.executionDate).getTime();
        }

        if (statusResponse.task.lastCheckMessage) {
          tx.errorMessage = statusResponse.task.lastCheckMessage;
        }
      });
    });

    setLocalStorageTxPool(_this.get().transactionsPool);
  };

  this.get = get;
  this.set = set;
};

var useLastTxLocalStatus = function useLastTxLocalStatus(_ref) {
  var state = _ref.state,
      activeAddress = _ref.activeAddress,
      type = _ref.type,
      payload = _ref.payload;
  var tx = selectLastTxByTypeAndPayload(state, activeAddress, type, payload);

  var _useState = React.useState(''),
      fullTxErrorMessage = _useState[0],
      setFullTxErrorMessage = _useState[1];

  var _useState2 = React.useState(''),
      error = _useState2[0],
      setError = _useState2[1];

  var _useState3 = React.useState(false),
      loading = _useState3[0],
      setLoading = _useState3[1];

  var _useState4 = React.useState(false),
      isTxStart = _useState4[0],
      setIsTxStart = _useState4[1];

  var txHash = tx && tx.hash;
  var txPending = tx && tx.pending;
  var isError = tx && isGelatoBaseTx(tx) ? !tx.pending && (tx.status !== 1 || !!error) : tx && !tx.pending && tx.status !== 1 || !!error;
  var txSuccess = tx && tx.status === 1 && !isError;
  var txChainId = tx && tx.chainId;
  var txWalletType = tx && tx.walletType;
  React.useEffect(function () {
    return function () {
      setFullTxErrorMessage('');
      setError('');
    };
  }, []);
  React.useEffect(function () {
    if (txPending || isError) {
      setIsTxStart(true);
    }
  }, [txPending, isError]);
  React.useEffect(function () {
    if (tx != null && tx.errorMessage) {
      setError(tx.errorMessage);
    }
  }, [tx == null ? void 0 : tx.errorMessage]);

  function executeTxWithLocalStatuses(_x) {
    return _executeTxWithLocalStatuses.apply(this, arguments);
  }

  function _executeTxWithLocalStatuses() {
    _executeTxWithLocalStatuses = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref2) {
      var errorMessage, callbackFunction, _error;

      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              errorMessage = _ref2.errorMessage, callbackFunction = _ref2.callbackFunction;
              setError('');
              setLoading(true);
              _context.prev = 3;
              _context.next = 6;
              return callbackFunction();

            case 6:
              _context.next = 14;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](3);
              _error = _context.t0;
              console.error('TX error: ', _error);
              setFullTxErrorMessage(!!(_error != null && _error.message) ? _error.message : _error);
              setError(errorMessage);

            case 14:
              setLoading(false);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[3, 8]]);
    }));
    return _executeTxWithLocalStatuses.apply(this, arguments);
  }

  return {
    error: error,
    setError: setError,
    loading: loading,
    setLoading: setLoading,
    isTxStart: isTxStart,
    setIsTxStart: setIsTxStart,
    txHash: txHash,
    txPending: txPending,
    txSuccess: txSuccess,
    txChainId: txChainId,
    txWalletType: txWalletType,
    isError: isError,
    executeTxWithLocalStatuses: executeTxWithLocalStatuses,
    fullTxErrorMessage: fullTxErrorMessage,
    setFullTxErrorMessage: setFullTxErrorMessage
  };
};

var StaticJsonRpcBatchProvider = /*#__PURE__*/function (_providers$JsonRpcBat) {
  _inheritsLoose(StaticJsonRpcBatchProvider, _providers$JsonRpcBat);

  function StaticJsonRpcBatchProvider() {
    return _providers$JsonRpcBat.apply(this, arguments) || this;
  }

  var _proto = StaticJsonRpcBatchProvider.prototype;

  _proto.detectNetwork = /*#__PURE__*/function () {
    var _detectNetwork = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var network;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              network = this.network;

              if (!(network == null)) {
                _context.next = 7;
                break;
              }

              _context.next = 4;
              return _providers$JsonRpcBat.prototype.detectNetwork.call(this);

            case 4:
              network = _context.sent;

              if (!network) {
                ethers.logger.throwError('no network detected', logger.Logger.errors.UNKNOWN_ERROR, {});
              } // If still not set, set it


              if (this._network == null) {
                // A static network does not support "any"
                properties.defineReadOnly(this, '_network', network);
                this.emit('network', network, null);
              }

            case 7:
              return _context.abrupt("return", network);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function detectNetwork() {
      return _detectNetwork.apply(this, arguments);
    }

    return detectNetwork;
  }();

  return StaticJsonRpcBatchProvider;
}(ethers.providers.JsonRpcBatchProvider);

var ETH = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18
};
var MATIC = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18
};
var AVAX = {
  name: 'Avax',
  symbol: 'AVAX',
  decimals: 18
};
var initialChains = {
  1: {
    urls: ['https://cloudflare-eth.com'],
    nativeCurrency: ETH,
    name: 'Ethereum',
    blockExplorerUrls: ['https://etherscan.io']
  },
  137: {
    urls: ['https://polygon.llamarpc.com'],
    nativeCurrency: MATIC,
    name: 'Polygon',
    blockExplorerUrls: ['https://polygonscan.com']
  },
  43114: {
    urls: ['https://rpc.ankr.com/avalanche'],
    nativeCurrency: AVAX,
    name: 'Avalanche',
    blockExplorerUrls: ['https://snowtrace.io']
  },
  // testnet chains
  5: {
    urls: ['https://ethereum-goerli.publicnode.com'],
    nativeCurrency: ETH,
    name: 'Goerli testnet',
    blockExplorerUrls: ['https://goerli.etherscan.io']
  },
  43113: {
    urls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    nativeCurrency: AVAX,
    name: 'Avalanche fuji',
    blockExplorerUrls: ['https://testnet.snowtrace.io']
  },
  420: {
    urls: ['https://goerli.optimism.io'],
    nativeCurrency: ETH,
    name: 'Optimism goerli',
    blockExplorerUrls: ['https://goerli-optimism.etherscan.io/']
  },
  11155111: {
    urls: ['https://ethereum-sepolia.blockpi.network/v1/rpc/public'],
    nativeCurrency: ETH,
    name: 'Sepolia Testnet',
    blockExplorerUrls: ['https://sepolia.etherscan.io/']
  }
};

function isExtendedChainInformation(chainInformation) {
  return !!(chainInformation != null && chainInformation.nativeCurrency);
}

var initChainInformationConfig = function initChainInformationConfig(chains) {
  var CHAINS = Object.assign(initialChains, chains || {}); // init urls from chains config

  var urls = Object.keys(CHAINS).reduce(function (accumulator, chainId) {
    var validURLs = CHAINS[Number(chainId)].urls;

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs;
    }

    return accumulator;
  }, {}); // init provider instances from chain config

  var initalizedProviders = {};
  var providerInstances = Object.keys(CHAINS).reduce(function (accumulator, chainId) {
    var numberChainId = Number(chainId);
    accumulator[numberChainId] = {
      get instance() {
        if (initalizedProviders[numberChainId]) {
          return initalizedProviders[numberChainId];
        } else {
          // TODO: add fallback provider to utilize all the urls
          var provider = new StaticJsonRpcBatchProvider(urls[numberChainId][0]);
          initalizedProviders[numberChainId] = provider;
          return provider;
        }
      }

    };
    return accumulator;
  }, {});

  function getChainParameters(chainId) {
    var chainInformation = CHAINS[chainId];

    if (isExtendedChainInformation(chainInformation)) {
      return {
        chainId: chainId,
        chainName: chainInformation.name,
        nativeCurrency: chainInformation.nativeCurrency,
        rpcUrls: chainInformation.urls,
        blockExplorerUrls: chainInformation.blockExplorerUrls
      };
    } else {
      // this case can only ever occure when a wallet is connected with a unknown chainId which will not allow interaction
      return {
        chainId: chainId,
        chainName: "unknown network: " + chainId,
        nativeCurrency: initialChains[1].nativeCurrency,
        rpcUrls: initialChains[1].urls,
        blockExplorerUrls: initialChains[1].blockExplorerUrls
      };
    }
  }

  return {
    urls: urls,
    providerInstances: providerInstances,
    getChainParameters: getChainParameters
  };
};

var SafeTransactionServiceUrls = {
  1: 'https://safe-transaction-mainnet.safe.global/api/v1',
  5: 'https://safe-transaction-goerli.safe.global/api/v1',
  10: 'https://safe-transaction-optimism.safe.global/api/v1',
  137: 'https://safe-transaction-polygon.safe.global/api/v1',
  42161: 'https://safe-transaction-arbitrum.safe.global/api/v1',
  43114: 'https://safe-transaction-avalanche.safe.global/api/v1'
};

/**
 * The `WalletIdentityFlag` is a property on an etherium provider
 */
var WalletIdentityFlag;

(function (WalletIdentityFlag) {
  WalletIdentityFlag["AlphaWallet"] = "isAlphaWallet";
  WalletIdentityFlag["AToken"] = "isAToken";
  WalletIdentityFlag["Binance"] = "bbcSignTx";
  WalletIdentityFlag["Bitpie"] = "isBitpie";
  WalletIdentityFlag["BlockWallet"] = "isBlockWallet";
  WalletIdentityFlag["Coinbase"] = "isToshi";
  WalletIdentityFlag["CoinbaseExtension"] = "isCoinbaseWallet";
  WalletIdentityFlag["Dcent"] = "isDcentWallet";
  WalletIdentityFlag["Exodus"] = "isExodus";
  WalletIdentityFlag["Frontier"] = "isFrontier";
  WalletIdentityFlag["Frame"] = "isFrame";
  WalletIdentityFlag["HuobiWallet"] = "isHbWallet";
  WalletIdentityFlag["HyperPay"] = "isHyperPay";
  WalletIdentityFlag["ImToken"] = "isImToken";
  WalletIdentityFlag["Liquality"] = "isLiquality";
  WalletIdentityFlag["MeetOne"] = "wallet";
  WalletIdentityFlag["MetaMask"] = "isMetaMask";
  WalletIdentityFlag["MyKey"] = "isMYKEY";
  WalletIdentityFlag["OwnBit"] = "isOwnbit";
  WalletIdentityFlag["Status"] = "isStatus";
  WalletIdentityFlag["Trust"] = "isTrust";
  WalletIdentityFlag["TokenPocket"] = "isTokenPocket";
  WalletIdentityFlag["TP"] = "isTp";
  WalletIdentityFlag["WalletIo"] = "isWalletIO";
  WalletIdentityFlag["XDEFI"] = "isXDEFI";
  WalletIdentityFlag["OneInch"] = "isOneInchIOSWallet";
  WalletIdentityFlag["Tokenary"] = "isTokenary";
  WalletIdentityFlag["Tally"] = "isTally";
  WalletIdentityFlag["BraveWallet"] = "isBraveWallet";
  WalletIdentityFlag["Rabby"] = "isRabby";
  WalletIdentityFlag["MathWallet"] = "isMathWallet";
  WalletIdentityFlag["GameStop"] = "isGamestop";
  WalletIdentityFlag["BitKeep"] = "isBitKeep";
  WalletIdentityFlag["Sequence"] = "isSequence";
  WalletIdentityFlag["Core"] = "isAvalanche";
  WalletIdentityFlag["Opera"] = "isOpera";
  WalletIdentityFlag["Bitski"] = "isBitski";
  WalletIdentityFlag["Enkrypt"] = "isEnkrypt";
  WalletIdentityFlag["Phantom"] = "isPhantom";
  WalletIdentityFlag["OKXWallet"] = "isOkxWallet";
  WalletIdentityFlag["Zeal"] = "isZeal";
  WalletIdentityFlag["Zerion"] = "isZerion";
  WalletIdentityFlag["Rainbow"] = "isRainbow";
  WalletIdentityFlag["SafePal"] = "isSafePal";
  WalletIdentityFlag["DeFiWallet"] = "isDeficonnectProvider";
})(WalletIdentityFlag || (WalletIdentityFlag = {}));

var WalletLabel;

(function (WalletLabel) {
  WalletLabel["AlphaWallet"] = "Alpha Wallet";
  WalletLabel["AToken"] = "AToken Wallet";
  WalletLabel["Binance"] = "Binance Smart Wallet";
  WalletLabel["Bitpie"] = "Bitpie Wallet";
  WalletLabel["Bitski"] = "Bitski Wallet";
  WalletLabel["BlockWallet"] = "Block Wallet";
  WalletLabel["Brave"] = "Brave";
  WalletLabel["Coinbase"] = "Coinbase";
  WalletLabel["Dcent"] = "D'CENT Wallet";
  WalletLabel["Exodus"] = "Exodus";
  WalletLabel["Frame"] = "Frame";
  WalletLabel["Frontier"] = "Frontier";
  WalletLabel["HuobiWallet"] = "Huobi Wallet";
  WalletLabel["HyperPay"] = "HyperPay";
  WalletLabel["ImToken"] = "imToken";
  WalletLabel["Liquality"] = "Liquality";
  WalletLabel["MeetOne"] = "MeetOne";
  WalletLabel["MetaMask"] = "MetaMask";
  WalletLabel["MyKey"] = "MyKey";
  WalletLabel["Opera"] = "Opera";
  WalletLabel["OwnBit"] = "OwnBit";
  WalletLabel["Status"] = "Status";
  WalletLabel["Trust"] = "Trust Wallet";
  WalletLabel["TokenPocket"] = "TokenPocket";
  WalletLabel["TP"] = "TP Wallet";
  WalletLabel["WalletIo"] = "Wallet.io";
  WalletLabel["XDEFI"] = "XDEFI Wallet";
  WalletLabel["OneInch"] = "1inch";
  WalletLabel["Tokenary"] = "Tokenary Wallet";
  WalletLabel["Tally"] = "Tally Ho Wallet";
  WalletLabel["Rabby"] = "Rabby";
  WalletLabel["MathWallet"] = "MathWallet";
  WalletLabel["GameStop"] = "GameStop Wallet";
  WalletLabel["BitKeep"] = "BitKeep Wallet";
  WalletLabel["Sequence"] = "Sequence";
  WalletLabel["Core"] = "Core Wallet";
  WalletLabel["Enkrypt"] = "Enkrypt";
  WalletLabel["Zeal"] = "Zeal Wallet";
  WalletLabel["Phantom"] = "Phantom";
  WalletLabel["OKXWallet"] = "OKX Wallet";
  WalletLabel["Zerion"] = "Zerion";
  WalletLabel["Rainbow"] = "Rainbow";
  WalletLabel["SafePal"] = "SafePal";
  WalletLabel["DeFiWallet"] = "DeFi Wallet";
})(WalletLabel || (WalletLabel = {}));

var alphawallet = {
  identityFlag: WalletIdentityFlag.AlphaWallet,
  label: WalletLabel.AlphaWallet,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 40 40\"><defs><path id=\"a\" d=\"M0 .01h22.177v22.553H0z\"/></defs><g fill=\"none\" fill-rule=\"evenodd\"><path fill=\"#FFF\" d=\"M0 0h40v40H0z\"/><path fill=\"#81BA28\" d=\"m29.55 17.398-.099.126c.032-.043.066-.084.1-.126\"/><path fill=\"#FFF\" d=\"m29.55 17.398-.099.126c.032-.043.066-.084.1-.126\"/><path fill=\"#81BA28\" d=\"M34.918 8.923c-.315.502-4.53 7.132-4.936 7.768l-.275.432-.175.274a4.467 4.467 0 0 0-3.623-3.288c.08-.126 2.553-4.038 3.178-5.032.07-.114.133-.198.291-.198 1.82.006 3.637.006 5.456.008.016 0 .033.013.084.036\"/><path fill=\"#E52F2E\" d=\"M35.97 28.144c-.91 1.08-1.936 1.843-3.24 2.15-1.79.42-3.495.23-5.023-.877-1.112-.803-1.788-1.927-2.28-3.178a13.139 13.139 0 0 1-.052-.134l-.012-.03a40.972 40.972 0 0 1-.564-1.598 20.864 20.864 0 0 1-.463-1.585 4.446 4.446 0 0 0 4.208-1.41l.01-.009c.3.744.612 1.91.908 2.818a10.334 10.334 0 0 0 .242.679c.33.821.679 1.624 1.34 2.235.043.04.09.08.136.118.86.713 1.89.899 2.963.934.584.02 1.162-.06 1.827-.113\"/><g transform=\"translate(4 8)\"><mask id=\"b\" fill=\"#fff\"><use xlink:href=\"#a\"/></mask><path fill=\"#4BBCEC\" d=\"M17.438 12.897c-1.057 1.479-2.204 2.885-3.552 4.133-1.137 1.05-2.347 1.99-3.808 2.557a4.621 4.621 0 0 1-1.735.332c-1.696.003-2.914-1.06-3.274-2.835-.32-1.579-.159-3.133.284-4.654.82-2.818 2.26-5.31 4.172-7.524.865-1.001 1.858-1.862 3.156-2.274.917-.292 1.84-.374 2.736.086.69.355 1.172.928 1.556 1.583.547.932.886 1.943 1.18 2.97a4.442 4.442 0 0 1 3.755-1.161l.269-.423c-.204-.469-.376-.895-.57-1.31-.607-1.29-1.436-2.407-2.63-3.213C17.56.208 15.986-.1 14.297.042c-2.154.18-4.163.806-5.999 1.94-2.916 1.803-5.206 4.216-6.813 7.247-1.03 1.94-1.622 4.007-1.458 6.23.213 2.87 1.659 4.921 4.23 6.176 2 .976 4.129 1.064 6.286.799a13.24 13.24 0 0 0 5.04-1.71c1.891-1.094 3.53-2.52 5.056-4.075.052-.054.086-.134.16-.172a20.379 20.379 0 0 1-.462-1.585 4.468 4.468 0 0 1-2.899-1.995\" mask=\"url(#b)\"/></g><path fill=\"#FFD400\" d=\"M27.469 18.517a2.256 2.256 0 1 1-4.513 0 2.256 2.256 0 0 1 4.513 0\"/></g></svg>"
};

var atoken = {
  identityFlag: WalletIdentityFlag.AToken,
  label: WalletLabel.AToken,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 512 512\"><g clip-path=\"url(#a)\"><path fill=\"url(#b)\" d=\"M12.886 509.82H83.34a7.964 7.964 0 0 0 7.115-4.386L298.671 91.34a7.964 7.964 0 0 0-.085-7.32l-38.375-72.119c-2.432-4.569-9.009-4.486-11.324.144L5.763 498.294c-2.648 5.295 1.203 11.526 7.123 11.526Z\"/><path fill=\"url(#c)\" d=\"M321.91 510.615H188.853c-5.984 0-9.83-6.352-7.058-11.654L250.319 367.9c3.021-5.777 11.323-5.676 14.203.172l64.532 131.061c2.606 5.292-1.245 11.482-7.144 11.482Z\"/><path fill=\"url(#d)\" d=\"M499.1 510.615h-72.023a7.964 7.964 0 0 1-7.119-4.393L301.499 270.074a7.966 7.966 0 0 1-.029-7.082l35.702-72.679c2.903-5.911 11.318-5.944 14.268-.057l154.78 308.826c2.654 5.296-1.196 11.533-7.12 11.533Z\"/></g><defs><linearGradient id=\"b\" x1=\"17.491\" x2=\"257.59\" y1=\"509.82\" y2=\"7.36\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#1FA2F2\"/><stop offset=\"1\" stop-color=\"#3ECCF9\"/></linearGradient><linearGradient id=\"c\" x1=\"255.205\" x2=\"255.205\" y1=\"363.534\" y2=\"510.615\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#27AEF4\"/><stop offset=\"1\" stop-color=\"#1EA2F2\"/></linearGradient><linearGradient id=\"d\" x1=\"345.044\" x2=\"461.913\" y1=\"184.652\" y2=\"501.075\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#33BDF7\"/><stop offset=\"1\" stop-color=\"#1EA1F2\"/></linearGradient><clipPath id=\"a\"><path fill=\"#fff\" d=\"M0 0h512v512H0z\"/></clipPath></defs></svg>"
};

var binance = {
  identityFlag: WalletIdentityFlag.Binance,
  label: WalletLabel.Binance,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" fill=\"none\" viewBox=\"0 0 300 300\"><path fill=\"url(#a)\" d=\"M0 0h300v300H0z\"/><defs><pattern id=\"a\" width=\"1\" height=\"1\" patternContentUnits=\"objectBoundingBox\"><use xlink:href=\"#b\" transform=\"scale(.00333)\"/></pattern><image xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAABGdBTUEAALGPC/xhBQAAQABJREFUeAHtfQl8G8X1/8xKtuNY2lWuQilnSxIgXIXQI5wmtgyl9KClFHoALUeBktsBwhUIEAhJSCil0JYftP+WAj1ogZZadmLuUgg3gRy0FAhQSkiklRQnlrTz/46IgmMsW8fualZ6+nzslXZn3rz5vt3vzryZecMZfQgBGxGIdwX2sTJsCeOsh9VpM41m8zUbxZOoGkeA13j9qfo2IRB7Qh/J4tZcxsU5QjC/FIubq1dwtsTQG67mX9hg2lQUialhBLQarjtV3QYEhDjRF+sInAuyWiuYOD9HVlK0YKwe/2abZu8aszP4AyHm0v1mA+a1LIJaWLVs/TLrHu1qauEZvgRENaFAUc9qmjZVb40/VmB6SkYIbIcAEdZ2cNCPQhCILjM+w9KZhWhDfa2Q9P3TcM7vqud1FzS2bnyz/zX6TQgMhgAR1mDo0LXtEBCPjQ7GNvVczAWbnu3ubXe1yB9wynPBF+ij9AV84jubisxNyWsUASKsGjV8MdUWQvB4l36asKxrQFQ7FpO3gLRvccZnG22JuwpIS0lqHAEirBq/AYaqvhkJHmoJaynSHTxU2nKuo5v4uBC+qaG22DPlyKG81Y0AEVZ127fk2m16eOQuqS2916F1dXLJQorMyDlDcex2f/3wiwPN7/+3yOyUvAYQIMKqASMXU0XxxM6NZiLaDua4APmGF5PXvrQ8rnF+VfBTuy7hE1b22ieXJHkdASIsr1vQRv2jXYGTmCUWYO7UrjaKLVkUfFv/Qldxhh6O31eyEMpYVQgQYVWVOUurTHKZcVA6k1mKVtVhpUlwOhfv8tWxacGjEyudLonkq40AEZba9nFUu0RX0w5pi12NaQqnY/RP6VnouFEzjPOfsYB2uTHJ3OAoMCRcWQSIsJQ1jXOKiZUT6uPvvDnFssSlmPypO1eS/ZLRTdwAar1c90+8hTc/lLa/BJKoMgJEWCpbxwHdzI7g8VhKsxh/ezog3jWR8G29IjQxLdSS7HStUCqo4ggQYVXcBO4okAv7AqJqdadEd0oBcd1HYWzcwVqFUoiwVLCCgzoMFPbFweIqIho3ca/Q2FIj2HAVhbGpiAlcK1RpR6trKFRhQdmwL5HAeQOFfam26mbXNVqsncLYVJtlP14famF9HBPPnykh7Ivn69yvAhTGph8g1fKTCKtaLIl6yLAvPJ1ZBD/VV6uoWiVXBf4tCmNTMnpqZiTCUtMuRWlla9iXokr2QGIKY+MBIxWuIhFW4VgplxIz050M+6JcfctUiMLYlAmgCtmJsFSwQgk6uBX2pQTVlM6CbiKFsVHaQoMrR4Q1OD7KXa1E2BflQChTIQpjUyaAFcxOhFVB8IspWo2wL8Vo7IW0FMbGC1bqqyMRVl80FP2uWtgXRWEqWa1sGBuNz8RuPn8pWQhldAUBIixXYC6tEPXDvpRWL3VzURgbdW3zoWZEWApayEthXxSEryyV8EBQGJuyEHQ2MxGWs/gWJT0b9mXdm1MtJi7xWtiXoirqgcQUxkZNIxFhKWKXagn7ogictqlBYWxsg9IWQURYtsBYupBqDftSOiJq5qQwNmrYhQirQnaohbAvFYLWsWLxsFAYG8fQLUwwhZcpDCfbUtVS2BfbQFNEEIWxqbwhqIXlog1k2Bdm8RuwXei+LhZLRTmHAIWxcQ7bASUTYQ0Ii70naynsC0bXVjOuzdC41ZgR4nrscbiHvWiqJ02GsalrqJ89/MgNb6mnXXVpRITloD1rKuwL51EuxJX6qL1u4hOfSUlYxdo9G2KvvzcT3y5CqzLgINSVF01hbFyxARGWAzDXUtgX3EAZtDB+yer4JXpzfP1AcCYfGf3J9Oae+bj2fSFYtd9zFMZmoJvApnPVfvPYBFPhYmTYF8GsJXgwJxaey6MpOV/u52JaoDX5UiE1iEaMiVxgh2kmJhWS3stpQOIUxsYBAxJh2QRqTYV94fzfPs7ag62JP5UCX6yz6RRhsWuRd5dS8nslz7YwNj42J9CSfM8requsJxFWmdaprbAvPM40fo2x+w438LGvbSkHOrFip+HmBvMCtLba4ZhvLEeW+nkpjI1dNiLCKgPJWgn7IlsKgOlXvrrhFwWa3/9vGZB9LOvWlukC+P2+/bGLVXaCwtiUb1AirBIwrKWwL275YsxlwUkiYy2tCd8fozA2JTx22SxEWEUgV1NhXzh7kwt+gdGWuKsIiMpKWmujq4zzW1hAu8yYZG4oC7gaykyEVYCxayzsyyau8QV6U2gBn7SupwB4bE8iuscE4r2bLkY/dDr+GmwvQCGBFMamOGMQYQ2BV62Efcn6qQT/XV19/QXDmzesGwIWVy73dBh7bOGZRZh0+nVXCqxgISCulcInpodakp0VVEP5oomw8piolsK+gKye5po2VW+J/yMPHBU9DVs0ZzJsCWbM719RRVwoHD7D+1idNtNoNl9zoTjPFUHRGvKYTFh8BIbcR+W5XBWn8bZ6V2PaaXpr4vOqkpUEOtiS6DbCsz4Ln885aIm8XxXg56uEYGNEiofyXa7189TCGuQOEGKuFu9a9EM4g6/C3ycGSeqpS2hRbYbhbwjWDb+GN7+f8JLyonOEYbL05UxYP8aIYp2XdB9UV87ehk0uxMvjt2hlyWkk9BkAASKsAUDpfyr7kIj0ZYxZ53v/IeF/bKj3z2psjv6nfz299NvsCo4TlnUD7PElL+ndX9cPXx58cVA0XcPb3kv2v06/t0eACGt7PAb9ZS4Pjhfp7ENy7KAJVbzI2fM+xqcFw4mHVVSvVJ1inXobWlsgLrF3qTIqlo/zexuEb2ZjW+z1iungsYKJsEowWCyi462efUjGlZDd1SzS54MACZcY4Zm/5Hyu5WrhLhUmuo/ym70rzkU/ai4c8yNcKrb0Yjh/ySfYtGBbYnnpQmozJxFWiXYXKw6ui29YNcUSHF1FoZcoxrFs6GqkBNNuNLh/Hm/dGHOsIIUEo5s4Ci2tK5klzgZ5+RRSLatKds4VZ5fprcfewvnvM6rp5wV9iLDKtFK8I/CJDBfXwE16Oh4SJUZdYdQHGPfNMMLm2jKr58ns8eWBCZlUdhpEiwoVgD3k5qw0q90GYxBh2QCiFLF1feGNeMMfapPIosVgdOkVwXzTQ+FYpOjMVZjB7Ax+VVhiIaan7Fmx6nG+zOdnU4NHJ1ZWTIcqKpgIy2ZjxiJNJ2PkagHE7myz6Lzisl0Njc3V/RN/xpsfSudNWIMXKrasCjHDNMZn6eH4vTUIu2NVJsJyANqtsZ4uhG+rHeQ1zIEisiLhpwI5Zbsal9MC2sFRdq3rznmCCcQM+/QOi8uNGTZ4jWrzKhGWg3bvWRbabUsmvRBr4b5pdzEgq4im8emYBf6K3bKrWV6yM/TZlEgvgU2OsLOesAdcmOw3ftZ4YVN4/Tt2yiZZHyFAhPURFo59i0cCR2LLq6Uo4IByC4Gfai3CvszU2+L3lyurlvNHI4ET0QKW25DtVi4OeIieYppvqtFqPlmuLMo/OAKeJqytUwsw+5x/08fFpYFwctng1a3c1eyOz50PngnA58ExP7poTTiPaUzMC47c68bcNlpFy3AhQ0/niF17Rep6kEGPf1jjRU1HrH/XhWJLKkJ07z7M7F0/S3BxIYirqVghsOW7nGkXBcPmr1VeTvPhvMHMZYLzXxktx/7cy1MqPEtYsQ4ds80xeZOJ8dtuNM7/hJnDs1SeOSy6QyEzlb4CD/S58G/5t+me5wsMZGHi522YVHQJJhr+L0+yip/OxrZPRmeDjC/Aw/9hjHbpz2H8KmOPHZao7M9JRkbvlGY91wLE78ImQz4TSNArOLvBGN54NT9sfbzi4OdRILsyI4UdnBg7ZlsSOWlVw6glFpRvO+ehL0MaR7W6DLWGDBXagrfdItXXZsU7A3tbQsjtwMJ5Meb8YT/zTwuEo8/nTaPAhWxs+wy6V3l2wcEo5r9gkxkYMbtPAXXzqoCX4OcZxzZkgn0+XyLU4z7h880ITY79K1+aSp8vbO2rN9eUeoawxJMj9ZiZuowzawpuqCFX6cMJKh2fF6i++h37GH4FrZJF/eYK/Qfr/trRovpDpW/+wcqXDuy0lZb7DB4+WLrcNRBXp+bDkhSFBwpgC252Br6DVsm1aCl+apvuco6bJqapHGBvW3QRS1wNm4zJ6Z7viGdkMya0LtStpmu9svBaecLKGiGy6HT4Ga7BzVR0iBe8EZ9kmjbFaDGfzme4Sp/PzhV6+81pQljTBNduMupGLebN/9lcab3ylR9/JDAm08OuxsDYD/FgFzW7Hw+JnIpxs2j0zQ0dHtuYr4xKnxcdOzSZWhK+LfEDTFO4Tq+feLPKc9zQ8zjcsqylINnPFo2dDG2j4eU+OXEnnheYVN2P0oQld1G2hHUj4DuoHAi3Djk7sk1VOXr1zyvf7irfMHKQw/xg1Y+h5eV4kI3++hfzG/X8AE/GJUbrsb9Q2Qmsuk3s3CYNLeB/CO6bgpUSK4qxpZtplSSsTd0jd06leuVedSfbCwZtaFkqnrEu/RiWkQ7cPoMcpQrbLh9/MesEbk08tN1p+jEoAgMOcgyao7CL8uUOl8vtfkV3q1aKsLbuojwLiGGWOBteGMTFp8Kb5DX8zaC5TENjt3WQYzFu4uOGTl1GCs7/0FDnb/d6YMEyECg4a7Qz8C3QipxDtmvBmYpOiJc74/OCO++6lE9Y2Vt0docyKENYWDrxTUQ9wKzw8ifyFYoV3iYRjSOoXWvi1ULz1Eq67CBHbMulwGhqIYMcduCCsuC349frI/Vr+cR3Ntkhs5pkJCKhA9MsDT+VvbP0B8MIXfe12PZtBmL+PzBYOreuVZywEstDB6TTWSMc6Val+5aDh0Q6gX+q1/nn8uZotO+1Wvy+daTpNLRy5SDHDhXCYJ10AhutyTsrVL5SxW4d5LgKvbUzih3ksKsieE46eJ02TW+Or7JLZilyKkZYZndwtEiJeXhbnFUpI/QFDG+S9VudwIjMWZvB1bYOcsglRAf3xaZS39FtfwLhcqaE2mLPVEqHSpabHeTYuOo8jMXIQY6K76STfbkLfpNe77+iUi931wkrG8429fR5mFA8VwUjDHBDvuDjfGq1xT4foJ7bTmUHOXp7r4ND/ZRtJxX5ghsUM/3ZHao6gZ2CKRur3soOcuzlVBmlysWLpGJht10lrGjECHOWwexuD2wYgGZWgw9O4MnRN0o1rOr5tq2lY+Ii6OrYIIc9OHAT0SnmBXfa9UaVnMD21O0jKVj3N5aJzGKQ9Jc/OqvoN7mxicDLvS3xiFsaukJYsW59T5ayFoGovuJWxewop5qdwNlBDhmtgLHd7cDKLRnSCcy4Nh2REf7qVplulJMd5IhvuYRbGORgrN6NMu0qAza5p57XtTe2bnzTLpn55DhKWOKx0cHYpp5LMHd2mteM0A+wdSCv2UY4+bt+5z33M9HVtH/a4nKk6SjPKd9HYdy4f+f12vRKO4H7qFTSV7zEebxLPw3H+fir1CBHSbpvl4mzHoQ9WqCP0hc4OcLrCGFljdCpn4qlJvNBVDtuVzEP/8Cb5HG/zzelaXLsWa9VI7ujTAaDHCw7yKHcjjKl4ImXSAqtrZt0BiewB3cGMpcFJ4mMJRdbTyyl/ormeYv5eHuoJXG3E/rZTlhwFn4BfXBsxsAOcULhSssEYNjZi92OvvsclcO95HDy3J59OcWLOEonMOYKXRxsmXmbF/Ze3LRs1KdS6S1ykOM7RVTTU0lhk0f9mn9qU2v0OTsVL2rhakEFi8wT1UpWsv5oMQIzPpZrHmm+p19oQoSncZjDo9zeiQXdTwUlEgYW/o5jkZ99GIeroDyVS9SbSX+S8Qru5ONC1UHGhyMUdbfdRdnewop2NOGZrtIPZ28iHEd7qDVxj9dqmN2rL82k72qy13QfTF90C+F890332h6MWbdJRP++YFm3yScHq6N3r3Ez1JYoa5F8/7oTYfVHZODfm9DlWKA3hRbwSet6Bk7ijbOYHPp1i8klUOLT3tB4YC3R5VjFfBgtbDH/PnAKb5wV3WMC8d5NF+MtPx1/Dd7QulAtibAKRcq2dHgw7q4bVt8+/MgNb9kmtMKCxNo9G2KvvzcTHdyLQFyBCqtTXPGIbc+FuEIftddNKse2L65SjEW7jE/zjJx/Jb5abF510xNhuWcbzp7TuDZFb40/5l6h7pZUbCxzd7XbvrTsYIeMbd/ILg4ekXh/+6vV8yva1dTCM1yG8Zng/VrZT1j2O909jjKmLvxP07SzjNb2idVMVtJMcv88zC37PuO+SSCEp1Q1nRxx8vG6g+EPOauayUrijxDMXYhueiBcEFMwuLNRVZtUSi/yYW1F3utzesq9gfrMnbsGvhQ1nMBykEPjs52a01MuZk7n9/7cOftbWERYuOtAVg9yP2ZNHx1f7fRNqLr8rasTLsbqBOkErswSkdys6WDoOq8Pcthh70Rn037Z1QlMNNshzz0ZRFi2Yo3u3xrMlJ5RbevS7AApusz4TNYJ7PL6TzfXpdmBk5sysDXcNzIWRng9s/7TfsKqUR8WVv5zNksfOX5fIquBHzm5754RTnyV+VgYJPLKwKlsPCsHOXzaESjzJDcW0dqouWuiEBn3j0b9mL3h07sUk4GTrhWsUEE1RVjo/1owtNxFeaweTi6qpmFxp+4puQ+fXjfxADwkU51wAkMuRvy0s7ODHC3xR52qR7XIldu/GW2Jq+p9w8YDu5qLyFozPiy0Ejy7cFmVhy3rBLbEVZi7dSb8W+D90j+1PshROnLb51R7AbX9XcJaICxPhIYBGXxNZMQMNHlvVH3H53JD1OCmUz40jBw1/XAHaH4m17T5Ks+oz47wdumn41jJOPzbM2n2FxHWAKAMfApvcE/swIJAevtmOFuy3Ro/zh+p4/5pdq90Hxip0s8WGwQQrVyldmDJV/OtEUcQGZd9PpcGJPsA92kzsXvMmtw51Y7bdjpibErFRni3A4UIazs48v6Qe9z5/LNUDm8ce0IfyRLWFSCqcwbqXuEBQSxzzOzG7sgqh7HJhllOrW/H2/1C2CNPmGVvhDfOhn3JbJ6PenwXZPWx3ofsxuL8UsNomMe/sMHMe/9V+II6YZaJsIa6FZTfQEKIE31m5MGzUZF5WH4xcqgKwdGNEU1xZfBTu/9E5VjmA+3WjQccPKbuLsI57LMb+MajMwUH6QrWlDuf74iW4nv4m4P4W3eoHH9r627dN+A+q9BGFkRYA95DuHnkFl2XGq3H/kLlLbrQhToa3T8Z4mXfASsyyEmMCHlit+rcVmHQd4sXtuiKRgInYhG43EV5t0Hgz3fpGaw3naqH44/nS1Dp85XdKowIa0D74+E4GUO9dw14UYGTPR3GHlt4ZhGI6uvlq8O7fHVsWvDoxMryZTkjQTqB8cE7RN1PcplxUDqTQXhicVi5WsrpBXX19RcMb96wrlxZTuWPdgTPgpfhVqfkDyzXfsKqinlYQsP8KgU/omOHJjMSuLqXpV+1h6xkJUWLlRIvxCKBn8hpBgpWG0ud1CUrjHDuEI00/RK7jT9tB1llLYL9HHt7t6yOdQQukT49FW2iaTJYrvc/VUFYqplBtjBikabvmjyxxhJiDu4UWwOzQZ4PZfzYyoi1sc7A+TJuu2oYqKaPWDmh3uwItqcz2CZMsB8CQ7vv/eHwFc2L9b7/qlxCo1r9q0Ufu41WLbiUXA84Og8xO4Myrv3/w99OJQsqKKMYISxxo5la8WJ2p+CC8tReItjjq+a6N16xmLUALdSgwwjsjvV+f4BvrFvOV3O4rJoTT4Rlk8kT3WN2RKvqdmZl/onWzxdsEluQGJS3t7Ayf491NN2PbuK4gjLVQCI5xw3E0YUNKv6M1s9nXK0y9n3MZNiz6CberGrX3VU8bCqMCKtMILNdjUhwdrq3Zw1aVKfh72Pzd8osouDs6OZ8WVjWy9FIcKHoHGFr8P+ClVAgoSQIdJV/itj1z8N3OLlSKmW77kycQ113+yxAhFUGlvCJHI+uxkpLWNe50NUoSFMQZh0T1kzTSq2VI0NCzK0ZG0tfHlo0UyRBoKt8riSMgkBzPNG2rvsLCIHc6nhxVVxAzdzMdtoQTtW90f3rgE/kPnQ19rRTtl2yoNcYOYwdi1z/LPQ9yi65qsqRkyTN3hUvod5L8fIYoaKe6LrvwzIsAlL9s4w3pqKOqutEhFWEhUR3KITpBEsw8vciWjLhIrJWMukBcAJ3RzsCf5DzwSqpiBNlm8uD4/Hy+KvIZB4EWVVoRndxNYOeX+Xp9EpMr7hWbvNVXO7aTk2EVYD9ZbcKztuzzVR6Ld6SU0FWHpxGIL4h54OZkaZrquEhyb48OoOLRdp6Cfb4UgFmVCoJuqsNmF5xgdm7aQ1cC6fivqqY71MpYIZQhghrCIDikcCRslsF5+0tuKlGD5Fc6cvyIcGK6ou8/JDItZh4efwo+/KwrOlZn53SqA+uHGzySbgW7sAE4ydjHfq26BCD56rdq0RYeWzfsyy0Gx6MezJCPIQkB+RJ5snT2x6SzsBTMgCcVyoh12LGOh98Di+Pn3n95dEfc9jkc4xn/oHu7a/lfpH9r9PvDxEgwspzJ2zJpO/Hg4GFsdX7QetkopW2Hodf7s5ND4/cRdWayl2R8fL4U4aJZbDJfqrqWa5esAc2tWbfS7PNd5crq1rzE2HlsSxWw9UMNmitnNy7ecsqzF26XIZayQOJ66fllmNmR9N8nkm/AqKyYeG461UorcAauveKBahmHspiganB9MMxd2luLL5RLuL9diXrLx3QWE5zupnsWYNV7RdK31sl9aGy1UGACEsdW6iiyS4Ydv8dSOvxaMSY6LZSMp4WuqhPYznN/4GodnS7fCpPbQSIsNS2T8W0A2lN4iz9lFwfmXxktONb1/d0jtgVRPU7rBp4DJU+uGIVp4KVRsB2wtI07QeIh/Se0rUm5QpCYKsT+LTU5s1rop3BC8XaPW3vmokVOw0HUV2xRfSuQlewol3RgkChRIUisA4Ty2QocFs/thOW3hq/XR8+bCy0XAiFe23VloRVBgEhAsyy5sdef1fGejrBLiVinU2nxD6IrQZRXYZJlMo4++2qX03K4awHDZZ5xihjvBNRgG0nLGkkftj6eKgt2c64b1+Q1gM1abhqrLRge2CZzx+xzGd5ObGeZMww+MieEBb7LWDauRqhqsk6ZXerqtvbCCcu4xPf2eQEBo4QVk5RI2yuNdqSx3PNdwziXq/Knaej1xEQzTLWE2Zn3xJ/JIBF1oV9pC8MPrE7sjHDmPhiYbkolQcQkLtVHRUKJ050ems9RwkrB7TRanbo9RP34xqbjoDf0dx5OnoXAYzg+bAI/OzMZrYWgQOny91Z8tVGxjlHjK450hcGv9ip0jeWLy2d9w4C6Pqtx/N8jhFuPygYTjzshuauEJasCG9+KG20Jpf4hjFExOQ/xx2r5MYRboBeVWUIYYC8FpsbVr+MMM3H9a+bjG8u45wjRtfVmPxJkQn6A+TB39hvMg2yulGv849Fq+oWN/dmdD3qQPCIxPuw0dmJSOhnaZaWe/Qd4UGbkcr9EIDjfBwTmQfQ5evQOJ/Ohb8B9l0Cn9eR/ZLSTw8jALKKwL7Tgq2JVytRDdcJK1fJQDj6PL4fGe0MfAukJTey3DV3jY7eRQDdvTaEJn6RiZRsvbvWgvcuYt7QHD7oDzfyDcfvr6TGFb+hQq2Je4zAiL24xucCCEdGFioJcC2WDdLyo5tY8XurFrG3v848zrh2ob7zbhP0tsqSlaybEjcVn7Sux2hNXFE/rGEvMDmtVLf/riOJhEBRCKDrh+272R3++sZxoXD8Oj5hpRJzKpUgrBySw4/c8BYmm31b82lHYBzpudx5OhIChIB7CMCh/iTTfJ83wsnTA83v/9e9kocuSSnCyqmrt8QfNVrbJ2KZz1locUknPX0IAULAYQTQonoHf9/DapVJRov5tMPFlSReScKSNZFDpQDuF7pWN5Zr2g0AMlVSDSkTIUAIDIoAphhtwcjfNboIjEOr6jdoYcEFqeZHWcLKwcVbN8aM1vgM7tf2A2k9mDtPR0KAELABAc7vrWf+vfVw4mLe9l7SBomOilCesHK114+Orwb7fwnLfL6MN8Ca3Hk6EgKEQAkIcP6yj/HJmPh5QmNb7PUSJFQki2cIK4cOlvn8VR85fl/4t9rRcTRz5+lICBACQyMAn/AGvPB/bLQee2CwLbF86BxqpfAcYUn4+MRnUvBvLcQ+5GMxmnibD/skqQUraUMIKIeAXE7zUxbUxiKawk85/31GOQ0LUKgqFqHKjU7tXs+E8CcvI+rmhAIwpCSEgK0IoBX0BKb3HGqnUCeeETv1K1SWJ1tY/StnN1n1l0+/CQGvI1Atz0hVEJbXbybSnxAgBApDgAirMJwoFSFACCiAABGWAkYgFQgBQqAwBIiwCsOJUhEChIACCBBhKWAEUoEQIAQKQ8B2wsJ0gBujjxojCiueUhEChEA1IhDvCHwi1hlcbHfdbCcszF06n/dk1iKS6DlCnIi5nfQhBAiBWkFAbkYiNyXJcLZGWOKHdtfbdsKSCiK+9yhmiZtjnQ8+F+8KNNutNMkjBAgB9RCIdejHmh+sfgmhHhaDBAwnNHSEsLYpKsR+mYxYjo03/9DTHdp923n6QggQAlWDgNkVHIfNRx4QLPM39LDGO1kxZwlrm+biG72p1KuxzsA80bFD07bT9IUQIAQ8i4B4cqQe7Wi6XljWy4jjf5wbFXGJsGQ3kQ1Dn/aSGE+sjnU2neJG5copg/v4hVjT9a9yZFBeQqBYBLBA+VXhE5cXm8/N9HJdotkR/KFp9q5FubPwbOfdRNduvWxf/AzGLShaoVzgKbhvaigcW2F3peySJ1ZOqI+9/eZ0sO3FoNygXXJJDiHwcQT4RgT6vEKvO+SnctPhj19X44wZCR5qCetGaHPQ0BpxM9SWsNWXVTHCkpVFBFH459ntfh+bE2hJvjc0AJVJkehq2iFtsfkIHHsq2Ni1VmllakuluokAHsAM0/itaFldhr0MPnCz7GLK2tQ9cudUqncBHtiTC89XZYT1UcW5qWl8XnCnXW9UZTuhj3T76FtymXFQOpNZCqMd9tFZ+kYIlIoA7/LVsWnBoxMrS5XgdD7RvfswM7W+Hff8hShreHHlVS1hfQgD3jJrsaHqDLxpHigOGHdTR7sCJ2HaxgLardpd3KulNLhDXsN9PgtBKP+icp0w+fObGS4W4j7frTQ97Scspbo3YPGxVsa6HxPPHjS7g3uVBpLzuUItibuzu1VzLp2jtFu185BXSQnoSTBtdnYXZYXJKrE8dEA0Engow8TvSycrZ0xWUR/WYFXKbuvFtZt0v+9K3hyNDpa2ktc2LRv1qVR6y3WMi1Pgj7Mdz0rWjcq2BwHcFJbg7Haf4HMQR/1/9ki1XwoaCaNFSsyDZ/lM+GptWKVS5S2sviaQQ6WY3zHd7E2viXYEz5JDqX2vq/J9+OQP3kY42+8y7puEG/MpVfQiPRRBgPNH/FrdxFA4eYaqZCW6j/JjDfAUKyXWopfzI3vIyhn8bW8RFDqtoejqcPY83lBTYfRHis7rUgYYm5tdxveYyMwH4e7kUrFUjIoIcPYGhsFnh1oT96ioXk6naMQIc5a5AffuPrlz9h1rqIX1MdAEOxB96odjkcDdPZ0jdv3YdQVOYNBAYBuyX8sddOVOuujWblZALVLBTQQ4S8KpfqlRN2Yvlckq1q3viWfpL0ykO5whK2dA904Lq2/9Oevhgi/Qg6Hr+KR1PX0vqfRdrp/ckkpfD5/AN1XSi3SxHwE5pxBT9H7rZw0XNIXXv2N/CfZIFI+NDsY29VyMOYXToXC9PVLzSbG/heVNwvoIn7eYj7fLUbuPTqn3DcPDR2B4eClu6QPV0440KhcBtKyfZEKbZrSZ/yxXllP5pbsi3qmfKoQ1H0S1o1PlbC/XfsJS0pG9faUH/bULy4i74p2BEwZNVeGL0u9mtLYfrHHtTNzcyo4SVRgm7xXP2dtoWX0P86kmqUxWElhJVlhSc7t7ZOWMOb1OWFlUsIWt3xl47JMq94XTw/Ff6nr9WEhdiKZtr33SSZKrCEiXhMavMkRgvBFO/kb6Ll0tv5TCuHsLlEtRr9A8VUFYhVZWhXT8CxuwIDTZzup9E/B2vl8FnUiHwhEAOd3T4Kvb22hNXMrb3ksWnpNS2oEAEZYdKJYgw2g2X8Pb+SuYnodhZa7sWrISqlatWZ7VfNoRRjhxUuPk6BvVWknV60WEVWELhVqSnXr42APQxTgfxLWhwupQ8f0QQIvqPSynOcMItx+CNa6P9rtMP11GgAjLZcAHKo7z32fQxbhJDPftCdL6CbqKysZDGkj/ajyX9TFq7Hp9+LCxelv8NumDrMZ6eq1ORFgKWSx0eGwjlvlMwaTT/UFaHQqpVlOq4KXxF+H37xNqTc7mh62P11TlFa8sEZaCBgq2Jl6Ff+sY+EyOR5dkjYIqVqdKnL/s56wFL42vhSbHKDy2glYmwlLQKDmVZFwwfeT4fTXOZmJdWix3no72IoCXwgdoVZ1ntB57YCCcXGavdJJmJwJEWHai6YAsPvGZlB5OLvYNY5i/xX8O3wr5UmzCWfoKQVZLRaNvLFpVN0tfok2iSYxDCBBhOQSs3WKDRyTeR0D/s311dQehtfWQ3fJrTR6I/++8TtsP0xSmSd9hrdXfq/UlwvKY5QJHR18IhRPNPo1/E+ECX/eY+hVXF12/1Zz7jjPaksfqzfFVFVeIFCgKASKsPHAh9MalychoZWNawTH/R2OPT+6NCAFz0OJK5KkGnc4hwHmUa2y6Pmo8WlXm33KnVTvKCB/RzqDc8IE+AyBAhDUAKNlTgp2UYj1ropHgHLF2z4Z8ySp5no99bUuoLT6/btiwcfDH/Ap/6q9pcxkwdP0y8FPdotXxsUZrcon0CbqsQkHFyR3R8ZK8Uu6Qzi1xfEGZajAREdZgRhesiQnr6tjr776KDSS/PljSSl5rOmL9u5gGcRrTfJ9Hl+eJSuqiVNmcL/f52EHwU52D7t96pXTro4zcCV3uiI4QMJciUu2wPpfoaz8EiLD6ATLgT8H2QGiOP2EnkWWIbbXvgGkUOGm0mE9jtOtQtLROgTpvKaBSZVTg/N8I5XMCfH2TsUHvi5VRYuhSox3GwYil/riw2G/RNv7U0DkoBRFWMfeAEEdbTDyPpvtNsSf0kcVkdTMtWlu/M0YZe6G1dQUc88pGZLUfEx5nXLvQ2GPHfRDK51775dsjUe4kjr0PsNwn/bRgYpI9UmtDChFWkXaGk8iHpvt5LG6tBXGdJ8SJNmyHVKQSBSTnE9/ZhNbWXE1o5xeQvCqSwBA/CIXj10nfnooVEisn1JudwVnpTHb1wg/Q/YOLjT7FIECEVQxafdLizTgSxHVTrPPB5xORpsl9Lin1VWhcSSezEyCpXNdYp36c+fYbL1uWdT1jQnei/rUgkwirXCsLsW9asC74t/4U7TI+Xa44yl9dCMgdzOVO5sLKPIAXnIw2S58yECDCKgO87bIK8XWeSb9iRgJXi+4xge2u0Y+aQ0B0jjBincHFImW9CDfCMTUHgEMVJsKyEVjcmA2WEHPM1KbVsYj+PbxRyUdhI75eECV3KIef6kzTSq2VO5fDT1XnBb29oiMRlgOWwk26kxCZX+PGfSK2TP+cA0WQSAURMLuCh8c6r18BP9XP4eMco6CKnleJCMtBE6KF9QWWyTwZizTdnuge49JecA5WiEQPiIDciRzzqe6yMtYjmE/12QET0UlbECDCsgXG/ELk0DX+Tkv3Zpf5XCCHtvOnpiteQkA8sXNjrDNw+RbRuwotqpO8pLtXdSXCcs1yIohlPtea696AYz74FdeKpYIcQSDaFTgplti4SlhiLlpVjY4UQkI/hgAR1scgcfYE3sSfwTKfv6ALEYl3BfZxtjSSbjcCiUjoQNjuEbnjOIhqV7vlk7zBESDCGhwfx66CuFotS7yA2fJLo48aIxwriATbgkD8kcCYaEfg1oxIPQPbHW6LUBJSNAJEWEVDZl8G+Lb8cMxP4T0ZhLEJ/EjVZT721dh7ksSKg+sw8XN6ZjNbixnqZ2HqCj0zFTQjgV9B8HNFg7RGMyF+Fut6kAK35UBR5BjbuOpqkNRi2MdQRKWaVoMISyHzc8GUDBSoEESuq8IFp1Fd11HPXyARVn5s6AohQAgohgARlmIGIXUIAUIgPwJEWPmxoSuEACGgGAJEWIoZhNQhBAiB/AgQYeXHhq4QAoSAYggQYSlmEFKHECAE8iNAhJUfG7pCCBACiiFAhKWYQUgdQoAQyI8AEVZ+bOgKIUAIKIYAEZZiBiF1CAFCID8CRFj5saErhAAhoBgCRFiKGYTUIQQIgfwIEGHlx4auEAKEgGIIEGEpZhBShxAgBPIjQISVHxu6QggQAoohQISVzyCauAa7oP4332U6XzMIuL0Z7luc84U1g26RFSXCygOY0Zq8U29qHIeAuNfjju3Nk4xOVz8CCDjqwoezHhDVlcYoYy89HL/XhRI9WQQR1iBm44etj4dak7NZvW8CSOuBQZLSJUKgdAQ4/30Dr9/LCCcu5xPf2VS6oOrPSYRVgI2NZvM1oy15POP+NrwFXy0gCyUhBIZGgLPnfYwfGQonvtXYuvHNoTNQCiKsIu6BUDgW0esm7s81Np1xHi0iKyUlBLYhgJfeetw/PzJa2w8OtiUe2XaBvgyJABHWkBBtn4A3P5SGf2uJVsfHapzfiq6itX0K+kUIDIwA5ywNslqq1/nHolV1K+dz6d4ZGKq8Z4mw8kIz+AW9Ob5eDyd+5KurOwhvy4cHT01Xax0BkFUHXnD7w081jTdHqXVe4g1BhFUicLlsgaOjL+BteRTT+EmMszdy5+lICEgEOOOvaUz7ihFOHhNsTZD/s8zbggirTABz2UOtiXuMwIi90eS/HOdopCcHTM0eeVzj2gX6zrtN0Nvi99csDDZXnAjLRkD5pHU9aPJfWT+sYS8Q1102iiZRHkEAXT+Bvzv89Y3jMJ9qAZ+wkubw2Wg7IiwbwcyJGn7khrdAXCdrmnY4zj2bO0/H6kYA3b9/COb/HLp/pwea36dVEg6YmwjLAVBzIvXW+GNGuP0QdA3ORIvrf7nzdKwyBDh7G62q76FFdSimvqyostopVZ3qICzBzsIMqbFKIbtVGTl0jRv5lzqvG8e5thg3dkpFPUmnvAhg5srAH9hyM1pVVxsiMB6tqt/gpeTOMp6B1cl7Nr48MEEIcWreBB66UCWEJSYzkXk52tF0vXhypK4i/rx1Y8wIx2dyv7YfbvQHVdSRdBoQgYFJiPM/1Qv/PkZb4hLe9l5ywJwVPml2BUfFIoGfWCnxAgjr0AqrY0vx1UFYgAJ3VT0Os0yzd60ZCZ4hxFwl66YfHV+Nt/GXOPcdhzfyGlusSELcQ4Dzl7CcZjKmsnyjsS32unsFF16S6D7KH+sMnG9lxFoQ1Y/xbPgKz612SiUf6nIgg4E+YQnrF7HO65+JRwJHliPLybxG2PybPnL8vhpnszBbx3SyLJJdPgJ4uXyA7t95Ruuxn8VymuXlS3RGQqxTbzNTK14UlrgRr/ERzpRSOalVR1jboBTswIwQD0UjgXt6ukO7bzuv0Bc+8ZmUHk4uwutvLGYY3oZmIi3VUMg+UhXBuFxOcxMLaOPQ/bsZgRUyiqmYVQfdv3Gxjqb7hZX5O17ae6uoox06+e0QorQMIU7sTaWONyOBxcG6xvm8+f2EavrijS1HEM8Q3bsPY0w59VSDy1V9jLpRl/Dm/2x2tdAiChOdIwxTpC8TlnU+un51RWT1ZNLqbWH1MYcQbJglxBwztWk1RhO/hzdQ3pGfPtlc/6ryg+E6GIoUqKpNpI822hE8y7RS8FNZM3CPVz1ZyVuiJggrd+/DqDsJkfk1WltPogn9xdx5OhICXkIg3hk4Kha5HhOSrVsFE2O8pHu5utYUYeXAQtP5c2hCPx7rCPxmU/fInXPn6UgIqIxAT4exR7Qj8IeMJbqh5wEq6+qUbjVJWBJMtLYwy098p7d3C7qJgUvFEzs3OgUyySUEykFAdI8JmJGma3pZGtEexDfKkeX1vDVLWH0MNxw+rStjiY2rol2Bk/qcp6+EQEURkL5WsyN4qtm7aY0l2EXoGTRUVCEFCifCyhlBsF1ZRtyF1taj0Q7j4NxpOhIClUDAXBacZHYGnrKYdQeI6pOV0EHFMomw+lkFb7XDEMn2KSzzuS3RPWbHfpfpJyHgKAKbHh65C3yrv7XS1uNwW0x0tDAPCifCGsBoeKNJXH6Q7u1Zg2U+s8XaPWu+KT4ATHTKRgSkDxXLaS7v3bxlFXyrp9gouqpEEWENak4RxDKf68x//3clpkF8bdCkdJEQKBEBtKi+HYtvXI3lNHMhYniJYmoiGxFWAWbGG+8zVsa6F8t8liU6m/YrIAslIQSGRCAaMSaCrB7H/fU7JN5lyAyUoLYmjpZtbyGOzljsOdxkN5vdwdFlyyMBNYlA8pHRn4xFmm6XvlKQ1aSaBKHEStvewsJC0SuxkLenRH2Uzwb/lg832TmIMbQ21tk0Taw4WOklEfXM9xDib3UoD2yZCuK+u0/zD/tnmWIczS59odHO4IWpzZvXwKF+mpwL6GiBlRTOeUJj/Cq7VXAEsJ7OEbv2itT1GHH7lt0KqyYPIUdWw0c/3WgzlQ7Kh/k8x4NoF+NvT9UwLEcf4L9S+MS0UEuyqxw5TufFcpoTED1kIcI/7OF0WZWUj5cj3uns1/5hjRc1HbH+Xbt1cYSwckqancHDLMtait8H5c5V61FGEeV12gxssLpK1TqKlRPq42+/OQ0LwS/BjOmgqnoWphffiJt3rl4/8Wa5G3dhedxPlehq2j+d4UuAd7P7pbtbIl4e/2A+barRYj7tVMmOEpZUWq4qj3cu+gHe7FehxbWDUxVRQS5IK41Nnm7S6/1XqLy7r5xflkltmg/MTvVatwQ3LOJR8Z9zH79Ub4l/oILdB9Ih/khgjNjM5uGeP0O6EQZKU0Xn1nEfu1CfnLgTXXPZwnLs4zhh5TSXsdZjsS2XosApqJEMZ1y1HxhtPQLYXGa0HPtzVQO+SfDlKBUXmRvxMvFI5Are7Uf3L9CSfFHVm0f6NM0PVv0YmxNejre1oaqetugFXzXu9UX6CH0+n/iOK5sHu0ZYOYBi3fqerDdzA0jry7lzVXtE/G8/E9MD4eQyVeuIFgDHEpDvwB7XwvvwKUX1/A/iqLcj0OEfFNUvqxbCEx/HhLUYmI5TWU9bdMObuMHnb2+cHH3DFnkFCnGdsHJ64e0e5gzEJcQ+uXPVe+R/Zn7frNDk2L9UraPo2KEpzpNz0NqSweAQ+VSBD2dJLvi1ev3ohaoG0pMowaG+N/yCuJdZmwKoOasCZ8/5BJ+Gl8cjzhY0sPSKEZZUR+7uYfauOBdv97n4VXUB8/tCDqB70U1cYgxvvIoftj7e95pK32XMpS08g9EscUIl9YID9846f8Ps4ZM/eLuSegxWdvRRYwTvyczFvXsuyKqqw42j6/c//F0SbJl5m9xrczBcnLxWUcLKVUzun4aW1pXMEmeDvKraQQmjv4e/OTD8HZU0fA77fMd4R+DoDAgWxOXqzH4MXKzgGGnSJ8efyKdbpc9jmwCf2fngj6DHFbhvR1VaHyfLhz2w8a/2E12vu4J/YYPpZFmFyFaCsHKK4iHZd+tDMjl3roqPz2oaHkxsZ69qHbc9mIJdia7iSCf1/IjIzdvxHe8tNT/RrqYWjmkKwGOCmhrapxXI6q9oP0zHlnRr7ZNaniSlCCtXFbnQWGTEQtwUn8mdq9Yjuj5312t1sxtbN76pah1jT+gjWcK6Aq2tc+xuAWe7yozdaBgN81R4g+ezQXawKGUtQovqK/nSVMt5vDBeZRyToVtN5VZIKElY0vByGUPs9fem4SG5GL88PslxiFtZDg8zvlAfqV/r1vDwEBoNeDm+PDAhk2ZLYRNbWsAqvsH7Vzw7HSe+5RJusakg66qejoP5bRvRuL1Crzvkp6pOxlWWsHI3jpcnOebqUPCR84exBfpRBaevUELZArYssQjE9elSVAA5r8KM6OmYEf33UvK7mScaaXoO0z0OdLNMt8sCCXhiMq7ExfbFz3aDHWh+/79GOHk6BmE+hxtdWUesLfUW3mhJYob5n409dsR0FG0OwyLXguvOeQwPxwx91Pj9vUBWsl6YVhEouH5eTMj5cp/GPotdrc9VeeVADlrlW1g5RXNHREg4RVjsOvyuxu25ng21JT0VTz4ZGb1TmvVcC3t8N98yH9xk2EOB3+ZrZBcHj0i8n7OlF44IJbQWvtSqWjCexZ3zfyOawiw9HL/XC3bI6ah8CyunaO5otCbvNEYZ4+EYrOowNrn6qn5sCq9/By3g7zPh+yKI6an++qJV/KiP1x0cakuc5TWy6l+XqvidbRFrc2QL2WtkJfH3XAur701ThWFsPNfC6msPjKDxeET/vmDWfEySTTGNzw61JO7um8Zr36ulhYUBDjlVxLGwL27Z1dOElQOpisLYeJqwcvaQG3+yhoYMn7TO84EcQViveX16DVq5jod9ydne6aPnuoQDASInXxrh9kM0rp2JruL/BkpD59xDgDe/n6gGstqKmLKTWIe0KGdvI+zLd9H1O9TJGFVD6mFjgqogLImHXOYCw/xS1+vH4udCNB17bcSJRBECnkEA3b/NXONXGSONcUZL8rcqrxwoFtSqIaxcxeVsaYy0tTPu2xeGuz93no6EQE0ggLAv9b66vYzWxKUqT0Iu1RZVR1g5IOT6J4xefYVxfxveMK/kztOREKhKBGTYF8aPxMTjb7kdo8pNPKuWsHIghsKxiF438QA4HqfKpQe583QkBKoBAemzxSL6s4zW9omVilHlJo5VT1gSTLkuCjN5b9R8fCz69jfDv4WlCPQhBLyLANwdKSxQXqTzunEYdPqFyqGK7ES5JggrB5hceoC+/XmY4XsgvPTKhi3O6WvHsWdZaDcZTdQOWSrLEJ0jjE3LRjkR4lm5qT9Q6AGuafuGwvFZvHVjTGW72K1bTRFWDjw0nV9GX79F82lfR1dR2bDFOX3LOfZa1pExnlgd62r6jpzYWY4sFfPKXZmw5+IPTZFak7Z6JzqgozLTGtD9e5VrvmOMtuTxePmucaCuyousScLKWUUu4tU/veMENK0vRMdR2bDFOX1LPmJzCZFhvzEjwcdjXfohJctRLKOcMByLXP+0xaxfgow/oZh6Nqojw76wafDF7q9ijCobKzqkqJomLIkOH/vaFjStr/PXN47DTYGwxdklDEMC58UEmLH9RWZl/omQKf8nw/Z4sQ5S500Pj9wlFgnciU16H8XPg7xaj6H0lr5W9AB+Jn2vGPFeqmqMqqHqYef1miesHJi1EsYmG1FBsNPTvT1r0JVql7tB5zBQ/Sie2LkRRHVZ7+Ytq9CiOll1fcvSz2NhX8qqaxGZibD6gYVpECswongo19h3cGldv8tV9FME0ZVaYK57YyUC8im/R2Q0Ejgxltj4KojqChhheBUZYvuqyLAvXDsBPtbJgdbkS9tfpF9EWHnugVoJYyNjPVkZ6/5YpOnvcn+9PHBU7HRieegAkNVDiG56Dzrru1VMEacL9njYF6fhycknwsohMcBRLm0wwonLG3j9XhihuWeAJFVzSm4Cis1AX0R0ghtEdyhU6YqZ3cHRZiRwSyaVehZkdWSl9XGqfOkzxd+v6oYNGxdqi8+XPlWnyqoGuURYBVhR7mgD4joJ0yCOQPJnC8jiySRyM1C0uKaZqfTaaEfwLDllwO2KyM110dqbaqXEWhCo3KfSdR3cqnM27Ivm+zwc6qc1HbH+XbfK9XI5VXszOGEUTIN4tBbC2MBPNBpRjW/FlIFnsVekJGlXPtEIVoCmVrwI4pQbuFa8ledYpasw7ItjWPUTTITVD5ChftZYGJsDMkw8jJG5u2V016GwKfW63PMPrar7mEh3gCyV86OVWq/++dD12wzXwrxqDPvSv65O/SbCKhHZWgpjAxL51hbRuwrEdYVYsZNtI3TisdFBzAm7jvVmVqJVdXyJpvBGtlzYl3DismoM++KWEYiwykS6ZsLYCNYI4ros9kFsFRzz3y4HNsjhmHV/mpnsWYORv9nwU3lmLljR9ebs+VoI+1I0LiVmIMIqEbj+2baFsdH4lCoPY7MLHPO/Q2vr0eQyo+hZ5pjz9UWzM/BPS1i3g6g8O9u+v/37/+4T9uXgWgj70r/+Tv0mwrIR2WwYm9bET2ohjA1aSYel0+mnMUfqF3DMD7mOT0ZSiEWC/09Y1uPo/lXNesb+tw/8VDUZ9qU/Dk79JsJyANlaCWOTnXIgxBlY8LbGjDTNECsOrusPp+jefVg0EpzTm9m8Wggr72ar/fN58TfI6q+1GvbFLXsRYTmIdM2EsRHCwNbOi8wPVr8U69CPzUGKmfMnxFLvv8KEdTV8VVUbk2tb2Jdw8su1GvYlZ3Onj0RYTiMM+bUSxga+rfGCZf6GKQp/RVdxWcYSfwRR7eECxE4WMUgMMQr74iTwA8kmwhoIFQfO1VQYG8G+hImfRzsAYyVEoue7/YfCvmyPh5u/iLDcRBtl1UoYG5dhda84CvviHtYDlESENQAobpyqnTA2bqDpQhkU9sUFkIcugghraIwcTdE3jA2ct5scLYyEF42A4CKB9ddzjD123Ac7i99btADKYCsCflulkbCSENi6VONy8eTIRSUJoEyOIWDoDUfKZViMVW/If8fAc0AwtbAcALVUkR8+GKXmpnxOIEA2cQLV0mUSYZWOHeUkBAgBlxEgwnIZcCqOECAESkeACKt07CgnIUAIuIwAEZbLgFNxhAAhUDoCRFilY0c5CQFCwGUEiLBcBpyKIwQIgdIRIMIqHTvKSQgQAi4jQITlMuBUHCFACJSOABFW6dhRTkKAEHAZASIslwGn4ggBQqB0BIiwSsfOEzk1Zr3JOOvxhLJlKcnjltDeLksEZVYeASIs5U1UnoLB1sRD9Q0N47Et+t3lSVIzN+KoC/z9yl/fOE6G7FFTS9LKLgQGCf9qVxEkRxUEsMXW4ZZlLUXY4s+qolM5eiAcz5NM06YYLebT5cihvN5BgAjLO7ayRVMh5mqxyKIz0DC5CjHYx9gi1GUhaFG9w5jvQr019huQ1sdCGLusDhXnIgJEWC6CrVJRonOEYbL05djR5sfYJ/Bj23OppGtOF9ysW0BWi4MicDVvey+ZO0/H2kGACKt2bD1gTc3lwfEiZS1BM+WYARMoc5L/mfl8M0MtsX8roxIp4joCRFiuQ65mgbFO/Ti0thZjR+dxSmnI+ct+JqYFwsllSulFylQEARolrAjs6hVqtJp/1UeO31fTtHbGOEICV/aDUc0NXOPnG63HHkhkVVlbqFQ6tbBUsoYiuiS6mnZIZ9g1uDlOy25H76JeKDPDNH4ra9IuNSaZG1wsmoryAAJEWB4wUqVUjHYYB3OeWYpu4qGu6CD3/BNsarAt8bIr5VEhnkOACMtzJnNf4Vhn0ynCYteh5J0dKZ2z132cz8Ik1z85Ip+EVg0CRFhVY0pnKyJW7DTc3GhehC3oZ2EaxDBbSuMMUxO0a4w9dljEx762xRaZJKSqESDCqmrz2l+5nu7Q7lt60wsZE98oVbpcTgOi+q2fNVzQFF6PSaD0IQQKQ4AIqzCcKFU/BOKdgaMyFlsK4tq/36VBf4KsnmbcNwWjkk8OmpAuEgIDIECENQAodKowBIQ40RfrevAsLI6ZB8f8qMFy4Ub7L+faRcFW81e0nGYwpOjaYAgQYQ2GDl0rCIHoo8YI3pOZi9bWufBv+ftmwg3WKzhbYgxvvIoftp72e+8LDn0vGgEirKIhowz5EIh3BfaxMgzLfESrTIPu3/2szjfDaDZfy5eHzhMCxSZs1a8AAAAISURBVCDw/wECLJVpCeJX2AAAAABJRU5ErkJggg==\" id=\"b\" width=\"300\" height=\"300\"/></defs></svg>"
};

var bitkeep = {
  identityFlag: WalletIdentityFlag.BitKeep,
  label: WalletLabel.BitKeep,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 36 36\"><path fill=\"#7524F9\" d=\"M18 0c9.942 0 18 8.06 18 18 0 9.942-8.058 18-18 18-9.94 0-18-8.059-18-18C0 8.06 8.06 0 18 0Z\"/><path fill=\"#fff\" fill-rule=\"evenodd\" d=\"M28 13.182v1.104a.594.594 0 0 1-.084.305.617.617 0 0 1-.229.223l-3.663 2.055 3.273 1.83c.214.12.391.293.515.502.123.207.188.444.188.684v2.945c0 .24-.064.477-.188.685a1.388 1.388 0 0 1-.515.501l-8.607 4.8a1.437 1.437 0 0 1-1.406 0l-2.817-1.581a.308.308 0 0 1-.156-.263.298.298 0 0 1 .156-.263l9.297-5.204a.15.15 0 0 0 0-.263l-3.452-1.939a.64.64 0 0 0-.625 0l-9.443 5.29a.479.479 0 0 1-.468 0l-1.07-.595a1.388 1.388 0 0 1-.517-.502A1.338 1.338 0 0 1 8 22.81v-1.204a.446.446 0 0 1 .234-.396l13.54-7.566a.153.153 0 0 0 .077-.131.153.153 0 0 0-.078-.131l-3.457-1.946a.64.64 0 0 0-.625 0L8.47 16.594a.32.32 0 0 1-.427-.111A.298.298 0 0 1 8 16.33v-3.164c0-.24.065-.476.188-.684.123-.209.301-.382.515-.502l8.606-4.799a1.437 1.437 0 0 1 1.402 0l8.586 4.816c.214.12.391.293.514.5.124.208.189.444.189.684Z\" clip-rule=\"evenodd\"/></svg>"
};

var bitpie = {
  identityFlag: WalletIdentityFlag.Bitpie,
  label: WalletLabel.Bitpie,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 40 40\"><path fill=\"url(#a)\" fill-rule=\"evenodd\" d=\"M8.721.714h21.59a8.705 8.705 0 0 1 8.705 8.706v21.589a8.705 8.705 0 0 1-8.705 8.705H8.72A8.705 8.705 0 0 1 .016 31.01V9.419A8.705 8.705 0 0 1 8.721.715Z\" clip-rule=\"evenodd\"/><path fill=\"#fff\" d=\"M19.69 35.188c8.173 0 14.8-6.626 14.8-14.8 0-8.173-6.627-14.799-14.8-14.799-8.173 0-14.799 6.626-14.799 14.8 0 8.173 6.626 14.799 14.8 14.799Z\"/><path fill=\"url(#b)\" fill-rule=\"evenodd\" d=\"M19.516.714c10.77 0 19.5 8.73 19.5 19.5s-8.73 19.5-19.5 19.5-19.5-8.73-19.5-19.5 8.73-19.5 19.5-19.5ZM19.43 5.35c-8.21 0-14.866 6.655-14.866 14.865S11.22 35.08 19.43 35.08s14.865-6.656 14.865-14.866S27.64 5.35 19.43 5.35Z\" clip-rule=\"evenodd\"/><path fill=\"url(#c)\" fill-rule=\"evenodd\" d=\"M21.748 27.625a2.216 2.216 0 0 1-3.838 2.216l-.665-1.151-1.151.665a2.216 2.216 0 1 1-2.216-3.838l1.15-.665-1.772-3.07-1.151.664a2.216 2.216 0 1 1-2.216-3.838l1.151-.665-.664-1.151a2.216 2.216 0 1 1 3.838-2.216l.664 1.151 3.07-1.773-.664-1.15a2.216 2.216 0 1 1 3.838-2.217l.665 1.152 1.152-.665a2.216 2.216 0 0 1 2.215 3.838l-1.151.665 1.773 3.07 1.151-.664a2.216 2.216 0 0 1 2.216 3.837l-1.151.665.665 1.152a2.216 2.216 0 0 1-3.839 2.216l-.665-1.152-3.07 1.773.665 1.151Zm-2.88-4.99 3.07-1.772-1.773-3.07-3.07 1.772 1.772 3.07Z\" clip-rule=\"evenodd\"/><defs><linearGradient id=\"a\" x1=\"20.509\" x2=\"20.509\" y1=\"39.714\" y2=\".714\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#1E3DA0\"/><stop offset=\"1\" stop-color=\"#3750DE\"/></linearGradient><linearGradient id=\"b\" x1=\"19.516\" x2=\"19.516\" y1=\".714\" y2=\"39.714\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#1D3BA3\" stop-opacity=\"0\"/><stop offset=\"1\" stop-color=\"#173793\" stop-opacity=\".653\"/></linearGradient><linearGradient id=\"c\" x1=\"24.391\" x2=\"14.641\" y1=\"28.658\" y2=\"11.771\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#1E3DA0\"/><stop offset=\"1\" stop-color=\"#3750DE\"/></linearGradient></defs></svg>"
};

var bitski = {
  identityFlag: WalletIdentityFlag.Bitski,
  label: WalletLabel.Bitski,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 256 256\"><g clip-path=\"url(#a)\"><path fill=\"#FF245A\" d=\"M256 0H0v256h256V0Z\"/><g filter=\"url(#b)\"><path stroke=\"url(#c)\" stroke-width=\"25\" d=\"M243.5 12.5h-231v231h231v-231Z\"/></g><mask id=\"d\" width=\"150\" height=\"157\" x=\"53\" y=\"51\" maskUnits=\"userSpaceOnUse\" style=\"mask-type:alpha\"><path fill=\"#fff\" fill-rule=\"evenodd\" d=\"M83.014 64.943 54.687 93.27c-2.128 2.128-1.995 3.857.133 5.985l86.976 86.975c2.127 2.128 3.856 2.261 5.984.133l39.764-39.764c20.747-20.746 19.018-42.69 2.66-59.047-11.703-11.704-23.938-15.96-37.902-12.103-2.261.665-3.325.4-4.389-.665-.389-.389-.707-.85-1.111-1.434a47.629 47.629 0 0 0-.485-.693c-1.596-2.394-4.255-6.118-6.383-8.246-16.757-16.756-38.168-18.22-56.92.532Zm36.572 36.573-6.782 6.782c-2.128 2.128-3.857 1.995-5.985-.133l-6.383-6.383c-2.128-2.128-2.261-3.857-.133-5.985l6.782-6.782c3.458-3.458 8.379-3.857 12.368.132 4.123 4.123 3.591 8.91.133 12.369Zm43.488 21.411-17.821 17.821c-2.128 2.127-3.857 1.995-5.984-.133l-6.384-6.384c-2.128-2.128-2.261-3.857-.133-5.984l17.821-17.821c5.186-5.187 10.107-6.118 14.363-1.862 4.388 4.389 3.324 9.176-1.862 14.363Zm-100.74 15.892a7.837 7.837 0 0 0 0 11.083l55.413 55.412a7.837 7.837 0 0 0 11.082-11.082l-55.412-55.413a7.837 7.837 0 0 0-11.083 0Z\" clip-rule=\"evenodd\"/></mask><g filter=\"url(#e)\" mask=\"url(#d)\"><path fill=\"url(#f)\" d=\"M174.791 51.36H81.156c-15.464 0-28 12.535-28 28v101.754c0 15.464 12.536 28 28 28h93.635c15.464 0 28-12.536 28-28V79.359c0-15.464-12.536-28-28-28Z\"/><path fill=\"url(#g)\" fill-opacity=\".12\" d=\"M174.791 51.36H81.156c-15.464 0-28 12.535-28 28v101.754c0 15.464 12.536 28 28 28h93.635c15.464 0 28-12.536 28-28V79.359c0-15.464-12.536-28-28-28Z\"/><path fill=\"#fff\" fill-opacity=\".2\" d=\"M174.791 51.36H81.156c-15.464 0-28 12.535-28 28v101.754c0 15.464 12.536 28 28 28h93.635c15.464 0 28-12.536 28-28V79.359c0-15.464-12.536-28-28-28Z\" style=\"mix-blend-mode:overlay\"/></g></g><defs><linearGradient id=\"c\" x1=\"128\" x2=\"128\" y1=\"0\" y2=\"252.75\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#fff\" stop-opacity=\".5\"/><stop offset=\".633\" stop-color=\"#E00037\"/></linearGradient><linearGradient id=\"f\" x1=\"127.974\" x2=\"127.974\" y1=\"51.359\" y2=\"209.114\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#fff\"/><stop offset=\".544\" stop-color=\"#F9F7FA\"/><stop offset=\".77\" stop-color=\"#F7F7F7\"/><stop offset=\"1\" stop-color=\"#E6E6E6\"/></linearGradient><filter id=\"b\" width=\"456\" height=\"456\" x=\"-100\" y=\"-100\" color-interpolation-filters=\"sRGB\" filterUnits=\"userSpaceOnUse\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/><feBlend in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"/><feGaussianBlur result=\"effect1_foregroundBlur_901_2\" stdDeviation=\"50\"/></filter><filter id=\"e\" width=\"269.635\" height=\"277.756\" x=\"-6.844\" y=\"35.359\" color-interpolation-filters=\"sRGB\" filterUnits=\"userSpaceOnUse\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/><feColorMatrix in=\"SourceAlpha\" result=\"hardAlpha\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"/><feOffset dy=\"44\"/><feGaussianBlur stdDeviation=\"30\"/><feColorMatrix values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.28 0\"/><feBlend in2=\"BackgroundImageFix\" result=\"effect1_dropShadow_901_2\"/><feBlend in=\"SourceGraphic\" in2=\"effect1_dropShadow_901_2\" result=\"shape\"/></filter><radialGradient id=\"g\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(0 113.934 -108.07 0 127.974 95.18)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\".479\" stop-color=\"#fff\"/><stop offset=\"1\"/></radialGradient><clipPath id=\"a\"><rect width=\"256\" height=\"256\" fill=\"#fff\" rx=\"32\"/></clipPath></defs></svg>"
};

var blockwallet = {
  identityFlag: WalletIdentityFlag.BlockWallet,
  label: WalletLabel.BlockWallet,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 30 30\"><path fill=\"#000\" fill-rule=\"evenodd\" d=\"M15 30c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15Zm8.125-23.125H6.875v16.25h16.25V6.875Z\" clip-rule=\"evenodd\"/></svg>"
};

var brave = {
  identityFlag: WalletIdentityFlag.BraveWallet,
  label: WalletLabel.Brave,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 218 256\"><defs><linearGradient id=\"a\" x1=\"0%\" x2=\"100%\" y1=\"50.706%\" y2=\"50.706%\"><stop offset=\"0%\" stop-color=\"#F50\"/><stop offset=\"40.988%\" stop-color=\"#F50\"/><stop offset=\"58.198%\" stop-color=\"#FF2000\"/><stop offset=\"100%\" stop-color=\"#FF2000\"/></linearGradient><linearGradient id=\"c\" x1=\"2.148%\" x2=\"100%\" y1=\"50.706%\" y2=\"50.706%\"><stop offset=\"0%\" stop-color=\"#FF452A\"/><stop offset=\"100%\" stop-color=\"#FF2000\"/></linearGradient><path id=\"b\" d=\"M170.272 25.336 147.968 0H69.632L47.328 25.336s-19.584-5.447-28.832 3.813c0 0 26.112-2.36 35.088 12.255 0 0 24.208 4.63 27.472 4.63 3.264 0 10.336-2.724 16.864-4.902 6.528-2.179 10.88-2.195 10.88-2.195s4.352.016 10.88 2.195c6.528 2.178 13.6 4.902 16.864 4.902 3.264 0 27.472-4.63 27.472-4.63 8.976-14.615 35.088-12.255 35.088-12.255-9.248-9.26-28.832-3.813-28.832-3.813\"/></defs><g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(.114)\"><path fill=\"url(#a)\" d=\"m209.984 61.285 5.984-14.707s-7.616-8.17-16.864-17.43c-9.248-9.259-28.832-3.812-28.832-3.812L147.968 0H69.632L47.328 25.336s-19.584-5.447-28.832 3.813c-9.248 9.26-16.864 17.43-16.864 17.43l5.984 14.706L0 83.072s22.4 84.946 25.024 95.32c5.168 20.425 8.704 28.323 23.392 38.672 14.688 10.349 41.344 28.323 45.696 31.046 4.352 2.724 9.792 7.363 14.688 7.363 4.896 0 10.336-4.64 14.688-7.363 4.352-2.723 31.008-20.697 45.696-31.046 14.688-10.35 18.224-18.247 23.392-38.673C195.2 168.018 217.6 83.072 217.6 83.072l-7.616-21.787Z\"/><path fill=\"#FFF\" d=\"M164.016 41.404s28.688 34.723 28.688 42.145c0 7.421-3.608 9.38-7.237 13.238l-21.51 22.87c-2.036 2.164-6.273 5.445-3.78 11.35 2.492 5.905 6.168 13.419 2.08 21.04-4.089 7.62-11.093 12.708-15.58 11.867-4.489-.842-15.029-6.357-18.905-8.876-3.876-2.52-16.16-12.663-16.16-16.545 0-3.88 12.698-10.85 15.044-12.432 2.347-1.583 13.047-7.712 13.266-10.117.219-2.406.136-3.111-3.022-9.055-3.158-5.944-8.845-13.875-7.898-19.153.946-5.277 10.118-8.02 16.663-10.496 6.545-2.474 19.146-7.148 20.72-7.875 1.575-.727 1.168-1.42-3.601-1.872-4.768-.452-18.3-2.251-24.402-.548-6.1 1.702-16.524 4.293-17.368 5.667-.844 1.373-1.589 1.42-.722 6.158.867 4.739 5.33 27.477 5.764 31.516.433 4.039 1.28 6.709-3.068 7.705-4.35.995-11.672 2.724-14.188 2.724s-9.838-1.729-14.187-2.724c-4.35-.996-3.503-3.666-3.07-7.705.434-4.039 4.898-26.777 5.765-31.516.867-4.739.122-4.785-.722-6.158-.844-1.374-11.268-3.965-17.369-5.667-6.1-1.703-19.633.096-24.401.548-4.769.453-5.176 1.145-3.602 1.872 1.575.727 14.177 5.4 20.72 7.875 6.546 2.475 15.718 5.22 16.665 10.496.946 5.278-4.741 13.21-7.899 19.153-3.158 5.944-3.241 6.65-3.022 9.055.219 2.405 10.92 8.534 13.266 10.117 2.346 1.583 15.044 8.552 15.044 12.432 0 3.882-12.284 14.026-16.16 16.545-3.876 2.52-14.416 8.034-18.904 8.876-4.488.84-11.492-4.246-15.58-11.867-4.089-7.621-.412-15.135 2.08-21.04 2.491-5.905-1.745-9.186-3.78-11.35l-21.511-22.87c-3.629-3.858-7.237-5.817-7.237-13.238 0-7.422 28.688-42.145 28.688-42.145s24.208 4.63 27.472 4.63c3.264 0 10.336-2.724 16.864-4.902 6.528-2.179 10.88-2.195 10.88-2.195s4.352.016 10.88 2.195c6.528 2.178 13.6 4.902 16.864 4.902 3.264 0 27.472-4.63 27.472-4.63ZM142.51 174.228c1.775 1.113.692 3.212-.925 4.357-1.618 1.145-23.357 18-25.467 19.862-2.11 1.864-5.21 4.94-7.318 4.94-2.108 0-5.209-3.076-7.318-4.94-2.11-1.863-23.849-18.717-25.467-19.862-1.618-1.145-2.7-3.244-.925-4.357 1.777-1.113 7.333-3.922 15-7.894 7.665-3.972 17.219-7.349 18.71-7.349 1.491 0 11.045 3.377 18.711 7.349 7.666 3.972 13.222 6.781 14.999 7.894Z\"/><use xlink:href=\"#b\" fill=\"url(#c)\"/></g></svg>"
};

var coinbase = {
  identityFlag: WalletIdentityFlag.Coinbase,
  label: WalletLabel.Coinbase,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" baseProfile=\"tiny\" overflow=\"visible\" version=\"1.2\" viewBox=\"0 0 1024 1024\"><path fill=\"#0052FF\" d=\"M512 0c282.8 0 512 229.2 512 512s-229.2 512-512 512S0 794.8 0 512 229.2 0 512 0z\"/><path fill=\"#FFF\" d=\"M512.1 692c-99.4 0-180-80.5-180-180s80.6-180 180-180c89.1 0 163.1 65 177.3 150h181.3c-15.3-184.8-170-330-358.7-330-198.8 0-360 161.2-360 360s161.2 360 360 360c188.7 0 343.4-145.2 358.7-330H689.3c-14.3 85-88.1 150-177.2 150z\"/></svg>"
};

var core = {
  identityFlag: WalletIdentityFlag.Core,
  label: WalletLabel.Core,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 256 256\"><rect width=\"256\" height=\"256\" fill=\"#000\" rx=\"128\"/><path fill=\"#fff\" fill-rule=\"evenodd\" d=\"M87.648 203.403c-20.956 0-40.627-4.472-57.648-12.308l69.251-63.21c-9.565-7.847-15.667-19.759-15.667-33.097 0-13.58 6.326-25.683 16.193-33.521V52H126.372a42.62 42.62 0 0 1 27.977 10.413A42.62 42.62 0 0 1 182.325 52h.064l.001-.001.002.002h26.527v9.266c9.867 7.838 16.194 19.941 16.194 33.521 0 17.078-10.005 31.819-24.473 38.681-5.173 15.273-14.903 29.009-27.926 40.182v19.746h-32.737c-15.75 6.403-33.522 10.005-52.33 10.005Zm38.723-75.7a32.775 32.775 0 0 0 20.583-7.228l7.328 16.501 7.363-16.579a32.773 32.773 0 0 0 20.68 7.306c18.177 0 32.913-14.736 32.913-32.913 0-18.178-14.736-32.914-32.913-32.914-11.812 0-22.17 6.221-27.977 15.566-5.807-9.344-16.165-15.566-27.977-15.566-18.178 0-32.913 14.736-32.913 32.914 0 18.177 14.735 32.913 32.913 32.913Zm0-9.874c12.725 0 23.04-10.315 23.04-23.04 0-12.724-10.315-23.04-23.04-23.04-12.724 0-23.04 10.316-23.04 23.04 0 12.725 10.316 23.04 23.04 23.04Zm0-9.874c7.271 0 13.166-5.895 13.166-13.166 0-7.27-5.895-13.165-13.166-13.165-7.271 0-13.165 5.894-13.165 13.165 0 7.271 5.894 13.166 13.165 13.166Zm78.993-13.166c0 12.725-10.315 23.04-23.04 23.04-12.724 0-23.039-10.315-23.039-23.04 0-12.724 10.315-23.04 23.039-23.04 12.725 0 23.04 10.316 23.04 23.04Zm-9.874 0c0 7.271-5.894 13.166-13.166 13.166-7.271 0-13.165-5.895-13.165-13.166 0-7.27 5.894-13.165 13.165-13.165 7.272 0 13.166 5.894 13.166 13.165Z\" clip-rule=\"evenodd\"/></svg>"
};

var dcent = {
  identityFlag: WalletIdentityFlag.Dcent,
  label: WalletLabel.Dcent,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" x=\"0\" y=\"0\" version=\"1.1\" viewBox=\"0 0 62.27 71.11\"><style>.dcent-st0{fill:#b3b5b5}.dcent-st2{fill:#6d6e70}</style><path d=\"m32.04 13.43 5.3-3.06V3.06L32.04 0z\" class=\"dcent-st0\"/><path fill=\"#72bfbc\" d=\"M12.53 45.25V24.69l17.71-10.22V0L.9 16.94c-.56.32-.9.92-.9 1.56v33.88c0 .03.01.07.01.1l12.52-7.23z\"/><path d=\"M48.86 46.69 31.14 56.93 13.52 46.75.99 53.99l29.25 16.89a1.812 1.812 0 0 0 1.8 0l29.34-16.94c.01 0 .01-.01.02-.01l-12.54-7.24z\" class=\"dcent-st2\"/><path d=\"m61.38 16.94-11.63-6.71v7.3l-12.5 7.22 12.5 7.21v13.16l12.53 7.23V18.5a1.84 1.84 0 0 0-.9-1.56z\" class=\"dcent-st0\"/><path d=\"m24.93 31.85.01 14.33 12.16-7.02V24.83z\" class=\"dcent-st2\"/></svg>"
};

var defiwallet = {
  identityFlag: WalletIdentityFlag.DeFiWallet,
  label: WalletLabel.DeFiWallet,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 222 256\"><path fill=\"#fff\" d=\"M111 0 0 64v128l111 64 111-64V64L111 0Zm0 0L0 64v128l111 64 111-64V64L111 0Z\"/><path fill=\"#03316C\" d=\"M154.822 206h-15.794l-18.908-17.333v-8.889l19.575-18.667v-29.555l25.582-16.667 29.14 22L154.822 206Zm-65.4-46.667 2.893-27.777-9.566-24.889h56.502l-9.343 24.889 2.669 27.777H89.423Zm12.903 29.334-18.908 17.555H67.4l-39.818-69.333 29.363-21.778 25.803 16.445v29.555l19.576 18.667v8.889ZM67.178 55.333H154.6l10.455 44.445H56.946l10.232-44.445ZM111 0 0 64v128l111 64 111-64V64L111 0Z\"/></svg>"
};

var enkrypt = {
  identityFlag: WalletIdentityFlag.Enkrypt,
  label: WalletLabel.Enkrypt,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" x=\"0\" y=\"0\" version=\"1.1\" viewBox=\"0 0 43 43\"><path d=\"M11.1 2.3c-.9.2-2.2.6-3 1-1.9 1-3.6 2.9-4.4 4.9-.6 1.5-.6.8-.6 12.9 0 11.8 0 11.9.4 13.3.8 2.3 2.6 4.4 4.7 5.4 1.2.6 2.3.9 3.5 1 1.3.1 24.3.1 25.1 0 1.2-.2 2.1-.8 2.6-1.9l.3-.6v-2.1c0-1.8 0-2.2-.2-2.6-.6-1.9-1.9-3.1-3.7-3.6-.4-.1-1.5-.1-7.9-.2h-7.5l-.8-.2c-3.1-1-5.4-3.4-6-6.4-.2-1-.1-2.8.1-3.7.2-.8.8-1.9 1.2-2.5.9-1.2 2.5-2.5 3.8-3 1.4-.5 1.4-.5 8.8-.5 3.7 0 7 0 7.4-.1 2.1-.3 3.7-1.6 4.4-3.6.2-.5.2-.8.2-2.4 0-1.2 0-2-.1-2.3-.3-1.4-1.3-2.4-2.7-2.7-.3-.1-4-.1-12.9-.1-9.7-.2-12.1-.1-12.7 0z\" fill=\"#7e44f2\"/><path d=\"M20.8 16c-1.7.4-3.2 1.8-3.7 3.5-.4 1.1-.4 2.8 0 3.9.5 1.5 1.8 2.8 3.4 3.3l.6.2h7c7 0 7 0 7.7-.2 1.8-.6 3.3-2.1 3.7-3.9.2-1 .2-2.5-.1-3.4-.6-1.7-2.1-3-3.8-3.5-.9-.1-14.1-.1-14.8.1z\" fill=\"#7e44f2\"/></svg>"
};

var exodus = {
  identityFlag: WalletIdentityFlag.Exodus,
  label: WalletLabel.Exodus,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 227 230\"><path fill=\"url(#a)\" d=\"M226.623 64.22 128.678 0v35.905l62.832 40.83-7.392 23.39h-55.44v29.75h55.44l7.392 23.39-62.832 40.83V230l97.945-64.014-16.016-50.883 16.016-50.884Z\"/><path fill=\"url(#b)\" d=\"M43.464 129.875h55.235v-29.75H43.26l-7.187-23.39 62.627-40.83V0L.754 64.22l16.016 50.883L.755 165.986 98.904 230v-35.905l-62.832-40.83 7.392-23.39Z\"/><mask id=\"e\" width=\"227\" height=\"230\" x=\"0\" y=\"0\" maskUnits=\"userSpaceOnUse\" style=\"mask-type:alpha\"><path fill=\"url(#c)\" d=\"M226.623 64.22 128.678 0v35.905l62.833 40.83-7.392 23.39h-55.441v29.75h55.441l7.392 23.39-62.833 40.83V230l97.945-64.014-16.016-50.883 16.016-50.884Z\"/><path fill=\"url(#d)\" d=\"M43.464 129.875H98.7v-29.75H43.26l-7.187-23.39L98.7 35.905V0L.755 64.22l16.016 50.883L.755 165.986 98.905 230v-35.905l-62.833-40.83 7.392-23.39Z\"/></mask><g mask=\"url(#e)\"><path fill=\"url(#f)\" d=\"M.875 0h224.25v230H.875z\"/></g><defs><linearGradient id=\"a\" x1=\"194.938\" x2=\"129.33\" y1=\"245.813\" y2=\"-25.259\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#0B46F9\"/><stop offset=\"1\" stop-color=\"#BBFBE0\"/></linearGradient><linearGradient id=\"b\" x1=\"194.938\" x2=\"129.33\" y1=\"245.813\" y2=\"-25.259\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#0B46F9\"/><stop offset=\"1\" stop-color=\"#BBFBE0\"/></linearGradient><linearGradient id=\"c\" x1=\"194.938\" x2=\"129.33\" y1=\"245.813\" y2=\"-25.259\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#0B46F9\"/><stop offset=\"1\" stop-color=\"#BBFBE0\"/></linearGradient><linearGradient id=\"d\" x1=\"194.938\" x2=\"129.33\" y1=\"245.813\" y2=\"-25.259\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#0B46F9\"/><stop offset=\"1\" stop-color=\"#BBFBE0\"/></linearGradient><linearGradient id=\"f\" x1=\"15.251\" x2=\"128.813\" y1=\"51.75\" y2=\"136.562\" gradientUnits=\"userSpaceOnUse\"><stop offset=\".12\" stop-color=\"#8952FF\" stop-opacity=\".87\"/><stop offset=\"1\" stop-color=\"#DABDFF\" stop-opacity=\"0\"/></linearGradient></defs></svg>"
};

var frame = {
  identityFlag: WalletIdentityFlag.Frame,
  label: WalletLabel.Frame,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 153.42 152.94\"><path d=\"M145.15 75.59v-58a9.29 9.29 0 0 0-9.3-9.28h-58.2a2.24 2.24 0 0 1-1.56-.64l-7-7A2.24 2.24 0 0 0 67.48 0H9.31A9.29 9.29 0 0 0 0 9.27v58a2.16 2.16 0 0 0 .65 1.55l7 7a2.16 2.16 0 0 1 .65 1.55v58a9.29 9.29 0 0 0 9.3 9.28h58.2a2.24 2.24 0 0 1 1.56.64l7 7a2.24 2.24 0 0 0 1.56.64h58.19a9.29 9.29 0 0 0 9.31-9.27v-58a2.16 2.16 0 0 0-.65-1.55l-7-7a2.17 2.17 0 0 1-.62-1.52Zm-32.3 38.55h-72.2a1.68 1.68 0 0 1-1.65-1.67V40.53a1.68 1.68 0 0 1 1.67-1.67h72.18a1.68 1.68 0 0 1 1.67 1.67v71.94a1.68 1.68 0 0 1-1.67 1.67Z\"/></svg>"
};

var frontier = {
  identityFlag: WalletIdentityFlag.Frontier,
  label: WalletLabel.Frontier,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 540 540\"><rect width=\"540\" height=\"540\" fill=\"#CC703C\" rx=\"150\"/><path fill=\"#fff\" fill-rule=\"evenodd\" d=\"m415 89-2.195 5.293-7.225 16.935-4.796 10.92c-36.417 81.85-64.748 120.696-94.861 120.696-17.355 0-27.625-4.544-40.923-15.21l-3.838-3.166c-9.567-8.017-13.596-9.988-22.799-9.988-4.797 0-13.38 5.58-24.241 18.604-11.263 13.505-23.614 33.457-36.888 59.737l-1.236 2.459 129.193.006-16.086 30.298H168.462V450H133V89h282Zm-50.269 30.309-196.271-.011v120.311c23.516-37.029 45.862-55.62 69.903-55.62 18.691 0 29.704 4.777 43.599 15.896l3.964 3.267c8.932 7.484 12.374 9.201 19.997 9.201 8.429 0 30.751-32.161 58.808-93.044Z\" clip-rule=\"evenodd\"/></svg>"
};

var gamestop = {
  identityFlag: WalletIdentityFlag.GameStop,
  label: WalletLabel.GameStop,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"12\" fill=\"#000\"/><path fill=\"#fff\" fill-rule=\"evenodd\" d=\"M7.529 9.75v6.215a.88.88 0 0 0 .896.892h7.337a.88.88 0 0 0 .897-.892v-5.213h.966v5.213a1.84 1.84 0 0 1-1.863 1.848H8.425a1.84 1.84 0 0 1-1.863-1.848V9.75h.967Z\" clip-rule=\"evenodd\"/><path fill=\"#fff\" fill-rule=\"evenodd\" d=\"M6.563 8.223c0-1.031.82-1.848 1.862-1.848h7.484v2.272h.223c.84 0 1.493.65 1.493 1.48v.768c0 .83-.652 1.48-1.493 1.48H8.425a1.84 1.84 0 0 1-1.863-1.848V8.223Zm8.38.424V7.33H8.425a.88.88 0 0 0-.896.892v2.304a.88.88 0 0 0 .896.892h3.186V8.647h3.332Zm-2.366 2.772h3.555a.508.508 0 0 0 .527-.524v-.768a.508.508 0 0 0-.527-.525h-3.555v1.817Z\" clip-rule=\"evenodd\"/></svg>"
};

var huobiwallet = {
  identityFlag: WalletIdentityFlag.HuobiWallet,
  label: WalletLabel.HuobiWallet,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1024 1024\"><path fill=\"#2d65f8\" fill-rule=\"evenodd\" d=\"M292.28 0H552q190.79 27 306.24 122.88T1024 392v339.72c0 101.63-10.58 138.48-30.45 175.64a207.13 207.13 0 0 1-86.19 86.19c-37.16 19.87-74 30.45-175.64 30.45H292.28c-101.63 0-138.48-10.58-175.64-30.45a207.13 207.13 0 0 1-86.19-86.19C10.58 870.2 0 833.35 0 731.72V292.28C0 190.65 10.58 153.8 30.45 116.64a207.13 207.13 0 0 1 86.19-86.19C153.8 10.58 190.65 0 292.28 0Z\"/><path fill=\"#173fff\" fill-rule=\"evenodd\" d=\"M993.55 116.64a207.13 207.13 0 0 0-86.19-86.19C870.21 10.58 833.35 0 731.72 0H552q190.79 27 306.24 122.88T1024 392v-99.72c0-101.63-10.58-138.48-30.45-175.64Z\"/><path fill=\"#fcfcff\" d=\"M591.8 382.71c0-97.43-48-181.13-84.48-208.41 0 0-2.78-1.53-2.59 2.3-3 188-100.19 239-153.65 307.63-123.27 158.45-8.6 332.23 108.14 364.18 65.35 18-15.06-31.95-25.4-136.86C421.21 584.73 591.8 487.81 591.8 382.71Z\"/><path fill=\"#fff\" d=\"M643.64 445.69c-.78-.51-1.81-.9-2.53.32-2.07 23.74-26.56 74.42-57.67 121C478.07 725 538.08 801.1 571.91 842.18c19.44 23.74 0 0 49-24.25 60.52-36.26 99.8-98.95 105.62-168.62a242.5 242.5 0 0 0-82.89-203.62Z\"/></svg>"
};

var hyperpay = {
  identityFlag: WalletIdentityFlag.HyperPay,
  label: WalletLabel.HyperPay,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 189 188\"><path fill=\"#1A72FE\" d=\"M94.5.25C42.75.25.75 42.25.75 94s42 93.5 93.75 93.5 93.75-42 93.75-93.75S146.25.25 94.5.25Zm24.75 114c-6.25 0-21.75.25-21.75.25l-7 27h-29l6.75-26.5H23l7.25-21.75s78.75.25 85.25 0S132 91.5 132.25 78.5c.25-17.75-27-16.75-29.25-1-1.5 10-1.5 12.5-1.5 12.5H75.75l5-23.5H39l6.25-22s61.25.25 72.75.25 42.25 3 42.25 31.25c0 31-29.75 38.25-41 38.25Z\"/></svg>"
};

var imtoken = {
  identityFlag: WalletIdentityFlag.ImToken,
  label: WalletLabel.ImToken,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 93 93\"><defs><linearGradient id=\"a\" x1=\"97.185%\" x2=\"-.038%\" y1=\"3.105%\" y2=\"99.699%\"><stop offset=\"0%\" stop-color=\"#11C4D1\"/><stop offset=\"100%\" stop-color=\"#0062AD\"/></linearGradient></defs><g fill=\"none\"><path fill=\"url(#a)\" d=\"M92.755 63.804s0 9.64-1.028 13.78c-1.028 4.187-2.985 7.06-5.09 9.202-2.154 2.142-4.993 4.09-9.3 5.112-4.356 1.023-13.754.974-13.754.974H29.417s-9.642 0-13.803-1.022c-4.16-1.071-7.097-2.97-9.25-5.113-2.155-2.142-4.112-4.966-5.091-9.3-1.028-4.333-.98-13.682-.98-13.682V29.671s0-9.64 1.029-13.78c1.027-4.187 2.985-7.06 5.09-9.202 2.154-2.142 4.993-4.09 9.3-5.113C20.068.554 29.466.603 29.466.603h34.166s9.642 0 13.803 1.022c4.16 1.071 7.097 2.97 9.25 5.113 2.154 2.142 4.112 4.966 5.091 9.3.98 4.333.98 13.682.98 13.682v34.084z\"/><path fill=\"#FFF\" d=\"M78.267 28.795c1.909 26.244-15.614 38.71-31.326 40.073-14.587 1.265-28.292-7.304-29.467-20.597-.979-10.955 6.07-15.678 11.6-16.117 5.679-.486 10.427 3.263 10.867 7.84.392 4.382-2.447 6.427-4.454 6.573-1.566.146-3.524-.78-3.72-2.727-.147-1.704.538-1.899.342-3.7-.293-3.214-3.181-3.555-4.747-3.409-1.91.146-5.385 2.338-4.944 7.694.49 5.404 5.874 9.69 12.922 9.056 7.636-.682 12.971-6.378 13.363-14.412 0-.439.098-.828.293-1.218.098-.146.147-.292.294-.438.196-.292.392-.536.636-.779l.686-.682c3.328-3.019 15.37-10.225 26.676-7.985.098 0 .196.049.245.097.44 0 .685.341.734.73\"/></g></svg>"
};

var liquality = {
  identityFlag: WalletIdentityFlag.Liquality,
  label: WalletLabel.Liquality,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 36 12\"><path fill=\"url(#a)\" d=\"m1.888 1.702-.03.028A5.924 5.924 0 0 0 .08 5.046c-.052.308-.078.62-.079.93v.036c0 .3.025.598.072.894.148.923.522 1.82 1.122 2.612.198.261.42.511.668.747l.026.025a6.211 6.211 0 0 0 1.772 1.173c2.342 1.026 5.194.55 7.327-1.16a.496.496 0 0 1 .017-.013c2.408-1.941 4.618-3.7 6.996-3.7s4.588 1.759 6.996 3.7a7.842 7.842 0 0 0 2.13 1.224 7.24 7.24 0 0 0 3.05.47 6.28 6.28 0 0 0 3.936-1.694l.026-.025c.248-.236.47-.486.669-.747a5.84 5.84 0 0 0 1.12-2.612 5.754 5.754 0 0 0-.006-1.86 5.926 5.926 0 0 0-1.78-3.316l-.03-.028C32.996.65 31.61.106 30.177.014a7.323 7.323 0 0 0-3.053.474 7.93 7.93 0 0 0-2.127 1.214c-2.417 1.93-4.606 3.7-6.996 3.7-2.39 0-4.579-1.77-6.996-3.7l-.013-.01C9.606.592 7.917 0 6.261 0a6.51 6.51 0 0 0-2.603.531 6.168 6.168 0 0 0-1.77 1.171z\"/><defs><radialGradient id=\"a\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(41.2215 0 0 21.0874 -.869 3.328)\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#1CE5C3\"/><stop offset=\".103\" stop-color=\"#1CE5C3\"/><stop offset=\".475\" stop-color=\"#5440D7\"/><stop offset=\".631\" stop-color=\"#8B2CE4\"/><stop offset=\".796\" stop-color=\"#D421EB\"/><stop offset=\"1\" stop-color=\"#AC39FD\"/></radialGradient></defs></svg>"
};

var mathwallet = {
  identityFlag: WalletIdentityFlag.MathWallet,
  label: WalletLabel.MathWallet,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 130 130\"><mask id=\"a\" width=\"130\" height=\"130\" x=\"0\" y=\"0\" maskUnits=\"userSpaceOnUse\" style=\"mask-type:alpha\"><path fill=\"#C4C4C4\" d=\"M0 50.771c0-17.959 0-26.938 3.55-33.773A31.534 31.534 0 0 1 16.998 3.55C23.833 0 32.812 0 50.771 0H79.23c17.959 0 26.938 0 33.773 3.55a31.54 31.54 0 0 1 13.448 13.448C130 23.833 130 32.812 130 50.771V79.23c0 17.959 0 26.938-3.55 33.773a31.544 31.544 0 0 1-13.448 13.448C106.167 130 97.188 130 79.229 130H50.77c-17.959 0-26.938 0-33.773-3.55A31.54 31.54 0 0 1 3.55 113.002C0 106.167 0 97.188 0 79.229V50.77Z\"/></mask><g mask=\"url(#a)\"><path fill=\"#F18D8D\" d=\"M0 0h130v130H0z\"/><mask id=\"b\" width=\"130\" height=\"130\" x=\"0\" y=\"0\" maskUnits=\"userSpaceOnUse\" style=\"mask-type:alpha\"><path fill=\"#2C363F\" d=\"M0 0h130v130H0z\"/></mask><g mask=\"url(#b)\"><g filter=\"url(#c)\"><path fill=\"url(#d)\" d=\"M0 0h130v130H0z\"/></g><path fill=\"#fff\" d=\"M6.049 6.049h119.016v119.016H6.049z\" opacity=\".01\"/><path fill=\"#fff\" fill-rule=\"evenodd\" d=\"M90.52 59.756a5.421 5.421 0 1 1 7.668-7.667 5.421 5.421 0 0 1-7.668 7.667Zm-18.21 18.21a4.066 4.066 0 1 1 5.751-5.75 4.066 4.066 0 0 1-5.75 5.75Zm28.753-9.584a4.066 4.066 0 1 1 5.75-5.75 4.066 4.066 0 0 1-5.75 5.75Zm-9.584 9.584a4.066 4.066 0 1 1 5.75-5.75 4.066 4.066 0 0 1-5.75 5.75Zm20.126-.959a2.712 2.712 0 0 1 3.834-3.834 2.712 2.712 0 0 1-3.834 3.834Zm-9.584 9.584a2.712 2.712 0 1 1 3.837-3.834 2.712 2.712 0 0 1-3.837 3.834ZM80.937 69.34a5.421 5.421 0 1 1 7.667-7.667 5.421 5.421 0 0 1-7.667 7.667Zm0-19.168a5.422 5.422 0 1 1 7.667-7.667 5.422 5.422 0 0 1-7.667 7.667Zm-9.584 9.584a5.421 5.421 0 1 1 7.667-7.667 5.421 5.421 0 0 1-7.667 7.667Zm-19.257 0a5.421 5.421 0 1 1 7.667-7.667 5.421 5.421 0 0 1-7.667 7.667Zm-18.21 18.21a4.066 4.066 0 1 1 5.75-5.75 4.066 4.066 0 0 1-5.75 5.75Zm28.752-9.584a4.066 4.066 0 1 1 5.75-5.75 4.066 4.066 0 0 1-5.75 5.75Zm-9.584 9.584a4.066 4.066 0 1 1 5.75-5.75 4.066 4.066 0 0 1-5.75 5.75Zm-37.377-.959a2.71 2.71 0 1 1 3.833-3.833 2.71 2.71 0 0 1-3.833 3.833Zm9.584 9.584a2.71 2.71 0 1 1 3.833-3.834 2.71 2.71 0 0 1-3.833 3.834Zm38.336 0a2.71 2.71 0 1 1 3.833-3.834 2.71 2.71 0 0 1-3.833 3.834Zm-39.295-18.21a4.066 4.066 0 1 1 5.75-5.75 4.066 4.066 0 0 1-5.75 5.75Zm18.21.959a5.421 5.421 0 1 1 7.667-7.667 5.421 5.421 0 0 1-7.667 7.667Zm0-19.168a5.422 5.422 0 1 1 7.667-7.667 5.422 5.422 0 0 1-7.667 7.667Zm-9.584 9.584a5.421 5.421 0 1 1 7.667-7.667 5.421 5.421 0 0 1-7.667 7.667Z\" clip-rule=\"evenodd\"/></g></g><defs><radialGradient id=\"d\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(59.19662 59.99107 -66.45326 65.57323 27.254 22.28)\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#3C4143\"/><stop offset=\"1\" stop-color=\"#1D2022\"/></radialGradient><filter id=\"c\" width=\"130\" height=\"134.891\" x=\"0\" y=\"0\" color-interpolation-filters=\"sRGB\" filterUnits=\"userSpaceOnUse\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/><feBlend in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"/><feColorMatrix in=\"SourceAlpha\" result=\"hardAlpha\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"/><feOffset dy=\".515\"/><feGaussianBlur stdDeviation=\"7.207\"/><feComposite in2=\"hardAlpha\" k2=\"-1\" k3=\"1\" operator=\"arithmetic\"/><feColorMatrix values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.54 0\"/><feBlend in2=\"shape\" result=\"effect1_innerShadow_10_486\"/><feColorMatrix in=\"SourceAlpha\" result=\"hardAlpha\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"/><feOffset dy=\"4.891\"/><feGaussianBlur stdDeviation=\"4.633\"/><feComposite in2=\"hardAlpha\" k2=\"-1\" k3=\"1\" operator=\"arithmetic\"/><feColorMatrix values=\"0 0 0 0 0.366667 0 0 0 0 0.391667 0 0 0 0 0.4 0 0 0 0.54 0\"/><feBlend in2=\"effect1_innerShadow_10_486\" result=\"effect2_innerShadow_10_486\"/><feColorMatrix in=\"SourceAlpha\" result=\"hardAlpha\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"/><feOffset dy=\".772\"/><feGaussianBlur stdDeviation=\"1.416\"/><feComposite in2=\"hardAlpha\" k2=\"-1\" k3=\"1\" operator=\"arithmetic\"/><feColorMatrix values=\"0 0 0 0 0.187292 0 0 0 0 0.240573 0 0 0 0 0.258333 0 0 0 0.54 0\"/><feBlend in2=\"effect2_innerShadow_10_486\" result=\"effect3_innerShadow_10_486\"/></filter></defs></svg>"
};

var meetone = {
  identityFlag: WalletIdentityFlag.MeetOne,
  label: WalletLabel.MeetOne,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" fill=\"none\" viewBox=\"0 0 151 102\"><path fill=\"url(#a)\" d=\"M.997 0h150v102h-150z\"/><defs><pattern id=\"a\" width=\"1\" height=\"1\" patternContentUnits=\"objectBoundingBox\"><use xlink:href=\"#b\" transform=\"scale(.00667 .0098)\"/></pattern><image xlink:href=\"data:image/png;base64,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\" id=\"b\" width=\"150\" height=\"102\"/></defs></svg>"
};

var metamask = {
  identityFlag: WalletIdentityFlag.MetaMask,
  label: WalletLabel.MetaMask,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" x=\"0\" y=\"0\" version=\"1.1\" viewBox=\"0 0 318.6 318.6\"><style>.st13123123,.st6123123123{fill:#e4761b;stroke:#e4761b;stroke-linecap:round;stroke-linejoin:round}.st6123123123{fill:#f6851b;stroke:#f6851b}</style><path fill=\"#e2761b\" stroke=\"#e2761b\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m274.1 35.5-99.5 73.9L193 65.8z\"/><path d=\"m44.4 35.5 98.7 74.6-17.5-44.3zm193.9 171.3-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4.9L50.1 263l56.7-15.6-26.5-40.6z\" class=\"st13123123\"/><path d=\"m103.6 138.2-15.8 23.9 56.3 2.5-2-60.5zm111.3 0-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5 33.9 16.5-4.7-39.3z\" class=\"st13123123\"/><path fill=\"#d7c1b3\" stroke=\"#d7c1b3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m211.8 247.4-33.9-16.5 2.7 22.1-.3 9.3zm-105 0 31.5 14.9-.2-9.3 2.5-22.1z\"/><path fill=\"#233447\" stroke=\"#233447\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m138.8 193.5-28.2-8.3 19.9-9.1zm40.9 0 8.3-17.4 20 9.1z\"/><path fill=\"#cd6116\" stroke=\"#cd6116\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m106.8 247.4 4.8-40.6-31.3.9zM207 206.8l4.8 40.6 26.5-39.7zm23.8-44.7-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1zm-120.2 23.1 20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z\"/><path fill=\"#e4751f\" stroke=\"#e4751f\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m87.8 162.1 23.6 46-.8-22.9zm120.3 23.1-1 22.9 23.7-46zm-64-20.6-5.3 28.9 6.6 34.1 1.5-44.9zm30.5 0-2.7 18 1.2 45 6.7-34.1z\"/><path d=\"m179.8 193.5-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9zm-69.2-8.3.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z\" class=\"st6123123123\"/><path fill=\"#c0ad9e\" stroke=\"#c0ad9e\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m180.3 262.3.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z\"/><path fill=\"#161616\" stroke=\"#161616\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m177.9 230.9-4.8-3.3h-27.7l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z\"/><path fill=\"#763d16\" stroke=\"#763d16\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m278.3 114.2 8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z\"/><path d=\"m267.2 153.5-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5zm-163.6-15.3-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46zm71 26.4 3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z\" class=\"st6123123123\"/></svg>"
};

var mykey = {
  identityFlag: WalletIdentityFlag.MyKey,
  label: WalletLabel.MyKey,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" viewBox=\"0 0 960 960\"><path fill=\"#50C3AF\" d=\"M785.469 961c-8.665-1.65-16.973-2.881-25.036-5.029-23.183-6.173-44.307-16.503-62.412-32.48-5.35-4.72-10.579-9.595-15.625-14.636-65.65-65.588-131.26-131.219-196.876-196.84-1.413-1.414-2.797-2.857-4.076-4.756 1.086-1.387 2.074-2.283 3.016-3.225 73.264-73.258 146.524-146.52 219.78-219.786 1.057-1.058 2.038-2.194 3.184-3.29.13.004.385.041.567.33 67.081 67.22 133.992 134.141 200.86 201.105a347.531 347.531 0 0 1 14.637 15.625c15.978 18.106 26.307 39.232 32.483 62.415 2.148 8.063 3.38 16.37 5.029 24.567 0 10.354 0 20.708-.3 31.807-1.278 6.938-1.844 13.23-3.3 19.309-8.348 34.877-25.757 64.199-53.352 87.47-18.452 15.562-39.298 26.222-62.483 32.386-8.064 2.144-16.37 3.378-24.565 5.028h-31.531zM176.531 1c8.664 1.65 16.968 2.885 25.032 5.028 23.184 6.16 44.028 16.822 62.48 32.38 27.594 23.27 45.057 52.576 53.368 87.46 4.184 17.563 4.532 35.381 2.694 53.334-2.69 26.282-11.833 50.181-26.633 71.828-25.152 36.785-60.03 59.62-103.652 67.626-43.086 7.907-83.488-.767-119.701-25.712-36.362-25.047-58.105-60.005-66.96-103.099-.828-4.034-1.053-8.193-1.859-12.57-.3-10.63-.3-20.983 0-32.082 1.278-6.938 1.844-13.23 3.3-19.308 8.352-34.876 25.758-64.199 53.352-87.473C76.405 22.848 97.256 12.2 120.436 6.028 128.499 3.882 136.805 2.65 145 1h31.531z\"/><path fill=\"#0091E6\" d=\"M1 784.469c1.641-8.122 3.051-15.834 4.967-23.417 5.973-23.64 16.996-44.651 32.728-63.338 19.072-22.655 42.64-38.552 70.497-48.23 12.353-4.292 25.148-6.17 38.143-7.734 15.901-1.913 31.555-.386 46.815 2.681 25.368 5.099 48.379 16.109 68.516 32.737 24.028 19.84 41.106 44.58 50.535 74.115 3.77 11.808 4.808 24.518 6.766 36.868 2.875 18.13.08 36.006-4.146 53.507-5.468 22.65-16.2 42.9-31.012 60.969-19.765 24.11-44.602 40.965-74.06 50.634-10.713 3.516-22.168 4.776-33.517 7.402-10.586.337-20.94.337-32-.002-3.801-.768-6.901-1.162-9.99-1.632-30.383-4.621-57.028-17.544-79.965-37.64-25.616-22.441-42.322-50.592-50.228-83.8C3.43 830.79 2.336 823.866 1 817v-32.531zM675.975 59.859c15.372-17.168 32.545-32.086 53.349-42.397 17.123-8.486 35.298-13.45 54.45-16.128 10.914-.334 21.601-.334 32.984 0 13.474 2.385 26.07 4.821 38.45 9.04 20.453 6.971 38.107 18.144 54.005 32.401 13.7 12.286 24.812 26.721 33.437 42.922 6.817 12.803 11.788 26.376 14.429 40.734 1.144 6.22 2.604 12.381 3.921 18.569 0 10.688 0 21.375-.332 32.751-5.735 43.547-24.827 79.06-57.828 107.358-.8.424-1.295.761-1.785 1.034.007-.065.138-.051-.115.053-.452.401-.65.699-.848.946 0-.05.1-.05-.152.054-.452.401-.65.699-.848.946 0-.05.1-.05-.152.054-.452.401-.65.699-.827.96.02-.036.093.006-.267.009-7.83 4.602-15.022 9.75-22.82 13.705-32.7 16.584-67.09 22.065-103.38 15.323-35.751-6.642-65.568-23.734-89.862-50.457-16.069-17.676-27.481-38.131-34.11-61.196-5.843-20.322-8.019-40.892-5.769-62.003 2.338-21.928 8.508-42.533 19.568-61.629 3.715-6.414 7.573-12.745 11.365-19.114 0 0 .042.073.259-.01a4.68 4.68 0 0 0 .81-.976s.001.1.204-.003c.4-.402.599-.7.797-.997 0 0 .013.13.209-.037.416-.749.637-1.33.858-1.912z\"/><path fill=\"#2E73D2\" d=\"M707.295 480.955c-1.017 1.099-1.998 2.235-3.055 3.293a2533633.347 2533633.347 0 0 1-219.78 219.786c-.942.942-1.93 1.838-3.18 2.944-1.627-1.048-3.02-2.236-4.31-3.527-72.583-72.565-145.152-145.143-217.761-217.681-1.402-1.4-3.255-2.348-5.05-3.614 1.677-2.09 2.391-3.177 3.291-4.077 74.34-74.345 148.695-148.675 223.6-222.991 70.393 69.856 140.236 139.695 210.072 209.542 5.416 5.417 10.783 10.882 16.173 16.325z\"/><path fill=\"#5FC3E6\" d=\"M707.424 480.958c-5.52-5.446-10.886-10.911-16.302-16.328a710257.631 710257.631 0 0 0-209.789-209.747c4.17-4.72 8.581-9.246 13.05-13.716A954512.823 954512.823 0 0 1 667.75 67.806c1.406-1.406 2.924-2.7 4.738-4.029-3.443 6.386-7.3 12.717-11.016 19.131-11.06 19.096-17.23 39.7-19.568 61.629-2.25 21.111-.074 41.68 5.768 62.003 6.63 23.065 18.042 43.52 34.111 61.196 24.294 26.723 54.11 43.815 89.862 50.457 36.29 6.742 70.68 1.261 103.38-15.323 7.798-3.955 14.99-9.103 22.82-13.705-.93 1.65-2.06 3.46-3.53 4.932-62.041 62.118-124.112 124.205-186.343 186.6-.164.302-.42.265-.55.261zM675.69 60.036c.064.404-.157.986-.638 1.741-.056-.405.148-.984.638-1.74zM673.576 62.794c.134.312-.064.61-.516 1.011-.107-.272.04-.649.516-1.011zM674.576 61.794c.134.312-.064.61-.516 1.011-.107-.272.04-.649.516-1.011zM902.84 285.109c-.178.368-.659.821-1.466 1.187.17-.426.667-.763 1.466-1.187zM900.94 286.196c.107.272-.039.649-.516 1.01-.134-.311.064-.609.516-1.01zM899.94 287.196c.107.272-.039.649-.516 1.01-.134-.311.064-.609.516-1.01zM898.94 288.196c.107.272-.039.649-.516 1.01-.134-.311.064-.609.516-1.01z\"/></svg>"
};

var okxwallet = {
  identityFlag: WalletIdentityFlag.OKXWallet,
  label: WalletLabel.OKXWallet,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 1000 1000\"><path fill=\"#000\" d=\"M0 0h1000v1000H0z\"/><path fill=\"#fff\" fill-rule=\"evenodd\" d=\"M393.949 218.518h-162.9c-6.92 0-12.53 5.61-12.53 12.53v162.9c0 6.921 5.61 12.531 12.53 12.531h162.9c6.921 0 12.531-5.61 12.531-12.531v-162.9c0-6.92-5.61-12.53-12.531-12.53Zm188.043 187.961h-162.9c-6.92 0-12.531 5.611-12.531 12.531v162.9c0 6.921 5.611 12.531 12.531 12.531h162.9c6.921 0 12.531-5.61 12.531-12.531v-162.9c0-6.92-5.61-12.531-12.531-12.531Zm24.982-187.961h162.9c6.92 0 12.531 5.61 12.531 12.53v162.9c0 6.921-5.611 12.531-12.531 12.531h-162.9c-6.921 0-12.531-5.61-12.531-12.531v-162.9c0-6.92 5.61-12.53 12.531-12.53ZM393.95 594.442H231.049c-6.92 0-12.53 5.61-12.53 12.531v162.9c0 6.92 5.61 12.531 12.53 12.531H393.95c6.92 0 12.53-5.611 12.53-12.531v-162.9c0-6.921-5.61-12.531-12.53-12.531Zm213.024 0h162.9c6.92 0 12.531 5.61 12.531 12.531v162.9c0 6.92-5.611 12.531-12.531 12.531h-162.9c-6.921 0-12.531-5.611-12.531-12.531v-162.9c0-6.921 5.61-12.531 12.531-12.531Z\" clip-rule=\"evenodd\"/></svg>"
};

var oneInch = {
  identityFlag: WalletIdentityFlag.OneInch,
  label: WalletLabel.OneInch,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" x=\"0\" y=\"0\" version=\"1.1\" viewBox=\"0 0 706.8 665.2\"><style>.st123123123124432345543534{fill:#fff}.st786751982739812631{fill:#94a6c3}.st98790010273989821462{fill:#1b314f}.st09809086284712746812908{fill:#d82122}</style><path d=\"M168.2 366.5 186.9 226 24.7 113.4l148.2 50.2 35-53.7 127.8-79.3 281.7 155.2L632 422.6 506.5 597l-99.2 15.2 51.3-93.9v-90.4l-37.3-70.6-37.9-25.1-58.3 60.1v63.6l-45.5 42.6-57.8 7-25.6 14.5-42-13.4-17.5-63 31.5-44.3v-32.8z\" class=\"st123123123124432345543534\"/><path d=\"M427.2 112.2c-30.9-6.4-64.7-4.7-64.7-4.7s-11.1 51.3-79.9 64.8c.5 0 90.9 30.9 144.6-60.1zM455.2 577.7c37.3-29.2 65.3-69.4 78.2-114.9.6-1.7 5.8-4.7 9.3-7 5.8-3.5 11.7-6.4 12.8-11.1 2.3-13.4 3.5-27.4 3.5-41.4 0-5.2-5.3-10.5-10.5-15.7-4.1-3.5-8.2-7.6-8.2-10.5-5.8-53.1-30.3-102.7-69.4-138.8l-4.1 4.1c37.9 35.6 62.4 84 67.7 135.3.6 4.7 5.2 9.3 9.9 14 4.1 3.5 8.8 8.8 8.8 11.1 0 13.4-1.2 26.8-3.5 40.2-.6 2.3-5.8 4.7-9.9 7-5.8 2.9-11.1 5.8-12.2 10.5-14 49.6-46.1 92.8-88.7 120.8 7.6-16.3 31.5-69.4 44.3-96.3l-2.3-86.3-74.1-71.7-42 5.8-46.1 74.7s21.6 27.4-8.8 59.5c-29.7 31.5-53.1 38.5-53.1 38.5l-21.6-11.7c6.4-8.2 19.3-20.4 29.2-28.6 16.9-14 33.8-15.2 33.8-30.3.7-31.6-33.2-22.9-33.2-22.9l-12.3 11.7-5.2 43.2-25.6 32.1-2.9-.6-42-9.3s25.7-13.4 29.8-28.6c4.1-14.6-8.2-63-8.8-65.9.6.6 12.3 10.5 17.5 26.8 9.3-25.7 21.6-50.2 25.1-52.5 3.5-2.3 50.7-27.4 50.7-27.4l-15.7 41.4 11.7-6.4 28-68.8s27.4-13.4 47.8-13.4c36.7-.6 91-45.5 66.5-126 7 2.9 128.3 63.6 149.3 182.6 15.7 91.5-36.2 177.2-123.7 226.8z\" class=\"st786751982739812631\"/><path d=\"M316.4 125c13.4-15.8 8.2-39.1 8.2-39.1l-39.1 57.8c-.6 0 13.9.6 30.9-18.7zM185.1 440.6l4.7-23.3s-19.3 33.8-21 38.5c-1.8 5.3 1.2 14.6 8.7 14 7.6-.6 16.9-11.7 16.9-19.8 0-10.5-9.3-9.4-9.3-9.4z\" class=\"st98790010273989821462\"/><path d=\"M531.6 69.6s29.2 1.2 59.5 4.7c-68.3-53.7-133-69.4-185.5-69.4-72.3 0-121.3 29.8-124.3 31.5L304.1.2s-91-8.8-123.1 87.5c-8.2-20.4-15.7-50.2-15.7-50.2S118 79 140.2 147.8C85.9 128 8.4 100.5 5.4 100c-4.1-.6-5.3 1.2-5.3 1.2s-1.2 1.7 2.3 4.7c6.5 5.1 129 95.6 155.9 113.1-5.8 21-5.8 30.9 0 40.8 8.2 13.4 8.7 20.4 7.6 30.3-1.2 9.9-11.7 95.7-14 106.2-2.3 10.5-26.8 47.8-25.7 58.9 1.2 11.1 16.3 58.3 29.8 63.6 9.9 3.5 34.4 11.1 50.7 11.1 5.8 0 11.1-1.2 13.4-3.5 9.9-8.7 12.8-10.5 19.8-10.5h1.7c2.9 0 6.4.6 10.5.6 9.3 0 21.6-1.8 30.3-9.9 12.8-12.8 35-30.3 42-38.5 8.8-11.1 13.4-26.2 11.1-41.4-1.8-14 5.8-26.3 14.6-38.5 11.1-14.6 31.5-40.8 31.5-40.8C421.9 377.6 447 423.7 447 475c0 91-79.3 164.5-177.3 164.5-15.2 0-29.7-1.7-44.3-5.2 44.9 15.7 82.8 21 113.8 21 65.9 0 100.9-23.9 100.9-23.9s-12.2 15.8-32.1 33.8h.6c109.1-15.2 162.2-105 162.2-105s-4.1 29.2-9.3 49c145.1-109.1 120.6-245.6 120-250.2 1.2 1.7 15.8 19.2 23.3 28.6 23.4-240.4-173.2-318-173.2-318zM308.2 453.5c-2.3 2.9-12.2 11.7-19.2 18.1-7 6.4-14.6 12.8-20.4 18.7-2.3 2.3-7 3.5-14 3.5h-17.5c8.8-11.7 34.4-38.5 43.2-44.3 10.5-7 15.8-14 9.3-26.2-6.4-12.3-23.3-9.3-23.3-9.3s9.9-4.1 18.7-4.1c-11.1-2.9-25.1 0-31.5 6.4-7 6.4-5.8 29.2-8.7 43.7-2.9 15.2-12.8 22.8-28 36.8-8.2 7.6-14 9.9-18.7 9.9-9.9-1.7-21.6-4.7-29.8-7.6-5.8-7.6-14.6-32.7-16.9-43.2 1.7-5.8 8.7-18.1 12.2-25.1 7-13.4 11.1-21 12.3-28 2.3-9.9 9.9-71.2 12.8-96.8 7.6 9.9 18.1 26.3 15.7 36.8 16.9-23.9 4.7-47.3-1.2-56.6-5.2-9.3-12.2-28-6.4-47.8 5.8-19.8 26.8-74.7 26.8-74.7s7 12.3 16.9 9.9c9.9-2.3 89.8-122.5 89.8-122.5s21.6 47.2-1.2 81.7c-23.3 34.4-46.1 40.8-46.1 40.8s32.1 5.8 61.8-15.8c12.2 28.6 23.9 58.3 24.5 62.4-1.8 4.1-25.1 60.1-27.4 63.6-1.2 1.2-9.3 3.5-15.2 4.7-9.9 2.9-15.7 4.7-18.1 6.4-4.1 3.5-22.8 54.8-31.5 79.9-10.5 2.9-21 8.8-28.6 20.4 4.1-2.9 16.9-4.7 26.3-5.8 8.2-.6 33.2 12.8 39.7 37.9v1.2c1.3 9.2-1.6 18-6.3 25zm-54.8 7c5.3-7.6 4.7-20.4 5.3-24.5.6-4.1 1.7-11.7 6.4-12.8 4.7-1.2 15.8.6 15.8 8.7 0 7.6-8.2 9.3-14 14.6-4.2 4-12.4 12.8-13.5 14zM486.1 349c5.8-29.7 6.4-55.4 4.7-76.4 22.7 30.3 36.7 67.1 40.8 105 .6 4.7 5.2 9.3 9.9 14 4.1 3.5 8.8 8.2 8.8 11.1 0 13.4-1.2 26.8-3.5 40.3-.6 1.7-5.8 4.7-9.9 7-5.8 2.9-11.1 5.8-12.2 10.5-12.8 44.9-40.3 84.6-77 112.6 54.2-56.6 80.4-150 38.4-224.1zm-36.7 229.3c37.9-29.2 67.1-70 79.9-116.1.6-1.7 5.8-4.7 9.3-7 5.8-2.9 11.7-6.4 12.8-11.1 2.3-13.4 3.5-27.4 3.5-41.4 0-5.2-5.3-10.5-10.5-15.7-2.9-3.5-7.6-7.6-7.6-10.5-4.7-42.6-21.6-82.8-47.8-116.1-11.7-70-58.3-91.6-59.5-92.2 1.2 1.8 31.5 45.5 10.5 96.8-21.6 51.9-77 43.8-81.7 44.3-4.7 0-22.7 23.3-45.5 66.5-2.9-1.2-15.2-4.1-29.2-1.7 10.5-29.2 26.3-70.6 29.2-74.1 1.2-1.2 9.9-3.5 15.8-5.2 11.1-2.9 16.3-4.7 18.1-7 1.2-1.8 7-15.2 12.8-29.2 5.3 0 18.7-1.2 19.8-1.8 1.2-1.2 12.3-29.7 12.3-33.2 0-2.9-22.8-59.5-31.5-81.1 4.1-4.7 8.2-10.5 12.2-16.9 119.6 12.9 213 114.4 213 237.4 0 94.5-55.4 176.8-135.9 215.3z\" class=\"st98790010273989821462\"/><path d=\"M294.2 263.3c11.1-12.8 5.3-36.7-15.2-40.8 5.3-12.2 12.8-36.7 12.8-36.7s-59.5 93.3-64.7 95.1c-5.3 1.8-10.5-18.7-10.5-18.7-11.1 42.6 18.7 48.4 22.2 35 16.3-4.2 44.3-21.7 55.4-33.9z\" class=\"st98790010273989821462\"/><path fill=\"#ffd923\" d=\"m243.4 286 30.3-51.9s17.5 8.8 8.7 22.8c-11 16.3-39 29.1-39 29.1z\"/><path d=\"M618.5 526.4c-8.8 11.7-18.7 23.9-30.3 35.6 75.2-144.7 3.5-277.1.6-282.3 5.3 5.3 10.5 11.1 15.2 16.3 57.7 64.1 64.7 160.4 14.5 230.4zM688.5 340.3c-26.3-70.6-63.6-130.7-145.8-184.9-79.3-52.5-164.5-48.4-169.2-47.8h-1.2c2.9-1.2 5.8-1.8 8.7-2.3 18.1-5.8 41.4-10.5 64.8-13.4C507.7 83 570.1 104 612.7 149l1.2 1.2c48.4 51.3 73.5 115.4 74.6 190.1zM524 51.5c-86.9-16.3-142.9-8.2-183.2 7-1.2-4.7-5.3-14-8.8-21.6-12.1 14.6-25 32.1-33.1 43.2-22.2 15.2-31.5 29.8-31.5 29.8 12.8-43.8 50.2-76.4 95.7-84.6 12.8-2.3 26.8-3.5 42-3.5 40.2.6 80.4 10.5 118.9 29.7zM202.6 163.5c-68.2-2.3-45.5-81.7-44.3-86.3 0 .6 4.6 62.4 44.3 86.3zM269.7 20.6c-52.5 31.5-42 106.7-42 106.7-50.2-76.3 37.9-104.9 42-106.7z\" class=\"st09809086284712746812908\"/><path d=\"M183.4 184.5c3.5 2.9 7 8.2 2.9 15.8-2.3 4.1-5.8 3.5-11.1 1.2-7-3.5-49-28-86.9-53.1 43.2 15.2 86.9 31.5 93.9 35 0 0 .6.6 1.2 1.1z\" class=\"st123123123124432345543534\"/></svg>"
};

var opera = {
  identityFlag: WalletIdentityFlag.Opera,
  label: WalletLabel.Opera,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"xMidYMid\" viewBox=\"0 0 256 256\"><defs><linearGradient id=\"a\" x1=\"50.003%\" x2=\"50.003%\" y1=\"1.63%\" y2=\"98.545%\"><stop offset=\"30%\" stop-color=\"#FF1B2D\"/><stop offset=\"43.81%\" stop-color=\"#FA1A2C\"/><stop offset=\"59.39%\" stop-color=\"#ED1528\"/><stop offset=\"75.81%\" stop-color=\"#D60E21\"/><stop offset=\"92.72%\" stop-color=\"#B70519\"/><stop offset=\"100%\" stop-color=\"#A70014\"/></linearGradient><linearGradient id=\"b\" x1=\"49.99%\" x2=\"49.99%\" y1=\".853%\" y2=\"99.519%\"><stop offset=\"0%\" stop-color=\"#9C0000\"/><stop offset=\"70%\" stop-color=\"#FF4B4B\"/></linearGradient></defs><path fill=\"url(#a)\" d=\"M85.9 200.1C71.7 183.4 62.6 158.7 62 131v-6c.6-27.7 9.8-52.4 23.9-69.1 18.4-23.8 45.4-34.5 75.9-34.5 18.8 0 36.5 1.3 51.5 11.3C190.8 12.4 161.1.1 128.5 0h-.5C57.3 0 0 57.3 0 128c0 68.6 54 124.7 121.9 127.9 2 .1 4.1.1 6.1.1 32.8 0 62.7-12.3 85.3-32.6-15 10-31.7 10.4-50.5 10.4-30.4.1-58.6-9.8-76.9-33.7Z\"/><path fill=\"url(#b)\" d=\"M85.9 55.9c11.7-13.9 26.9-22.2 43.5-22.2 37.3 0 67.5 42.2 67.5 94.4s-30.2 94.4-67.5 94.4c-16.6 0-31.7-8.4-43.5-22.2 18.4 23.8 45.7 39 76.1 39 18.7 0 36.3-5.7 51.3-15.7C239.5 200 256 165.9 256 128c0-37.9-16.5-72-42.7-95.4-15-10-32.5-15.7-51.3-15.7-30.5 0-57.8 15.1-76.1 39Z\"/></svg>"
};

var ownbit = {
  identityFlag: WalletIdentityFlag.OwnBit,
  label: WalletLabel.OwnBit,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 132 132\"><defs><linearGradient id=\"a\" x1=\"15.8%\" x2=\"106.3%\" y1=\"84.9%\" y2=\"-17.2%\"><stop offset=\"0%\" stop-color=\"#0877FF\"/><stop offset=\"100%\" stop-color=\"#3CCEF9\"/></linearGradient></defs><path fill=\"url(#a)\" fill-rule=\"nonzero\" d=\"M65.86 0c-1.418 0-2.824.045-4.216.135a4.338 4.338 0 0 0-4.017 4.342V32.8a4.346 4.346 0 0 0 1.45 3.235 4.327 4.327 0 0 0 3.373 1.072 29.47 29.47 0 0 1 3.41-.2c11.742 0 22.327 7.089 26.82 17.96a29.136 29.136 0 0 1-6.292 31.703 28.986 28.986 0 0 1-31.637 6.306C43.903 88.373 36.83 77.766 36.83 66V19.223a6.949 6.949 0 0 0-3.9-6.25 6.92 6.92 0 0 0-7.314.784C9.447 26.24-.017 45.544 0 65.999c0 36.412 30.083 66.298 66.419 65.999 36.373-.155 65.735-29.829 65.58-66.279C131.845 29.27 102.233-.154 65.86.001Z\"/></svg>"
};

var phantom = {
  identityFlag: WalletIdentityFlag.Phantom,
  label: WalletLabel.Phantom,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 128\"><g clip-path=\"url(#a)\"><circle cx=\"64\" cy=\"64\" r=\"64\" fill=\"url(#b)\"/><g filter=\"url(#c)\"><path fill=\"url(#d)\" d=\"M110.584 64.914H99.142C99.142 41.765 80.173 23 56.772 23c-23.11 0-41.9 18.306-42.36 41.058C13.936 87.577 36.242 108 60.019 108h2.99c20.963 0 49.06-16.233 53.45-36.013.811-3.646-2.1-7.073-5.875-7.073Zm-70.815 1.031c0 3.096-2.56 5.628-5.689 5.628s-5.688-2.533-5.688-5.628v-9.104c0-3.095 2.56-5.627 5.688-5.627 3.13 0 5.69 2.532 5.69 5.627v9.104Zm19.754 0c0 3.096-2.56 5.628-5.689 5.628-3.13 0-5.689-2.533-5.689-5.628v-9.104c0-3.095 2.56-5.627 5.689-5.627 3.13 0 5.689 2.532 5.689 5.627v9.104Z\"/></g></g><defs><linearGradient id=\"b\" x1=\"64\" x2=\"64\" y1=\"0\" y2=\"128\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#534BB1\"/><stop offset=\"1\" stop-color=\"#551BF9\"/></linearGradient><linearGradient id=\"d\" x1=\"65.5\" x2=\"65.5\" y1=\"23\" y2=\"108\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#fff\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\".82\"/></linearGradient><clipPath id=\"a\"><path fill=\"#fff\" d=\"M0 0h128v128H0z\"/></clipPath><filter id=\"c\" width=\"117.472\" height=\"100.281\" x=\"6.764\" y=\"15.36\" color-interpolation-filters=\"sRGB\" filterUnits=\"userSpaceOnUse\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/><feColorMatrix in=\"SourceAlpha\" result=\"hardAlpha\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"/><feOffset/><feGaussianBlur stdDeviation=\"3.82\"/><feColorMatrix values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0\"/><feBlend in2=\"BackgroundImageFix\" result=\"effect1_dropShadow_8241_140154\"/><feBlend in=\"SourceGraphic\" in2=\"effect1_dropShadow_8241_140154\" result=\"shape\"/></filter></defs></svg>"
};

var rabby = {
  identityFlag: WalletIdentityFlag.Rabby,
  label: WalletLabel.Rabby,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 320 320\"><path fill=\"url(#a)\" d=\"M310.142 178.941c11.915-26.619-46.993-100.99-103.27-131.974-35.473-24.003-72.437-20.705-79.923-10.166-16.429 23.129 54.402 42.727 101.772 65.597-10.183 4.423-19.778 12.36-25.421 22.51-17.66-19.281-56.422-35.883-101.904-22.51-30.65 9.013-56.122 30.26-65.967 62.351a19.227 19.227 0 0 0-7.827-1.654c-10.655 0-19.293 8.638-19.293 19.294 0 10.655 8.638 19.293 19.293 19.293 1.975 0 8.15-1.325 8.15-1.325l98.683.716c-39.465 62.607-70.654 71.759-70.654 82.606 0 10.846 29.842 7.907 41.047 3.864 53.64-19.354 111.252-79.674 121.138-97.038 41.516 5.18 76.406 5.793 84.176-11.564Z\"/><path fill=\"url(#b)\" fill-rule=\"evenodd\" d=\"M228.717 102.401a.03.03 0 0 0 .008.004c2.195-.865 1.84-4.108 1.237-6.654-1.385-5.854-25.295-29.464-47.747-40.039-30.595-14.41-53.124-13.667-56.452-7.025 6.232 12.773 35.123 24.764 65.298 37.29 12.873 5.343 25.98 10.783 37.661 16.422l-.005.002Z\" clip-rule=\"evenodd\"/><path fill=\"url(#c)\" fill-rule=\"evenodd\" d=\"M189.892 230.954c-6.187-2.364-13.176-4.534-21.122-6.502 8.472-15.16 10.25-37.603 2.249-51.793-11.23-19.914-25.326-30.513-58.082-30.513-18.016 0-66.523 6.068-67.385 46.561-.09 4.249-.002 8.142.306 11.723l88.577.642c-11.941 18.944-23.125 32.994-32.916 43.678 11.756 3.012 21.457 5.541 30.364 7.863a4800.923 4800.923 0 0 0 24.282 6.285c12.213-8.898 23.695-18.6 33.727-27.944Z\" clip-rule=\"evenodd\"/><path fill=\"url(#d)\" d=\"M34.247 196.269c3.619 30.761 21.1 42.816 56.823 46.383 35.722 3.568 56.213 1.174 83.493 3.656 22.784 2.073 43.128 13.684 50.675 9.672 6.792-3.611 2.992-16.657-6.096-25.027-11.781-10.85-28.086-18.393-56.776-21.07 5.718-15.655 4.116-37.604-4.764-49.546-12.839-17.267-36.538-25.074-66.532-21.663-31.337 3.564-61.364 18.992-56.823 57.595Z\"/><defs><linearGradient id=\"a\" x1=\"97.827\" x2=\"307.576\" y1=\"155.368\" y2=\"214.849\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#8797FF\"/><stop offset=\"1\" stop-color=\"#AAA8FF\"/></linearGradient><linearGradient id=\"b\" x1=\"272.257\" x2=\"120.914\" y1=\"151.38\" y2=\"-.333\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#3B22A0\"/><stop offset=\"1\" stop-color=\"#5156D8\" stop-opacity=\"0\"/></linearGradient><linearGradient id=\"c\" x1=\"194.103\" x2=\"48.722\" y1=\"236.239\" y2=\"152.655\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#3B1E8F\"/><stop offset=\"1\" stop-color=\"#6A6FFB\" stop-opacity=\"0\"/></linearGradient><linearGradient id=\"d\" x1=\"110.349\" x2=\"208.616\" y1=\"153.803\" y2=\"278.661\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#8898FF\"/><stop offset=\".984\" stop-color=\"#5F47F1\"/></linearGradient></defs></svg>"
};

var rainbow = {
  identityFlag: WalletIdentityFlag.Rainbow,
  label: WalletLabel.Rainbow,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 120 120\"><g clip-path=\"url(#a)\"><mask id=\"b\" width=\"120\" height=\"120\" x=\"0\" y=\"0\" maskUnits=\"userSpaceOnUse\" style=\"mask-type:alpha\"><circle cx=\"60\" cy=\"60\" r=\"60\" fill=\"#D9D9D9\"/></mask><g mask=\"url(#b)\"><path fill=\"url(#c)\" d=\"M0 0h120v120H0z\"/></g><path fill=\"url(#d)\" d=\"M26.667 41.667h5c25.773 0 46.666 20.893 46.666 46.666v5h10a5 5 0 0 0 5-5c0-34.057-27.609-61.666-61.666-61.666a5 5 0 0 0-5 5v10Z\"/><path fill=\"url(#e)\" d=\"M80 88.333h13.333a5 5 0 0 1-5 5H80v-5Z\"/><path fill=\"url(#f)\" d=\"M31.667 26.667V40h-5v-8.333a5 5 0 0 1 5-5Z\"/><path fill=\"url(#g)\" d=\"M26.667 40h5C58.36 40 80 61.64 80 88.333v5H65v-5C65 69.923 50.076 55 31.667 55h-5V40Z\"/><path fill=\"url(#h)\" d=\"M66.667 88.333H80v5H66.667v-5Z\"/><path fill=\"url(#i)\" d=\"M26.667 53.333V40h5v13.333h-5Z\"/><path fill=\"url(#j)\" d=\"M26.667 61.667a5 5 0 0 0 5 5c11.966 0 21.666 9.7 21.666 21.666a5 5 0 0 0 5 5h8.334v-5c0-19.33-15.67-35-35-35h-5v8.334Z\"/><path fill=\"url(#k)\" d=\"M53.333 88.333h13.334v5h-8.334a5 5 0 0 1-5-5Z\"/><path fill=\"url(#l)\" d=\"M31.667 66.667a5 5 0 0 1-5-5v-8.334h5v13.334Z\"/></g><defs><radialGradient id=\"d\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"rotate(-90 60 28.333) scale(61.6667)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\".77\" stop-color=\"#FF4000\"/><stop offset=\"1\" stop-color=\"#8754C9\"/></radialGradient><radialGradient id=\"g\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"rotate(-90 60 28.333) scale(48.3333)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\".724\" stop-color=\"#FFF700\"/><stop offset=\"1\" stop-color=\"#FF9901\"/></radialGradient><radialGradient id=\"j\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"rotate(-90 60 28.333) scale(35)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\".595\" stop-color=\"#0AF\"/><stop offset=\"1\" stop-color=\"#01DA40\"/></radialGradient><radialGradient id=\"k\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(14.1667 0 0 37.7778 52.5 90.833)\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#0AF\"/><stop offset=\"1\" stop-color=\"#01DA40\"/></radialGradient><radialGradient id=\"l\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(0 -14.1667 268.642 0 29.167 67.5)\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#0AF\"/><stop offset=\"1\" stop-color=\"#01DA40\"/></radialGradient><linearGradient id=\"c\" x1=\"60\" x2=\"60\" y1=\"0\" y2=\"120\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#174299\"/><stop offset=\"1\" stop-color=\"#001E59\"/></linearGradient><linearGradient id=\"e\" x1=\"79.167\" x2=\"93.333\" y1=\"90.833\" y2=\"90.833\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#FF4000\"/><stop offset=\"1\" stop-color=\"#8754C9\"/></linearGradient><linearGradient id=\"f\" x1=\"29.167\" x2=\"29.167\" y1=\"26.667\" y2=\"40.833\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#8754C9\"/><stop offset=\"1\" stop-color=\"#FF4000\"/></linearGradient><linearGradient id=\"h\" x1=\"66.667\" x2=\"80\" y1=\"90.833\" y2=\"90.833\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#FFF700\"/><stop offset=\"1\" stop-color=\"#FF9901\"/></linearGradient><linearGradient id=\"i\" x1=\"29.167\" x2=\"29.167\" y1=\"53.333\" y2=\"40\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#FFF700\"/><stop offset=\"1\" stop-color=\"#FF9901\"/></linearGradient><clipPath id=\"a\"><path fill=\"#fff\" d=\"M0 0h120v120H0z\"/></clipPath></defs></svg>"
};

var safepal = {
  identityFlag: WalletIdentityFlag.SafePal,
  label: WalletLabel.SafePal,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" viewBox=\"0 0 128 128\"><image width=\"128\" height=\"128\" href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAV HUlEQVR42u2deZRcVZ3HP7/73quupbuzohyQRceZM47DzHgUQQYUVJaADi4DzoiiDPsiECQkhBCi qIdVxihhxxEXxoRVlCQIDI7LqMfRo3MYj86ZkYRNyd7dVdXV9d79zR/3vapXnQ52ErrqVae+5+R0 p7rq1X33+72/3+/+7u/eJ+w2VE4CswqJ0q8ev9dLe1PIHRSZ6I1GvNeIRnNUzQzElkA0+ezuf/90 gKjrC1FURgQqIL9X0RdQ+ZUtB79eu7H0YvoTJ6HeKrDNvtzFb971j6oAhpj4N6PB3P2GDzXGHmeE wyz6VyCzPOkTIzkUBaL4Zw87gmAAQRCs1ol0VIEhg/zCKj+y1qzZ+Oxvf/yfvKUOuy+EXRSAGhAL cMyrf/8qP186S0Q+iOjfeNKPUsfqKKoRgEWwIKC9ET8piCgoKAbBCB5G8ggBkVZA9ecI3xiu1Vb+ +wtznnUfanKyU1+1c2+PzRRw5F4v7V0qlc4Ce7ZnSvtYrWF11KpgRREF03pPiCoqsjtWZ/oj6SMd ZyoFrAoqijEmbww5IlvdjHB3vaLXP/aHgZfiK8jOWIOdIKOpsHkHbj1XMEs90793ZEdQiUJRBMHo uK/uEb570Al8ZlMMxvfNAJEtv6A2vO7R9TOXx/HEpK3BJMlxF3zX/utelzdzVnimcGxoKyhhXcCL iW80tEf61GB8H8f/Dw1+YEwea2trR+2m855Yf8D/TVYEkyDKXeiY/Ta+L+cXbhPJvSq05bqgPeI7 iKTfRRAUq4r1vX7f6ujGelQ/7bH1s789GRH8EcLcBY7df9PFvpe/SdWiWg8R8Xo+PRtoiRlUIyOB L2Js3Y5etnbdnBv/mAjMy1zagNh5+29emPMHb1INIyWMxIjfIz87SHMhRnxLGFkNyXmDN8zbf/NC R77ukOcd/GGl58jfuND3Bq6JtByCFRE8VbRHfraQiCDmxQNLpJXQ9waumbf/xlgEK70JP7v9S27k H73/ppPyfv/KSEdDtZERI6ZHfPbRcAlWrRjPepL36/WhD695dq97J3IH48h0c8hj993y134Q/BA0 bwlJRn6P/O5AKi6IDD5ALayHh619ftYvx+cJtnMBf4HmTCBfNhKUrNa1R373IRUXeFZDFQmKXiBf PXKvl/rHvzclgGUGRPc7YNPSwMx4U6iVOmI87SXvuxaqKCJepNW6b2YcVCz6S93oX9bgPR7Vywws s+8+YMubcib4CRoZVSti6Pn9LkYzHsCKGBXxwjDSN69dP/B04gpaXIAv0TJP8oFqpPSmel2PRn5A EFWrRvr6RMaudQP+UwJuic7N9/fddKjJ9f1ANQK1gnm5HEEP3Qa1qAjWSJ8Xau2oNc/MegrUNEjW QOYbKXiKWp1gNaqH7kVsBVDEivSpoGcnfxOAI/fecmAxz9OKKYha7Y3+aQqLRYwo1BT7hjXPzHrG APTl7Im+N1hEbdQb/dMTqqgKomKjwPTnBd4H8TTQeOa9qqoYFzj0Ar/phzSviqoqJwDI0XM37BP0 +78GMwjWKj0BTFeoogIKnlHCbeWx6kEmKAaHI54jv2f4pz0cx5EV8Wf0B6W3GjW82ZOSKhLRM//T GuKKjUUV60lRLfZQH+yfq0YgiOxWmXgP3QAnAkE1QjBvNMDrlZqIqpmu0b92mW+byvbGlUNGqYuI 7uODzHKlXiBm+lgAVXX+zIARd1vWQpYlrlZBXBQ+VYjXBhRCgL19EeYoFqaN+VdUwRhBFaojSlh3 HdtXcH4ui1AL+aIQRU4IUykCBFFXEjDbB3KCTq3s2gZHvucJo1VFBN54sMehRwcc8GcepUGhkfzO wO0KzlJFIZQGhMdW1Xj47jFy+Sn+XnGJYZDAdyt+Mg1W/prkl4cs+77O48wrC7z9hIBsGzcFhJ8+ Ocbj943h55jy9qY59xPSu598wfNheIvlLUcGLPpSibl7G6xV51shMzpwIx+iSMn1GZ58cIzPnV/G eBDkZMpdQJpzv9OdsduIl7o8H4Y2W976roBP3VWiOCCEoeJ5gvFbI+tOebskMFVVbOjI/7eHalzz iQpBAJ4v2Kn2/+PQ5QJoJf+QdwdcdacjPwrB911nawZCnDT5Uaj4geHJBx35xusM+dDVAmia/aEt TfJLAy6S9mLyO0087ID8B2pcc6Ej3+8Q+UD3rvs3yN88nnxn9rNM/hMx+V6HyYcutQCqiucLQ5st hx4dsPSOfkoDdA35115YwfPdjKWT5EPXCSCe6vnCts2Ww45x5Bf7cWbfM7G/73Ar44BzPPmP31/j ugsreEE2yIeucgFN8odi8q+6s5QiX+Klzmzkepvk0yD/2oyRD11iARR3iFbi8992bMCyu/rJF9Lk N0ddR9uaNvsR+IHw+H01rr2ogp8x8qELLIBqk/xtmy2HHRew7E5Hvs00+YrvC9/NMPmQdQGoS5Mm 5P/tcQFX3dFPvujIN1klP1R83/DYyhrXXljOLPmQaRfQTPJs22w5fF7A0ttLjZFvMh7tr11Z44aL ywQ5ySz5kFkL0EzybNtsOfz4gCtv66evKEQ2w+RHMfnfrHH9xZXMkw8ZtQBp8o84IWDJrc7s6zif 7xZ6OtxYIU43K0FgWPOvNW64pEKQc0LNMvmQQQGkkzxHnBBw5a2t0b6DWzEznmTIhgmr761x4ycd +Vkf+QkyJIDWJM/bT8ix5LYSfS3RfvN9xhOe/d+Inz5RZ2xUEdO5FT7jCVs3Wh66u0YQdMfIT5AJ Abh5fpP8d7wncOTnt5/naxwDPHLPKLcsq1IZin1wB9uf0FwckLiN3UE+ZEAAOm6q9473uoAv19dK vogQRRbPMzz9szrLL69gjDAwy2Ql+Ye1ZCY4nSw6KgDV+IDhmPwj/y7HkltL5PpcZ7aM/Hh3o6ry /e/UGa0os/YyhPXOd3i3kZ5G50KoeNWmQf6JAUtuLRHk4nm+aY78ZJolccn00GbtWAHFxLch2KhZ 0t1N+xA6JID4CCsvIT/HkhX9BLmmjx8/qpwQ0teQjpPv2uWmo8UBIRzTlrxAN6ADAoiTPB5s22Q5 6sQcV6woEfTtmPzGJzX9ezY6WAxUhpW3HRNw6qV5RrYpIt0jgrYLwJGvjvz351i8wvn8ZGr3cv40 /XIWRn+jTeLc1ikXFfjYgjzDWxW6RARtFYCqOvK3KO/8gBv5ScCX9vndhEYMYBVrldMvL/LxywqM dIkI2iYAVcUYYWRIOerEHItvLjV8fpbKuHYWIs17E4Gwrpy2sMBpCwtd4Q7aJgBjhNGK8qcHeSz6 UjEe+ZqphZ1dhSM4CVTdotDHLytw2mXOHWRZBO1zAXHHnHxenkLRzd8Tsz8dkOhXTFoERf5pUbZj grYJIBxTZs4VDjrET5lMiTuve0f/eDQtgatS/tgCJ4KRbdkUQftiAFyuP+hLhkr8YxqR7+6HxvZ0 EYhCy8cWFDl9UYHytuwli9omAM8TRrYqL66LUG2uoWelI15JpANDY9waxqmXFjj98gIj29wpFVkR QfuCQE+oVpTH7xtzvt/SdVmznUEjfW0EI27H0kc/WeCMxQVGhrLjDtomABsp/YPCI/eM8eBdo/iB Qa3sOSIwLib46CUFzrwidgcZsARtTAS5lFmuD5ZfXuXBu0bx/NYjUaa1CCQWQah8ZH6BM66ILUGH RdA2AaT9YqEEyy+v8OCdo/HmyD3EHYhgvKYIzlpSoNxhEbQ1FZykTJ0IhOWXV3ngjpQl2MNEcMrF Bc5cUqA83DkRtH0xKBGBGKEwAF9cXOGBO2JLsAeJQEyrCCopEbQTHakHEGmeg1PsFyeC26uxJei+ NfWdvvckEZaI4KICpy8uUC27tHE777tjFUGJCDBOBMuvqHL/7aP4vsHuUSJwaeOPzM9z+Lwc5WH3 ervQ0ar68SL44hUV7rt1FG8PEoGY5Bwj4f1n9LlTwvYEC9DSEbE7KA0IN19ZYdWEIuh0S6fm3kUl HvHKfq83DMwSonAPEkDSEUl5eHFAuHlphVW3VGMREBd/Mu1EoKotZxfaiLZvdcuEACAlAhFK/cLN S6usXDEaV/8ms4NOt/KVQ7rcPalufua3EUNb3LkC7UJmBACpmCB2ByuuqrByRTVOFqX3CHS6pa/s /boFI+WBO2rO/O8pQeDLdQrEIlha5ZsrXJ6guXaQnargXUES19j4Po0Rvri4yo+/W6c0GO8xaBM6 vjVsIqQTJqVBuGVpBVT50PkFtyW8iwPDFvIVjAfLF5d54I4ag7OdpWunq8ucBUiQDgxLg8KKq6rc u7zqIubUTqFuQuvId0vkX1hU4b5basyY7Sxcu1WdSQuQIG0J+gfh1mVV+gpCEBAXlXS6hQ5pd7Sj cwq3I9/AFxaVuf+2GjPmmI5tLM20AGB7d3D71VUGZrmZQsdPBxnXRvf79n+fkPyFFe6/vcZgB8mH DLuANNJZM88Xhrcm5eSdblky+pvkJeVu6b+3ki/888IK98Xka4e3lHeFAKB1lDU3knSuPe7hW9qY tZQGWo+mT+odx4/8my4rc//tNWZmgHzoAhcwEYyh8wcCxym8KHKW6eB3BjGRFhGzHfki8PkFFR68 s8bMOZKZwyS6RgCNzhIY3qZtnStPiPgpm2Lg1EsLvOVIf7vTytPk33RZhYca5GdnN1RXCCC9KhiO wdvfE1Dslx1G3O1qU19BOGJewMHvzLkFLdPc55CQD27kP3R3jZlzBRtlh3zoAgE0O0upDCtnLS3w 4QsLnW5Waxvj9HXCaXJaCMBNCyo89OV45GeMfMi4ANKdVR5Szl5W4B8vKBDWLcnDjjvWNmIXIM4N JK9Ym5AvfH5BmYfvdgFfutwtS8isANIjvzyknLOswD9cUCAKLZ4njUKKLHToRD7/xk+WefjLMfkZ CfgmQiYFMJ78cz9V4EPnFwgT8iXr5Fcc+XOzO/ITZE4A25H/6SIfOi9PFD8DMCvkp4+pb5Iv3HDJ CN/6l7FMm/00MiWAFvKHlfM+XeDkmPwkws5Ch25Hvmsy188v88g9Y5k3+2lkRgBJqhdNkX9ugShU jCEzPn+ikY+FGy6p8MhXa8yc3T3kQ0ZSwY3OSsi/2pEfZpJ8aW5uiVdvr7+kwiP3JEkezURbJ4uO W4AWsz+inH91kZPOyW9HfhYgcfrPRo58G8H1l5T5ztfGXJInFPecky4hH7JwVnAqyXPBZ4r8/dn5 5lQvIz6/2dYkyeNy+dfPL/Odr481kzzizj7uJnTMBaR9fmVEOT9Fvskk+RKPfFeHcP38Mo9+bcz5 /CTD12XkQ4csQIN8q1TKygWfLfDBMzNOfryh1Vq47uIyj369u6L9HaHtAkhvh6qWlU98rsgHzshn PsnjDoWG6y6Kye+CJM9k0FYBtJA/0iQ/S0medMAp4rZpeb4j/9oLy6y+d/qQD20UQNqPVsvKhTH5 9bqL9tOlVFmI+pP2+D6M1Rz5313VPRm+ycJXd3S/JD+n6ouS0qkohEtvLPKeU/OAEgRAhoOn//mv kBVLq/z8+3VmzDbYUN26XxeTn+bcd6QrMuV3pNTrcPK5fRxxQo4X10cYj8Y0sOOIq0vCunNPz/3O 8qPVY/xwTZ3KCAzONETJU0EyLNjJIBnoIogc/9otNYUcU2wBkgMRZs4VxmpxOpXOPu1rXAsB56LG ajC0xVX7FkuC8aWR/MmytZr0nSqKqKAS+aoMCzJHp3gim0TTLz2fPPsneTpwltCs3h2Y4Y61s5bG /H/aQFHBCKJbfEE2IN4cIWQq44AkaApyZH8Qaesj4KYT+THHiHio1jcaxa43BIqIneogsNmKjP+b qM3TBDHHKgSqsN4o8rSIj6qqaoZccg9TArd3RaxIACq/MVEU/crqqAh48WaXngimKZLD2QX1rFYk Qn9ijNofWK2NgphpaPF6GAcjKIixWq9K5P3ErH1ur9+B/NKYoqowpXFAD51FfCiZNaaoovKLtc+t /Z0BidTqGoMvNJ/h0HMD0wwNXi0YfEF4DE6Oki0Nq0Itj4L4MsUJoR46A5f6VRC8UMthVB97CMCA ytr1c562Wv+eb0qowfaswPRCwqcxJvKlhGr9ibXPv/qXoGKI0zLWmhut1kUsgkrPCkwjiDhO1aqA iqrclvzJgFhQeWz9jCesjj7lmZIB7VmBaQTHo1rPFL1Qyz8eXTfzEVABsUlNoIDYqG6vVqJkgbCx ZNjpG+hh15AMYsFZdCVUrdslTyEhseWPBSAW1Dz2/NwnQ618xff6fWcFpEd+l8MRr5FvZniRrX5j zfNznwCNLX9rVbAClEdzC0Idec6YvIda27MC3YlU0UdkJOdHtvy8UljgTH+Tz5QAREHN938/sMFa e7ZgVIyvKD0RdBkaq7qKFfEUhDCsnrF2XelF9w6ZSACQuII162Y/GtrhRZ4UfRWJtBcPdA3SXKlI 5EnRj7SyeO1zr1oTm/4WDncw1XM+Yt6Bm2/JebPOGYu21gG/HbWDPew6Wuo7kXrgzcjVoi23rXlm 9jlpv5/GyxAZi+CAbV/LeYOnjEVbQxEMgkksQU8I2UALH4pVJMqZGcFYNPSN1esGTwV0IvLhZbeG iQVk9boZH6nboeW+V/IVEVWN4iKZnkvIAJJRH6d6I0XEN8WgbodvWr1uxikg0Y7Ih8kVZwmgxx24 Zb5v8tegmou01uISoGcN2o10v8e/h0b6AoTQRrVFq9fNupHG0RU7xiRJc+7g2AM2HOVL4WbPFN5Q t0OKEKF44w5L7glhCtGwukk5vaoFMYGZKaEd+W8lPG/1M7O+tyOfPx47QZa74OH7r5s1YGZeZcQ/ 30ifH9rhhhDG660nhlcGaVcb864IFsV4pt9YrdWstV+qbtv0mae2vnbrZMmHna7PXWZgmQU4br9t BxuPS8F80DdFL9QRUBvhzkgwOsG1e4KYHCaadrvdO1i3h8fzjBSxtoqKfjsatVetfXHmz+NPT5r8 +Lo73TxXMB9/yfGv2XgIXnA+ou/1TP9MQYi0ilIHlSi+Ddm179qjoclgQjBCgCcFQKnb8gZR+7BV /cqa9bN/EL/d4KL9nQrMd4MUTa0jwNFzN+yTG+ibp8qxEB0Csq+RvCfiAxGqkStH6eGPQjCIeICH 6hhW65FiX1D0P0TM42Pl2reeeOnVf3Dvbh2QO/9duw01sErg5Ch55cgDt8zMW+8vReqHIt6foLq3 CvsIlBq7b3oGoQW2Ye0F0BFUNoA8a0V/Y6z3s6qJnn7qmVlbm59Y6cFJuqvEJ/h/wDFwS11zQ3QA AAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDEtMDhUMTY6NDk6NDcrMDA6MDCh3oIyAAAAJXRFWHRk YXRlOm1vZGlmeQAyMDIzLTAxLTA4VDE2OjQ5OjQ3KzAwOjAw0IM6jgAAACh0RVh0ZGF0ZTp0aW1l c3RhbXAAMjAyMy0wMS0wOFQxNjo0OTo0NyswMDowMIeWG1EAAAAASUVORK5CYII=\"/></svg>"
};

var sequence = {
  identityFlag: WalletIdentityFlag.Sequence,
  label: WalletLabel.Sequence,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 31 25\"><g clip-path=\"url(#a)\"><path fill=\"#111\" d=\"M0 5.208V19.3c0 2.876 2.325 5.208 5.194 5.208h20.163c2.868 0 5.194-2.332 5.194-5.208V5.208C30.55 2.332 28.224 0 25.357 0H5.194C2.325 0 0 2.332 0 5.208Z\"/><path fill=\"url(#b)\" d=\"M0 5.208V19.3c0 2.876 2.325 5.208 5.194 5.208h20.163c2.868 0 5.194-2.332 5.194-5.208V5.208C30.55 2.332 28.224 0 25.357 0H5.194C2.325 0 0 2.332 0 5.208Z\"/><path fill=\"url(#c)\" d=\"M7.638 6.127A1.53 1.53 0 0 0 6.11 4.595a1.53 1.53 0 0 0-1.527 1.532A1.53 1.53 0 0 0 6.11 7.659a1.53 1.53 0 0 0 1.528-1.532Z\"/><path fill=\"url(#d)\" d=\"M7.638 6.127A1.53 1.53 0 0 0 6.11 4.595a1.53 1.53 0 0 0-1.527 1.532A1.53 1.53 0 0 0 6.11 7.659a1.53 1.53 0 0 0 1.528-1.532Z\"/><path fill=\"url(#e)\" d=\"M7.638 6.127A1.53 1.53 0 0 0 6.11 4.595a1.53 1.53 0 0 0-1.527 1.532A1.53 1.53 0 0 0 6.11 7.659a1.53 1.53 0 0 0 1.528-1.532Z\"/><path fill=\"url(#f)\" d=\"M7.638 18.371a1.53 1.53 0 0 0-1.528-1.532 1.53 1.53 0 0 0-1.527 1.532 1.53 1.53 0 0 0 1.527 1.532 1.53 1.53 0 0 0 1.528-1.532Z\"/><path fill=\"url(#g)\" d=\"M25.968 12.254a1.53 1.53 0 0 0-1.528-1.532 1.53 1.53 0 0 0-1.527 1.532 1.53 1.53 0 0 0 1.527 1.532 1.53 1.53 0 0 0 1.528-1.532Z\"/><path fill=\"url(#h)\" d=\"M25.968 12.254a1.53 1.53 0 0 0-1.528-1.532 1.53 1.53 0 0 0-1.527 1.532 1.53 1.53 0 0 0 1.527 1.532 1.53 1.53 0 0 0 1.528-1.532Z\"/><path fill=\"url(#i)\" d=\"M24.44 4.595H12.22a1.53 1.53 0 0 0-1.527 1.532 1.53 1.53 0 0 0 1.527 1.532h12.22a1.53 1.53 0 0 0 1.528-1.532 1.53 1.53 0 0 0-1.528-1.532Z\"/><path fill=\"url(#j)\" d=\"M24.44 16.84H12.22a1.53 1.53 0 0 0-1.527 1.531 1.53 1.53 0 0 0 1.527 1.532h12.22a1.53 1.53 0 0 0 1.528-1.532 1.53 1.53 0 0 0-1.528-1.532Z\"/><path fill=\"url(#k)\" d=\"M18.33 10.722H6.11a1.53 1.53 0 0 0-1.527 1.532 1.53 1.53 0 0 0 1.527 1.532h12.22a1.53 1.53 0 0 0 1.528-1.532 1.53 1.53 0 0 0-1.528-1.532Z\"/></g><defs><linearGradient id=\"b\" x1=\"15.275\" x2=\"15.275\" y1=\"0\" y2=\"24.533\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#1D273D\"/><stop offset=\"1\" stop-color=\"#0D0F13\"/></linearGradient><linearGradient id=\"c\" x1=\"5.053\" x2=\"7.136\" y1=\"7.638\" y2=\"4.86\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#4462FE\"/><stop offset=\"1\" stop-color=\"#7D69FA\"/></linearGradient><linearGradient id=\"d\" x1=\"4.851\" x2=\"7.417\" y1=\"7.66\" y2=\"7.529\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#3757FD\"/><stop offset=\"1\" stop-color=\"#6980FA\"/></linearGradient><linearGradient id=\"e\" x1=\"4.851\" x2=\"7.417\" y1=\"7.66\" y2=\"7.529\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#2447FF\"/><stop offset=\"1\" stop-color=\"#6980FA\"/></linearGradient><linearGradient id=\"f\" x1=\"5.015\" x2=\"7.059\" y1=\"19.403\" y2=\"17.243\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#BC3EE6\"/><stop offset=\"1\" stop-color=\"#D972F1\"/></linearGradient><linearGradient id=\"g\" x1=\"23.53\" x2=\"25.42\" y1=\"13.269\" y2=\"11.264\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#29BDFF\"/><stop offset=\"1\" stop-color=\"#96E7FB\"/></linearGradient><linearGradient id=\"h\" x1=\"23.158\" x2=\"25.811\" y1=\"13.764\" y2=\"13.638\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#23BBFF\"/><stop offset=\"1\" stop-color=\"#85E7FF\"/></linearGradient><linearGradient id=\"i\" x1=\"11.919\" x2=\"24.494\" y1=\"7.638\" y2=\"4.629\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#23BBFF\"/><stop offset=\"1\" stop-color=\"#85E7FF\"/></linearGradient><linearGradient id=\"j\" x1=\"12.035\" x2=\"24.109\" y1=\"19.904\" y2=\"16.818\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#2447FF\"/><stop offset=\"1\" stop-color=\"#6980FA\"/></linearGradient><linearGradient id=\"k\" x1=\"6.635\" x2=\"18.168\" y1=\"13.809\" y2=\"10.723\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#6634FF\"/><stop offset=\"1\" stop-color=\"#9C6DFF\"/></linearGradient><clipPath id=\"a\"><path fill=\"#fff\" d=\"M0 0h30.55v24.508H0z\"/></clipPath></defs></svg>"
};

var status = {
  identityFlag: WalletIdentityFlag.Status,
  label: WalletLabel.Status,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 2000 2000\"><circle cx=\"1000\" cy=\"1000\" r=\"1000\" fill=\"#5b6dee\"/><path fill=\"#fff\" d=\"M831.27 938.79a571.5 571.5 0 0 0-104 8.95c28.25-261.28 246-459.12 505.24-459.1 158.73 0 267.49 77.72 267.49 238.64s-130.54 238.64-321 238.64c-140.58-.01-207.13-27.13-347.73-27.13m-10.27 95.3c-190.45 0-321 77.72-321 238.64s108.76 238.64 267.49 238.64c259.27 0 477-197.82 505.24-459.1a571.5 571.5 0 0 1-104 8.95c-140.6-.01-207.15-27.13-347.73-27.13\"/></svg>"
};

var tallywallet = {
  identityFlag: WalletIdentityFlag.Tally,
  label: WalletLabel.Tally,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 40 40\"><circle cx=\"20\" cy=\"20\" r=\"20\" fill=\"#D08E39\"/><path fill=\"#002522\" d=\"m33.495 12.219-1.74-.102a.523.523 0 0 1-.486-.472l-.153-1.609a.116.116 0 0 0-.114-.096.116.116 0 0 0-.115.096l-.156 1.609a.516.516 0 0 1-.487.472l-1.74.11a.116.116 0 0 0 0 .228l1.74.102a.526.526 0 0 1 .487.472l.153 1.609a.116.116 0 0 0 .229 0l.152-1.61a.523.523 0 0 1 .487-.471l1.743-.11a.116.116 0 0 0 0-.228Z\"/><path fill=\"#002522\" fill-rule=\"evenodd\" d=\"m29.838 18.247.287.204c.253.171.451.412.57.694.057.157.08.326.066.494a2.984 2.984 0 0 1-.334 1.115c-.065.117-.14.229-.222.333l-.04.055.05.323c.017.13.025.259.026.389a3.533 3.533 0 0 1-1.275 2.695l-.047.04-.058.018c-.508.182-1.029.325-1.558.428a6.809 6.809 0 0 1-1.645.142H25.578a16.4 16.4 0 0 0-3.356-.69c-.072-.007-.146-.012-.22-.018a8.065 8.065 0 0 1-.68-.073 4.848 4.848 0 0 1-.905-.232 4.994 4.994 0 0 0-1.583-.276h-.018a2.107 2.107 0 0 0-.265 1.67c.139.706.384 1.387.726 2.02.393.665.744 1.354 1.053 2.062.167.376.289.77.363 1.173.079.44.046.894-.094 1.319l-.178.504-.432-.32a1.266 1.266 0 0 0-.207-.119 5.904 5.904 0 0 1-.145.726 5.086 5.086 0 0 1-.52 1.188c-.296-2.358-1.945-3.034-3.557-3.694-.722-.296-1.436-.588-2.018-1.027-1.88-1.42-2.033-3.08-.871-5.985.355-.894.613-1.823.77-2.771a9.352 9.352 0 0 1 .138-.723l.032-.149c.005.096.007.19.01.286.007.23.013.458.041.684.018.308.079.613.182.904.047.124.117.237.207.334.026.03.054.056.087.087l.076.073c.048.055.1.106.156.152.232.177.489.317.763.414.58.203 1.183.332 1.794.385.589.07 1.188.095 1.79.095h.091a5.81 5.81 0 0 1 1.838.312 5.55 5.55 0 0 0 1.638.29c1.172.114 2.33.349 3.454.702.479.012.958-.03 1.427-.128.334-.065.665-.156.992-.254.73-.308 1.212-1.144.225-1.035a4.9 4.9 0 0 0-.694.098 3.337 3.337 0 0 0-.544.168 5.168 5.168 0 0 1-.545.177 2.423 2.423 0 0 1-1.22-.029 3.518 3.518 0 0 0-1.09-.258c.174-.1.37-.158.57-.17.144-.015.273-.01.398-.005.06.002.12.005.18.005.34.043.685.028 1.02-.044.17-.048.342-.141.528-.242.15-.08.309-.166.482-.237.378-.16.784-.245 1.194-.25h.247c.287-.4.53-.843.436-1.207a.93.93 0 0 0-.443-.323 4.396 4.396 0 0 0-.257-.07c-.432-.113-1.226-.32-1.537-.605-.232-.236-.095-.712.857-.908.438-.076.884-.09 1.326-.04a.875.875 0 0 0 .45-.04l-.054-.047-.276-.197-.28-.21-1.09-.832a9.413 9.413 0 0 0-.54-.385l-.088-.05-.17-.073a4.555 4.555 0 0 1-1.296-.843c-1.065-.893-2.257-3.05-2.569-3.755a2.437 2.437 0 0 0-1.235-1.213 1.762 1.762 0 0 1 1.428.603c.091.076.262.323.468.621.416.603.977 1.415 1.322 1.449.186-.007.37-.035.549-.084a4.06 4.06 0 0 1-.469-.537 6.548 6.548 0 0 1-.47-.746 16.26 16.26 0 0 0-.144-.25 4.684 4.684 0 0 0-.577-.856 1.815 1.815 0 0 0-.164-.153 1.172 1.172 0 0 0-.192-.116 4.942 4.942 0 0 0-.49-.214 5.854 5.854 0 0 1-.552-.236l-.509-.255-1.017-.494c-.67-.322-1.36-.602-2.066-.838a10.67 10.67 0 0 0-2.15-.469 4.693 4.693 0 0 0-.523-.04.883.883 0 0 0-.407.087c-.067.03-.135.066-.21.105-.09.049-.19.101-.302.15l-.505.232c-.656.33-1.283.717-1.874 1.155-.475.31-.895.698-1.242 1.147a4.074 4.074 0 0 1 1.515.218 6.217 6.217 0 0 0-1.932.276c-.307.091-.606.203-.897.335a5.732 5.732 0 0 0-.84.435 3.697 3.697 0 0 0-.726.549.897.897 0 0 0-.203.316c-.062.134-.12.283-.174.432-.21.611-.378 1.236-.502 1.87a14.919 14.919 0 0 0-.29 3.843 7.39 7.39 0 0 0 .795 2.985c.447-.585.883-1.184 1.304-1.79a31.891 31.891 0 0 0 1.507-2.423c.24-.429.45-.877.664-1.33.195-.415.392-.834.615-1.245.225-.44.489-.86.788-1.253.154-.203.333-.386.533-.545.198-.164.442-.262.698-.28-.814.73-1.45 2.692-2.078 4.89-.512 1.782-2.237 5.85-3.326 5.948-.425.025-.578-.178-.868-.592l-.236-.327a6.508 6.508 0 0 1-.945-1.917 9.606 9.606 0 0 1-.345-2.063 14.417 14.417 0 0 1 .048-2.06c.075-.678.19-1.35.345-2.015.151-.667.35-1.322.592-1.961.065-.16.13-.32.21-.483.044-.092.094-.18.15-.265.06-.086.128-.166.203-.24a3.84 3.84 0 0 1 .89-.632c.54-.28 1.118-.477 1.717-.585.168-.374.4-.716.683-1.013.277-.288.578-.552.9-.788a10.712 10.712 0 0 1 1.936-1.238c.167-.084.385-.182.53-.244.072-.03.146-.069.227-.111.085-.045.178-.093.282-.14.218-.102.456-.154.697-.152.203.003.406.017.607.044.78.088 1.55.256 2.295.5.734.245 1.453.537 2.15.872l1.031.502.512.254c.114.061.258.117.412.177l.086.034c.185.072.36.148.548.243.103.051.201.11.294.178.09.072.176.151.255.236.279.3.523.632.726.988l.025.042c.375.652.724 1.258 1.264 1.614l.433.287v.047l-.12.214-.4.102a.305.305 0 0 0-.178.145.271.271 0 0 0-.032.113 2.212 2.212 0 0 0 0 .236c0 .123-.018.245-.055.363-.019.065-.04.12-.058.168a1.228 1.228 0 0 0-.033.09.204.204 0 0 0 0 .16c.284.294.614.539.977.726.091.05.185.094.284.138l.148.058c.075.034.147.074.215.12.193.122.352.242.518.367l.063.047 1.09.835.268.203Zm-9.453-2.302a1.451 1.451 0 0 1-.28 0c-.625-.036-.93-.465-.828-.904.102-.44.04-.585-.084-.585a.933.933 0 0 0-.468.363H18.7a.045.045 0 0 1-.037-.01.043.043 0 0 1-.014-.036c.13-.913.664-.953.9-.953.72.054 1.435.176 2.132.364.02.003.04.012.054.026a.102.102 0 0 1-.014.159.776.776 0 0 0-.247.744c.044.429-.465.763-1.09.832Z\" clip-rule=\"evenodd\"/></svg>"
};

var tokenary = {
  identityFlag: WalletIdentityFlag.Tokenary,
  label: WalletLabel.Tokenary,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" viewBox=\"0 0 230 230\"><path fill=\"#fff\" d=\"M134 231H1V1h230v230h-97m67.846-23.608c11.456-9.659 16.087-22.31 16.117-36.94.04-19.492.162-38.986 0-58.477-.172-20.608.073-41.257-1.167-61.81-1.29-21.394-20.286-37.788-42.788-38.119-36.432-.536-72.878-.295-109.315-.023-7.615.057-15.576.537-22.756 2.796-17.811 5.604-29.775 21.728-29.862 43.035-.155 38.152-.162 76.306.088 114.456.036 5.49 1.109 11.233 2.965 16.406 6.501 18.116 22.611 29.028 43.214 29.147 37.82.219 75.642.176 113.462-.013 10.8-.054 20.976-2.8 30.042-10.458z\"/><path fill=\"#FEFEFF\" d=\"M201.575 207.625c-8.795 7.424-18.972 10.171-29.771 10.225-37.82.19-75.642.232-113.462.013-20.603-.12-36.713-11.03-43.214-29.147-1.856-5.173-2.929-10.915-2.965-16.406-.25-38.15-.243-76.304-.088-114.456.087-21.307 12.051-37.43 29.862-43.035 7.18-2.259 15.141-2.739 22.756-2.796 36.437-.272 72.883-.513 109.315.023 22.502.331 41.498 16.725 42.788 38.12 1.24 20.552.995 41.2 1.166 61.809.163 19.491.041 38.985.001 58.478-.03 14.63-4.661 27.28-16.388 37.172M50.505 102.124c-.221 1.48-.461 2.956-.66 4.438-5.133 38.15 24.33 73.126 62.572 74.282 40.924 1.236 72.585-33.404 67.74-74.117-3.736-31.41-30.233-56.048-61.901-57.561-32.175-1.538-60.877 20.625-67.751 52.958z\"/><path fill=\"#2D7DF5\" d=\"M50.617 101.716c6.762-31.925 35.464-54.088 67.639-52.55 31.668 1.513 58.165 26.152 61.902 57.56 4.844 40.714-26.817 75.354-67.74 74.118-38.242-1.156-67.706-36.131-62.573-74.282.199-1.482.439-2.959.772-4.846z\"/></svg>"
};

var tokenpocket = {
  identityFlag: WalletIdentityFlag.TokenPocket,
  label: WalletLabel.TokenPocket,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 1024 1024\"><path fill=\"#2980FE\" d=\"M1041.52 0H-27v1024h1068.52V0Z\"/><g clip-path=\"url(#a)\"><path fill=\"#29AEFF\" d=\"M406.796 438.643h.131c-.131-.786-.131-1.703-.131-2.489v2.489Z\"/><path fill=\"#fff\" d=\"M667.602 463.533H523.249v260.543c0 12.313 9.955 22.269 22.268 22.269h99.816c12.314 0 22.269-9.956 22.269-22.269V463.533ZM453.563 277H190.269C177.955 277 168 286.955 168 299.269v90.384c0 12.314 9.955 22.269 22.269 22.269H275.021V724.731c0 12.314 9.955 22.269 22.268 22.269h94.839c12.313 0 22.268-9.955 22.268-22.269V411.922h38.774c37.202 0 67.461-30.259 67.461-67.461.393-37.202-29.866-67.461-67.068-67.461Z\"/><path fill=\"url(#b)\" d=\"M667.735 463.533V645.35c4.978 1.179 10.086 2.096 15.326 2.882 7.336 1.048 14.933 1.703 22.531 1.834h1.31V505.45c-21.876-1.441-39.167-19.649-39.167-41.917Z\"/><path fill=\"#fff\" d=\"M709.781 277c-102.959 0-186.532 83.573-186.532 186.533 0 88.551 61.697 162.692 144.484 181.817V463.533c0-23.186 18.863-42.049 42.048-42.049 23.186 0 42.049 18.863 42.049 42.049 0 19.518-13.23 35.892-31.307 40.607a41.665 41.665 0 0 1-10.742 1.441v144.485c3.668 0 7.205-.131 10.742-.262 97.982-5.633 175.791-86.848 175.791-186.271C896.445 360.573 812.872 277 709.781 277Z\"/><path fill=\"#fff\" d=\"M709.78 650.066V505.581c-1.047 0-1.964 0-3.012-.131v144.616h3.012Z\"/></g><defs><linearGradient id=\"b\" x1=\"709.844\" x2=\"667.753\" y1=\"556.827\" y2=\"556.827\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#fff\"/><stop offset=\".967\" stop-color=\"#fff\" stop-opacity=\".323\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\".3\"/></linearGradient><clipPath id=\"a\"><path fill=\"#fff\" d=\"M168 277h728.448v470H168z\"/></clipPath></defs></svg>"
};

var tp = {
  identityFlag: WalletIdentityFlag.TP,
  label: WalletLabel.TP,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" fill=\"none\" viewBox=\"0 0 202 201\"><path fill=\"url(#a)\" d=\"M.1.303h201v200H.1z\"/><defs><pattern id=\"a\" width=\"1\" height=\"1\" patternContentUnits=\"objectBoundingBox\"><use xlink:href=\"#b\" transform=\"scale(.00498)\"/></pattern><image xlink:href=\"data:image/png;base64,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\" id=\"b\" width=\"201\" height=\"200\"/></defs></svg>"
};

var trust = {
  identityFlag: WalletIdentityFlag.Trust,
  label: WalletLabel.Trust,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\"><path fill=\"#3375bb\" fill-rule=\"evenodd\" d=\"M1.363 6.825C0 9.5 0 13 0 20s0 10.5 1.363 13.175a12.536 12.536 0 0 0 5.462 5.462C9.5 40 13 40 20 40s10.5 0 13.175-1.363a12.536 12.536 0 0 0 5.462-5.462C40 30.5 40 27 40 20s0-10.5-1.363-13.175a12.536 12.536 0 0 0-5.462-5.462C30.5 0 27 0 20 0S9.5 0 6.825 1.363a12.536 12.536 0 0 0-5.462 5.462zm28.618 3.962c.35 0 .682.144.925.388.244.25.382.588.375.931-.062 3.725-.206 6.575-.475 8.831-.262 2.257-.656 3.932-1.25 5.288a8.37 8.37 0 0 1-1.475 2.294c-.781.844-1.675 1.456-2.65 2.037-.417.25-.85.496-1.305.754-.97.55-2.036 1.156-3.245 1.965a1.293 1.293 0 0 1-1.443 0c-1.228-.818-2.308-1.431-3.287-1.986l-.638-.364c-1.144-.662-2.175-1.294-3.075-2.206a7.841 7.841 0 0 1-1.532-2.2c-.562-1.163-.943-2.569-1.225-4.388-.375-2.431-.562-5.612-.631-10.025a1.304 1.304 0 0 1 .369-.93c.244-.245.581-.389.931-.389h.538c1.656.007 5.312-.156 8.475-2.618a1.304 1.304 0 0 1 1.593 0c3.163 2.462 6.82 2.625 8.482 2.618zm-2.906 14.607c.406-.838.744-1.994 1-3.657.306-1.987.494-4.687.581-8.362-1.95-.056-5.3-.431-8.493-2.581-3.194 2.143-6.544 2.519-8.488 2.581.069 3.038.206 5.4.425 7.256.25 2.113.606 3.544 1.05 4.55.294.669.619 1.15 1.006 1.575.52.57 1.175 1.038 2.07 1.575.37.223.779.454 1.223.706.793.449 1.7.962 2.714 1.607.994-.634 1.888-1.143 2.672-1.588l.678-.387c1.1-.632 1.912-1.156 2.518-1.769a5.53 5.53 0 0 0 1.044-1.506z\"/></svg>"
};

var walletio = {
  identityFlag: WalletIdentityFlag.WalletIo,
  label: WalletLabel.WalletIo,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1025 1024\"><defs><linearGradient id=\"a\" x1=\"0%\" x2=\"100%\" y1=\"100%\" y2=\"0%\"><stop offset=\"0%\" stop-color=\"#1550FF\"/><stop offset=\"100%\" stop-color=\"#0D8DFF\"/></linearGradient></defs><g fill=\"none\" fill-rule=\"evenodd\"><rect width=\"1024\" height=\"1024\" fill=\"url(#a)\" rx=\"192\"/><g fill=\"#FFF\" fill-rule=\"nonzero\"><path d=\"m873.739 511.885-78.081 82.858c-10.617 11.266-28.357 11.793-39.623 1.176a28.03 28.03 0 0 1-3.25-3.648l-81.649-109.54c-8.13-10.906-7.255-26.075 2.074-35.975l78.081-82.857c10.617-11.267 28.357-11.793 39.624-1.176a28.03 28.03 0 0 1 3.25 3.648l81.648 109.54c8.13 10.906 7.255 26.075-2.074 35.974Z\"/><path d=\"m728.491 666.368-78.08 82.857c-10.618 11.267-28.358 11.793-39.624 1.176a28.03 28.03 0 0 1-3.25-3.648L410.22 482.033c-8.13-10.907-7.255-26.076 2.074-35.975l78.081-82.858c10.617-11.266 28.357-11.793 39.624-1.176a28.03 28.03 0 0 1 3.25 3.648l197.316 264.72c8.13 10.907 7.255 26.076-2.074 35.976Z\" opacity=\".75\"/><path d=\"m728.346 666.173-78.081 82.857c-10.617 11.267-28.357 11.793-39.623 1.176a28.03 28.03 0 0 1-3.25-3.648l-95.705-128.397 117.121-124.286L730.42 630.198c8.13 10.906 7.255 26.075-2.074 35.975Z\"/><path d=\"M270.683 365.94 468 630.66c8.13 10.907 7.255 26.076-2.075 35.976l-78.08 82.857c-10.618 11.267-28.358 11.793-39.624 1.176a28.03 28.03 0 0 1-3.25-3.648l-197.317-264.72c-8.13-10.907-7.255-26.076 2.075-35.976l78.08-82.857c10.618-11.267 28.358-11.793 39.624-1.176a28.03 28.03 0 0 1 3.25 3.648Z\" opacity=\".5\"/><path d=\"M366.569 494.58 468.18 630.903c8.13 10.907 7.255 26.076-2.074 35.976l-78.081 82.857c-10.617 11.267-28.357 11.793-39.624 1.176a28.03 28.03 0 0 1-3.25-3.648l-95.705-128.397L366.57 494.58Z\" opacity=\".5\"/></g></g></svg>"
};

var xdefi = {
  identityFlag: WalletIdentityFlag.XDEFI,
  label: WalletLabel.XDEFI,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><g fill=\"#000\" fill-rule=\"nonzero\"><path d=\"M19.017 17.867a16.131 16.131 0 0 1-9.063 2.116 8.874 8.874 0 0 1-6.476-2.763 6.929 6.929 0 0 1-1.371-5.606 7.214 7.214 0 0 1 .659-2.123l.045-.092a14.274 14.274 0 0 1 4.957-5.387 14.528 14.528 0 0 1 14.219-.784 14.329 14.329 0 0 1 5.532 4.807 14.069 14.069 0 0 1 1.033 14.036 14.258 14.258 0 0 1-4.77 5.547 14.489 14.489 0 0 1-6.925 2.481l.152 1.728a16.258 16.258 0 0 0 7.774-2.787 16 16 0 0 0 5.357-6.227A15.788 15.788 0 0 0 28.977 7.06a16.08 16.08 0 0 0-6.214-5.393 16.3 16.3 0 0 0-15.962.9 16.016 16.016 0 0 0-5.555 6.051l-.061.124a8.9 8.9 0 0 0-.815 2.635 8.662 8.662 0 0 0 1.752 6.961 10.482 10.482 0 0 0 7.73 3.388 17.741 17.741 0 0 0 10.83-2.869l-1.665-.99z\"/><path d=\"M22.373 19.833a18.979 18.979 0 0 1-11.463 4.194c-6.891.376-9.764-1.837-9.79-1.86l-.556.678.56-.666L0 23.511c.122.1 2.876 2.3 9.345 2.3.53 0 1.086 0 1.665-.045 7.44-.41 11.528-3.618 12.952-4.988l-1.589-.945z\"/><path d=\"M25.36 21.624a12.79 12.79 0 0 1-3.429 3.087c-4.663 2.974-10.594 3.358-14.747 3.151L7.1 29.6c.7.034 1.368.05 2.019.05 11.71 0 16.442-5.272 17.764-7.154l-1.524-.885m-.445-6.555a1.389 1.389 0 1 0-1.406-1.389 1.4 1.4 0 0 0 1.406 1.39z\"/></g></svg>"
};

var zeal = {
  identityFlag: WalletIdentityFlag.Zeal,
  label: WalletLabel.Zeal,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" fill=\"#0FF\" rx=\"10.333\"/><path fill=\"#0B1821\" d=\"M7.44 24.56h17.12v-7.704H10.864A3.424 3.424 0 0 0 7.44 20.28v4.28ZM24.56 7.44H7.44v7.704h13.696a3.424 3.424 0 0 0 3.424-3.424V7.44Z\"/></svg>"
};

var zerion = {
  identityFlag: WalletIdentityFlag.Zerion,
  label: WalletLabel.Zerion,
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 512 512\"><path fill=\"#2962EF\" d=\"M0 140.8c0-49.285 0-73.927 9.591-92.751A88 88 0 0 1 48.05 9.59C66.873 0 91.515 0 140.8 0h230.4c49.285 0 73.927 0 92.751 9.591a88.004 88.004 0 0 1 38.458 38.458C512 66.873 512 91.515 512 140.8v230.4c0 49.285 0 73.927-9.591 92.751a88.007 88.007 0 0 1-38.458 38.458C445.127 512 420.485 512 371.2 512H140.8c-49.285 0-73.927 0-92.751-9.591A88.004 88.004 0 0 1 9.59 463.951C0 445.127 0 420.485 0 371.2V140.8Z\"/><path fill=\"#fff\" d=\"M111.048 128c-8.774 0-12.155 10.85-4.792 15.382l184.187 111.059c4.591 2.826 10.714 1.709 13.876-2.532l80.982-106.315c5.506-7.386-.057-17.594-9.588-17.594H111.048ZM400.538 384c8.773 0 12.242-10.908 4.881-15.439L221.178 257.516c-4.591-2.826-10.566-1.568-13.726 2.672l-81.14 106.294c-5.504 7.384.233 17.518 9.762 17.518h264.464Z\"/></svg>"
};

var wallets = [alphawallet, atoken, binance, bitkeep, bitpie, bitski, blockwallet, brave, coinbase, core, dcent, defiwallet, enkrypt, exodus, frame, frontier, gamestop, huobiwallet, hyperpay, imtoken, liquality, mathwallet, meetone, metamask, mykey, okxwallet, oneInch, opera, ownbit, phantom, rabby, rainbow, safepal, sequence, status, tallywallet, tokenary, tokenpocket, tp, trust, walletio, xdefi, zeal, zerion];

var defaultWallet = {
  label: 'Browser wallet',
  icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 27 27\"><path stroke=\"#1B2030\" d=\"M1 8.14286H26M7 12H20.0952V21.5238H7V12ZM7 12H19V11H7V12ZM20.5 4L23 6.5M23 4L20.5 6.5M15 6H13M4 26H23C24.6569 26 26 24.6569 26 23V4C26 2.34315 24.6569 1 23 1H4C2.34315 1 1 2.34315 1 4V23C1 24.6569 2.34315 26 4 26ZM18 17C18 17.5523 17.5523 18 17 18C16.4477 18 16 17.5523 16 17C16 16.4477 16.4477 16 17 16C17.5523 16 18 16.4477 18 17ZM16.5 4H19V6.5H16.5V4Z\"/></svg>"
};

function getBrowserWalletLabelAndIcon() {
  var defaultBrowserWallet = {
    label: defaultWallet.label,
    icon: defaultWallet.icon
  };

  if (typeof window !== 'undefined') {
    if (!!window.ethereum) {
      var userBrowserWallets = wallets.filter(function (wallet) {
        return !!window.ethereum[wallet.identityFlag];
      });

      if (userBrowserWallets.length > 1 || userBrowserWallets.length === 0) {
        return defaultBrowserWallet;
      } else {
        return {
          label: userBrowserWallets[0].label,
          icon: userBrowserWallets[0].icon
        };
      }
    } else {
      return defaultBrowserWallet;
    }
  } else {
    return defaultBrowserWallet;
  }
}

var ImpersonatedProvider = /*#__PURE__*/function (_providers$JsonRpcPro) {
  _inheritsLoose(ImpersonatedProvider, _providers$JsonRpcPro);

  function ImpersonatedProvider(url) {
    var _this;

    _this = _providers$JsonRpcPro.call(this, url) || this;
    _this.copyProvider = new ethers.providers.JsonRpcProvider(url);
    return _this;
  }

  var _proto = ImpersonatedProvider.prototype;

  _proto.getSigner = function getSigner(address) {
    return this.copyProvider.getUncheckedSigner(address);
  };

  return ImpersonatedProvider;
}(ethers.providers.JsonRpcProvider);
var ImpersonatedConnector = /*#__PURE__*/function (_Connector) {
  _inheritsLoose(ImpersonatedConnector, _Connector);

  function ImpersonatedConnector(actions, options) {
    var _this2;

    _this2 = _Connector.call(this, actions) || this;
    _this2.urls = options.urls;
    _this2.chainId = options.chainId;
    return _this2;
  }

  var _proto2 = ImpersonatedConnector.prototype;

  _proto2.activate = function activate(_ref) {
    var address = _ref.address,
        chainId = _ref.chainId;
    this.actions.startActivation();
    this.customProvider = new ImpersonatedProvider(this.urls[chainId || this.chainId][0]);
    this.actions.update({
      chainId: chainId || this.chainId,
      accounts: [address]
    });
  };

  return ImpersonatedConnector;
}(types.Connector);

var initAllConnectors = function initAllConnectors(props) {
  var projectId = props.wcProjectId;
  var chainIds = Object.keys(props.chains).map(Number);
  var metaMask = core$1.initializeConnector(function (actions) {
    return new metamask$1.MetaMask({
      actions: actions
    });
  });
  var walletConnect = null;

  if (projectId) {
    walletConnect = core$1.initializeConnector(function (actions) {
      return new walletconnectV2.WalletConnect({
        actions: actions,
        options: {
          projectId: projectId,
          chains: chainIds,
          showQrModal: true
        },
        onError: function onError(error) {
          console.error('walletconnect error', error);
        }
      });
    });
  }

  var coinbase = core$1.initializeConnector(function (actions) {
    return new coinbaseWallet.CoinbaseWallet({
      actions: actions,
      options: {
        url: props.chains[props.defaultChainId || chainIds[0]].urls[0],
        appName: props.appName
      }
    });
  });
  var gnosisSafe$1 = core$1.initializeConnector(function (actions) {
    return new gnosisSafe.GnosisSafe({
      actions: actions
    });
  });
  var impersonatedConnector = core$1.initializeConnector(function (actions) {
    return new ImpersonatedConnector(actions, {
      urls: props.urls,
      chainId: props.defaultChainId || chainIds[0]
    });
  });
  var connectors = [metaMask, coinbase, gnosisSafe$1, impersonatedConnector];

  if (walletConnect !== null) {
    connectors.push(walletConnect);
  }

  return connectors;
};
function getConnectorName(connector) {
  if (connector instanceof metamask$1.MetaMask) return 'Metamask';
  if (connector instanceof walletconnectV2.WalletConnect) return 'WalletConnect';
  if (connector instanceof coinbaseWallet.CoinbaseWallet) return 'Coinbase';
  if (connector instanceof gnosisSafe.GnosisSafe) return 'GnosisSafe';
  if (connector instanceof ImpersonatedConnector) return 'Impersonated';
  return;
}

function Child(_ref) {
  var useStore = _ref.useStore,
      connectors = _ref.connectors;

  var _useWeb3React = core$1.useWeb3React(),
      connector = _useWeb3React.connector,
      chainId = _useWeb3React.chainId,
      isActive = _useWeb3React.isActive,
      accounts = _useWeb3React.accounts,
      provider = _useWeb3React.provider;

  var setActiveWallet = useStore(function (state) {
    return state.setActiveWallet;
  });
  var setConnectors = useStore(function (state) {
    return state.setConnectors;
  });
  var disconnectActiveWallet = useStore(function (state) {
    return state.disconnectActiveWallet;
  });

  var _useState = React.useState(''),
      currentWalletType = _useState[0],
      setCurrentWalletType = _useState[1];

  React.useEffect(function () {
    if (connectors) {
      setConnectors(connectors);
    }
  }, [connectors]);
  React.useEffect(function () {
    var walletType = connector && getConnectorName(connector);

    if (walletType && accounts && isActive && provider) {
      setCurrentWalletType(walletType); // TODO: don't forget to change to different

      setActiveWallet({
        walletType: walletType,
        accounts: accounts,
        chainId: chainId,
        provider: provider,
        isActive: isActive,
        isContractAddress: false
      });
    } else if (currentWalletType !== walletType) {
      disconnectActiveWallet();
    }
  }, [isActive, chainId, provider, accounts]);
  return null;
}

function Web3Provider(_ref2) {
  var useStore = _ref2.useStore,
      connectorsInitProps = _ref2.connectorsInitProps;

  var _useState2 = React.useState(initAllConnectors(connectorsInitProps)),
      connectors = _useState2[0];

  var _useState3 = React.useState(connectors.map(function (connector) {
    return connector[0];
  })),
      mappedConnectors = _useState3[0];

  return React__default.createElement(core$1.Web3ReactProvider, {
    connectors: connectors
  }, React__default.createElement(Child, {
    useStore: useStore,
    connectors: mappedConnectors
  }));
}

var EthereumAdapter = function EthereumAdapter(get, set) {
  var _this = this;

  this.transactionsIntervalsMap = {};

  this.executeTx = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(params) {
      var activeWallet, chainId, type, tx, transaction, txPool;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              activeWallet = params.activeWallet, chainId = params.chainId, type = params.type;
              tx = params.tx; // ethereum tx

              transaction = {
                chainId: chainId,
                hash: tx.hash,
                type: type,
                payload: params.payload,
                from: tx.from,
                to: tx.to,
                nonce: tx.nonce
              };
              txPool = _this.get().addTXToPool(transaction, activeWallet.walletType);

              _this.waitForTxReceipt(tx, tx.hash);

              return _context.abrupt("return", txPool[tx.hash]);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();

  this.startTxTracking = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(txKey) {
      var retryCount, txData, provider, i, tx;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              retryCount = 5;
              txData = _this.get().transactionsPool[txKey];

              if (!txData) {
                _context2.next = 21;
                break;
              }

              provider = _this.get().providers[txData.chainId];

              if (!txData.hash) {
                _context2.next = 19;
                break;
              }

              i = 0;

            case 6:
              if (!(i < retryCount)) {
                _context2.next = 17;
                break;
              }

              _context2.next = 9;
              return provider.getTransaction(txData.hash);

            case 9:
              tx = _context2.sent;

              if (!tx) {
                _context2.next = 14;
                break;
              }

              _context2.next = 13;
              return _this.waitForTxReceipt(tx, txData.hash);

            case 13:
              return _context2.abrupt("return");

            case 14:
              i++;
              _context2.next = 6;
              break;

            case 17:
              _context2.next = 19;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 3000);
              });

            case 19:
              _context2.next = 21;
              break;

            case 21:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  this.waitForTxReceipt = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(tx, txHash) {
      var chainId, provider, txn, updatedTX, txBlock, timestamp;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              chainId = tx.chainId || _this.get().transactionsPool[txHash].chainId;
              provider = _this.get().providers[chainId];
              _context3.prev = 2;
              _context3.next = 5;
              return tx.wait();

            case 5:
              txn = _context3.sent;

              _this.updateTXStatus(txHash, txn.status);

              updatedTX = _this.get().transactionsPool[txHash];
              _context3.next = 10;
              return provider.getBlock(txn.blockNumber);

            case 10:
              txBlock = _context3.sent;
              timestamp = txBlock.timestamp;

              _this.get().txStatusChangedCallback(_extends({}, updatedTX, {
                timestamp: timestamp
              }));

              _context3.next = 18;
              break;

            case 15:
              _context3.prev = 15;
              _context3.t0 = _context3["catch"](2);
              console.log(_context3.t0);

            case 18:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[2, 15]]);
    }));

    return function (_x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  }();

  this.updateTXStatus = function (hash, status) {
    _this.set(function (state) {
      return immer.produce(state, function (draft) {
        draft.transactionsPool[hash].status = status;
        draft.transactionsPool[hash].pending = false;
      });
    });

    setLocalStorageTxPool(_this.get().transactionsPool);
  };

  this.get = get;
  this.set = set;
};

var GnosisAdapter = function GnosisAdapter(get, set) {
  var _this = this;

  this.transactionsIntervalsMap = {};

  this.executeTx = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(params) {
      var activeWallet, chainId, type, tx, transaction, txPool;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              activeWallet = params.activeWallet, chainId = params.chainId, type = params.type;
              tx = params.tx; // ethereum tx

              transaction = {
                chainId: chainId,
                hash: tx.hash,
                type: type,
                payload: params.payload,
                from: tx.from,
                to: tx.to,
                nonce: tx.nonce
              };
              txPool = _this.get().addTXToPool(transaction, activeWallet.walletType);

              _this.startTxTracking(tx.hash);

              return _context.abrupt("return", txPool[tx.hash]);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();

  this.startTxTracking = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(txKey) {
      var tx, isPending, newGnosisInterval;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              tx = _this.get().transactionsPool[txKey];
              isPending = tx.pending;

              if (isPending) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return");

            case 4:
              _this.stopPollingGnosisTXStatus(txKey);

              newGnosisInterval = setInterval(function () {
                _this.fetchGnosisTxStatus(txKey); // TODO: maybe change timeout or even stop tracking after some time (day/week)

              }, 10000);
              _this.transactionsIntervalsMap[txKey] = Number(newGnosisInterval);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  this.fetchGnosisTxStatus = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(txKey) {
      var tx, response, gnosisStatus, gnosisStatusModified, currentTime, daysPassed, isPending;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              tx = _this.get().transactionsPool[txKey];
              _context3.next = 3;
              return fetch(SafeTransactionServiceUrls[tx.chainId] + "/multisig-transactions/" + txKey + "/");

            case 3:
              response = _context3.sent;

              if (response.ok) {
                _context3.next = 7;
                break;
              }

              _context3.next = 21;
              break;

            case 7:
              _context3.next = 9;
              return response.json();

            case 9:
              gnosisStatus = _context3.sent;
              gnosisStatusModified = dayjs(gnosisStatus.modified);
              currentTime = dayjs(); // check if more than a day passed to stop polling

              daysPassed = currentTime.diff(gnosisStatusModified, 'day');

              if (!(daysPassed >= 1)) {
                _context3.next = 18;
                break;
              }

              _this.updateGnosisTxStatus(txKey, gnosisStatus, true);

              _this.stopPollingGnosisTXStatus(txKey);

              _this.get().txStatusChangedCallback(tx);

              return _context3.abrupt("return");

            case 18:
              isPending = !gnosisStatus.isExecuted;

              _this.updateGnosisTxStatus(txKey, gnosisStatus);

              if (!isPending) {
                _this.stopPollingGnosisTXStatus(txKey);

                _this.get().txStatusChangedCallback(tx);
              }

            case 21:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }();

  this.stopPollingGnosisTXStatus = function (txKey) {
    var currentInterval = _this.transactionsIntervalsMap[txKey];
    clearInterval(currentInterval);
    _this.transactionsIntervalsMap[txKey] = undefined;
  };

  this.updateGnosisTxStatus = function (txKey, statusResponse, forceStopped) {
    _this.set(function (state) {
      return immer.produce(state, function (draft) {
        var tx = draft.transactionsPool[txKey];
        tx.status = forceStopped ? 0 : +!!statusResponse.isSuccessful; // turns boolean | null to 0 or 1

        tx.pending = forceStopped ? false : !statusResponse.isExecuted;
        tx.nonce = statusResponse.nonce;
      });
    });

    setLocalStorageTxPool(_this.get().transactionsPool);
  };

  this.get = get;
  this.set = set;
};

function createTransactionsSlice(_ref) {
  var txStatusChangedCallback = _ref.txStatusChangedCallback,
      defaultProviders = _ref.defaultProviders;
  return function (set, get) {
    return {
      transactionsPool: {},
      transactionsIntervalsMap: {},
      providers: defaultProviders,
      txStatusChangedCallback: txStatusChangedCallback,
      gelatoAdapter: new GelatoAdapter(get, set),
      ethereumAdapter: new EthereumAdapter(get, set),
      executeTx: function () {
        var _executeTx = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref2) {
          var body, params, activeWallet, chainId, tx, args;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  body = _ref2.body, params = _ref2.params;
                  _context.next = 3;
                  return get().checkAndSwitchNetwork(params.desiredChainID);

                case 3:
                  activeWallet = get().activeWallet;

                  if (activeWallet) {
                    _context.next = 6;
                    break;
                  }

                  throw new Error('No wallet connected');

                case 6:
                  chainId = Number(params.desiredChainID);
                  _context.next = 9;
                  return body();

                case 9:
                  tx = _context.sent;
                  args = {
                    tx: tx,
                    payload: params.payload,
                    activeWallet: activeWallet,
                    chainId: chainId,
                    type: params.type
                  };
                  return _context.abrupt("return", isGelatoTx(tx) // in case of gnosis safe it works in a same way
                  ? get().gelatoAdapter.executeTx(args) : get().ethereumAdapter.executeTx(args));

                case 12:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function executeTx(_x) {
          return _executeTx.apply(this, arguments);
        }

        return executeTx;
      }(),
      addTXToPool: function addTXToPool(transaction, walletType) {
        var localTimestamp = new Date().getTime();

        if (isGelatoBaseTxWithoutTimestamp(transaction)) {
          set(function (state) {
            return immer.produce(state, function (draft) {
              draft.transactionsPool[transaction.taskId] = _extends({}, transaction, {
                pending: true,
                walletType: walletType,
                localTimestamp: localTimestamp
              });
            });
          });
          var _txPool = get().transactionsPool;
          setLocalStorageTxPool(_txPool);
        } else {
          set(function (state) {
            return immer.produce(state, function (draft) {
              draft.transactionsPool[transaction.hash] = _extends({}, transaction, {
                pending: true,
                walletType: walletType,
                localTimestamp: localTimestamp
              });
            });
          });
        }

        var txPool = get().transactionsPool;
        setLocalStorageTxPool(txPool);
        return txPool;
      },
      initTxPool: function initTxPool() {
        var localStorageTXPool = getLocalStorageTxPool();

        if (localStorageTXPool) {
          var transactionsPool = JSON.parse(localStorageTXPool); // TODO: figure out type casting from string via ZOD or similar

          set(function () {
            return {
              transactionsPool: transactionsPool
            };
          });
        }

        Object.values(get().transactionsPool).forEach(function (tx) {
          if (tx.pending) {
            if (isGelatoBaseTx(tx)) {
              get().gelatoAdapter.startTxTracking(tx.taskId);
            } else {
              if (tx.hash) {
                get().ethereumAdapter.startTxTracking(tx.hash);
              }
            }
          }
        });
      },
      setProvider: function setProvider(chainID, provider) {
        set(function (state) {
          return immer.produce(state, function (draft) {
            draft.providers[chainID] = provider;
          });
        });
      },
      isGelatoAvailable: true,
      checkIsGelatoAvailable: function () {
        var _checkIsGelatoAvailable = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(chainId) {
          var response, listOfRelays, isRelayAvailable;
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  _context2.next = 3;
                  return fetch("https://relay.gelato.digital/relays/v2");

                case 3:
                  response = _context2.sent;

                  if (response.ok) {
                    _context2.next = 8;
                    break;
                  }

                  set({
                    isGelatoAvailable: false
                  });
                  _context2.next = 13;
                  break;

                case 8:
                  _context2.next = 10;
                  return response.json();

                case 10:
                  listOfRelays = _context2.sent;
                  isRelayAvailable = !!listOfRelays.relays.find(function (id) {
                    return +id === chainId;
                  });
                  set({
                    isGelatoAvailable: isRelayAvailable
                  });

                case 13:
                  _context2.next = 19;
                  break;

                case 15:
                  _context2.prev = 15;
                  _context2.t0 = _context2["catch"](0);
                  set({
                    isGelatoAvailable: false
                  });
                  console.error(_context2.t0);

                case 19:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[0, 15]]);
        }));

        function checkIsGelatoAvailable(_x2) {
          return _checkIsGelatoAvailable.apply(this, arguments);
        }

        return checkIsGelatoAvailable;
      }(),
      updateEthAdapter: function updateEthAdapter(gnosis) {
        set(function (state) {
          return immer.produce(state, function (draft) {
            draft.ethereumAdapter = gnosis ? new GnosisAdapter(get, set) : new EthereumAdapter(get, set);
          });
        });
      }
    };
  };
}

function createWalletSlice(_ref) {
  var walletConnected = _ref.walletConnected,
      getChainParameters = _ref.getChainParameters;
  return function (set, get) {
    return {
      isContractWalletRecord: {},
      walletActivating: false,
      walletConnectionError: '',
      connectors: [],
      setConnectors: function () {
        var _setConnectors = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(connectors) {
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(get().connectors.length !== connectors.length)) {
                    _context.next = 5;
                    break;
                  }

                  set(function () {
                    return {
                      connectors: connectors
                    };
                  });
                  _context.next = 4;
                  return get().initDefaultWallet();

                case 4:
                  get().initTxPool();

                case 5:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function setConnectors(_x) {
          return _setConnectors.apply(this, arguments);
        }

        return setConnectors;
      }(),
      initDefaultWallet: function () {
        var _initDefaultWallet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
          var lastConnectedWallet;
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  lastConnectedWallet = localStorage.getItem(exports.LocalStorageKeys.LastConnectedWallet);

                  if (!lastConnectedWallet) {
                    _context2.next = 4;
                    break;
                  }

                  _context2.next = 4;
                  return get().connectWallet(lastConnectedWallet);

                case 4:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function initDefaultWallet() {
          return _initDefaultWallet.apply(this, arguments);
        }

        return initDefaultWallet;
      }(),
      connectWallet: function () {
        var _connectWallet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(walletType, txChainID) {
          var _get$activeWallet;

          var chainID, activeWallet, impersonatedAddress, connector, errorMessage;
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  chainID = txChainID;
                  activeWallet = get().activeWallet;

                  if (typeof txChainID === 'undefined' && activeWallet && activeWallet.chainId) {
                    if (activeWallet.chainId !== chainID) {
                      chainID = activeWallet.chainId;
                    }
                  }

                  if (!(((_get$activeWallet = get().activeWallet) == null ? void 0 : _get$activeWallet.walletType) !== walletType)) {
                    _context3.next = 6;
                    break;
                  }

                  _context3.next = 6;
                  return get().disconnectActiveWallet();

                case 6:
                  impersonatedAddress = get()._impersonatedAddress;
                  set({
                    walletActivating: true
                  });
                  set({
                    walletConnectionError: ''
                  });
                  connector = get().connectors.find(function (connector) {
                    return getConnectorName(connector) === walletType;
                  });
                  _context3.prev = 10;

                  if (!connector) {
                    _context3.next = 30;
                    break;
                  }

                  _context3.t0 = walletType;
                  _context3.next = _context3.t0 === 'Impersonated' ? 15 : _context3.t0 === 'Coinbase' ? 19 : _context3.t0 === 'Metamask' ? 19 : _context3.t0 === 'WalletConnect' ? 22 : _context3.t0 === 'GnosisSafe' ? 25 : 28;
                  break;

                case 15:
                  if (!impersonatedAddress) {
                    _context3.next = 18;
                    break;
                  }

                  _context3.next = 18;
                  return connector.activate({
                    address: impersonatedAddress,
                    chainId: chainID
                  });

                case 18:
                  return _context3.abrupt("break", 28);

                case 19:
                  _context3.next = 21;
                  return connector.activate(typeof chainID !== 'undefined' ? getChainParameters(chainID) : undefined);

                case 21:
                  return _context3.abrupt("break", 28);

                case 22:
                  _context3.next = 24;
                  return connector.activate(chainID);

                case 24:
                  return _context3.abrupt("break", 28);

                case 25:
                  _context3.next = 27;
                  return connector.activate(chainID);

                case 27:
                  return _context3.abrupt("break", 28);

                case 28:
                  setLocalStorageWallet(walletType);
                  get().updateEthAdapter(walletType === 'GnosisSafe');

                case 30:
                  _context3.next = 36;
                  break;

                case 32:
                  _context3.prev = 32;
                  _context3.t1 = _context3["catch"](10);

                  if (_context3.t1 instanceof Error) {
                    errorMessage = _context3.t1.message ? _context3.t1.message.toString() : _context3.t1.toString();

                    if (errorMessage === 'MetaMask not installed') {
                      errorMessage = 'Browser wallet not installed';
                    }

                    set({
                      walletConnectionError: errorMessage
                    });
                  }

                  console.error(_context3.t1);

                case 36:
                  set({
                    walletActivating: false
                  });

                case 37:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, null, [[10, 32]]);
        }));

        function connectWallet(_x2, _x3) {
          return _connectWallet.apply(this, arguments);
        }

        return connectWallet;
      }(),
      checkAndSwitchNetwork: function () {
        var _checkAndSwitchNetwork = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(chainID) {
          var activeWallet;
          return _regeneratorRuntime().wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  activeWallet = get().activeWallet;

                  if (!activeWallet) {
                    _context4.next = 4;
                    break;
                  }

                  _context4.next = 4;
                  return get().connectWallet(activeWallet.walletType, chainID);

                case 4:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        function checkAndSwitchNetwork(_x4) {
          return _checkAndSwitchNetwork.apply(this, arguments);
        }

        return checkAndSwitchNetwork;
      }(),
      disconnectActiveWallet: function () {
        var _disconnectActiveWallet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
          var activeWallet, activeConnector;
          return _regeneratorRuntime().wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  activeWallet = get().activeWallet;

                  if (!activeWallet) {
                    _context5.next = 9;
                    break;
                  }

                  activeConnector = get().connectors.find(function (connector) {
                    return getConnectorName(connector) == activeWallet.walletType;
                  });

                  if (!(activeConnector != null && activeConnector.deactivate)) {
                    _context5.next = 6;
                    break;
                  }

                  _context5.next = 6;
                  return activeConnector.deactivate();

                case 6:
                  _context5.next = 8;
                  return activeConnector == null ? void 0 : activeConnector.resetState();

                case 8:
                  set({
                    activeWallet: undefined
                  });

                case 9:
                  deleteLocalStorageWallet();
                  clearWalletConnectLocalStorage();

                case 11:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5);
        }));

        function disconnectActiveWallet() {
          return _disconnectActiveWallet.apply(this, arguments);
        }

        return disconnectActiveWallet;
      }(),
      checkIsContractWallet: function () {
        var _checkIsContractWallet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(wallet) {
          var account, walletRecord, codeOfWalletAddress, isContractWallet;
          return _regeneratorRuntime().wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  account = wallet.accounts[0];
                  walletRecord = get().isContractWalletRecord[account];

                  if (!(walletRecord !== undefined)) {
                    _context6.next = 4;
                    break;
                  }

                  return _context6.abrupt("return", walletRecord);

                case 4:
                  _context6.next = 6;
                  return wallet.provider.getCode(wallet.accounts[0]);

                case 6:
                  codeOfWalletAddress = _context6.sent;
                  isContractWallet = codeOfWalletAddress !== '0x';
                  set(function (state) {
                    return immer.produce(state, function (draft) {
                      draft.isContractWalletRecord[account] = isContractWallet;
                    });
                  });
                  return _context6.abrupt("return", isContractWallet);

                case 10:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6);
        }));

        function checkIsContractWallet(_x5) {
          return _checkIsContractWallet.apply(this, arguments);
        }

        return checkIsContractWallet;
      }(),

      /**
       * setActiveWallet is separate from connectWallet for a reason, after metaMask.activate()
       * only provider is available in the returned type, but we also need accounts and chainID which for some reason
       * is impossible to pull from .provider() still not the best approach, and I'm looking to find proper way to handle it
       */
      setActiveWallet: function () {
        var _setActiveWallet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(wallet) {
          var providerSigner, isContractAddress, activeWallet;
          return _regeneratorRuntime().wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  providerSigner = wallet.walletType === 'Impersonated' ? wallet.provider.getSigner(get()._impersonatedAddress) : wallet.provider.getSigner(0);

                  if (wallet.chainId !== undefined) {
                    get().setProvider(wallet.chainId, wallet.provider);
                  }

                  _context7.next = 4;
                  return get().checkIsContractWallet(wallet);

                case 4:
                  isContractAddress = _context7.sent;
                  set({
                    activeWallet: _extends({}, wallet, {
                      isContractAddress: isContractAddress,
                      signer: providerSigner
                    })
                  });
                  activeWallet = get().activeWallet;

                  if (activeWallet) {
                    walletConnected(activeWallet);
                  }

                case 8:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7);
        }));

        function setActiveWallet(_x6) {
          return _setActiveWallet.apply(this, arguments);
        }

        return setActiveWallet;
      }(),
      changeActiveWalletChainId: function changeActiveWalletChainId(chainId) {
        if (chainId !== undefined) {
          set(function (state) {
            return immer.produce(state, function (draft) {
              if (draft.activeWallet) {
                draft.activeWallet.chainId = chainId;
              }
            });
          });
        }
      },
      getActiveAddress: function getActiveAddress() {
        var activeWallet = get().activeWallet;

        if (activeWallet && activeWallet.accounts) {
          return activeWallet.accounts[0];
        }

        return undefined;
      },
      setImpersonatedAddress: function setImpersonatedAddress(address) {
        set({
          _impersonatedAddress: address
        });
      },
      resetWalletConnectionError: function resetWalletConnectionError() {
        set({
          walletConnectionError: ''
        });
      }
    };
  };
}

exports.AVAX = AVAX;
exports.ETH = ETH;
exports.ImpersonatedConnector = ImpersonatedConnector;
exports.ImpersonatedProvider = ImpersonatedProvider;
exports.MATIC = MATIC;
exports.SafeTransactionServiceUrls = SafeTransactionServiceUrls;
exports.StaticJsonRpcBatchProvider = StaticJsonRpcBatchProvider;
exports.Web3Provider = Web3Provider;
exports.clearWalletConnectLocalStorage = clearWalletConnectLocalStorage;
exports.createTransactionsSlice = createTransactionsSlice;
exports.createWalletSlice = createWalletSlice;
exports.deleteLocalStorageWallet = deleteLocalStorageWallet;
exports.getBrowserWalletLabelAndIcon = getBrowserWalletLabelAndIcon;
exports.getConnectorName = getConnectorName;
exports.getLocalStorageTxPool = getLocalStorageTxPool;
exports.initAllConnectors = initAllConnectors;
exports.initChainInformationConfig = initChainInformationConfig;
exports.initialChains = initialChains;
exports.selectAllTransactions = selectAllTransactions;
exports.selectAllTransactionsByWallet = selectAllTransactionsByWallet;
exports.selectIsGelatoTXPending = selectIsGelatoTXPending;
exports.selectLastTxByTypeAndPayload = selectLastTxByTypeAndPayload;
exports.selectPendingTransactionByWallet = selectPendingTransactionByWallet;
exports.selectPendingTransactions = selectPendingTransactions;
exports.selectTXByHash = selectTXByHash;
exports.selectTXByKey = selectTXByKey;
exports.selectTxExplorerLink = selectTxExplorerLink;
exports.setLocalStorageTxPool = setLocalStorageTxPool;
exports.setLocalStorageWallet = setLocalStorageWallet;
exports.useLastTxLocalStatus = useLastTxLocalStatus;
//# sourceMappingURL=frontend-web3-utils.cjs.development.js.map
