<%@ page contentType="text/html; charset=UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="entries" class="ru.itmo.web.lab2.beans.EntriesBean" scope="session"/>

<html>
<head>
    <meta charset="UTF-8">
    <title>ЛР2</title>
    <link href="css/style.css" rel="stylesheet" type="text/css"/>
</head>
<body onload="drawCanvas()">
<table id="big_table">
    <tr>
        <td id="header" colspan="2" >Выполнил: Васильев Максим Олегович<br>группа: Р3213 вариант: 13203</td>
    </tr>
    <tr>
        <td>
            <table id="form_table">
                <tr>
                    <td>
                        Введите координату X:
                    </td>
                    <td>
                        Введите координату Y:
                    </td>
                    <td>
                        Введите значение R:
                    </td>
                </tr>
                <tr>
                    <td>
                        <select id="x_field" name="x_field" class="form">
                            <option value="1">1</option>
                            <% for (int i = -5; i <= 3; i++) { %>
                            <option value="<%=i%>"><%=i%></option>
                            <% } %>
                        </select>
                    </td>
                    <td>
                        <input type="text" id="y_field" class="form" placeholder="от -5 до 3" maxlength="5" value="${entries.entries[0].y}">
                    </td>
                    <td>
                        <input type="text" id="r_field" class="form" placeholder="от 1 до 4" maxlength="5" value="${entries.entries[0].r}">
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <button  type="submit" class="buttons" id="form_submit"  onclick="submit()">Отправить</button>
                        <button  type="reset" class="buttons" id="clear_table"  onclick="clearTable()">Очистить таблицу</button>
                    </td>
                </tr>
            </table>
        </td>
        <td>
            <div class="canvas_zone">
                <canvas id="canvas" width="250" height="250"></canvas>
            </div>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <div id="output">
                <table id="result-table">
                    <tr class="table-header">
                        <th class="coords-col">X</th>
                        <th class="coords-col">Y</th>
                        <th class="coords-col">R</th>
                        <th class="time-col">Время отправки запроса</th>
                        <th class="time-col">Время выполнения скрипта</th>
                        <th class="hit-col">Результат</th>
                    </tr>
                    <c:forEach var="entry" items="${entries.entries}">
                        <tr class="row ${(entry.hit? "green": "red")}">
                            <td>${entry.x}</td>
                            <td>${entry.y}</td>
                            <td>${entry.r}</td>
                            <td>${entry.currentTime}</td>
                            <td>${entry.executionTime}</td>
                            <td class="hit-col">${(entry.hit? "Попал" : "Мимо")}</td>
                        </tr>
                    </c:forEach>
                </table>
            </div>
        </td>
    </tr>
</table>

<script src="js/validation.js"></script>
<script src="js/drawZones.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</body>
</html>