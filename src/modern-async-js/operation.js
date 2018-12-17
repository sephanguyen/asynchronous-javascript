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
    operation.fail('GPS broken');
  }, 20);
  return operation;
}

export function Operation() {
  const operation = {
    successReactions: [],
    errorReactions: []
  };
  operation.fail = function(error) {
    operation.state = 'failed';
    operation.error = error;
    operation.errorReactions.forEach(r => r(error));
  };
  operation.succeed = function(result) {
    operation.state = 'succeeded';
    operation.result = result;
    operation.successReactions.forEach(s => s(result));
  };
  operation.onCommplete = function(onSuccess, onError) {
    const proxyOp = new Operation();

    function successHandler() {
      if (onSuccess) {
        const callBackResult = onSuccess(operation.result);
        if (callBackResult && callBackResult.onCommplete) {
          callBackResult.forwardCompletion(proxyOp);
        }
      }
    }

    function errorHandler() {
      if (onError) {
        const callBackResult = onError(operation.error);
        proxyOp.succeed(callBackResult);
      }
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
    return operation.onCommplete(null, onError);
  };
  operation.nodeCallback = function(error, result) {
    if (error) {
      operation.fail(error);
      return;
    }
    operation.succeed(result);
  };
  operation.then = operation.onCommplete;
  operation.catch = operation.onFailure;
  operation.forwardCompletion = function(op) {
    operation.onCommplete(op.succeed, op.fail);
  };

  return operation;
}
