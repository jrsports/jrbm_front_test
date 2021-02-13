export function secondsToTime(seconds) {

    let h = Math.floor(seconds / 3600) < 10 ? '0' + Math.floor(seconds / 3600) : Math.floor(seconds / 3600);
    let m = Math.floor((seconds / 60 % 60)) < 10 ? '0' + Math.floor((seconds / 60 % 60)) : Math.floor((seconds / 60 % 60));
    let s = Math.floor((seconds % 60)) < 10 ? '0' + Math.floor((seconds % 60)) : Math.floor((seconds % 60));

    let res = '';
    if(h !== '00') res += `${h}:`;
    if(m !== '00') res += `${m}:`;
    res += `${s}`;
    return res;
}

export function secondsToMatchTime(s) {
    let h;
    h = Math.floor(s / 60);
    s = s % 60;
    h += '';
    s += '';
    h = (h.length == 1) ? '0' + h : h;
    s = (s.length == 1) ? '0' + s : s;
    return h + ':' + s;
}