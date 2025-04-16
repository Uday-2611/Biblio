import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = () => {
    try {
        cloudinary.config({
            cloud_name: 'dxqjyqz8p',
            api_key: '583153789193697',
            api_secret: 'Ux_Ry6xKYB_3RzR9tGD9GQqVlYw'
        });
        console.log('Cloudinary Connected Successfully');
    } catch (error) {
        console.error('Cloudinary Connection Failed:', error);
        process.exit(1);
    }
};

export { cloudinary, connectCloudinary };