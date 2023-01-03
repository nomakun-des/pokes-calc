let stats_name = ['H', 'A', 'B', 'C', 'D', 'S'];
var Speed_lv50;
let hpTheory = [
    'はらだいこ1回でオボン発動',
    'じこさいせい等の回復量増加<br>4倍のステルスロック2回耐え<br>飛び膝蹴り2回外しケア',
    'さいせいりょくの回復量最大',
    'みがわり3回で木の実発動',
    'みがわり4回で残りHP1',
    'みがわり4回使用可能',
    'ゴツゴツメット、まきびし2回等1/6ダメージ最小',
    'ポイズンヒールの回復量最大',
    'ポイズンヒールの回復2回でみがわり1回分のHP回復',
    '1/8ダメージ最小',
    'いのちのたまのダメージ最小',
    'たべのこし、アイスボディ等の回復量最大',
    '奇数を維持してたべのこし、アイスボディ等の回復量最大',
    'たべのこし、アイスボディ等の回復4回でみがわり1回分のHP回復',
    'すなあらし、やけど、もうどく等のダメージ最小',
    'ちきゅうなげ等の固定ダメージをより多く耐える',
    'ちきゅうなげ等の固定ダメージをみがわりが耐える'
];

let speed_skill = [
    ["かるわざ", "2.0"],
    ["クォークチャージ", "1.5"],
    ["こだいかっせい", "1.5"],
    ["サーフテール", "2.0"],
    ["すいすい", "2.0"],
    ["すなかき", "2.0"],
    ["はやあし", "1.5"],
    ["ゆきかき", "2.0"],
    ["ようりょくそ", "2.0"]
];

let speed_item = [
    ["こだわりスカーフ", "1.5"],
    ["スピードパウダー", "2.0"]
];

window.onload = function () {
    first_setup();
    reCalc();
    setHpInfo();

    const loader = document.getElementById('loader');
    loader.classList.add('loaded');
};

function first_setup() {
    for (let i = 0; i < pokemon.length; i++) {
        document.getElementById("pokename_" + i).innerHTML = pokemon[i][0];
    }
    for (let i = 0; i < pokemon.length; i++) {
        document.getElementById("pokename2_" + i).innerHTML = pokemon[i][0]+" ("+pokemon[i][6]+")";
    }
    for (let i = 0; i < speed_skill.length; i++) {
        document.getElementById("s_skill_" + i).innerHTML =
                speed_skill[i][0] + "(×" + speed_skill[i][1] + ")";
    }
    for (let i = 0; i < speed_item.length; i++) {
        document.getElementById("s_item_" + i).innerHTML =
                speed_item[i][0] + "(×" + speed_item[i][1] + ")";
    }

    document.getElementById('poke2_sMax').style.color = "#888";
    document.getElementById('poke2_sHig').style.color = "#888";
    document.getElementById('poke2_sNor').style.color = "#888";
    document.getElementById('poke2_sLow').style.color = "#888";
    document.getElementById('poke2_sMin').style.color = "#888";

    $(document).ready(function () {
        $('.select_search').select2();
    });
    $(function () {
        function customMatcher(params, data) {
            if ($.trim(params.term) === '') {
                return data;
            }

            if (typeof data.text === 'undefined') {
                return null;
            }
            /*
             ZEtoHE 英数字を半角に
             HKtoZK 半角カタカナを全角カタカナに
             HGtoKK ひらがなをカタカナに
             */
            let term = moji(params.term.toUpperCase())
                    .convert("ZEtoHE").convert('HKtoZK').convert('HGtoKK').toString();

            let text = moji(data.text.toUpperCase())
                    .convert("ZEtoHE").convert('HKtoZK').convert('HGtoKK').toString();

            if (text.indexOf(term) > -1) {
                return data;
            }

            let searchText = $(data.element).data('search');
            if (searchText) {
                //ホントはdata-searchに記載前にconvertしておく方が良い。
                searchText = moji(searchText.toUpperCase())
                        .convert("ZEtoHE").convert('HKtoZK').convert('HGtoKK').toString();
                if (searchText.indexOf(term) > -1) {
                    return data;
                }

            }
            return null;
        }
        $("#pokename").select2({
            language: "ja",
            matcher: customMatcher
        });
        $("#pokename2").select2({
            language: "ja",
            matcher: customMatcher
        });
        $("#s_skill").select2({
            language: "ja",
            matcher: customMatcher
        });
        $("#s_item").select2({
            language: "ja",
            matcher: customMatcher
        });
    });
}

