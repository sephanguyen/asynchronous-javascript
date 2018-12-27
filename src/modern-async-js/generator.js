const city = 'New York, NY';
const appid = '90a4ad2e94c942f953551e8552df9e8a';
const weartherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${appid}`;
const fiveDayUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${appid}`;

export function* me() {
  try {
    const reponse = yield fetch(weartherUrl);
    const weather = yield reponse.json();

    const fiveDay = yield fetch(fiveDay).then(r => r.json());

    console.log(fiveDay);
    console.log(weather);
  } catch (error) {
    console.log('Failed to get the weather');
  }
}

export function assistant(generator) {
  remind(() => generator.next());

  function remind(resume) {
    const next = resume();
    if (next.done) {
      return;
    }
    const promise = Promise.resolve(next.value);
    promise.then(
      function fulfillReaction(result) {
        remind(() => generator.next(result));
      },
      function rejectReaction(error) {
        remind(() => generator.throw(error));
      }
    );
  }
}
