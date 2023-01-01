<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<%
    String[] stats_name = {"H", "A", "B", "C", "D", "S"};
%>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="icon" type="image/png" href="https://www.pokemon.co.jp/common/images/favi_official.ico">
        <title>POKES STATS CALC</title>
        <script type="text/javascript" src="calc.js"></script>
        <script type="text/javascript" src="data.js"></script>
        <link rel="stylesheet" href="style.css">
        <link rel="stylesheet" href="loading.css">

        <link href="select2.min.css" rel="stylesheet" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <script src="select2.min.js"></script>
    </head>
    <body>

        <h1>POKES STATS CALC</h1>

        <DIV id="main">
            <div>
                <select id="pokename" class="select_search" onchange="setPokes()">
                    <option value="" disabled selected style="display:none;">ポケモン名</option>
                    <% for (int i = 0; i < 425; i++) {%>
                    <option id="pokename_<%=i%>" value="<%=i%>">pokemon[<%=i%>][0]</option>
                    <% }%>
                </select>
                <TABLE>
                    <TR>
                        <TD>Lv.</TD>
                        <TD><input type="number" value="50" min="1" max="100" 
                                   id="lv" onChange="reCalc()"></TD>
                        <TD><button id="lv50" onClick="setLv(50)">50</button>
                            <button id="lv100" onClick="setLv(100)">100</button></TD>
                    </TR>
                </TABLE>

                <TABLE>
                    <TR>
                        <TH></TH><TH>実数値</TH><TH>努力値</TH><TH></TH><TH>種族値</TH><TH>個体値</TH><TH></TH><TH colspan="2">性格</TH>
                    </TR>
                    <% for (int i = 0; i < 6; i++) {%>
                    <TR>
                        <TD><%=stats_name[i]%></TD>
                        <TD><input type="number" value="<% if (i == 0) {%>175<% } else {%>120<% }%>" min="0" 
                                   id="Stats_<%=stats_name[i]%>" onChange="byStats()"></TD>
                        <TD><input type="number" value="0" min="0" max="252" step="4" 
                                   id="EV_<%=stats_name[i]%>" onChange="reCalc()"></TD>
                        <TD><button id="EV0_<%=stats_name[i]%>" onClick="setEV(0,<%= i%>)">0</button>
                            <button id="EV252_<%=stats_name[i]%>" onClick="setEV(252,<%= i%>)">252</button></TD>
                        <TD><input type="number" value="100" min="0" 
                                   id="Basestats_<%=stats_name[i]%>" onChange="reCalc()"></TD>
                        <TD><input type="number" value="31" min="0" max="31" 
                                   id="IV_<%=stats_name[i]%>" onChange="reCalc()"></TD>
                        <TD><button id="IV0_<%=stats_name[i]%>" onClick="setIV(0,<%= i%>)">0</button>
                            <button id="IV252_<%=stats_name[i]%>" onClick="setIV(31,<%= i%>)">31</button></TD>

                        <% if (i == 0) {%>
                        <TD style="color:red;">+</TD><TD style="color:blue;">-</TD>
                            <% } else {%>
                        <TD>
                            <input type="checkbox" name="inc" class="rd" value="0" style="accent-color:red;"
                                   id="Nature_<%=stats_name[i]%>_inc"
                                   onChange="set_Nature(0,<%=i%>)"></TD>
                        <TD>
                            <input type="checkbox" name="dec" class="rd" value="0" style="accent-color:blue;"
                                   id="Nature_<%=stats_name[i]%>_dec"
                                   onChange="set_Nature(1,<%=i%>)"></TD>
                            <% }%>
                    </TR>
                    <% }%>
                    <TR>
                        <TD></TD>
                        <TD>合計</TD>
                        <TD><input type="number" value="0" id="EV_total" readonly></TD>
                        <TD><button id="all_0" onClick="all_set(0)">ALL0</button></TD>
                        <TD><input type="number" value="600" id="Bs_total" readonly></TD>
                    </TR>
                </TABLE><br>
                <TABLE>
                    <TR>
                        <TH colspan="2"></TH><TH>ランク補正</TH><TH></TH><TH>麻痺</TH><TH>おいかぜ</TH>
                    </TR>
                    <TR>
                        <TD>S</TD>
                        <TD>
                            <input id="real_Speed" value="120" readonly>
                        </TD>
                        <TD>
                            <select id="s_rank" onchange="real_speed()">
                                <% for (int i = 6; i > (-7); i--) {%>
                                <option id="s_rank_<%=i%>" value="<%=i%>" 
                                        <% if (i == 0) {%>selected="selected"<% }%>>
                                    <%if (i > 0) {%>+<% }%><%=i%></option>
                                    <% }%>
                            </select>
                        </TD>
                        <TD class="left">
                            <select class="select_search" id="s_skill" onchange="real_speed()">
                                <option id="s_skill_null" value="" selected>
                                    とくせい</option>
                                    <% for (int i = 0; i < 9; i++) {%>
                                <option id="s_skill_<%=i%>" value="<%=i%>">skill[<%=i%>][0]</option>
                                <% }%>
                            </select>
                        </TD>
                        <TD>
                            <input type="checkbox" id="Paralysis" onchange="real_speed()">
                        </TD>
                        <TD>
                            <input type="checkbox" id="Tailwind" onchange="real_speed()">
                        </TD>
                    </TR>
                    <TR>
                        <TD colspan="3"></TD>
                        <TD class="left">
                            <select class="select_search" id="s_item" onchange="real_speed()">
                                <option id="s_item_null" value="" selected>
                                    もちもの</option>
                                    <% for (int i = 0; i < 2; i++) {%>
                                <option id="s_item_<%=i%>" value="<%=i%>">item[<%=i%>][0]</option>
                                <% }%>
                            </select>
                        </TD>
                    </TR>
                </TABLE>
                S比較<br>
                <select id="pokename2" class="select_search" onchange="setPoke2_speed('max')">
                    <option value="" disabled selected style="display:none;">ポケモン名</option>
                    <% for (int i = 0; i < 425; i++) {%>
                    <option id="pokename2_<%=i%>" value="<%=i%>">pokemon[<%=i%>][0]</option>
                    <% }%>
                </select>
                <TABLE>
                    <TR>
                        <TD>
                            素早さ
                        </TD>
                        <TD>
                            <input type="number" id="poke2_speed" readonly>
                        </TD>
                        <TD>
                            <button class="pokes_S" id="poke2_sMax" onclick="setPoke2_speed('max')">最速</button>
                            <button class="pokes_S" id="poke2_sMin" onclick="setPoke2_speed('high')">準速</button>
                            <button class="pokes_S" id="poke2_sMin" onclick="setPoke2_speed('normal')">無振</button>
                            <button class="pokes_S" id="poke2_sMin" onclick="setPoke2_speed('low')">下降</button>
                            <button class="pokes_S" id="poke2_sMin" onclick="setPoke2_speed('min')">最遅</button>
                        </TD>
                    </TR>
                </TABLE>

                <textarea id="text" placeholder="コピペ"></textarea><br>
            </div>
            <DIV>
                <div id="main_info">
                    <a id="info_button" class="word_button" onclick="info_display()">
                        <h2 id="info_title">#このサイトについて ▽</h2>
                    </a>
                    <div id="info">
                        ポケモンの実数値を計算するサイトです。<br>
                        <br>
                        ポケモン名は「かな/カナ」関わらず行えます。<br>
                        入力されたポケモンの概要をタイトルとして表示します。<br>
                        「252」ボタンで努力値を設定する場合に最大値を超えてしまったり、<br>
                        無駄な努力値になってしまう事を自動で判断し計算します。<br>
                        <br>
                        特性「はやあし」によって麻痺での1/2が無視されます。<br>
                        持ち物「スピードパウダー」は「メタモン」のみに効果があります。<br>
                    </div>
                </div>

                <div id="main_hp">
                    <a id="hpTheory_button" class="word_button" onclick="hpTable_display()">
                        <h2 id="hpTheory_title">#HP調整表 ▽</h2>
                    </a>
                    <TABLE border="1" id="hpTheory">
                        <TR>
                            <TH>過不足</TH><TH>調整</TH><TH>内容</TH>
                        </TR>
                        <% for (int i = 1; i < 18; i++) {%>
                        <TR>
                            <TD id="hpTheory_<%=i%>">null</TD><TD id="hpTheoryName_<%=i%>"></TD><TD class="left" id="hpTheoryInfo_<%=i%>"></TD>
                        </TR>
                        <% }%>
                    </TABLE>
                </div>
            </DIV>

            <div class="spacer"></div>
            <div>
                Thx to <a href="https://github.com/select2/select2" target="_blank">Select2</a>, 
                <a href="https://into-the-program.com/javascript-loader/" target="_blank">ryohei</a><br>
                Made by <a href="https://twitter.com/nomakun_des" target="_blank">@nomakun_des</a><br>
                v1.05.0 <a href="update.html" target="_blank">Update Details</a>
            </div>
        </DIV>

        <div id="loader">
            <div class="sk-chase">
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
            </div>
        </div>

        <script src="https://github.com/niwaringo/moji/releases/download/V1.2.0/moji.js"></script>
    </body>
</html>