function setHpInfo() {
    console.log("setHpInfo()");

    for (let i = 0; i < hpTheory.length; i++) {
        document.getElementById("hpTheoryInfo_" + (i + 1)).innerHTML = hpTheory[i];
    }
}

function reCalc() {
    console.log("reCalc()");
    
    for (let i = 0; i < 6; i++) {
        if(document.getElementById("EV_" + stats_name[i]).value==='')
            document.getElementById("EV_" + stats_name[i]).value = 0;
    }

    document.getElementById("EV_total").value = total_ev();
    document.getElementById("Bs_total").value = total_bs();
    for (let i = 0; i < 6; i++) {
        document.getElementById("Stats_" + stats_name[i]).value = Stats_calc(i, Number(document.getElementById("lv").value));
    }
    Speed_lv50 = Stats_calc(5, 50);
    numCheck();
    real_speed();
    setText();
    setTitle();
    HPchecker();

    return;
}

function byStats() {
    console.log("byStats()");

    for (let i = 0; i < 6; i++) {
        if (EV_calc(i) >= 0)
            document.getElementById("EV_" + stats_name[i]).value = EV_calc(i);
        console.log(EV_calc(i));
    }

    reCalc();
}

function highStats(num) {
    console.log("highStats(" + num + ")");

    return ((Number(document.getElementById("EV_" + stats_name[num]).value) === 252)
            && (Number(document.getElementById("IV_" + stats_name[num]).value) === 31)
            && (num === 0 || !document.getElementById('Nature_' + stats_name[num] + '_dec').checked));
}
function lowStats(num) {
    console.log("lowStats(" + num + ")");

    return ((Number(document.getElementById("EV_" + stats_name[num]).value) === 0)
            && (Number(document.getElementById("IV_" + stats_name[num]).value) === 0)
            && (num === 0 || !document.getElementById('Nature_' + stats_name[num] + '_inc').checked));
}
function maxStats(num) {
    console.log("maxStats(" + num + ")");

    return (highStats(num) && document.getElementById('Nature_' + stats_name[num] + '_inc').checked);
}
function minStats(num) {
    console.log("minStats(" + num + ")");

    return (lowStats(num) && document.getElementById('Nature_' + stats_name[num] + '_dec').checked);
}
function nameofTheory() {
    console.log("nameofTheory()");

    if (maxStats(5)) {
        return "最速";
    } else if (minStats(5)) {
        return "最遅";
    } else {
        result = "";
        for (let i = 0; i < 6; i++) {
            if (highStats(i))
                result += stats_name[i];
        }
        if (result.length <= 1) {
            result_store = result;
            result = "";
            for (let i = 0; i < 6; i++) {
                if (nameofTheory_vague(i))
                    result += stats_name[i];
            }
            if (result.length === 2) {
                result += "ベース";
            } else {
                result = result_store;
            }
        }
        if (result.length === 1)
            result += "ぶっぱ";
        if (result === 'AC')
            result = "両刀";

        return result;
    }
}
function nameofTheory_vague(num) {
    console.log("nameofTheory_vague(" + num + ")");

    return (Number(document.getElementById("EV_" + stats_name[num]).value) >= 180);
}

