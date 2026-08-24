import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();

const sevenDaysAgo = new Date(now).setDate(now.getDate() -7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() -30);

const getUserStats = async()=> {
    const totalUsersPromise = User.countDocuments()
    const totalActiveUsersPromise = User.countDocuments({isActive: IsActive.ACTIVE})
    const totalInActiveUsersPromise = User.countDocuments({isActive: IsActive.INACTIVE})
    const totalBlockedUsersPromise = User.countDocuments({isActive: IsActive.BLOCKED})

    const newUsersInLast7DaysPromise = User.countDocuments({
        createdAt: {$gte: sevenDaysAgo}
    })
    const newUsersInLast30DaysPromise = User.countDocuments({
        createdAt: {$gte: thirtyDaysAgo}
    })

    const userByRolePromise = User.aggregate([
        // stage -1 
        {
            $group: {
                _id: "$role",
                count: {$sum : 1}
            }
        }
    ])

    const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, userByRole] = await Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalInActiveUsersPromise,
        totalBlockedUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        userByRolePromise
    ])
   
    return {
        totalUsers, 
        totalActiveUsers,
        totalInActiveUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        userByRole
    }
}

const getTourStats = async()=> {
   
    const totalTourPromise = Tour.countDocuments();
    const totalTourByTourTypePromise = Tour.aggregate([
        // stage -1: connect tour type model: lookup stage
        {
        $lookup: {
            from: "tourtypes",
            localField: "tourType",
            foreignField: "_id",
            as:"type"
        }
    }
])

    const [totalTour, totalToutByTourType] = await Promise.all([
        totalTourPromise,
        totalTourByTourTypePromise
    ])

    return {
        totalTour,
       totalToutByTourType
    }
}

const getBookingStats = async()=> {
    // 
}
const getPaymentStats = async()=> {
    // 
}



export const StatsService  = {
    getBookingStats,
    getPaymentStats,
    getUserStats,
    getTourStats
}