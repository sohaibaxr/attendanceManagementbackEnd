const router= require("express").Router()
const {getBycourseId, userRegister,userLogin, userAuth,getAllUser,deleteUser, updateUser, getUserByCourse,checkRole }= require("../utils/auth")

router.post("/registerUser",async(req,res)=>{
    await userRegister(req.body,res)
}),
router.get("/:courseId",async(req,res)=>{
    await getBycourseId(req,res)
})
router.post("/loginUser",async(req,res)=>{
    await userLogin(req.body,res)
}),
router.get("/",async (req,res)=>{
     await getAllUser(req,res)   
}),
router.get("/:id",async (req,res)=>{
    await getUserByCourse(req,res)
}), 
router.delete("/:id",async (req,res)=>{
    await deleteUser(req,res)
}), 

router.put("/:id",async (req,res)=>{
    await updateUser(req,res)    
})



module.exports=router