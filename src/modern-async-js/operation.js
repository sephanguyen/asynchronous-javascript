const delayms = 1;

export function getCurrentCity(callback) {
  setTimeout(function() {
    const city = 'New York, NY';
    callback(null, city);
  }, delayms);
}

export function getWeather(city, callback) {
  setTimeout(function() {
    if (!city) {
      callback(new Error('City required to get weather'));
      return;
    }

    const weather = {
      temp: 50
    };

    callback(null, weather);
  }, delayms);
}

export function getForecast(city, callback) {
  setTimeout(function() {
    if (!city) {
      callback(new Error('City required to get forecast'));
      return;
    }

    const fiveDay = {
      fiveDay: [60, 70, 80, 45, 50]
    };

    callback(null, fiveDay);
  }, delayms);
}

// export function fetchCurrentCity(onSuccess, onError) {
//   getCurrentCity(function(error, result) {
//     if (error) {
//       onError(error);
//       return;
//     }
//     onSuccess(result);
//   });
// }

// export function fetchCurrentCity() {
//   const operation = {};
//   getCurrentCity(function(error, result) {
//     if (error) {
//       operation.onError(error);
//       return;
//     }
//     operation.onSuccess(result);
//   });
//   operation.setCallBacks = function(onSuccess, onError) {
//     operation.onSuccess = onSuccess;
//     operation.onError = onError;
//   };
//   return operation;
// }

export function fetchCurrentCity() {
  const operation = new Operation();
  getCurrentCity(operation.nodeCallback);

  return operation;
}

export function fetchWeather(city) {
  const operation = new Operation();
  getWeather(city, operation.nodeCallback);
  return operation;
}

export function fetchForeCast(city) {
  const operation = new Operation();
  getForecast(city, operation.nodeCallback);
  return operation;
}

export function fetchCurrentCityThatFails(city) {
  const operation = new Operation();
  setTimeout(function() {
    operation.reject(new Error('GPS broken'));
  }, 20);
  return operation;
}

export function fetchCurrentCityIndecisive(city) {
  const operation = new Operation();
  setTimeout(function() {
    operation.resolve('NYC');
    operation.resolve('Philly');
  }, 20);
  return operation;
}

export function fetchCurrentCityRepeatedFailures(city) {
  const operation = new Operation();
  setTimeout(function() {
    operation.reject(new Error('I failed'));
    operation.reject(new Error('I failed again'));
  }, 20);
  return operation;
}

export function Operation() {
  const operation = {
    successReactions: [],
    errorReactions: []
  };
  function fail(error) {
    if (operation.complete) {
      return;
    }
    operation.complete = true;
    operation.state = 'failed';
    operation.error = error;
    operation.errorReactions.forEach(r => r(error));
  }
  operation.reject = fail;
  function succeed(result) {
    if (operation.complete) {
      return;
    }
    operation.complete = true;
    operation.state = 'succeeded';
    operation.result = result;
    operation.successReactions.forEach(s => s(result));
  }

  operation.resolve = function resolve(value) {
    if (value && value.onCommplete) {
      // value.forwardCompletion(operation);
      value.then(operation.resolve, operation.reject);
      return;
    }
    succeed(value);
  };

  operation.onCommplete = function(onSuccess, onError) {
    const proxyOp = new Operation();

    function successHandler() {
      setTimeout(() => {
        if (onSuccess) {
          let callBackResult;

          try {
            callBackResult = onSuccess(operation.result);
          } catch (error) {
            proxyOp.reject(error);
            return;
          }
          proxyOp.resolve(callBackResult);
        } else {
          proxyOp.resolve(operation.result);
        }
      });
    }

    function errorHandler() {
      setTimeout(() => {
        if (onError) {
          let callBackResult;

          try {
            callBackResult = onError(operation.error);
          } catch (error) {
            proxyOp.reject(error);
            return;
          }
          proxyOp.resolve(callBackResult);
        } else {
          proxyOp.reject(operation.error);
        }
      });
    }

    switch (operation.state) {
      case 'succeeded':
        successHandler();
        break;
      case 'failed':
        errorHandler();
        break;
      default:
        operation.successReactions.push(successHandler);
        operation.errorReactions.push(errorHandler);
        break;
    }
    return proxyOp;
  };
  operation.onFailure = function onFailure(onError) {
    return operation.then(null, onError);
  };
  operation.nodeCallback = function(error, result) {
    if (error) {
      operation.reject(error);
      return;
    }
    operation.resolve(result);
  };
  operation.then = operation.onCommplete;
  operation.catch = operation.onFailure;
  // operation.forwardCompletion = function(op) {
  //   operation.onCommplete(op.resolve, op.fail);
  // };

  return operation;
}