function ANplusB_H(A, B) {
    console.log("ANplusB_H(" + A + "," + B + ")");

    return Number.isInteger(((Number(document.getElementById("Stats_H").value)) - B) / A);
}
function ANplusB_excess(A, B) {
    console.log("ANplusB_excess(" + A + "," + B + ")");

    HP = Number(document.getElementById("Stats_H").value);
    plus = 0;
    minus = 0;

    while (!Number.isInteger(((HP + plus) - B) / A))
        plus++;
    while (!Number.isInteger(((HP - minus) - B) / A))
        minus++;

    return "<span style='color:red;'>+" + plus + "</span> / <span style='color:blue;'>-" + minus + "</span>";
}
function ANplusB_excess_3point(A, B1, B2, B3) {
    console.log("ANplusB_excess_3point(" + A + ", " + B1 + ", " + B2 + ", " + B3 + ")");

    HP = Number(document.getElementById("Stats_H").value);
    plus = 0;
    minus = 0;

    while (!Number.isInteger(((HP + plus) - B1) / A))
        plus++;
    while (!Number.isInteger(((HP - minus) - B1) / A))
        minus++;
    plus1 = plus;
    minus1 = minus;
    plus = 0;
    minus = 0;

    while (!Number.isInteger(((HP + plus) - B2) / A))
        plus++;
    while (!Number.isInteger(((HP - minus) - B2) / A))
        minus++;
    plus2 = plus;
    minus2 = minus;
    plus = 0;
    minus = 0;

    while (!Number.isInteger(((HP + plus) - B3) / A))
        plus++;
    while (!Number.isInteger(((HP - minus) - B3) / A))
        minus++;
    plus3 = plus;
    minus3 = minus;

    if (plus1 <= plus2 && plus1 <= plus3)
        plus = plus1;
    if (plus2 <= plus1 && plus2 <= plus3)
        plus = plus2;
    if (plus3 <= plus1 && plus3 <= plus2)
        plus = plus3;
    if (minus1 <= minus2 && minus1 <= minus3)
        minus = minus1;
    if (minus2 <= minus1 && minus2 <= minus3)
        minus = minus2;
    if (minus3 <= minus1 && minus3 <= minus2)
        minus = minus3;

    return "<span style='color:red;'>+" + plus + "</span> / <span style='color:blue;'>-" + minus + "</span>";
}
function HPcheck(A, B) {
    console.log("HPcheck(" + A + "," + B + ")");

    if (ANplusB_H(A, B)) {
        return "○";
    } else {
        return ANplusB_excess(A, B);
    }
}
function HPcheck_3point(A, B1, B2, B3) {
    console.log("HPcheck_3point(" + A + ", " + B1 + ", " + B2 + ", " + B3 + ")");

    if (ANplusB_H(A, B1) || ANplusB_H(A, B2) || ANplusB_H(A, B3)) {
        return "○";
    } else {
        return ANplusB_excess_3point(A, B1, B2, B3);
    }
}
function hpTheoryOutPut(no, name, A, B) {
    console.log("hpTheoryOutPut(" + no + "," + name + "," + A + "," + B + ")");

    if (B === "1~3") {
        document.getElementById("hpTheory_" + no).innerHTML = HPcheck_3point(A, 1, 2, 3);
        if (ANplusB_H(A, 1) || ANplusB_H(A, 2) || ANplusB_H(A, 3)) {
            document.getElementById("hpTheory_" + no).style.backgroundColor = "#FFE3E3";
        } else {
            document.getElementById("hpTheory_" + no).style.backgroundColor = null;
        }
    } else {
        document.getElementById("hpTheory_" + no).innerHTML = HPcheck(A, B);
        if (ANplusB_H(A, B)) {
            document.getElementById("hpTheory_" + no).style.backgroundColor = "#FFE3E3";
        } else {
            document.getElementById("hpTheory_" + no).style.backgroundColor = null;
        }
    }
    document.getElementById("hpTheoryName_" + no).innerHTML = name;
}
function HPchecker() {
    console.log("HPchecker()");

    let i = 1;
    hpTheoryOutPut(i, "2n", 2, 0);
    i++;
    hpTheoryOutPut(i, "2n+1", 2, 1);
    i++;
    hpTheoryOutPut(i, "3n", 3, 0);
    i++;
    hpTheoryOutPut(i, "4n", 4, 0);
    i++;
    hpTheoryOutPut(i, "4n+1", 4, 1);
    i++;
    hpTheoryOutPut(i, "4n+1~+3", 4, "1~3");
    i++;
    hpTheoryOutPut(i, "6n-1", 6, -1);
    i++;
    hpTheoryOutPut(i, "8n", 8, 0);
    i++;
    hpTheoryOutPut(i, "8n+1~+3", 8, "1~3");
    i++;
    hpTheoryOutPut(i, "8n-1", 8, -1);
    i++;
    hpTheoryOutPut(i, "10n-1", 10, -1);
    i++;
    hpTheoryOutPut(i, "16n", 16, 0);
    i++;
    hpTheoryOutPut(i, "16n+1", 16, 1);
    i++;
    hpTheoryOutPut(i, "16n+1~+3", 16, "1~3");
    i++;
    hpTheoryOutPut(i, "16n-1", 16, -1);
    i++;
    hpTheoryOutPut(i, "50n+1", 50, 1);
    i++;

    if (Number(document.getElementById("Stats_H").value) >= 205) {
        document.getElementById("hpTheory_17").innerHTML = "○";//>=205
        document.getElementById("hpTheory_17").style.backgroundColor = "#FFE3E3";
    } else {
        document.getElementById("hpTheory_17").innerHTML = "+" + (205 - Number(document.getElementById("Stats_H").value));
        document.getElementById("hpTheory_17").style.backgroundColor = null;
    }
    document.getElementById("hpTheoryName_17").innerHTML = ">=205";
}

function setTitle() {
    console.log("setTitle()");

    if (document.getElementById("pokename").value === "") {
        document.title = "POKES STATS CALC";
    } else {
        name = pokemon[Number(document.getElementById("pokename").value)][0];
        Theory = nameofTheory();

        document.title = Theory + name + " - POKES STATS CALC";
    }

    return;
}

