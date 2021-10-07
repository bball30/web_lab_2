package ru.itmo.web.lab2.servlets;

import ru.itmo.web.lab2.beans.EntriesBean;
import ru.itmo.web.lab2.beans.Entry;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

public class AreaCheckServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        EntriesBean entries = (EntriesBean) request.getSession().getAttribute("entries");
        if (entries == null) entries = new EntriesBean();

        long startTime = System.nanoTime();
        String xString = request.getParameter("x");
        String yString = request.getParameter("y").replace(",", ".");
        String rString = request.getParameter("r").replace(",", ".");
        boolean isButton = "button".equals(request.getParameter("key"));
        boolean valid = validateXYR(xString, yString, rString, isButton);

        if (valid) {
            double x = Double.parseDouble(xString);
            double y = Double.parseDouble(yString);
            double r = Double.parseDouble(rString);
            boolean isHit = checkHit(x, y, r);

            String currentTime = new SimpleDateFormat("d MMMM y HH:mm:ss").format(new Date());
            float resultTime = (System.nanoTime() - startTime) / 1000000000f;
            //float diff = (System.nanoTime() - startTime) / 1000000000f;
            String executionTime = String.format("%f", resultTime);

            entries.getEntries().add(0, new Entry(x, y, r, currentTime, executionTime, isHit));
            request.getSession().setAttribute("entries", entries);
        }

        PrintWriter writer = response.getWriter();
        writer.println(generateTable(entries));
        writer.close();
    }

    private String generateTable(EntriesBean entries) {
        String header = "<table id=\"result-table\">" +
                "<tr class=\"table-header\">" +
                "<th class=\"coords-col\">X</th>" +
                "<th class=\"coords-col\">Y</th>" +
                "<th class=\"coords-col\">R</th>" +
                "<th class=\"time-col\">Время отправки запроса</th>" +
                "<th class=\"time-col\">Время выполнения скрипта</th>" +
                "<th class=\"hit-col\">Результат</th>" +
                "</tr> %s </table>";

        StringBuilder rows = new StringBuilder();
        if (entries != null) {
            for (Entry entry : entries.getEntries()) {
                rows.append(generateRowFromElement(entry));
            }
        }

        return String.format(header, rows);
    }

    private String generateRowFromElement(Entry element) {
        return (element.isHit() ? "<tr class=\"row green\">" : "<tr class=\"row red\">") +
                "<td>" + element.getX() + "</td>" +
                "<td>" + element.getY() + "</td>" +
                "<td>" + element.getR() + "</td>" +
                "<td>" + element.getCurrentTime() + "</td>" +
                "<td>" + element.getExecutionTime() + "</td>" +
                "<td class=\"hit-col\">" + (element.isHit() ? "Попал" : "Мимо") + "</td></tr>";
    }

    private boolean validateX(String xString, boolean isButton) {
        try {
            if (isButton) {
                int xValue = Integer.parseInt(xString);
                return xValue >= -5 && xValue <=3;
            } else {
                Double.parseDouble(xString);
                return true;
            }
        } catch (NumberFormatException exception) {
            return false;
        }
    }

    private boolean validateY(String yString) {
        try {
            Double yValue = Double.parseDouble(yString);
            return yValue > -5 && yValue < 3;
        } catch (NumberFormatException exception) {
            return false;
        }
    }

    private boolean validateR(String rString) {
        try {
            Double rValue = Double.parseDouble(rString);
            return rValue > 1 && rValue < 4;
        } catch (NumberFormatException exception) {
            return false;
        }
    }

    private boolean validateXYR(String xString, String yString, String rString, boolean isButton) {
        return validateX(xString, isButton) && validateY(yString) && validateR(rString);
    }

    private boolean checkTriangle(double xValue, double yValue, double rValue) {
        return xValue >= 0 && yValue >= 0 && yValue <= -xValue + rValue / 2;
    }

    private boolean checkRectangle(double xValue, double yValue, double rValue) {
        return xValue >= 0 && yValue <= 0 && xValue <= rValue && yValue >= -rValue;
    }

    private boolean checkCircle(double xValue, double yValue, double rValue) {
        return xValue <= 0 && yValue >= 0 && xValue * xValue + yValue * yValue <= rValue * rValue / 4;
    }

    private boolean checkHit(double xValue, double yValue, double rValue) {
        return checkTriangle(xValue, yValue, rValue) || checkRectangle(xValue, yValue, rValue) ||
                checkCircle(xValue, yValue, rValue);
    }
}
