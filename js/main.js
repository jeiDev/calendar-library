document.body.onload = init

function init(){
    let btns = {
        blue: "#0770aa",
        green: "#16a085",
        purple: "#8e44ad",
        orange: "#d35400",
        grayDark: "#2c3e50",
        gray: "#7f8c8d"
    }

    Object.keys(btns).forEach(color => {
        let btn = document.getElementById(color)

        btn.onclick = () => {
            let calendar = new Calendar({background: btns[color]})
            calendar.create(res => {
                console.log(res)
            })
        }
    })
} 