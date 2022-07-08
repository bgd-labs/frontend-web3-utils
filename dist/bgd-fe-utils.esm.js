import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector, Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';
import { Connector } from '@web3-react/types';
import { providers } from 'ethers';
import produce, { produce as produce$1 } from 'immer';
import React, { useEffect } from 'react';

var LocalStorageKeys;

(function (LocalStorageKeys) {
  LocalStorageKeys["LastConnectedWallet"] = "LastConnectedWallet";
  LocalStorageKeys["TransactionPool"] = "TransactionPool";
})(LocalStorageKeys || (LocalStorageKeys = {}));

var setLocalStorageTxPool = function setLocalStorageTxPool(pool) {
  var stringifiedPool = JSON.stringify(pool);
  localStorage.setItem(LocalStorageKeys.TransactionPool, stringifiedPool);
};
var getLocalStorageTxPool = function getLocalStorageTxPool() {
  return localStorage.getItem(LocalStorageKeys.TransactionPool);
};
var setLocalStorageWallet = function setLocalStorageWallet(walletType) {
  localStorage.setItem(LocalStorageKeys.LastConnectedWallet, walletType);
};
var deleteLocalStorageWallet = function deleteLocalStorageWallet() {
  localStorage.removeItem(LocalStorageKeys.LastConnectedWallet);
};

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

var ImpersonatedProvider = /*#__PURE__*/function (_providers$JsonRpcPro) {
  _inheritsLoose(ImpersonatedProvider, _providers$JsonRpcPro);

  function ImpersonatedProvider(url) {
    var _this;

    _this = _providers$JsonRpcPro.call(this, url) || this;
    _this.copyProvider = new providers.JsonRpcProvider(url);
    return _this;
  }

  var _proto = ImpersonatedProvider.prototype;

  _proto.getSigner = function getSigner(address) {
    return this.copyProvider.getUncheckedSigner(address);
  };

  return ImpersonatedProvider;
}(providers.JsonRpcProvider);
var ImpersonatedConnector = /*#__PURE__*/function (_Connector) {
  _inheritsLoose(ImpersonatedConnector, _Connector);

  function ImpersonatedConnector(actions, options) {
    var _this2;

    _this2 = _Connector.call(this, actions) || this;
    _this2.rpcURL = options.rpcUrl;
    return _this2;
  }

  var _proto2 = ImpersonatedConnector.prototype;

  _proto2.activate = function activate(address) {
    this.actions.startActivation();
    this.customProvider = new ImpersonatedProvider(this.rpcURL);
    this.actions.update({
      chainId: 1,
      accounts: [address]
    });
  };

  return ImpersonatedConnector;
}(Connector);

var initAllConnectors = function initAllConnectors(props) {
  var metaMask = initializeConnector(function (actions) {
    return new MetaMask({
      actions: actions
    });
  });
  var URLS = Object.keys(props.chains).reduce(function (accumulator, chainId) {
    var validURLs = props.chains[Number(chainId)].urls;

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs;
    }

    return accumulator;
  }, {});
  var walletConnect = initializeConnector(function (actions) {
    return new WalletConnect({
      actions: actions,
      options: {
        rpc: URLS
      }
    });
  });
  var coinbase = initializeConnector(function (actions) {
    return new CoinbaseWallet({
      actions: actions,
      options: {
        url: props.chains[props.desiredChainId].urls[0],
        appName: props.appName
      }
    });
  });
  var impersonatedConnector = initializeConnector(function (actions) {
    return new ImpersonatedConnector(actions, {
      rpcUrl: props.chains[props.desiredChainId].urls[0]
    });
  });
  return [metaMask, walletConnect, coinbase, impersonatedConnector];
};
function getConnectorName(connector) {
  if (connector instanceof MetaMask) return "Metamask";
  if (connector instanceof WalletConnect) return "WalletConnect";
  if (connector instanceof CoinbaseWallet) return "Coinbase";
  if (connector instanceof ImpersonatedConnector) return "Impersonated";
  return;
}

var selectAllTransactions = function selectAllTransactions(state) {
  return Object.values(state.transactionsPool).sort(function (a, b) {
    return a.nonce - b.nonce;
  });
};
var selectPendingTransactions = function selectPendingTransactions(state) {
  return selectAllTransactions(state).filter(function (tx) {
    return tx.pending;
  });
};
var selectTXByHash = function selectTXByHash(state, hash) {
  return state.transactionsPool[hash];
};