function setText() {
    console.log("setText()");

    if (document.getElementById("pokename").value === "") {
        document.getElementById("text").value = "";
    } else {
        name = pokemon[Number(document.getElementById("pokename").value)][0];
        EV = "";
        for (let i = 0; i < 6; i++) {
            EV += stats_name[i] + ":" + document.getElementById("EV_" + stats_name[i]).value;
            if (i !== 5)
                EV += ", ";
        }
        Nature = getNature();

        if (Nature.length < 3) {
            tab1 = "\t\t\t";
        } else if (Nature.length < 5) {
            tab1 = "\t\t";
        } else {
            tab1 = "\t";
        }

        document.getElementById("text").value = name + "\n" + EV + "\n" + Nature + tab1 + "S実数値: " + Speed_lv50;
    }
}

function Stats_calc(num, lv) {
    console.log("Stats_calc(" + num + "," + lv + ")");

    if (num === 0) {
        EV = Number(document.getElementById("EV_H").value);                 //努力値
        IV = Number(document.getElementById("IV_H").value);                 //個体値
        Basestats = Number(document.getElementById("Basestats_H").value);   //種族値
        result = Math.floor((Basestats * 2 + IV + Math.floor(EV / 4)) * lv / 100) + lv + 10;

        return result;
    } else {
        EV = Number(document.getElementById("EV_" + stats_name[num]).value);                 //努力値
        IV = Number(document.getElementById("IV_" + stats_name[num]).value);                 //個体値
        Basestats = Number(document.getElementById("Basestats_" + stats_name[num]).value);   //種族値
        if (document.getElementById("Nature_" + stats_name[num] + "_inc").checked) {
            Nature = 1.1;
        } else if (document.getElementById("Nature_" + stats_name[num] + "_dec").checked) {
            Nature = 0.9;
        } else {
            Nature = 1;
        }

        result = Math.floor((Math.floor((Basestats * 2 + IV + Math.floor(EV / 4)) * lv / 100) + 5) * Nature);

        return result;
    }
}

function EV_calc(num) {
    console.log("EV_calc(" + num + ")");

    lv = Number(document.getElementById("lv").value);
    if (num === 0) {
        IV = Number(document.getElementById("IV_H").value);                 //個体値
        Basestats = Number(document.getElementById("Basestats_H").value);   //種族値
        Stats = Number(document.getElementById("Stats_H").value);           //実数値

        EV = 0;
        while (Stats !== Math.floor((Basestats * 2 + IV + Math.floor(EV / 4)) * lv / 100) + lv + 10) {
            EV += 4;
            if (EV > 252) {
                EV = 252;
                break;
            }
        }

        return Number(EV);
    } else {
        IV = Number(document.getElementById("IV_" + stats_name[num]).value);                 //個体値
        Basestats = Number(document.getElementById("Basestats_" + stats_name[num]).value);   //種族値
        if (document.getElementById("Nature_" + stats_name[num] + "_inc").checked) {
            Nature = 1.1;
        } else if (document.getElementById("Nature_" + stats_name[num] + "_dec").checked) {
            Nature = 0.9;
        } else {
            Nature = 1;
        }
        Stats = Number(document.getElementById("Stats_" + stats_name[num]).value);   //実数値

        EV = 0;
        while (Stats !== Math.floor((Math.floor((Basestats * 2 + IV + Math.floor(EV / 4)) * lv / 100) + 5) * Nature)) {
            EV += 4;
            if (EV > 252) {
                EV = 252;
                break;
            }
        }

        return Number(EV);
    }
}

function setPokes() {
    console.log("setPokes()");

    for (let i = 0; i < 6; i++) {
        document.getElementById("Basestats_" + stats_name[i]).value =
                pokemon[Number(document.getElementById("pokename").value)][i + 1];
    }

    reCalc();
}

function all_set(num) {
    console.log("all_set(" + num + ")");

    for (let i = 0; i < 6; i++) {
        setEV(num, i);
    }
}

function setEV(num, id) {
    console.log("setEV(" + num + "," + id + ")");

    if (Number(document.getElementById("EV_" + stats_name[id]).value) < num) {
        if ((Number(document.getElementById("EV_total").value) + num) > 508) {
            console.log("setEV is over");
            num = 508 - (Number(document.getElementById("EV_total").value) - Number(document.getElementById("EV_" + stats_name[id]).value));
            while (num % 4 !== 0)
                num--;
            if (getStats(id, 50, num, "", "", "") === getStats(id, 50, num - 4, "", "", ""))
                num -= 4;
        }

        if (Number(document.getElementById("EV_" + stats_name[id]).value) < num)
            document.getElementById("EV_" + stats_name[id]).value = num;
    } else {
        document.getElementById("EV_" + stats_name[id]).value = num;
    }

    reCalc();
}

