var black = '\u001b[30m';
var red = '\u001b[31m';
var green = '\u001b[32m';
var yellow = '\u001b[33m';
var blue = '\u001b[34m';
var magenta = '\u001b[35m';
var cyan = '\u001b[36m';
var white = '\u001b[37m';

var reset = '\u001b[0m';

var img_no1 = 0;
var img_no2 = 0;
var sc_list = [];
var sc_list_delete_button = '';
var sc_button = '';
var x_list = [0, 0, 0, 0, 0, 0];
var numcheck_list =
        [0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0];

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

let type_name = [
    "null", "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground",
    "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
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
    ["ようりょくそ", "2.0"],
    ["スロースタート", "0.5"]
];

let speed_item = [
    ["こだわりスカーフ", "1.5"],
    ["スピードパウダー", "2.0"],
    ["きょうせいギプス", "0.5"],
    ["くろいてっきゅう", "0.5"],
    ["パワー系アイテム", "0.5"]
];

window.onload = function () {
    first_setup();
    reCalc();
    setHpInfo();

    const loader = document.getElementById('loader');
    loader.classList.add('loaded');
};

function first_setup() {
    console.log("first_setup()");

    for (let i = 0; i < pokemon.length; i++) {
        document.getElementById("pokename_" + i).innerHTML = pokemon[i][0];
    }
    for (let i = 0; i < pokemon.length; i++) {
        document.getElementById("pokename2_" + i).innerHTML = pokemon[i][0] + " (" + pokemon[i][6] + ")";
    }
    for (let i = 0; i < speed_skill.length; i++) {
        document.getElementById("s_skill_" + i).innerHTML =
                speed_skill[i][0] + "(×" + speed_skill[i][1] + ")";
        document.getElementById("s_skill2_" + i).innerHTML =
                speed_skill[i][0] + "(×" + speed_skill[i][1] + ")";
    }
    for (let i = 0; i < speed_item.length; i++) {
        document.getElementById("s_item_" + i).innerHTML =
                speed_item[i][0] + "(×" + speed_item[i][1] + ")";
        document.getElementById("s_item2_" + i).innerHTML =
                speed_item[i][0] + "(×" + speed_item[i][1] + ")";
    }

    setupSpeedbutton();

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
        $("#s_skill2").select2({
            language: "ja",
            matcher: customMatcher
        });
        $("#s_item2").select2({
            language: "ja",
            matcher: customMatcher
        });
    });
}

function setupSpeedbutton() {
    document.getElementById('poke2_sMax').style.color = 'var(--js-speed-none)';
    document.getElementById('poke2_sHig').style.color = 'var(--js-speed-none)';
    document.getElementById('poke2_sNor').style.color = 'var(--js-speed-none)';
    document.getElementById('poke2_sLow').style.color = 'var(--js-speed-none)';
    document.getElementById('poke2_sMin').style.color = 'var(--js-speed-none)';
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
        if (document.getElementById("EV_" + stats_name[i]).value === '') {
            document.getElementById("EV_" + stats_name[i]).value = 0;
        }
        if (x_list[i] === 1) {
            document.getElementById("EV_" + stats_name[i]).value = 0;
        }
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
    poke1_imgs();
    color();

    return;
}

