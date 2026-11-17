const Course = require("../models/Course");

// Only the columns the Admin catalogue displays. Authoring and private fields
// (trainer, description, objectives, durations, timestamps) are never selected.
const ADMIN_COURSE_FIELDS = "title category level status";

const toCourseSummary = (course) => ({
  id: course._id.toString(),
  title: course.title,
  category: course.category,
  level: course.level,
  status: course.status,
});

// Admin-only complete inventory across every publication state. Authorization is
// enforced by the route middleware (authenticate + authorize(ADMIN)); this
// controller only serializes what the database actually returned.
const listCourses = async (req, res, next) => {
  try {
    const courses = await Course.find()
      .select(ADMIN_COURSE_FIELDS)
      .sort({ title: 1, _id: 1 })
      .lean();

    const data = courses.map(toCourseSummary);

    return res.status(200).json({
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { listCourses };
