
let slider = document.getElementById("customTDP");

const BOOST_TDP = 2;

function handleError(err, stdout, stderr) {
    if (err) {
        console.log(`exec error: ${err}`);
        return;
    }else{
        console.log(`${stdout}`);
    }
}

slider.addEventListener('change', (e) => {
	document.getElementById("tdpView").innerHTML = e.target.value;
	const targetTDP = Number(e.target.value) * 1000;
	const boostTDP = targetTDP + (BOOST_TDP*1000);

})
