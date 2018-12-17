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

function Operation() {
  const operation = {
    successReactions: [],
    errorReactions: []
  };
  const noop = function() {};
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
    switch (operation.state) {
      case 'succeeded':
        onSuccess(operation.result);
        break;
      case 'failed':
        onError(operation.error);
        break;
      default:
        operation.successReactions.push(onSuccess || noop);
        operation.errorReactions.push(onError || noop);
        break;
    }
  };
  operation.onFailure = function onFailure(onError) {
    operation.onCommplete(null, onError);
  };
  operation.nodeCallback = function(error, result) {
    if (error) {
      operation.fail(error);
      return;
    }
    operation.succeed(result);
  };

  return operation;
}