function createTransactionsSlice(_ref) {
  var txStatusChangedCallback = _ref.txStatusChangedCallback,
      providers = _ref.providers;
  return function (set, get) {
    return {
      transactionsPool: {},
      txStatusChangedCallback: txStatusChangedCallback,
      executeTx: function () {
        var _executeTx = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref2) {
          var body, params, tx, chainId, transaction, txPool;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  body = _ref2.body, params = _ref2.params;
                  _context.next = 3;
                  return get().checkAndSwitchNetwork();

                case 3:
                  _context.next = 5;
                  return body();

                case 5:
                  tx = _context.sent;
                  chainId = Number(tx.chainId);
                  transaction = {
                    chainId: chainId,
                    hash: tx.hash,
                    type: params.type,
                    payload: params.payload,
                    from: tx.from,
                    to: tx.to,
                    nonce: tx.nonce
                  };
                  set(function (state) {
                    return produce(state, function (draft) {
                      draft.transactionsPool[transaction.hash] = _extends({}, transaction, {
                        pending: true
                      });
                    });
                  });
                  txPool = get().transactionsPool;
                  setLocalStorageTxPool(txPool);
                  get().waitForTx(tx.hash);
                  return _context.abrupt("return", txPool[tx.hash]);

                case 13:
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
      waitForTx: function () {
        var _waitForTx = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(hash) {
          var txData, provider, tx, txn, updatedTX;
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  txData = get().transactionsPool[hash];

                  if (!txData) {
                    _context2.next = 14;
                    break;
                  }

                  provider = providers[txData.chainId];
                  _context2.next = 5;
                  return provider.getTransaction(hash);

                case 5:
                  tx = _context2.sent;
                  _context2.next = 8;
                  return tx.wait();

                case 8:
                  txn = _context2.sent;
                  get().updateTXStatus(hash, txn.status);
                  updatedTX = get().transactionsPool[hash];
                  get().txStatusChangedCallback(_extends({}, updatedTX));
                  _context2.next = 14;
                  break;

                case 14:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function waitForTx(_x2) {
          return _waitForTx.apply(this, arguments);
        }

        return waitForTx;
      }(),
      updateTXStatus: function updateTXStatus(hash, status) {
        set(function (state) {
          return produce(state, function (draft) {
            draft.transactionsPool[hash].status = status;
            draft.transactionsPool[hash].pending = false;
          });
        });
        setLocalStorageTxPool(get().transactionsPool);
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
            get().waitForTx(tx.hash);
          }
        });
      }
    };
  };
}

