const router = require("express").Router();
const Attendance = require("../model/Attendance")
const mongoose = require ("mongoose")

router.post("/", async (req, res) => {
    try {
        const newAttendance = new Attendance();
        newAttendance.student = req.body.student,
        newAttendance.course = req.body.course,
        newAttendance.date = req.body.date,
        newAttendance.isPresent = req.body.isPresent
        await newAttendance.save()
        res.send(newAttendance)
    } catch (error) {
        res.send(error)
    }
})
router.get("/", async (req, res) => {
    try {
        const attendances = await Attendance.find({})
        res.send(attendances)
    } catch (error) {
        res.send(error)
    }
})

router.get("/:courseId&:studentId", async (req, res) => {
    try {
        const courseId = req.params.courseId
        const studentId = req.params.studentId
        const attBycourseAndstudent = await Attendance
            .find({ "course": { _id: courseId }, "student": { _id: studentId } })
            .populate("student", "name")
        res.send(attBycourseAndstudent)
    } catch (error) {
        res.send(error)
    }
})
// router.delete("/:id", async (req, res) => {
//     try {
//         const _id = req.params.id
//         const foundOne = await Attendance.findByIdAndDelete(_id)
//         res.send(foundOne)
//     } catch (error) {
//         res.send(error)
//     }
// })
module.exports = router