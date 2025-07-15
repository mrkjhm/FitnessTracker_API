const express = require("express")
const workoutController = require("../controllers/workout")
const router = express.Router();
const { verify } = require("../middleware/auth")


router.post("/addWorkout", verify, workoutController.addWorkout);
router.get("/getMyWorkouts", verify, workoutController.getMyWorkouts);
router.patch("/updateWorkout/:id", verify, workoutController.updateWorkout);
router.delete("/deleteWorkout/:id", verify, workoutController.deleteWorkout)
router.patch("/completeWorkoutStatus/:id", verify, workoutController.completeWorkoutStatus)
router.patch("/startWorkout/:id", verify, workoutController.startWorkout)
router.patch('/resetWorkout/:id', verify, workoutController.resetWorkout);
router.get('/getWorkout/:id', verify, workoutController.getWorkout);



module.exports = router;

