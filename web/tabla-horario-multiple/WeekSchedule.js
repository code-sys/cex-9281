class WeekSchedule {
    constructor(idContainer, config, schedule, scheduleHours) {
        this.days = ["L", "M", "X", "J", "V", "S", "D"];
        this.config = config;
        this.minWidthPC = 700;
        this.schedule = schedule;
        this.scheduleHours = scheduleHours;
        this.container = document.getElementById(idContainer);
        this.unitCss = "px";
        this.run();
    }

    run() {
        this.container.classList.add("schedule");
        this.generateColumns();
    }

    generateColumns() {
        for (
            let currentColumn = 1;
            currentColumn <= this.days.length + 1;
            currentColumn++
        ) {
            const column = this.makeColumn(currentColumn);
            this.container.appendChild(column);
        }
    }

    makeColumn(currentColumn) {
        const column = document.createElement("div");
        column.classList.add("column", currentColumn == 1 ? "hours" : "day");

        this.addHeaderToColumn(column, currentColumn);

        if (currentColumn == 1) {
            this.addHoursToColumn(column);
        } else {
            this.addScheduleToColumn(column, currentColumn);
        }

        return column;
    }

    addHeaderToColumn(column, currentColumn) {
        const header = document.createElement("div");
        header.classList.add("header");
        header.textContent = this.getTextForHeaderColumn(currentColumn);

        column.appendChild(header);
    }

    addHoursToColumn(column) {
        this.scheduleHours.forEach((scheduleHour) => {
            const startHour = this.to12H(scheduleHour.start.substr(0, 5));
            const endHour = this.to12H(scheduleHour.end.substr(0, 5));
            const hour = document.createElement("div");
            hour.classList.add("cell");
            hour.textContent = `${startHour} - ${endHour}`;

            column.appendChild(hour);
        });
    }

    addScheduleToColumn(column, currentColumn) {
        let arrScheduleBarProperties =
            this.makeArrScheduleBarProperties(currentColumn);

        this.scheduleHours.forEach((scheduleHour) => {
            const day = this.days[currentColumn - 2];
            const cell = document.createElement("div");
            cell.classList.add("cell");

            this.schedule.days.forEach((scheduleDay) => {
                if (scheduleDay.day != day) {
                    return true;
                }

                scheduleDay.schedules.forEach((schedule) => {
                    const startHour = scheduleHour.start;
                    const endHour = scheduleHour.end;
                    const auxSchedule = this.getScheduleBarProperties(
                        arrScheduleBarProperties,
                        schedule
                    );

                    const inTheScheduleRange = this.inScheduleRange(
                        auxSchedule.schedule.start,
                        auxSchedule.schedule.end,
                        startHour,
                        endHour
                    );

                    const propertiesScheduleBar =
                        this.calcScheduleBarProperties(
                            inTheScheduleRange,
                            auxSchedule.height,
                            auxSchedule.top,
                            auxSchedule.schedule.start,
                            auxSchedule.schedule.end,
                            startHour,
                            endHour
                        );

                    auxSchedule.top = propertiesScheduleBar.topScheduleBar;
                    auxSchedule.height =
                        propertiesScheduleBar.heightScheduleBar;
                });
            });

            column.appendChild(cell);
        });

        for (let idx = 0; idx < arrScheduleBarProperties.length; ++idx) {
            const start = arrScheduleBarProperties[idx].schedule.start;
            const end = arrScheduleBarProperties[idx].schedule.end;
            const idxs = this.getIdxsInTheSameRange(
                arrScheduleBarProperties,
                start,
                end,
                idx
            );

            if (idxs.length > 0) {
                this.addInlinePropertie(arrScheduleBarProperties, idxs);
            }
        }

        arrScheduleBarProperties.forEach((sbp) => {
            column.appendChild(this.makeScheduleBar(sbp));
        });
    }

    getScheduleBarProperties(arrScheduleBarProperties, schedule) {
        let _schedule = null;

        arrScheduleBarProperties.some((sbp) => {
            if (this.deepEqual(sbp.schedule, schedule)) {
                _schedule = sbp;
                return true;
            }
        });

        return _schedule;
    }

    calcScheduleBarProperties(
        inTheScheduleRange,
        heightScheduleBar,
        topScheduleBar,
        scheduleDayStart,
        scheduleDayEnd,
        startHour,
        endHour
    ) {
        if (inTheScheduleRange) {
            heightScheduleBar += this.config.css.cellHeight;

            if (scheduleDayStart > startHour) {
                const { start } = this.calcPercentsCell(
                    startHour,
                    endHour,
                    scheduleDayStart
                );

                topScheduleBar += start;
                heightScheduleBar -= start;
            }

            if (scheduleDayEnd < endHour) {
                const { end } = this.calcPercentsCell(
                    startHour,
                    endHour,
                    scheduleDayEnd
                );

                heightScheduleBar -= end;
            }
        } else if (scheduleDayStart !== null && scheduleDayEnd > endHour) {
            topScheduleBar += this.config.css.cellHeight;
        }

        return {
            topScheduleBar,
            heightScheduleBar,
        };
    }

    makeScheduleBar(scheduleDay) {
        const schedule = document.createElement("div");
        schedule.classList.add("schedule-day");

        let scheduleStart = "";
        let scheduleEnd = "";
        let area = "";
        let style = `height: ${scheduleDay.height}${this.unitCss}; top: ${scheduleDay.top}${this.unitCss};`;

        scheduleStart = scheduleDay.schedule.start;
        scheduleEnd = scheduleDay.schedule.end;
        area = scheduleDay.schedule.text;
        style += `background-color: ${scheduleDay.schedule.color};`;

        let left = this.config.css.scheduleDaySeparator;

        if ("inline" in scheduleDay) {
            if (scheduleDay.inline > 1) {
                const scheduleDayWidth =
                    screen.width > this.minWidthPC
                        ? this.config.css.scheduleDayWidth.pc
                        : this.config.css.scheduleDayWidth.mobil;

                const width = scheduleDay.inline - 1;
                const separator =
                    scheduleDayWidth * (scheduleDay.inline - 1) +
                    this.config.css.scheduleDaySeparator;

                left = width + separator;
            }
        }

        style += `left: ${left}${this.unitCss}`;

        const start = this.to12H(scheduleStart.substring(0, 5), true);
        const end = this.to12H(scheduleEnd.substring(0, 5), true);
        schedule.setAttribute("title", `${start} - ${end}`);
        schedule.setAttribute("style", style);
        schedule.innerHTML = `<span>${area}</span>`;

        schedule.addEventListener("click", () =>
            this.showScheduleInfo(
                start,
                end,
                scheduleDay.schedule.color,
                scheduleDay.schedule.text
            )
        );

        return schedule;
    }

    getTextForHeaderColumn(currentColumn) {
        switch (currentColumn) {
            case 1:
                return "HORARIO";
            case 2:
                return "LUNES";
            case 3:
                return "MARTES";
            case 4:
                return "MIÉRCOLES";
            case 5:
                return "JUEVES";
            case 6:
                return "VIERNES";
            case 7:
                return "SÁBADO";
            case 8:
                return "DOMINGO";
            default:
                return "";
        }
    }

    inScheduleRange(fromHour, toHour, startHour, endHour) {
        return (
            (startHour >= fromHour && endHour <= toHour) ||
            (fromHour >= startHour && fromHour < endHour) ||
            (endHour >= toHour && toHour > startHour)
        );
    }

    calcPercentsCell(start, end, middle) {
        const startSec = this.strTimeToSeconds(start) / 60;
        const endSec = this.strTimeToSeconds(end) / 60;
        const middleSec = this.strTimeToSeconds(middle) / 60;
        const diffSecondsStart = middleSec - startSec;
        const diffSecondsEnd = endSec - middleSec;
        const percentStart = parseFloat(
            ((diffSecondsStart * 100) / 60).toFixed(2)
        );
        const percentEnd = parseFloat(((diffSecondsEnd * 100) / 60).toFixed(2));
        const cellHeight = this.config.css.cellHeight;
        const heightPercentStart = cellHeight * (percentStart / 100);
        const heightPercentEnd = cellHeight * (percentEnd / 100);

        return {
            start: heightPercentStart,
            end: heightPercentEnd,
        };
    }

    strTimeToSeconds(strTime) {
        const arrTime = strTime.split(":");

        return (
            parseInt(arrTime[0]) * 3600 +
            parseInt(arrTime[1]) * 60 +
            parseInt(arrTime[2])
        );
    }

    makeArrScheduleBarProperties(currentColumn) {
        const arrDay = [];

        this.schedule.days.forEach((scheduleDay) => {
            if (scheduleDay.day != this.numberDayToLetter(currentColumn)) {
                return true;
            }

            scheduleDay.schedules.forEach((schedule) => {
                arrDay.push({
                    day: scheduleDay.day,
                    schedule,
                    top: this.config.css.cellHeaderHeight,
                    height: 0,
                });
            });
        });

        return arrDay;
    }

    numberDayToLetter(currentColumn) {
        switch (currentColumn) {
            case 2:
                return "L";
            case 3:
                return "M";
            case 4:
                return "X";
            case 5:
                return "J";
            case 6:
                return "V";
            case 7:
                return "S";
            case 8:
                return "D";
            default:
                return "";
        }
    }

    deepEqual(schedule1, schedule2) {
        return (
            schedule1.start == schedule2.start &&
            schedule1.end == schedule2.end &&
            schedule1.text == schedule2.text &&
            schedule1.color == schedule2.color
        );
    }

    addInlinePropertie(schedules, idxs) {
        idxs.forEach((idx) => {
            if (!schedules[idx].hasOwnProperty("inline")) {
                schedules[idx].inline = 1;
            } else {
                schedules[idx].inline += 1;
            }
        });
    }

    getIdxsInTheSameRange(arr, start, end, idx) {
        const idxs = [];

        for (let i = idx; i < arr.length; ++i) {
            if (
                this.inScheduleRange(
                    start,
                    end,
                    arr[i].schedule.start,
                    arr[i].schedule.end
                )
            ) {
                idxs.push(i);
            }
        }

        if (idxs.length == 1 && !arr[idxs[0]].hasOwnProperty("inline")) {
            return [];
        }

        return idxs;
    }

    to12H(time, meridianInfo = false) {
        let h = parseInt(time.split(":")[0]);
        let meridian = "";

        if (meridianInfo) {
            if (h < 12) {
                meridian = " A.M";
            } else {
                meridian = " P.M";
            }
        }

        if (h > 12) {
            h -= 12;

            if (h < 10) {
                h = `0${h}`;
            }
        }

        return `${h}${time.substr(2)}${meridian}`;
    }

    showScheduleInfo(start, end, color, text) {
        const modal = document.createElement("div");
        modal.classList.add("schedule-info");

        const content = document.createElement("div");
        content.classList.add("si-content");
        content.innerHTML = `
            <table class="si-table" style="border: 1px solid ${color}">
                <caption style="background-color: ${color}">${text.toUpperCase()}</caption>
                <thead>
                    <tr>
                        <th style="color: ${color}">Inicio</th>
                        <th style="color: ${color}">Fin</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${start}</td>
                        <td>${end}</td>
                    </tr>
                </tbody>
            </table>
        `;

        const btnClose = document.createElement("button");
        btnClose.classList.add("si-btn-close");
        btnClose.textContent = "CERRAR";
        btnClose.setAttribute(
            "style",
            `background-color: ${color}; border: none; border-radius: 4px;`
        );
        btnClose.addEventListener("click", () => modal.remove());

        content.appendChild(btnClose);
        modal.appendChild(content);

        document.getElementsByTagName("body")[0].appendChild(modal);
    }

    // secondsToStrTime(seconds) {
    //     var date = new Date(seconds * 1000);
    //     return date.toTimeString().split(" ")[0];
    // }
}
