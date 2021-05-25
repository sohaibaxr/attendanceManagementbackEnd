const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../model/users");
const { SECRET } = require("../config");
const Attendance = require("../model/Attendance");
const moment = require("moment")

const userRegister = async (userDets, res) => {
  try {
    let emailNotRegistered = await validateEmail(userDets.email);
    if (!emailNotRegistered) {
      return res.json({ message: "Email  already registered", success: false });
    }
    const hashedPassword = await bcrypt.hash(userDets.password, 12);
    const newUser = new User({
      name: userDets.name,
      email: userDets.email,
      password: hashedPassword,
      role: userDets.role
    });
    await newUser.save();
    return res.status(201).json({
      message: " now you are successfully registred",
      success: true
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to create account.",
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (error) {
    res.send(error)
  }
};
const deleteUser = async (req, res) => {
  try {
    const _id = req.params.id
    const user = await User.findByIdAndDelete(_id)
    res.send(user)
  } catch (error) {
    res.send(error)
  }
}
const updateUser = async (req, res) => {
  try {
    const _id = req.params.id
    const updatedUser = await User.findByIdAndUpdate({ _id }, { name: req.body.name, email: req.body.email, courses: req.body.courses })
    res.status(200).send(updatedUser)
  } catch (error) {
    res.send(error)
  }
}
const getUserByCourse = async (req, res) => {
  try {
    const courseId = req.params.id
    const requiredUser = await User.find({ courses: courseId })
    const allAttendance = await Attendance.find({})
    var attendanceList = []
    requiredUser.forEach(usr => {
      const userId = usr._id.toString()
      const userName = usr.name
      var attendanceObject = new Object()
      const today = moment(new Date()).format("YYYY-MM-DD")
      allAttendance.forEach(atnd => {
        var attendanceStatus = atnd.isPresent
        if (atnd.student.toString() === userId && atnd.course.toString() === courseId && moment(atnd.date).format("YYYY-MM-DD") === today) {
          attendanceObject.id = userId,
            attendanceObject.name = userName,
            attendanceObject.isPresent = attendanceStatus
          attendanceList.push(attendanceObject)
        }
        else {
          console.log("not matched")
        }
      })
    })
    res.send(attendanceList)
  } catch (error) {
    res.send(error)
  }
}
const getBycourseId=async (req,res)=>{
  try {
    const course=req.params.courseId
    const requiredUser = await User.find({ courses: course })
    console.log(requiredUser)
    res.send(requiredUser)
  } catch (error) {
    res.send(error)
  }
} 
const userLogin = async (userCreds, res) => {
  let { email, password } = userCreds;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "Invalid login credentials.",
      success: false
    });
  }

  let matchPassword = await bcrypt.compare(password, user.password);
  if (matchPassword) {
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        email: user.email
      },
      SECRET,
      { expiresIn: "7 days" }
    );
    let result = {
      role: user.role,
      email: user.email,
      _id: user._id,
      token: `Bearer ${token}`,
      expiresIn: 168
    };
    return res.status(201).json({ ...result, message: "You are now logged in." });
  } else {
    return res.json({ message: "Incorrect password.", success: false });
  }
};

const userAuth = passport.authenticate("jwt", { session: false });


const checkRole = roles => {return (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next()
  }
  return res.status(401).json({
    message: "UnAuthorized",
    succes: "false"
  })}
}
const validateEmail = async email => {
  let user = await User.findOne({ email });
  if (user) {
    return false
  }
  else {
    return true
  }
};
module.exports = {
  userAuth,
  userLogin,
  getBycourseId,
  userRegister,
  getAllUser,
  deleteUser,
  updateUser,
  getUserByCourse,
  checkRole
};
