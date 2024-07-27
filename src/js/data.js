/* eslint-disable no-undef */
let replay_timer;
if (variable.replay_list.length)
  replay_timer = setInterval(() => read_replay_file(), 1000);

ntp();

setInterval(() => {
  show_rts_list();

  // if (variable.replay_list.length) return;
  realtime_rts();
  realtime_eew();
}, 1000);

setInterval(() => {
  if (Object.keys(variable.eew_list).length !== 0) return;
  report();
}, 10000);

setInterval(() => {
  ntp();
}, 60000);

setInterval(() => {
  checkForNewRelease();
}, 3_600_000);

function read_replay_file() {
  if (!variable.replay_list.length) {
    variable.replay = 0;
    if (replay_timer) clearInterval(replay_timer);
    return;
  }

  const name = variable.replay_list.shift();

  // eslint-disable-next-line no-constant-condition
  if (1 == 2) {
    const data = JSON.parse(
      fs
        .readFileSync(path.join(app.getPath("userData"), `replay/${name}`))
        .toString()
    );

    const alert = Object.keys(data.rts.box).length;
    show_rts_dot(data.rts, alert);
    if (alert) show_rts_box(data.rts.box);

    console.log(data.eew);
    for (const eew of data.eew) {
      eew.time = data.rts.time;
      eew.timestamp = now();
      // eew.eq.mag = 1;
      show_eew(eew);
    }

    for (const intensity of data.intensity) show_intensity(intensity);

    variable.replay = data.rts.time;
  }
}

async function realtime_rts() {
  if (rts_replay_time > 0) return;
  const res = await fetchData(`${LB_url()}v1/trem/rts`);
  const data = await res.json();
  const alert = Object.keys(data.box).length;
  show_rts_dot(data, alert);
  if (alert) show_rts_box(data.box);

  variable.last_get_data_time = now();
  $("#connect").style.color = "goldenrod";
}

async function realtime_eew() {
  if (rts_replay_time > 0) return;
  const res = await fetchData(`${LB_url()}v1/eq/eew`);
  const data = await res.json();
  for (const eew of data) {
    eew.timestamp = now();
    show_eew(eew);
  }
}

async function ntp() {
  const res = await fetchData(
    `https://lb-${Math.ceil(Math.random() * 4)}.exptech.com.tw/ntp`
  );
  const data = await res.text();
  variable.time_offset = Number(data) - Date.now();
}

let rts_replay_time = 0;

const fetchWithFallback = async (url, fallbackUrl, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (response.ok) return response.json();
    if (response.status === 404) {
      const fallbackResponse = await fetch(fallbackUrl, options);
      if (fallbackResponse.ok) return fallbackResponse.json();
      throw new Error(
        `Fallback request failed with status ${fallbackResponse.status}`
      );
    }
    throw new Error(`Request failed with status ${response.status}`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

setInterval(() => {
  try {
    if (!rts_replay_time) return;
    rts_replay_time += 1000;
    const ts = Math.round(rts_replay_time / 1000) * 1000;
    const controller = new AbortController();
    const { signal } = controller;
    setTimeout(() => controller.abort(), 2500);

    fetchWithFallback(
      `https://api-2.exptech.dev/api/v1/trem/rts/${ts}`,
      `https://api-1.exptech.dev/api/v1/trem/rts/${ts}`,
      { signal }
    ).then((ans) => {
      if (ans) variable.report.replay_data = ans;
    });

    fetchWithFallback(
      `https://api-2.exptech.dev/api/v1/eq/eew/${ts}`,
      `https://api-1.exptech.dev/api/v1/eq/eew/${ts}`,
      { signal }
    ).then((ans_eew) => {
      if (ans_eew) {
        variable.report.replay_data.eew = ans_eew;
      }
    });
    if (!variable.report.replay_data.box) return;
    const rp_data = variable.report.replay_data;
    variable.replay = rp_data.time;
    if (early(rp_data)) return;
    const alert = Object.keys(rp_data.box).length;
    if (alert) show_rts_box(rp_data.box);
    if (rp_data.eew) {
      show_rts_dot(rp_data, alert);
      for (const eew of rp_data.eew) {
        eew.time = rp_data.time;
        eew.timestamp = now();
        show_eew(eew);
      }
    }
  } catch (err) {
    console.log(err);
  }
}, 1000);

function early(data) {
  if (data.eew) {
    return data.eew.every((eew) => {
      const authorKey = `early-warning-${eew.author.toUpperCase()}`;
      return checkbox(authorKey) !== 1 && checkbox("tremeew-take") !== 1;
    });
  }
  return false;
}
