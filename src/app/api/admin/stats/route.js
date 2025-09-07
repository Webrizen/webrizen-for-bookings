import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Venue from '@/models/Venue';
import Order from '@/models/Order';

export async function GET(req) {
    await dbConnect();
    try {
        const [userCount, venueCount, orderCount, totalRevenueResult] = await Promise.all([
            User.countDocuments(),
            Venue.countDocuments(),
            Order.countDocuments(),
            Order.aggregate([
                { $match: { status: 'paid' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ])
        ]);

        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

        return NextResponse.json({
            success: true,
            data: {
                users: userCount,
                venues: venueCount,
                orders: orderCount,
                revenue: totalRevenue
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
