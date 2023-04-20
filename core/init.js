/* eslint-disable no-undef */
document.getElementById("eew_max_intensity").innerHTML = get_lang_string("eew.max.intensity");
document.getElementById("max_intensity_text").innerHTML = get_lang_string("rts.max.intensity");
document.getElementById("max_pga_text").innerHTML = get_lang_string("rts.max.pga");
const ver_text = document.getElementById("version");
ver_text.innerHTML = app.getVersion();
ver_text.addEventListener("click", () => shell.openExternal("https://github.com/ExpTechTW/TREM-Lite/releases/latest"));