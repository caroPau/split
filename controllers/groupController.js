const Group = require("./../models/groupModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");


exports.createGroup = catchAsync(async (req, res, next) => {
    const { groupName, groupMembers } = req.body;

    if (!groupName || !groupMembers) {
        return next(new AppError("Please provide all required fields", 400));
    }

    const newGroup = await Group.create({
        groupName,
        groupMembers
    });

    res.status(201).json({
        status: "success",
        data: {
            group: newGroup
        },
    });
});