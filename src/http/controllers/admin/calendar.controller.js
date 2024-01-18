const model = require("../../../models/index")
const moment = require('moment');
module.exports = {
    calendar:async(req,res)=>{
        const events = []
        const user = req.user
        const content = "Calendar"
        const teacherCalendar =await model.Teacher_calendar.findAll({include: model.Classes})
        teacherCalendar.forEach(e => {
            const isoDate = e.scheduleDate;
            const formattedDate = moment(isoDate).format('YYYY-MM-DD');
            const momentObj = moment(formattedDate);

            // Thêm 1 ngày
            const nextDay = momentObj.add(1, 'days').format('YYYY-MM-DD');
            
            const event = {
            title:e.Class.study_time,
            start:formattedDate,
            end:nextDay,
        }
        events.push(event)
        });
        console.log(events)
        
        res.render("admin/dashboard/calendar",{user,content,events})
    }
}