import { clerkClient } from '@clerk/express';
import userModel from '../models/userModel.js';

const buildName = (clerkUser, fallbackEmail) => {
    const fullName = `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim();
    if (fullName) return fullName;
    if (fallbackEmail) return fallbackEmail.split('@')[0];
    return 'User';
};

const authUser = async (req, res, next) => {
    try {
        const clerkUserId = req.auth?.userId;

        if (!clerkUserId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        let user = await userModel.findOne({ clerkId: clerkUserId });

        if (!user) {
            const clerkUser = await clerkClient.users.getUser(clerkUserId);
            const primaryEmail = clerkUser.emailAddresses.find(
                (email) => email.id === clerkUser.primaryEmailAddressId
            )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress || '';
            const displayName = buildName(clerkUser, primaryEmail);

            try {
                // First try linking an existing legacy account by email.
                if (primaryEmail) {
                    user = await userModel.findOneAndUpdate(
                        { email: primaryEmail },
                        {
                            $set: {
                                clerkId: clerkUserId,
                                isSeller: true
                            },
                            $setOnInsert: {
                                name: displayName,
                                cartData: {}
                            }
                        },
                        { new: true }
                    );
                }

                // If no account exists, atomically upsert by clerkId.
                if (!user) {
                    user = await userModel.findOneAndUpdate(
                        { clerkId: clerkUserId },
                        {
                            $set: {
                                isSeller: true
                            },
                            $setOnInsert: {
                                clerkId: clerkUserId,
                                name: displayName,
                                email: primaryEmail || undefined,
                                cartData: {}
                            }
                        },
                        { new: true, upsert: true }
                    );
                }
            } catch (dbError) {
                // Handle duplicate key races from concurrent sign-ins.
                if (dbError?.code === 11000) {
                    user = await userModel.findOne({
                        $or: [
                            { clerkId: clerkUserId },
                            ...(primaryEmail ? [{ email: primaryEmail }] : [])
                        ]
                    });
                } else {
                    throw dbError;
                }
            }
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

export default authUser;
