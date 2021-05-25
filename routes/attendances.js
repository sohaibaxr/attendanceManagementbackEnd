const router = require("express").Router();
const Attendance = require("../model/Attendance")
const mongoose = require("mongoose")
const moment = require("moment")

router.post("/", async (req, res) => {
    try {
        const newAttendance = new Attendance();
        newAttendance.student = req.body.student,
        newAttendance.course = req.body.course,
        newAttendance.date = req.body.date,
        newAttendance.isPresent = req.body.isPresent
        const filter = { student: req.body.student, course: req.body.course, date: moment(req.body.date).format("YYYY-MM-DD") }
        const update = { isPresent: req.body.isPresent }
        const count = await Attendance.countDocuments(filter)
        if (count === 1) {
            const doc = await Attendance.findOneAndUpdate(filter, update, { new: true, upsert: true })
            res.send(doc)
        }
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