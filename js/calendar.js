class Calendar {
    constructor(data) {
        this.saveDate = []
        this.filterDate = {}
        this.contentCalendarMain = null
        this.background = data ? data.background ? data.background : "#0770aa" : "#0770aa"
        this.fontFamily = data ? data.fontFamily ? data.fontFamily : "Arial, Helvetica, sans-serif" : "Arial, Helvetica, sans-serif"
        this.clicks = {
            start: null,
            end: null
        }
    }
    
    create(callback) {
        let contentCalendar = dom("div", document.body)
        let boxCalendar = dom("div", contentCalendar)
        let col1 = dom("div", boxCalendar)
        let col2 = dom("div", boxCalendar)
        let headerCalendar = dom("div", col2)
        let mainCalendar = dom("div", col2)
        let headerCalendarMain = dom("div", mainCalendar)
        this.contentCalendarMain = dom("div", mainCalendar)
        let footerCalendar = dom("div", col2)
        let days = ["S", "M", "T", "W", "T", "F", "S"]
        let monthYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let abvDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        let btns = ["CANCEL", "OK"]
        let date = new Date()
        let back = dom("i", headerCalendar)
        let text = dom("div", headerCalendar)
        let next = dom("i", headerCalendar)
        let width;

        contentCalendar.classList.add("content-calendar")
        boxCalendar.classList.add("box")
        col1.classList.add("col1")
        col2.classList.add("col2")
        headerCalendar.classList.add("header")
        mainCalendar.classList.add("main-calendar")
        footerCalendar.classList.add("footer-calendar")
        this.contentCalendarMain.classList.add("content-calendar-main")

        contentCalendar.css({
            fontFamily: this.fontFamily
        })

        col1.css({
            background: this.background
        })

        back.attr({
            className: "fas fa-chevron-left"
        }).css({
            paddingLeft: "20px"
        })
        
        text.setHTML(`${monthYear[date.getMonth()]} ${date.getFullYear()}`)

        next.attr({
            className: "fas fa-chevron-right"
        }).css({
            paddingRight: "20px"
        })

        next.onclick = () => {
            date.setMonth(date.getMonth() + 1)
            animation(true)
        }

        back.onclick = () => {
            date.setMonth(date.getMonth() - 1)
            animation(false)
        }

        function animation(type) {
            text.setHTML(`${monthYear[date.getMonth()]} ${date.getFullYear()}`)
            width = this.contentCalendarMain.clientWidth
            this.contentCalendarMain.style.opacity = 0
            this.contentCalendarMain.style.left = `${type ? -width : width}px`
            setTimeout(() => {
                this.contentCalendarMain.style.left = `${type ? width * 2 : -width * 2}px`
                this.contentCalendarMain.innerHTML = ""
                this.newDate({
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    day: date.getDate()
                })

                setTimeout(() => {
                    this.contentCalendarMain.style.opacity = 1
                    this.contentCalendarMain.style.left = `0px`
                }, 100)
            }, 400)
        }

        /* Start Col 1 */
        dom("div", col1).setHTML(date.getFullYear()).attr({
            id: "yearCalendar"
        }).css({
            color: "rgba(255,255,255,.5)",
            fontSize: "1.2em"
        })

        dom("div", col1).setHTML(`${abvDays[date.getDay()]},`).attr({
            id: "dayCalendar"
        }).css({
            color: "white",
            fontSize: "3em"
        })

        dom("div", col1).setHTML(`${monthYear[date.getMonth()].substr(0, 4)} ${date.getDate()}`).attr({
            id: "monthCalendar"
        }).css({
            color: "white",
            fontSize: "3em"
        })

        /* End Col 1 */
        // SHOW DAYS
        days.forEach(day => {
            this.createBoxCalendar({
                value: day,
                color: this.background,
                parent: headerCalendarMain,
                bold: "500",
            })
        })

        this.newDate({
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate()
        })

        btns.forEach(key => {
            let btn = dom("div", footerCalendar)

            btn.setHTML(key).css({
                color: this.background,
                fontSize: "1.1em",
                fontWeight: "bold",
                cursor: "pointer",
                marginRight: "20px"
            })

            btn.onclick = () => {
                contentCalendar.style.opacity = 0

                setTimeout(() => {

                    if (key == "CANCEL") {
                        document.body.removeChild(contentCalendar)
                        return
                    }

                    callback(this.filterDate)
                }, 600)
            }

        })

        setTimeout(() => {
            contentCalendar.style.opacity = 1
        }, 100)

        boxCalendar.onclick = (e) => {
            e.stopPropagation()
        }

        contentCalendar.onclick = () => {
            contentCalendar.style.opacity = 0

            setTimeout(() => {
                document.body.removeChild(contentCalendar)
            }, 600)
        }

    }

    newDate(date) {
        // NOW DATE
        let now = new Date(date.year, date.month)
        let monthNow = now.getMonth()
        let yearNow = now.getFullYear()

        // LAST DATE
        let last = new Date(now)
        last.setMonth(last.getMonth() - 1)
        let lastMonth = last.getMonth()
        let lastYear = last.getFullYear()

        // NEXT DATE
        let next = new Date(now)
        next.setMonth(next.getMonth() + 1)
        let into = now.getDay()

        for (let i = 0; i < now.getDay(); i++) {
            this.createBoxCalendar({
                value: +this.getDayOfMonth((+lastMonth), lastYear) - (into -= 1),
                type: true,
                parent: this.contentCalendarMain,
                date: {
                    month: last.getMonth(),
                    year: last.getFullYear()
                },
                place: "last"
            })
        }

        let d = new Date()
        for (let i = 0; i < this.getDayOfMonth(monthNow, yearNow); i++) this.createBoxCalendar({
            value: i + 1,
            parent: this.contentCalendarMain,
            bold: "500",
            active: (i + 1) == d.getDate(),
            date: {
                month: now.getMonth(),
                year: now.getFullYear()
            },
            place: "now"
        })

        let countItems = this.contentCalendarMain.querySelectorAll(".box-calendar").length
        for (let i = 0; i < (6 * 7) - countItems; i++) this.createBoxCalendar({
            value: i + 1,
            type: true,
            parent: this.contentCalendarMain,
            date: {
                month: next.getMonth(),
                year: next.getFullYear()
            },
            place: "next"
        })

    }

    createBoxCalendar(data) {
        let box = dom("div", data.parent)
        let boxA = dom("div", box)

        box.css({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxHeight: "50px",
            minHeight: "50px",
            opacity: data.type ? .5 : 1,
            cursor: "pointer",
            color: data.color,
            fontWeight: data.bold ? data.bold : ""
        })

        boxA.setHTML(data.value).css({
            maxHeight: "35px",
            minHeight: "35px",
            maxWidth: "35px",
            minWidth: "35px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }).attr({
            className: `box-calendar no-seleccionable`
        })

        if (data.date) {
            boxA.setAttribute("id", `key-${data.date.year}-${data.date.month}-${data.value}`)
            if (this.saveDate.indexOf(`key-${data.date.year}-${data.date.month}-${data.value}`) !== -1) {
                boxA.classList.add("btn-active-calendar")
                boxA.style.background = this.background
            }
        }


        box.onclick = () => {
            if (!this.clicks.start) {
                let items = document.querySelectorAll(".btn-active-calendar")
                items.forEach(item => {
                    item.classList.remove("btn-active-calendar")
                    item.style.background = "transparent"
                })
                this.clicks.start = data
                boxA.classList.add("btn-active-calendar")
                boxA.style.background = this.background
                this.filterDate.start = {
                    year: data.date.year,
                    month: data.date.month,
                    day: data.value
                }
                this.saveDate = []
            } else if (!this.clicks.end) {
                let s = this.clicks.start.date
                let e = data.date
                let last = new Date(s.year, s.month, this.clicks.start.value).getTime()
                let next = new Date(e.year, e.month, data.value).getTime()

                if (next < last) {
                    this.clicks.start = data
                    let items = document.querySelectorAll(".btn-active-calendar")
                    items.forEach(item => {
                        item.classList.remove("btn-active-calendar")
                        item.style.background = "transparent"
                    })
                    boxA.classList.add("btn-active-calendar")
                    boxA.style.background = this.background
                    this.filterDate.start = {
                        year: data.date.year,
                        month: data.date.month,
                        day: data.value
                    }
                    return
                }

                this.filterDate.end = {
                    year: data.date.year,
                    month: data.date.month,
                    day: data.value
                }

                this.clicks.end = data
                let start = this.clicks.start.date
                let end = this.clicks.end.date
                let dataSend = {}
                let initial = false
                for (let year = start.year; year <= end.year; year++) {
                    for (let month = (year >= end.year && year != start.year ? 0 : start.month); month <= (year < end.year && year == start.year ? 11 : end.month); month++) {
                        dataSend[`${year}-${month}`] = {
                            init: !initial ? this.clicks.start.value : 1,
                            end: month != end.month ? this.getDayOfMonth(month, year) : this.clicks.end.value
                        }
                        if (!initial) initial = true
                    }

                    if (year == end.year) {
                        this.activeDay(dataSend)
                        this.clicks.start = null
                        this.clicks.end = null
                    }
                }

            }

        }
    }

    activeDay(data) {
        Object.keys(data).forEach(key => {
            let split = key.split("-")
            let year = split[0]
            let month = split[1]
            for (let day = data[key].init; day <= data[key].end; day++) {
                let code = `key-${year}-${month}-${day}`
                let dom = document.getElementById(code)
                if (dom) {
                    dom.classList.add("btn-active-calendar")
                    dom.style.background = this.background
                }
                this.saveDate.push(code)
            }
        })
    }

    getDayOfMonth = (month, year) => (new Date(year, month + 1, 0).getDate())
}