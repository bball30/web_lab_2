function validateX() {
    return document.getElementById("x_field")[document.getElementById("x_field").selectedIndex].value
}

function validateY() {
    let y = document.getElementById("y_field").value.replace(",", ".");
    if (y === undefined) {
        alert("Введите координату Y!")
        return null
    }
    if (!isNumeric(y)) {
        alert("Y не является числом!")
        return null
    }
    if (!((y > -5) && (y < 3))) {
        alert("Y должен попадать в промежуток (-5, 3)!")
        return null
    }
    return y
}

function validateR() {
    let r = document.getElementById("r_field").value.replace(",", ".")
    if (r === undefined) {
        alert("Введите координату R!")
        return null
    }
    if (!isNumeric(r)) {
        alert("R не является числом!")
        return null
    }
    if (!((r > 1) && (r < 4))) {
        alert("R должен попадать в промежуток (1, 4)!")
        return null
    }
    return r
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function validateForm() {
    let x = validateX(), y = validateY(), r = validateR()

    if (x != null && y != null && r != null)
        return {x: x, y: y, r: r}
    else return null
}

function sendCheckRequest(form, key) {
    $.get("app", {
        'x': form.x,
        'y': form.y,
        'r': form.r,
        'key': key
    }).done(function (data) {
        document.getElementById("output").innerHTML = data
        let hits = document.getElementsByClassName("hit-col")
        if (hits[1].innerHTML === "Попал") {
            drawPoint(form.x, form.y, form.r, "#22ff00")
        } else {
            drawPoint(form.x, form.y, form.r, "#f00")
        }
    })
}

function submit() {
    let form = validateForm()

    if (form == null) return

    reDrawCanvas()
    sendCheckRequest(form, "button")
}

function clearTable() {
    document.getElementById("y_field").value = ""
    document.getElementById("r_field").value = ""
    $.get("app", {
        "clear": true
    }).done(function (data) {
        document.getElementById("output").innerHTML = data;
    })
    reDrawCanvas()
}