function byStats(change) {
    console.log("byStats("+change+")");

    for (let i = 0; i < 6; i++) {
        if (EV_calc(i,change) >= 0)
            document.getElementById("EV_" + stats_name[i]).value = EV_calc(i,change);
        console.log(EV_calc(i,change));
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

    return "<span style='color:#ef5350;'>+" + plus + "</span> / <span style='color:#1297ff;'>-" + minus + "</span>";
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

    return "<span style='color:#ef5350;'>+" + plus + "</span> / <span style='color:#1297ff;'>-" + minus + "</span>";
}
function HPcheck(A, B) {
    console.log("HPcheck(" + A + "," + B + ")");

    if (ANplusB_H(A, B)) {
        return "O";
    } else {
        return ANplusB_excess(A, B);
    }
}
function HPcheck_3point(A, B1, B2, B3) {
    console.log("HPcheck_3point(" + A + ", " + B1 + ", " + B2 + ", " + B3 + ")");

    if (ANplusB_H(A, B1) || ANplusB_H(A, B2) || ANplusB_H(A, B3)) {
        return "O";
    } else {
        return ANplusB_excess_3point(A, B1, B2, B3);
    }
}
function hpTheoryOutPut(no, name, A, B) {
    console.log("hpTheoryOutPut(" + no + "," + name + "," + A + "," + B + ")");


    if (B === "1~3") {
        document.getElementById("hpTheory_" + no).innerHTML = HPcheck_3point(A, 1, 2, 3);
        if (ANplusB_H(A, 1) || ANplusB_H(A, 2) || ANplusB_H(A, 3)) {
            document.getElementById("hpTheory_" + no).style.backgroundColor = 'var(--js-hptheory-bg)';
        } else {
            document.getElementById("hpTheory_" + no).style.backgroundColor = null;
        }
    } else {
        document.getElementById("hpTheory_" + no).innerHTML = HPcheck(A, B);
        if (ANplusB_H(A, B)) {
            document.getElementById("hpTheory_" + no).style.backgroundColor = 'var(--js-hptheory-bg)';
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
        document.getElementById("hpTheory_17").innerHTML = "O";//>=205
        document.getElementById("hpTheory_17").style.backgroundColor = 'var(--js-hptheory-bg)';
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
        Stats = "";
        for (let i = 0; i < 6; i++) {
            if (x_list[i] === 0) {
                Stats += Stats_calc(i, 50);
                if (Number(document.getElementById("EV_" + stats_name[i]).value) !== 0) {
                    Stats += "(" + document.getElementById("EV_" + stats_name[i]).value + ")";
                }
            } else {
                Stats += "x";
            }
            if (i !== 5)
                Stats += "-";
        }
        Nature = getNature();

        if (Nature.length < 3) {
            tab1 = "\t\t\t";
        } else if (Nature.length < 5) {
            tab1 = "\t\t";
        } else {
            tab1 = "\t";
        }

        EV = "";
        for (let i = 0; i < 6; i++) {
            if (Number(document.getElementById("EV_" + stats_name[i]).value) !== 0) {
                if (i !== 0) {
                    if (Number(document.getElementById("EV_" + stats_name[i - 1]).value) !== 0) {
                        EV += " ";
                    }
                }
                EV += stats_name[i] + document.getElementById("EV_" + stats_name[i]).value;
            }
        }

        document.getElementById("text").value = name + "\n" + Stats + "\n" + Nature + tab1 + EV;
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

function EV_calc(num, sign) {
    console.log("EV_calc(" + num + sign + ")");

    lv = Number(document.getElementById("lv").value);
    if (num === 0) {
        IV = Number(document.getElementById("IV_H").value);                 //個体値
        Basestats = Number(document.getElementById("Basestats_H").value);   //種族値
        Stats = Number(document.getElementById("Stats_H").value);           //実数値

        EV = 0;
        while (Stats !== Math.floor((Basestats * 2 + IV + Math.floor(EV / 4)) * lv / 100) + lv + 10) {
            EV += 4;
            if (EV > 252) {
                if (Math.floor((Basestats * 2 + IV + Math.floor(EV / 4)) * lv / 100) + lv + 10 > Stats) {
                    EV = 0;
                } else {
                    EV = 252;
                }
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
        EV_all = [];
        EV_check = 0;
        while (Stats !== Math.floor((Math.floor((Basestats * 2 + IV + Math.floor(EV / 4)) * lv / 100) + 5) * Nature)) {
            EV += 4;
            EV_all[(EV / 4) - 1] = Math.floor((Math.floor((Basestats * 2 + IV + Math.floor(EV / 4)) * lv / 100) + 5) * Nature);
            if (EV > 252) {
                EV_check = 1;
                if (Math.floor((Math.floor((Basestats * 2 + IV + Math.floor(EV / 4)) * lv / 100) + 5) * Nature) > Stats) {
                    EV = 0;
                } else {
                    EV = 252;
                }
                break;
            }
        }

        if (EV_check === 1) {
            if (sign > 0) {
                for (let i = 0; i < EV_all.length; i++) {
                    if (Stats < EV_all[i]) {
                        EV = (i + 1) * 4;
                        break
                    }
                }
            } else {
                for (let i = (EV_all.length - 1); i > 0; i--) {
                    if (Stats > EV_all[i]) {
                        EV = (i + 1) * 4;
                        break
                    }
                }
            }
        }

        return Number(EV);
    }
}

function setPokes() {
    console.log("setPokes()");

    SC_list_reset();
    for (let i = 0; i < 6; i++) {
        document.getElementById("Basestats_" + stats_name[i]).value =
                pokemon[Number(document.getElementById("pokename").value)][i + 1];
    }

    x_list = [0, 0, 0, 0, 0, 0];

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

function numCheck_parts(name, max, min) {
    console.log("numCheck_parts(" + name + "," + max + "," + min + ")");

    if (min === undefined) {
        n = max;
    } else {
        n = min;
    }
    if (n <= Number(document.getElementById(name).value)
            && Number(document.getElementById(name).value) <= max) {
        document.getElementById(name).style.color = null;
        document.getElementById(name).style.background = null;
        document.getElementById(name).style.border = null;
    } else {
        document.getElementById(name).style.color = 'var(--js-err-no-text)';
        document.getElementById(name).style.background = 'var(--js-err-no-bg)';
        document.getElementById(name).style.border = "1px solid var(--js-err-no-text)";
    }

    return (!(n <= Number(document.getElementById(name).value)
            && Number(document.getElementById(name).value) <= max));
}

function numCheck() {
    console.log("numCheck()");

    numCheck_parts('lv', 100, 1);
    numcheck_list[0] = numCheck_parts('EV_H', 252, 0);
    numcheck_list[1] = numCheck_parts('EV_A', 252, 0);
    numcheck_list[2] = numCheck_parts('EV_B', 252, 0);
    numcheck_list[3] = numCheck_parts('EV_C', 252, 0);
    numcheck_list[4] = numCheck_parts('EV_D', 252, 0);
    numcheck_list[5] = numCheck_parts('EV_S', 252, 0);
    numCheck_parts('EV_total', 510, 0);
    numcheck_list[6] = numCheck_parts('IV_H', 31);
    numcheck_list[7] = numCheck_parts('IV_A', 31);
    numcheck_list[8] = numCheck_parts('IV_B', 31);
    numcheck_list[9] = numCheck_parts('IV_C', 31);
    numcheck_list[10] = numCheck_parts('IV_D', 31);
    numcheck_list[11] = numCheck_parts('IV_S', 31);
    if (document.getElementById("pokename").value === "") {

    } else {
        for (let i = 0; i < 6; i++) {
            numCheck_parts('Basestats_' + stats_name[i],
                    pokemon[Number(document.getElementById("pokename").value)][i + 1]);
        }
    }
}

function total_ev() {
    console.log("total_ev()");

    result = 0;
    for (let i = 0; i < 6; i++) {
        result += Number(document.getElementById('EV_' + stats_name[i]).value);
    }

    return result;
}

function total_bs() {
    console.log("total_bs()");

    result = 0;
    for (let i = 0; i < 6; i++) {
        result += Number(document.getElementById('Basestats_' + stats_name[i]).value);
    }

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

    real_speed2();
    poke2_imgs();
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
            setupSpeedbutton();
            sc_button = "最遅";
            document.getElementById('poke2_sMin').style.color = 'var(--js-speed-selected)';
            EV = 0;
            IV = 0;
            Nature = 0.9;
        } else if (theory === 'max') {
            setupSpeedbutton();
            sc_button = "最速";
            document.getElementById('poke2_sMax').style.color = 'var(--js-speed-selected)';
            EV = 252;
            IV = 31;
            Nature = 1.1;
        } else if (theory === 'high') {
            setupSpeedbutton();
            sc_button = "準速";
            document.getElementById('poke2_sHig').style.color = 'var(--js-speed-selected)';
            EV = 252;
            IV = 31;
            Nature = 1;
        } else if (theory === 'low') {
            setupSpeedbutton();
            sc_button = "下降";
            document.getElementById('poke2_sLow').style.color = 'var(--js-speed-selected)';
            EV = 0;
            IV = 31;
            Nature = 0.9;
        } else if (theory === 'normal') {
            setupSpeedbutton();
            sc_button = "無振";
            document.getElementById('poke2_sNor').style.color = 'var(--js-speed-selected)';
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

    if (change.style.display === "table") {
        change.style.display = "none";
        document.getElementById("hpTheory_title").innerHTML = "#HP調整表 ▼";
    } else {
        change.style.display = "table";
        document.getElementById("hpTheory_title").innerHTML = "#HP調整表 ▲";
    }
}

function info_display() {
    console.log("info_display()");

    var change = document.getElementById("info");

    if (change.style.display === "block") {
        change.style.display = "none";
        document.getElementById("info_title").innerHTML = "#このサイトについて ▼";
    } else {
        change.style.display = "block";
        document.getElementById("info_title").innerHTML = "#このサイトについて ▲";
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
    if (document.getElementById("s_skill").value !== '') {
        skill = Number(speed_skill[Number(document.getElementById("s_skill").value)][1]);
        if (document.getElementById("s_skill").value === '0') {
            if (document.getElementById("s_item").value === '') {
                skill = Number(speed_skill[Number(document.getElementById("s_skill").value)][1]);
            } else {
                skill = 1;
            }
        }
    }

    item = 1;
    if (document.getElementById("s_item").value !== '') {
        if (Number(document.getElementById("s_item").value) === 1) {
            if (pokemon[Number(document.getElementById("pokename").value)][0] === 'メタモン')
                item = Number(speed_item[Number(document.getElementById("s_item").value)][1]);
        } else {
            item = Number(speed_item[Number(document.getElementById("s_item").value)][1]);
        }
    }

    revision = skill * item;

    if (document.getElementById("Tailwind").checked)
        revision *= 2;

    if (document.getElementById("Wetlands").checked)
        revision *= 1 / 4;

    roundedup = 0;
    if ((result * revision) - (Math.floor(result * revision)) >= 0.75) {
        roundedup = 1;
    }

    result = Math.floor(result * revision) + roundedup;

    if (document.getElementById("Paralysis").checked
            && Number(document.getElementById("s_skill").value) !== 6)
        result = Math.floor(result / 2);

    document.getElementById("real_Speed").value = result;
}

function click_arrow(type, num, change) {
    console.log("click_arrow(" + type + "," + num + "," + change + ")");

    if (type === 'lv') {
        result = Number(document.getElementById(type).value) + Number(change);
    } else {
        result = Number(document.getElementById(type + "_" + stats_name[num]).value) + Number(change);
    }

    if (type === 'EV') {
        if (result > 252 || result < 0)
            result = Number(document.getElementById(type + "_" + stats_name[num]).value);
    } else if (type === 'IV') {
        if (result > 31 || result < 0)
            result = Number(document.getElementById(type + "_" + stats_name[num]).value);
    } else if (type === 'lv') {
        if (result > 100 || result < 1)
            result = Number(document.getElementById(type).value);
    } else if (type === 'Basestats') {
        if (result > 999 || result < 1)
            result = Number(document.getElementById(type + "_" + stats_name[num]).value);
    }

    if (type === 'lv') {
        document.getElementById(type).value = result;
    } else {
        document.getElementById(type + "_" + stats_name[num]).value = result;
    }

    if (type === 'Stats') {
        byStats(change);
    } else {
        reCalc();
    }
    return;
}

function poke1_imgs() {
    console.log("poke1_imgs()");

    if (document.getElementById("pokename").value !== "") {
        img_no_1 = img[Number(document.getElementById("pokename").value)][0];
    } else {
        img_no_1 = 589;
    }

    set1imgs();
}

function set1imgs() {
    document.getElementById("poke1_icon").src =
            "img/pokes-icon/poke_"
            + img_no_1 + ".png";

    poke1_types();
}

function set2imgs() {
    document.getElementById("poke2_icon").src =
            "img/pokes-icon/poke_"
            + img_no_2 + ".png";
}

function poke2_imgs() {
    console.log("poke2_imgs()");

    if (document.getElementById("pokename2").value !== "") {
        img_no_2 = img[Number(document.getElementById("pokename2").value)][0];
    } else {
        img_no_2 = 589;
    }
    set2imgs();
}

function poke1_types() {
    console.log("poke1_types()");

    type1 = type[img_no_1 - 1][0];
    type2 = type[img_no_1 - 1][1];

    document.getElementById("poke1_type1").src =
            "img/type-icon/"
            + type_name[type1] + ".png";
    document.getElementById("poke1_type2").src =
            "img/type-icon/"
            + type_name[type2] + ".png";
}

function nextIMG() {
    console.log("nextIMG()");

    if (img[Number(document.getElementById("pokename").value)][1] !== 0) {
        if (img_no_1 + 1 <= img[Number(document.getElementById("pokename").value)][1]) {
            img_no_1++;
        } else {
            img_no_1 = img[Number(document.getElementById("pokename").value)][0];
        }

        set1imgs();
    } else {
        if (nextPOKE(document.getElementById("pokename").value) !== null) {
            $('#pokename').val(Number(nextPOKE(document.getElementById("pokename").value))).trigger('change');
            console.log("change:" + pokemon[Number(nextPOKE(document.getElementById("pokename").value))][0]);
            setPokes();
        }
    }
}

function nextIMG2() {
    console.log("nextIMG2()");

    if (img[Number(document.getElementById("pokename2").value)][1] !== 0) {
        if (img_no_2 + 1 <= img[Number(document.getElementById("pokename2").value)][1]) {
            img_no_2++;
        } else {
            img_no_2 = img[Number(document.getElementById("pokename2").value)][0];
        }

        set2imgs();
    } else {
        if (nextPOKE(document.getElementById("pokename2").value) !== null) {
            $('#pokename2').val(Number(nextPOKE(document.getElementById("pokename2").value))).trigger('change');
            console.log("change:" + pokemon[Number(nextPOKE(document.getElementById("pokename2").value))][0]);
            setPoke2_speed('max');
        }
    }
}

function nextPOKE(num) {
    result = null;
    if (pokemon[Number(num)][0] === 'イエッサン♀') {
        result = pokesNo_search('イエッサン♂');
    } else if (pokemon[Number(num)][0] === 'イエッサン♂') {
        result = pokesNo_search('イエッサン♀');
    } else if (pokemon[Number(num)][0] === 'イルカマン(ナイーブ)') {
        result = pokesNo_search('イルカマン(マイティ)');
    } else if (pokemon[Number(num)][0] === 'イルカマン(マイティ)') {
        result = pokesNo_search('イルカマン(ナイーブ)');
    } else if (pokemon[Number(num)][0] === 'コオリッポ(アイス)') {
        result = pokesNo_search('コオリッポ(ナイス)');
    } else if (pokemon[Number(num)][0] === 'コオリッポ(ナイス)') {
        result = pokesNo_search('コオリッポ(アイス)');
    } else if (pokemon[Number(num)][0] === 'ニャース') {
        result = pokesNo_search('ガラルニャース');
    } else if (pokemon[Number(num)][0] === 'ガラルニャース') {
        result = pokesNo_search('ニャース');
    } else if (pokemon[Number(num)][0] === 'ウパー') {
        result = pokesNo_search('パルデアウパー');
    } else if (pokemon[Number(num)][0] === 'パルデアウパー') {
        result = pokesNo_search('ウパー');
    } else if (pokemon[Number(num)][0] === 'パフュートン♀') {
        result = pokesNo_search('パフュートン♂');
    } else if (pokemon[Number(num)][0] === 'パフュートン♂') {
        result = pokesNo_search('パフュートン♀');
    } else if (pokemon[Number(num)][0] === '真昼ルガルガン') {
        result = pokesNo_search('真夜中ルガルガン');
    } else if (pokemon[Number(num)][0] === '真夜中ルガルガン') {
        result = pokesNo_search('黄昏ルガルガン');
    } else if (pokemon[Number(num)][0] === '黄昏ルガルガン') {
        result = pokesNo_search('真昼ルガルガン');
    } else if (pokemon[Number(num)][0] === 'ロトム') {
        result = pokesNo_search('ヒートロトム');
    } else if (pokemon[Number(num)][0] === 'ヒートロトム') {
        result = pokesNo_search('ウォッシュロトム');
    } else if (pokemon[Number(num)][0] === 'ウォッシュロトム') {
        result = pokesNo_search('フロストロトム');
    } else if (pokemon[Number(num)][0] === 'フロストロトム') {
        result = pokesNo_search('スピンロトム');
    } else if (pokemon[Number(num)][0] === 'スピンロトム') {
        result = pokesNo_search('カットロトム');
    } else if (pokemon[Number(num)][0] === 'カットロトム') {
        result = pokesNo_search('ロトム');
    }

    return result;
}

function pokesNo_search(name) {
    result = 0;
    pokemon.forEach((row, i) => {
        let colIndex = row.indexOf(name);
        if (colIndex >= 0) {
            result = i;
        }
    });
    return result;
}

function real_speed2() {
    console.log("real_speed2()");

    if (document.getElementById("pokename2").value === "") {
        result = "";
    } else {
        result = document.getElementById("poke2_speed").value;

        if (Number(document.getElementById("s_rank2").value) >= 0) {
            rank = (Number(document.getElementById('s_rank2').value) + 2) / 2;
        } else {
            rank = 2 / (2 - Number(document.getElementById('s_rank2').value));
        }
        result = Math.floor(result * rank);

        skill = 1;
        if (document.getElementById("s_skill2").value !== '') {
            skill = Number(speed_skill[Number(document.getElementById("s_skill2").value)][1]);
            if (document.getElementById("s_skill2").value === '0') {
                if (document.getElementById("s_item2").value === '') {
                    skill = Number(speed_skill[Number(document.getElementById("s_skill2").value)][1]);
                } else {
                    skill = 1;
                }
            }
        }

        item = 1;
        if (document.getElementById("s_item2").value !== '') {
            if (Number(document.getElementById("s_item2").value) === 1) {
                if (pokemon[Number(document.getElementById("pokename2").value)][0] === 'メタモン')
                    item = Number(speed_item[Number(document.getElementById("s_item2").value)][1]);
            } else {
                item = Number(speed_item[Number(document.getElementById("s_item2").value)][1]);
            }
        }

        revision = skill * item;

        if (document.getElementById("Tailwind2").checked)
            revision *= 2;

        if (document.getElementById("Wetlands2").checked)
            revision *= 1 / 4;

        roundedup = 0;
        if ((result * revision) - (Math.floor(result * revision)) >= 0.75) {
            roundedup = 1;
        }

        result = Math.floor(result * revision) + roundedup;

        if (document.getElementById("Paralysis2").checked
                && Number(document.getElementById("s_skill2").value) !== 6)
            result = Math.floor(result / 2);
    }
    document.getElementById("real_Speed2").value = result;
}

function SC_list_set(num) {
    console.log("SC_list_set(" + num + ")");

    if (num === undefined) {
        add = 0;
    } else {
        add = 1;
    }

    result = "";
    for (let i = 0; i < sc_list.length; i++) {
        if (add === 1 && i === num) {
            result += "<pre><li>" + "deleted" + "</li></pre>";
        }
        result += "<pre><li><a class='sc_list' onclick='deleteon(" + i + ")'>" + sc_list[i] + "</a>";
        if (sc_list_delete_button === i) {
            result += "<span class='sc_delete'> / <a onclick='SC_list_delete(" +
                    i + ")'>DELETE</a></span>";
        }
        result += "</li></pre>";
    }
    document.getElementById("speedcomparison_list").innerHTML = result;
}

function SC_list_add() {
    console.log("SC_list_add()");

    if (document.getElementById("pokename2").value === '') {

    } else {
        result = "";
        if ((document.getElementById("real_Speed2").value).length >= 3) {
            tab = "&#009;";
        } else {
            tab = "&#009;&#009;";
        }
        result += document.getElementById("real_Speed2").value + " -" + tab
                + sc_button + pokemon[Number(document.getElementById("pokename2").value)][0];
        if (Number(document.getElementById("s_rank2").value) !== 0) {
            result += "&ensp;";
            result += document.getElementById("s_rank2").value + "積み";
        }

        if (document.getElementById("s_skill2").value !== ""
                || document.getElementById("s_item2").value !== ""
                || document.getElementById("Paralysis2").checked
                || document.getElementById("Tailwind2").checked
                || document.getElementById("Wetlands2").checked) {
            result += "<br>&#009;&#009;";
            if (document.getElementById("s_skill2").value !== "")
                result += speed_skill[Number(document.getElementById("s_skill2").value)][0];
            if (document.getElementById("s_item2").value !== "") {
                if (document.getElementById("s_skill2").value !== "") {
                    result += " / ";
                }
                result += speed_item[Number(document.getElementById("s_item2").value)][0];
            }
            if (document.getElementById("Paralysis2").checked
                    || document.getElementById("Tailwind2").checked
                    || document.getElementById("Wetlands2").checked) {
                result += " (";
                if (document.getElementById("Paralysis2").checked)
                    result += "麻痺";
                if (document.getElementById("Tailwind2").checked) {
                    if (document.getElementById("Paralysis2").checked)
                        result += ", ";
                    result += "追い風";
                }
                if (document.getElementById("Wetlands2").checked) {
                    if (document.getElementById("Paralysis2").checked
                            || document.getElementById("Tailwind2").checked)
                        result += ", ";
                    result += "湿原";
                }
                result += ")";
            }
        }

        sc_list.push(result);
    }
    SC_list_set();
}

function SC_list_reset() {
    console.log("SC_list_reset()");

    sc_list.length = 0;
    SC_list_set();
}

function SC_list_delete(num) {
    console.log("SC_list_delete(" + num + ")");

    sc_list_delete_button = '';

    if (num === 0) {
        sc_list.shift();
    } else {
        sc_list.splice(num, 1);
    }
    SC_list_set();
}

function deleteon(num) {
    if (sc_list_delete_button === num) {
        sc_list_delete_button = '';
    } else {
        sc_list_delete_button = num;
    }
    SC_list_set();
}

function setX(num) {
    console.log("setX(" + num + ")");

    x_list[num] = Math.abs(x_list[num] - 1);

    reCalc();

    numCheck();
    color();
}

function color() {
    console.log("color()");

    for (let i = 0; i < 6; i++) {
        if (x_list[i] === 1) {
            document.getElementById("Stats_" + stats_name[i]).style.color = 'var(--js-x-color)';
            document.getElementById("Stats_" + stats_name[i]).style.background = null;
            document.getElementById("Stats_" + stats_name[i]).style.border = null;
            document.getElementById("EV_" + stats_name[i]).style.color = 'var(--js-x-color)';
            document.getElementById("EV_" + stats_name[i]).style.background = null;
            document.getElementById("EV_" + stats_name[i]).style.border = null;
            document.getElementById("IV_" + stats_name[i]).style.color = 'var(--js-x-color)';
            document.getElementById("IV_" + stats_name[i]).style.background = null;
            document.getElementById("IV_" + stats_name[i]).style.border = null;
        } else {
            document.getElementById("Stats_" + stats_name[i]).style.color = null;
            if (!numcheck_list[i]) {
                document.getElementById("EV_" + stats_name[i]).style.color = null;
            }
            if (!numcheck_list[i + 6]) {
                document.getElementById("IV_" + stats_name[i]).style.color = null;
            }
        }
    }
}
