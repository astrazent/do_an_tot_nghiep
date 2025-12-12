import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaYoutube,
    FaTiktok,
} from 'react-icons/fa'
import TextSlider from '~/components/user/home/TextSlider'

function TopBar() {
    return (
        <div className="bg-gray-800 text-white text-sm px-40">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <div className="flex items-center">
                    <a
                        href="/top-dac-san"
                        className="bg-green-600 px-3 py-1 text-white font-semibold mr-4"
                    >
                        TOP ĐẶC SẢN
                    </a>
                    <div className="flex items-center space-x-2 text-gray-400 mr-2">
                        <span>&lt;</span>
                        <span>&gt;</span>
                    </div>
                    <TextSlider />
                </div>

                <div className="flex items-center space-x-4">
                    <a
                        href="https://www.facebook.com/your-page-url"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="text-white hover:text-blue-500 transition-colors duration-300"
                    >
                        <FaFacebookF size={15} />
                    </a>
                    <a
                        href="https://twitter.com/your-profile-url"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                        className="text-white hover:text-gray-400 transition-colors duration-300"
                    >
                        <FaTwitter size={15} />
                    </a>
                    <a
                        href="https://www.instagram.com/your-profile-url"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="text-white hover:text-pink-500 transition-colors duration-300"
                    >
                        <FaInstagram size={15} />
                    </a>
                    <a
                        href="https://www.youtube.com/your-channel-url"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="YouTube"
                        className="text-white hover:text-red-500 transition-colors duration-300"
                    >
                        <FaYoutube size={15} />
                    </a>
                    <a
                        href="https://www.tiktok.com/@your-profile-url"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Tiktok"
                        className="text-white hover:text-black transition-colors duration-300"
                    >
                        <FaTiktok size={15} />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default TopBar