function setIV(num, id) {
    console.log("setIV(" + num + "," + id + ")");

    document.getElementById("IV_" + stats_name[id]).value = num;

    reCalc();
}

function setLv(num) {
    console.log("setLv(" + num + ")");

    document.getElementById("lv").value = num;

    reCalc();
}

function numCheck() {
    console.log("numCheck()");

    if (1 <= Number(document.getElementById('lv').value)
            && Number(document.getElementById('lv').value) <= 100) {
        document.getElementById('lv').style.color = "black";
    } else {
        document.getElementById('lv').style.color = "red";
    }
    if (0 <= Number(document.getElementById('EV_H').value)
            && Number(document.getElementById('EV_H').value) <= 252) {
        document.getElementById('EV_H').style.color = "black";
    } else {
        document.getElementById('EV_H').style.color = "red";
    }
    if (0 <= Number(document.getElementById('EV_A').value)
            && Number(document.getElementById('EV_A').value) <= 252) {
        document.getElementById('EV_A').style.color = "black";
    } else {
        document.getElementById('EV_A').style.color = "red";
    }
    if (0 <= Number(document.getElementById('EV_B').value)
            && Number(document.getElementById('EV_B').value) <= 252) {
        document.getElementById('EV_B').style.color = "black";
    } else {
        document.getElementById('EV_B').style.color = "red";
    }
    if (0 <= Number(document.getElementById('EV_C').value)
            && Number(document.getElementById('EV_C').value) <= 252) {
        document.getElementById('EV_C').style.color = "black";
    } else {
        document.getElementById('EV_C').style.color = "red";
    }
    if (0 <= Number(document.getElementById('EV_D').value)
            && Number(document.getElementById('EV_D').value) <= 252) {
        document.getElementById('EV_D').style.color = "black";
    } else {
        document.getElementById('EV_D').style.color = "red";
    }
    if (0 <= Number(document.getElementById('EV_S').value)
            && Number(document.getElementById('EV_S').value) <= 252) {
        document.getElementById('EV_S').style.color = "black";
    } else {
        document.getElementById('EV_S').style.color = "red";
    }
    if (0 <= Number(document.getElementById('EV_total').value)
            && Number(document.getElementById('EV_total').value) <= 510) {
        document.getElementById('EV_total').style.color = "black";
    } else {
        document.getElementById('EV_total').style.color = "red";
    }
    if (Number(document.getElementById('IV_H').value) === 31) {
        document.getElementById('IV_H').style.color = "black";
    } else {
        document.getElementById('IV_H').style.color = "red";
    }
    if (Number(document.getElementById('IV_A').value) === 31) {
        document.getElementById('IV_A').style.color = "black";
    } else {
        document.getElementById('IV_A').style.color = "red";
    }
    if (Number(document.getElementById('IV_B').value) === 31) {
        document.getElementById('IV_B').style.color = "black";
    } else {
        document.getElementById('IV_B').style.color = "red";
    }
    if (Number(document.getElementById('IV_C').value) === 31) {
        document.getElementById('IV_C').style.color = "black";
    } else {
        document.getElementById('IV_C').style.color = "red";
    }
    if (Number(document.getElementById('IV_D').value) === 31) {
        document.getElementById('IV_D').style.color = "black";
    } else {
        document.getElementById('IV_D').style.color = "red";
    }
    if (Number(document.getElementById('IV_S').value) === 31) {
        document.getElementById('IV_S').style.color = "black";
    } else {
        document.getElementById('IV_S').style.color = "red";
    }
    if (document.getElementById("pokename").value === "") {

    } else {
        if (Number(document.getElementById('Basestats_H').value) ===
                pokemon[Number(document.getElementById("pokename").value)][1]) {
            document.getElementById('Basestats_H').style.color = "black";
        } else {
            document.getElementById('Basestats_H').style.color = "red";
        }
        if (Number(document.getElementById('Basestats_A').value) ===
                pokemon[Number(document.getElementById("pokename").value)][2]) {
            document.getElementById('Basestats_A').style.color = "black";
        } else {
            document.getElementById('Basestats_A').style.color = "red";
        }
        if (Number(document.getElementById('Basestats_B').value) ===
                pokemon[Number(document.getElementById("pokename").value)][3]) {
            document.getElementById('Basestats_B').style.color = "black";
        } else {
            document.getElementById('Basestats_B').style.color = "red";
        }
        if (Number(document.getElementById('Basestats_C').value) ===
                pokemon[Number(document.getElementById("pokename").value)][4]) {
            document.getElementById('Basestats_C').style.color = "black";
        } else {
            document.getElementById('Basestats_C').style.color = "red";
        }
        if (Number(document.getElementById('Basestats_D').value) ===
                pokemon[Number(document.getElementById("pokename").value)][5]) {
            document.getElementById('Basestats_D').style.color = "black";
        } else {
            document.getElementById('Basestats_D').style.color = "red";
        }
        if (Number(document.getElementById('Basestats_S').value) ===
                pokemon[Number(document.getElementById("pokename").value)][6]) {
            document.getElementById('Basestats_S').style.color = "black";
        } else {
            document.getElementById('Basestats_S').style.color = "red";
        }
    }
}

