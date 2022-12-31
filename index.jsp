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
                    <script type="text/javascript">
                        for (let i = 0; i < pokemon.length; i++) {
                            document.getElementById("pokename_" + i).innerHTML = pokemon[i][0];
                        }
                    </script>
                </select>
                <script>
                    $(document).ready(function () {
                        $('.select_search').select2();
                    });
                </script>
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
                </TABLE>
                <textarea id="text" placeholder="コピペ"></textarea><br>
            </div>

            <div id="main_hp">
                HP調整表
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
            <div class="spacer"></div>
            <div>
                Thx to <a href="https://github.com/select2/select2" target="_blank">Select2</a><br>
                Made by <a href="https://twitter.com/nomakun_des" target="_blank">@nomakun_des</a>
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
    </body>
</html>
