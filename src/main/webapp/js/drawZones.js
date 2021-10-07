const canvas = document.getElementById("canvas")
let r = document.getElementById("r_field").value.replace(",", ".")

function drawCanvas() {
    let labels
    r = document.getElementById("r_field").value.replace(",", ".")
    if (r === undefined || !isNumeric(r) || !((r > 1) && (r < 4))) {
        labels = ["R", "R/2", "", "-R/2", "-R"]
    } else {
        labels = [r.toString(), (r / 2).toString(), "", (-r / 2).toString(), (-r).toString()]
    }

    const ctx = canvas.getContext("2d")
    const canvasWidth = canvas.clientWidth
    const canvasHeight = canvas.clientHeight
    const xAxis = canvasWidth / 2
    const yAxis = canvasHeight / 2
    const xNameAxis = canvasWidth / 6
    const yNameAxis = canvasHeight / 6

    const offsetAxis = 5

    ctx.beginPath()
    ctx.fillStyle = "#000"
    ctx.strokeStyle = "#000"
    ctx.moveTo(xAxis, 0)
    ctx.lineTo(xAxis, canvasHeight)
    ctx.moveTo(0, yAxis);
    ctx.lineTo(canvasWidth, yAxis)
    ctx.stroke();
    ctx.closePath();

    ctx.font = "15px Arial"
    ctx.fillText("y", xAxis + offsetAxis, offsetAxis * 2)
    ctx.moveTo(xAxis - offsetAxis / 2, offsetAxis)
    ctx.lineTo(xAxis, 0);
    ctx.moveTo(xAxis + offsetAxis / 2, offsetAxis);
    ctx.lineTo(xAxis, 0);
    ctx.stroke();
    for (let i = 0; i < labels.length; i++) {
        ctx.moveTo(xAxis - offsetAxis / 2, yNameAxis + yNameAxis * i)
        ctx.lineTo(xAxis + offsetAxis / 2, yNameAxis + yNameAxis * i)
        ctx.stroke()
        ctx.fillText(labels[i], xAxis + offsetAxis, yNameAxis + yNameAxis * i)
    }

    ctx.fillText("x", canvasWidth - offsetAxis * 2, yAxis + 20)
    ctx.moveTo(canvasWidth - offsetAxis, yAxis - offsetAxis / 2);
    ctx.lineTo(canvasWidth, yAxis);
    ctx.moveTo(canvasWidth - offsetAxis, yAxis + offsetAxis / 2);
    ctx.lineTo(canvasWidth, yAxis);
    ctx.stroke();
    for (let i = 0; i < labels.length; i++) {
        ctx.moveTo(xNameAxis + xNameAxis * i, yAxis - offsetAxis / 2);
        ctx.lineTo(xNameAxis + xNameAxis * i, yAxis + offsetAxis / 2);
        ctx.stroke();
        ctx.fillText(labels[labels.length - i - 1], xNameAxis + xNameAxis * i - offsetAxis, yAxis + 20);
    }

    ctx.fillStyle = "#6600ff"
    ctx.globalAlpha = 0.4
    ctx.fillRect(xAxis, yAxis, 2 * xNameAxis, 2 * yNameAxis)

    ctx.beginPath();
    ctx.moveTo(xAxis, yAxis);
    ctx.lineTo(xAxis, yAxis - yNameAxis);
    ctx.lineTo(xAxis + xNameAxis, yAxis);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(xAxis, yAxis);
    ctx.arc(xAxis, yAxis, xAxis - 2 * xNameAxis, Math.PI, Math.PI * 1.5);
    ctx.fill();
    ctx.closePath();

    let hits = document.getElementsByClassName("hit-col")
    for (let i = 1; i < hits.length; i++)
        if (hits[i].parentElement.getElementsByTagName('td').item(2).innerHTML === r) {
            if (hits[i].innerHTML === "Попал") {

                drawPoint(hits[i].parentElement.getElementsByTagName('td').item(0).innerHTML.toString(),
                    hits[i].parentElement.getElementsByTagName('td').item(1).innerHTML.toString(), r, "#22ff00")
            } else {
                drawPoint(hits[i].parentElement.getElementsByTagName('td').item(0).innerHTML.toString(),
                    hits[i].parentElement.getElementsByTagName('td').item(1).innerHTML.toString(), r, "#f00")
            }
        }
}

function reDrawCanvas() {
    canvas.getContext("2d").clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    drawCanvas()
}


canvas.addEventListener('click', (event) => {
    let rValue = document.getElementById("r_field").value
    if (!validateRadius(rValue)) {
        alert("Радиус не задан!")
        return
    }
    let xFormCanvas = (event.offsetX - 125) / 82 * rValue
    let yFromCanvas = (-event.offsetY + 125) / 82 * rValue;

    $.get("app", {
        'x': Math.floor(xFormCanvas * 100) / 100,
        'y': Math.floor(yFromCanvas * 100) / 100,
        'r': rValue,
        'key': 'not_button'
    }).done(function (data) {
        document.getElementById("output").innerHTML = data
        let hits = document.getElementsByClassName("hit-col")
        if (hits[1].innerHTML === "Попал") {
            drawPoint(xFormCanvas, yFromCanvas, rValue, "#22ff00")
        } else {
            drawPoint(xFormCanvas, yFromCanvas, rValue, "#f00")
        }
    })
})

function validateRadius(value) {
    let rValue = value.replace(',', '.')
    return isNumeric(rValue) && rValue > 1 && rValue < 4
}

function drawPoint(xPosition, yPosition, radius, color) {
    let xPos = xPosition.toString().replace(',', '.')
    let yPos = yPosition.toString().replace(',', '.')
    console.log(yPos)
    yPosition = 125 - 82 * yPos / radius
    xPosition = 125 + 82 * xPos / radius
    const ctx = canvas.getContext("2d")
    ctx.beginPath()
    ctx.moveTo(xPosition, yPosition)
    ctx.fillStyle = color
    ctx.globalAlpha = 1
    ctx.arc(xPosition, yPosition, 2, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
}