function total_ev() {
    console.log("total_ev()");

    result = 0;
    result += Number(document.getElementById('EV_H').value);
    result += Number(document.getElementById('EV_A').value);
    result += Number(document.getElementById('EV_B').value);
    result += Number(document.getElementById('EV_C').value);
    result += Number(document.getElementById('EV_D').value);
    result += Number(document.getElementById('EV_S').value);

    return result;
}

function total_bs() {
    console.log("total_bs()");

    result = 0;
    result += Number(document.getElementById('Basestats_H').value);
    result += Number(document.getElementById('Basestats_A').value);
    result += Number(document.getElementById('Basestats_B').value);
    result += Number(document.getElementById('Basestats_C').value);
    result += Number(document.getElementById('Basestats_D').value);
    result += Number(document.getElementById('Basestats_S').value);

    return result;
}

function set_Nature(crease, num) {
    console.log("set_Nature(" + crease + "," + num + ")");

    if (crease === 0) {
        if (num === 1) {
            document.getElementById('Nature_A_dec').checked = false;
            document.getElementById('Nature_B_inc').checked = false;
            document.getElementById('Nature_C_inc').checked = false;
            document.getElementById('Nature_D_inc').checked = false;
            document.getElementById('Nature_S_inc').checked = false;
        }
        if (num === 2) {
            document.getElementById('Nature_B_dec').checked = false;
            document.getElementById('Nature_A_inc').checked = false;
            document.getElementById('Nature_C_inc').checked = false;
            document.getElementById('Nature_D_inc').checked = false;
            document.getElementById('Nature_S_inc').checked = false;
        }
        if (num === 3) {
            document.getElementById('Nature_C_dec').checked = false;
            document.getElementById('Nature_A_inc').checked = false;
            document.getElementById('Nature_B_inc').checked = false;
            document.getElementById('Nature_D_inc').checked = false;
            document.getElementById('Nature_S_inc').checked = false;
        }
        if (num === 4) {
            document.getElementById('Nature_D_dec').checked = false;
            document.getElementById('Nature_A_inc').checked = false;
            document.getElementById('Nature_B_inc').checked = false;
            document.getElementById('Nature_C_inc').checked = false;
            document.getElementById('Nature_S_inc').checked = false;
        }
        if (num === 5) {
            document.getElementById('Nature_S_dec').checked = false;
            document.getElementById('Nature_A_inc').checked = false;
            document.getElementById('Nature_B_inc').checked = false;
            document.getElementById('Nature_C_inc').checked = false;
            document.getElementById('Nature_D_inc').checked = false;
        }
    } else {
        if (num === 1) {
            document.getElementById('Nature_A_inc').checked = false;
            document.getElementById('Nature_B_dec').checked = false;
            document.getElementById('Nature_C_dec').checked = false;
            document.getElementById('Nature_D_dec').checked = false;
            document.getElementById('Nature_S_dec').checked = false;
        }
        if (num === 2) {
            document.getElementById('Nature_B_inc').checked = false;
            document.getElementById('Nature_A_dec').checked = false;
            document.getElementById('Nature_C_dec').checked = false;
            document.getElementById('Nature_D_dec').checked = false;
            document.getElementById('Nature_S_dec').checked = false;
        }
        if (num === 3) {
            document.getElementById('Nature_C_inc').checked = false;
            document.getElementById('Nature_A_dec').checked = false;
            document.getElementById('Nature_B_dec').checked = false;
            document.getElementById('Nature_D_dec').checked = false;
            document.getElementById('Nature_S_dec').checked = false;
        }
        if (num === 4) {
            document.getElementById('Nature_D_inc').checked = false;
            document.getElementById('Nature_A_dec').checked = false;
            document.getElementById('Nature_B_dec').checked = false;
            document.getElementById('Nature_C_dec').checked = false;
            document.getElementById('Nature_S_dec').checked = false;
        }
        if (num === 5) {
            document.getElementById('Nature_S_inc').checked = false;
            document.getElementById('Nature_A_dec').checked = false;
            document.getElementById('Nature_B_dec').checked = false;
            document.getElementById('Nature_C_dec').checked = false;
            document.getElementById('Nature_D_dec').checked = false;
        }
    }

    reCalc();
    return;
}

