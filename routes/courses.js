const router = require("express").Router();
const Courses = require("../model/Course")

router.post("/", async (req, res) => {
    try {
        const newCourse = new Courses();
        newCourse.name = req.body.name;
        newCourse.code = req.body.code;
        let courseExists = await Courses.findOne({ name: req.body.name })
        if (courseExists) return res.send("Course already Exists")
        else await newCourse.save();
        res.status(201).send(newCourse);
    } catch (error) {
        res.send(error)
    }
});
router.get("/", async (req, res) => {
    try {
        newCourse = await Courses.find({});
        res.send(newCourse);
    } catch (error) {
        res.send(error)
    }
});
// get courses by course id
router.get("/:id", async (req, res) => {
    try {
        const _id = req.params.id
        newCourse = await Courses.find({_id});
        res.send(newCourse);
    } catch (error) {
        res.send(error)
    }
});
// get student assigned courses 
router.get("/students/:studentId", async (req, res) => {
     try {
         const _id = req.params.studentId
         const requiredStudents = await Courses.find({students:_id});
         res.send(requiredStudents);
     } catch (error) {
         res.send(error)
     }
});
router.delete("/:id", async (req, res) => {
    const _id = req.params.id
    try {
        const deletedCourse = await Courses.findByIdAndDelete(_id)
        res.send(deletedCourse)
    } catch (error) {
        console.log(error)
    }
});
router.put("/:id", async (req, res) => {
    const _id = req.params.id
    try {
        const updatedCourse = await Courses.findByIdAndUpdate({ _id }, { name: req.body.name, code: req.body.code, students: req.body.students })
        res.send(updatedCourse)
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;
