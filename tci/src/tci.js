function tci(weight, bolus, rate) {
    const kv1 = 0.228;       // L per kg
    const kv2 = 0.463;
    const kv3 = 2.893;
    const k10 = 0.119;      // min ^ -1
    const k12 = 0.112;
    const k13 = 0.042;
    const k21 = 0.055;
    const k31 = 0.0033;
    const keo = 0.26;

    const time = 1200;      // s
    //const weight = 70;      // kg
    //const bolus = 150;      // mg
    //const rate = 25;       // mcg/kg/min

    const v1 = weight * kv1;
    const v2 = weight * kv2;
    const v3 = weight * kv3;

    var c1 = bolus / v1;    // mg per L == mcg per mL
    var c2 = 0;
    var c3 = 0;

    var data = [];

    console.log(`Starting Marsh model for ${weight} kg individual with ${bolus} mg bolus.`);
    console.log(`V1: ${v1}; V2: ${v2}; V3: ${v3}`);

    data.push({
        t: 0,
        c1: c1,
        c2: c2,
        c3: c3,
    });

    for(let i = 1; i < time; i++) {
        let a01 = (rate * weight * 1/60) / 1000;

        let a1 = c1 * v1;
        let a2 = c2 * v2;
        let a3 = c3 * v3;

        let a10 = a1 - (a1 * Math.pow(1 - k10, 1/60));
        let a12 = a1 - (a1 * Math.pow(1 - k12, 1/60));
        let a13 = a1 - (a1 * Math.pow(1 - k13, 1/60));

        let a21 = a2 - (a2 * Math.pow(1 - k21, 1/60));
        let a31 = a3 - (a3 * Math.pow(1 - k31, 1/60));

        c1 = (a1 - a10 - a12 - a13 + a01 + a21 + a31) / v1;
        c2 = (a2 - a21 + a12) / v2;
        c3 = (a3 - a31 + a13) / v3;

        data.push({
            t: i,
            c1: c1,
            c2: c2,
            c3: c3,
        });
    }

    for(let i of data) {
        console.log(i.t, i.c1, i.c2, i.c3);
    }

    return data;
}

export default tci;