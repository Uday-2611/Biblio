import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
    try {
        cloudinary.config({
            cloud_name: 'dxdnjetf1',
            api_key: '592521867292979',
            api_secret: 'Q_UKsaudFmduDqjOZ81UlSxPyH4'
        });
        console.log('Cloudinary Connected Successfully');
    } catch (error) {
        console.error('Cloudinary Connection Failed:', error);
        process.exit(1);
    }
};

export { cloudinary, connectCloudinary };