function createWeb3Slice(_ref) {
  var walletConnected = _ref.walletConnected,
      getAddChainParameters = _ref.getAddChainParameters,
      _ref$desiredChainID = _ref.desiredChainID,
      desiredChainID = _ref$desiredChainID === void 0 ? 1 : _ref$desiredChainID;
  return function (set, get) {
    return {
      walletActivating: false,
      connectors: [],
      setConnectors: function setConnectors(connectors) {
        set(function () {
          return {
            connectors: connectors
          };
        });
        void get().initDefaultWallet();
      },
      initDefaultWallet: function () {
        var _initDefaultWallet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
          var lastConnectedWallet;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  lastConnectedWallet = localStorage.getItem(LocalStorageKeys.LastConnectedWallet);

                  if (!lastConnectedWallet) {
                    _context.next = 6;
                    break;
                  }

                  _context.next = 4;
                  return get().connectWallet(lastConnectedWallet);

                case 4:
                  _context.next = 6;
                  return get().checkAndSwitchNetwork();

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function initDefaultWallet() {
          return _initDefaultWallet.apply(this, arguments);
        }

        return initDefaultWallet;
      }(),
      connectWallet: function () {
        var _connectWallet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(walletType) {
          var _get$activeWallet;

          var impersonatedAddress, connector;
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (!(((_get$activeWallet = get().activeWallet) == null ? void 0 : _get$activeWallet.walletType) !== walletType)) {
                    _context2.next = 3;
                    break;
                  }

                  _context2.next = 3;
                  return get().disconnectActiveWallet();

                case 3:
                  impersonatedAddress = get()._impersonatedAddress;
                  set({
                    walletActivating: true
                  });
                  connector = get().connectors.find(function (connector) {
                    return getConnectorName(connector) === walletType;
                  });

                  if (!connector) {
                    _context2.next = 21;
                    break;
                  }

                  _context2.t0 = walletType;
                  _context2.next = _context2.t0 === "Impersonated" ? 10 : _context2.t0 === "Coinbase" ? 14 : _context2.t0 === "Metamask" ? 14 : _context2.t0 === "WalletConnect" ? 17 : 20;
                  break;

                case 10:
                  if (!impersonatedAddress) {
                    _context2.next = 13;
                    break;
                  }

                  _context2.next = 13;
                  return connector.activate(impersonatedAddress);

                case 13:
                  return _context2.abrupt("break", 20);

                case 14:
                  _context2.next = 16;
                  return connector.activate(getAddChainParameters(desiredChainID));

                case 16:
                  return _context2.abrupt("break", 20);

                case 17:
                  _context2.next = 19;
                  return connector.activate(desiredChainID);

                case 19:
                  return _context2.abrupt("break", 20);

                case 20:
                  setLocalStorageWallet(walletType);

                case 21:
                  set({
                    walletActivating: false
                  });

                case 22:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function connectWallet(_x) {
          return _connectWallet.apply(this, arguments);
        }

        return connectWallet;
      }(),
      checkAndSwitchNetwork: function () {
        var _checkAndSwitchNetwork = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
          var activeWallet;
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  activeWallet = get().activeWallet;

                  if (!activeWallet) {
                    _context3.next = 4;
                    break;
                  }

                  _context3.next = 4;
                  return get().connectWallet(activeWallet.walletType);

                case 4:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        function checkAndSwitchNetwork() {
          return _checkAndSwitchNetwork.apply(this, arguments);
        }

        return checkAndSwitchNetwork;
      }(),
      disconnectActiveWallet: function () {
        var _disconnectActiveWallet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
          var activeWallet, activeConnector;
          return _regeneratorRuntime().wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  activeWallet = get().activeWallet;

                  if (!activeWallet) {
                    _context4.next = 9;
                    break;
                  }

                  activeConnector = get().connectors.find(function (connector) {
                    return getConnectorName(connector) == activeWallet.walletType;
                  });

                  if (!(activeConnector != null && activeConnector.deactivate)) {
                    _context4.next = 6;
                    break;
                  }

                  _context4.next = 6;
                  return activeConnector.deactivate();

                case 6:
                  _context4.next = 8;
                  return activeConnector == null ? void 0 : activeConnector.resetState();

                case 8:
                  set({
                    activeWallet: undefined
                  });

                case 9:
                  deleteLocalStorageWallet();

                case 10:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        function disconnectActiveWallet() {
          return _disconnectActiveWallet.apply(this, arguments);
        }

        return disconnectActiveWallet;
      }(),

      /**
       * setActiveWallet is separate from connectWallet for a reason, after metaMask.activate()
       * only provider is available in the returned type, but we also need accounts and chainID which for some reason
       * is impossible to pull from .provider() still not the best approach, and I'm looking to find proper way to handle it
       */
      setActiveWallet: function setActiveWallet(wallet) {
        var providerSigner = wallet.walletType == "Impersonated" ? wallet.provider.getSigner(get()._impersonatedAddress) : wallet.provider.getSigner(0);
        set({
          activeWallet: _extends({}, wallet, {
            signer: providerSigner
          })
        });
        var activeWallet = get().activeWallet;

        if (activeWallet) {
          walletConnected(activeWallet);
        }
      },
      changeActiveWalletChainId: function changeActiveWalletChainId(chainId) {
        set(function (state) {
          return produce$1(state, function (draft) {
            if (draft.activeWallet) {
              draft.activeWallet.chainId = chainId;
            }
          });
        });
      },
      getActiveAddress: function getActiveAddress() {
        var activeWallet = get().activeWallet;

        if (activeWallet && activeWallet.accounts) {
          return activeWallet.accounts[0];
        }

        return undefined;
      }
    };
  };
}

function Child(_ref) {
  var useStore = _ref.useStore,
      connectors = _ref.connectors;

  var _useWeb3React = useWeb3React(),
      connector = _useWeb3React.connector,
      chainId = _useWeb3React.chainId,
      isActive = _useWeb3React.isActive,
      accounts = _useWeb3React.accounts,
      provider = _useWeb3React.provider;

  var setActiveWallet = useStore(function (state) {
    return state.setActiveWallet;
  });
  var changeChainID = useStore(function (state) {
    return state.changeActiveWalletChainId;
  });
  var setConnectors = useStore(function (state) {
    return state.setConnectors;
  });
  var initTxPool = useStore(function (state) {
    return state.initTxPool;
  });
  useEffect(function () {
    setConnectors(connectors);
  }, [connectors]);
  useEffect(function () {
    initTxPool();
  }, [initTxPool]);
  useEffect(function () {
    var walletType = connector && getConnectorName(connector);

    if (walletType && accounts && isActive && provider) {
      // TODO: don't forget to change to different
      setActiveWallet({
        walletType: walletType,
        accounts: accounts,
        chainId: chainId,
        provider: provider,
        isActive: isActive
      });
    }
  }, [isActive, chainId, provider, accounts]);
  useEffect(function () {
    if (chainId) {
      changeChainID(chainId);
    }
  }, [chainId]);
  return null;
}

function Web3Provider(_ref2) {
  var useStore = _ref2.useStore,
      connectorsInitProps = _ref2.connectorsInitProps;
  var connectors = initAllConnectors(connectorsInitProps);
  return React.createElement(Web3ReactProvider, {
    connectors: connectors
  }, React.createElement(Child, {
    useStore: useStore,
    connectors: connectors.map(function (connector) {
      return connector[0];
    })
  }));
}

export { ImpersonatedConnector, ImpersonatedProvider, LocalStorageKeys, Web3Provider, createTransactionsSlice, createWeb3Slice, deleteLocalStorageWallet, getConnectorName, getLocalStorageTxPool, initAllConnectors, selectAllTransactions, selectPendingTransactions, selectTXByHash, setLocalStorageTxPool, setLocalStorageWallet };
//# sourceMappingURL=bgd-fe-utils.esm.js.map