function getStats(num, lv, EV, IV, Basestats, Nature) {
    console.log("getStats(" + num + "," + lv + "," + EV + "," + IV + "," + Basestats + Nature + ")");

    if (num === 0) {
        if (EV === "")
            EV = Number(document.getElementById("EV_H").value);                 //努力値
        if (IV === "")
            IV = Number(document.getElementById("IV_H").value);                 //個体値
        if (Basestats === "")
            Basestats = Number(document.getElementById("Basestats_H").value);   //種族値
        result = Math.floor((Basestats * 2 + IV + Math.floor(EV / 4)) * lv / 100) + lv + 10;

        return result;
    } else {
        if (EV === "")
            EV = Number(document.getElementById("EV_" + stats_name[num]).value);                 //努力値
        if (IV === "")
            IV = Number(document.getElementById("IV_" + stats_name[num]).value);                 //個体値
        if (Basestats === "")
            Basestats = Number(document.getElementById("Basestats_" + stats_name[num]).value);   //種族値
        if (Nature === "") {
            if (document.getElementById("Nature_" + stats_name[num] + "_inc").checked) {
                Nature = 1.1;
            } else if (document.getElementById("Nature_" + stats_name[num] + "_dec").checked) {
                Nature = 0.9;
            } else {
                Nature = 1;
            }
        }

        result = Math.floor((Math.floor((Basestats * 2 + IV + Math.floor(EV / 4)) * lv / 100) + 5) * Nature);

        return result;
    }
}

function getNature() {
    console.log("getNature()");

    if (document.getElementById('Nature_A_inc').checked) {
        if (document.getElementById('Nature_B_dec').checked)
            return "さみしがり";
        if (document.getElementById('Nature_C_dec').checked)
            return "いじっぱり";
        if (document.getElementById('Nature_D_dec').checked)
            return "やんちゃ";
        if (document.getElementById('Nature_S_dec').checked)
            return "ゆうかん";
        return "？？？";
    } else if (document.getElementById('Nature_B_inc').checked) {
        if (document.getElementById('Nature_A_dec').checked)
            return "ずぶとい";
        if (document.getElementById('Nature_C_dec').checked)
            return "わんぱく";
        if (document.getElementById('Nature_D_dec').checked)
            return "のうてんき";
        if (document.getElementById('Nature_S_dec').checked)
            return "のんき";
        return "？？？";
    } else if (document.getElementById('Nature_C_inc').checked) {
        if (document.getElementById('Nature_A_dec').checked)
            return "ひかえめ";
        if (document.getElementById('Nature_B_dec').checked)
            return "おっとり";
        if (document.getElementById('Nature_D_dec').checked)
            return "うっかりや";
        if (document.getElementById('Nature_S_dec').checked)
            return "れいせい";
        return "？？？";
    } else if (document.getElementById('Nature_D_inc').checked) {
        if (document.getElementById('Nature_A_dec').checked)
            return "おだやか";
        if (document.getElementById('Nature_B_dec').checked)
            return "おとなしい";
        if (document.getElementById('Nature_C_dec').checked)
            return "しんちょう";
        if (document.getElementById('Nature_S_dec').checked)
            return "なまいき";
        return "？？？";
    } else if (document.getElementById('Nature_S_inc').checked) {
        if (document.getElementById('Nature_A_dec').checked)
            return "おくびょう";
        if (document.getElementById('Nature_B_dec').checked)
            return "せっかち";
        if (document.getElementById('Nature_C_dec').checked)
            return "ようき";
        if (document.getElementById('Nature_D_dec').checked)
            return "むじゃき";
        return "？？？";
    } else {
        if (document.getElementById('Nature_A_dec').checked)
            return "？？？";
        if (document.getElementById('Nature_B_dec').checked)
            return "？？？";
        if (document.getElementById('Nature_C_dec').checked)
            return "？？？";
        if (document.getElementById('Nature_D_dec').checked)
            return "？？？";
        if (document.getElementById('Nature_S_dec').checked)
            return "？？？";
        return "まじめ";
    }
}

