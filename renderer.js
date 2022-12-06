
let slider = document.getElementById("customTDP");
let ryzenAdjPathInput = document.getElementById("ryzenadjPath")

const BOOST_TDP = 2;
const RYZENADJ_PATH = "ryzenadjPath"

document.addEventListener('DOMContentLoaded', (e) => {
    if(window.localStorage.getItem(RYZENADJ_PATH)) {
        ryzenAdjPathInput.value = window.localStorage.getItem(RYZENADJ_PATH)
    }
})

slider.addEventListener('change', (e) => {
	document.getElementById("tdpView").innerHTML = e.target.value;
	const targetTDP = Number(e.target.value) * 1000;
	const boostTDP = targetTDP + (BOOST_TDP*1000);

    const path = window.localStorage.getItem(RYZENADJ_PATH)

    window.ipcRender.send('updateTdp', [path, `${targetTDP}`, `${boostTDP}`])
})

ryzenAdjPathInput.addEventListener('change', (e) => {
    const path = e.target.value;

    window.localStorage.setItem(RYZENADJ_PATH, path)
})

window.ipcRender.receive('tdpInfo', (...args) => {
    console.log(args)
})