function setPoke2_speed(theory) {
    console.log("setPoke2_speed()");

    document.getElementById("poke2_speed").value = setPoke2_button(theory);
    return;
}

function setPoke2_button(theory) {
    console.log("setPoke2_button(" + theory + ")");

    if (document.getElementById("pokename2").value === '') {
        return "";
    } else {
        EV = 0;
        IV = 0;
        Nature = 1;
        if (theory === 'min') {
            document.getElementById('poke2_sMax').style.color = "#888";
            document.getElementById('poke2_sHig').style.color = "#888";
            document.getElementById('poke2_sNor').style.color = "#888";
            document.getElementById('poke2_sLow').style.color = "#888";
            document.getElementById('poke2_sMin').style.color = "#000";
            EV = 0;
            IV = 0;
            Nature = 0.9;
        } else if (theory === 'max') {
            document.getElementById('poke2_sMax').style.color = "#000";
            document.getElementById('poke2_sHig').style.color = "#888";
            document.getElementById('poke2_sNor').style.color = "#888";
            document.getElementById('poke2_sLow').style.color = "#888";
            document.getElementById('poke2_sMin').style.color = "#888";
            EV = 252;
            IV = 31;
            Nature = 1.1;
        } else if (theory === 'high') {
            document.getElementById('poke2_sMax').style.color = "#888";
            document.getElementById('poke2_sHig').style.color = "#000";
            document.getElementById('poke2_sNor').style.color = "#888";
            document.getElementById('poke2_sLow').style.color = "#888";
            document.getElementById('poke2_sMin').style.color = "#888";
            EV = 252;
            IV = 31;
            Nature = 1;
        } else if (theory === 'low') {
            document.getElementById('poke2_sMax').style.color = "#888";
            document.getElementById('poke2_sHig').style.color = "#888";
            document.getElementById('poke2_sNor').style.color = "#888";
            document.getElementById('poke2_sLow').style.color = "#000";
            document.getElementById('poke2_sMin').style.color = "#888";
            EV = 0;
            IV = 31;
            Nature = 0.9;
        } else if (theory === 'normal') {
            document.getElementById('poke2_sMax').style.color = "#888";
            document.getElementById('poke2_sHig').style.color = "#888";
            document.getElementById('poke2_sNor').style.color = "#000";
            document.getElementById('poke2_sLow').style.color = "#888";
            document.getElementById('poke2_sMin').style.color = "#888";
            EV = 0;
            IV = 31;
            Nature = 1;
        }

        speed = pokemon[Number(document.getElementById("pokename2").value)][6];
        result = getStats(5, 50, EV, IV, speed, Nature);

        return result;
    }
}

function hpTable_display() {
    console.log("hpTable_display()");

    var change = document.getElementById("hpTheory");

    if (change.style.display === "block") {
        change.style.display = "none";
        document.getElementById("hpTheory_title").innerHTML = "#HP調整表 ▽";
    } else {
        change.style.display = "block";
        document.getElementById("hpTheory_title").innerHTML = "#HP調整表 △";
    }
}

function info_display() {
    console.log("info_display()");

    var change = document.getElementById("info");

    if (change.style.display === "block") {
        change.style.display = "none";
        document.getElementById("info_title").innerHTML = "#このサイトについて ▽";
    } else {
        change.style.display = "block";
        document.getElementById("info_title").innerHTML = "#このサイトについて △";
    }
}

function real_speed() {
    console.log("real_speed()");

    result = document.getElementById("Stats_S").value;

    if (Number(document.getElementById("s_rank").value) >= 0) {
        rank = (Number(document.getElementById('s_rank').value) + 2) / 2;
    } else {
        rank = 2 / (2 - Number(document.getElementById('s_rank').value));
    }
    result = Math.floor(result * rank);

    skill = 1;
    if (document.getElementById("s_skill").value !== '')
        skill = Number(speed_skill[Number(document.getElementById("s_skill").value)][1]);
    result = Math.floor(result * skill);

    item = 1;
    if (document.getElementById("s_item").value !== '') {
        if (Number(document.getElementById("s_item").value) === 1) {
            if (Number(document.getElementById("pokename").value) === 363)
                item = Number(speed_item[Number(document.getElementById("s_item").value)][1]);
        } else {
            item = Number(speed_item[Number(document.getElementById("s_item").value)][1]);
        }
    }
    result = Math.floor(result * item);

    if (document.getElementById("Paralysis").checked
            && Number(document.getElementById("s_skill").value) !== 6)
        result = Math.floor(result / 2);

    if (document.getElementById("Tailwind").checked)
        result = Math.floor(result * 2);

    document.getElementById("real_Speed").value = result;
}
