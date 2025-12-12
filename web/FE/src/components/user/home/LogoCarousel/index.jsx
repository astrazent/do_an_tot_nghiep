import React from 'react'
import Marquee from 'react-fast-marquee'

import logoIso from '~/assets/icon/logo/iso_22000.jpg'
import logoMocVit from '~/assets/icon/logo/dac_san_moc_vit.png'
import logoOcop from '~/assets/icon/logo/ocop.png'
import logoVanDinh from '~/assets/icon/logo/dac-san-van-dinh.png'
import logoHaccp from '~/assets/icon/logo/haccp.png'
import logoChaVit from '~/assets/icon/logo/dac-san-cha-vit.png'

const logos = [
    { src: logoIso, alt: 'Chứng nhận ISO 22000:2018' },
    { src: logoMocVit, alt: 'Đặc Sản Mộc Vịt Vân Đình' },
    { src: logoOcop, alt: 'Chứng nhận OCOP Hà Nội' },
    { src: logoVanDinh, alt: 'Đặc Sản Vân Đình' },
    { src: logoHaccp, alt: 'Chứng nhận HACCP' },
    { src: logoChaVit, alt: 'Đặc Sản Chả Vịt Vân Đình' },
]

const LogoCarousel = () => (
    <section className="bg-yellow-300 py-8">
        <div className="container mx-auto">
            <Marquee gradient={false} speed={70} pauseOnHover={true}>
                <div className="flex gap-23">
                    {logos.map((logo, index) => (
                        <img
                            key={index}
                            src={logo.src}
                            alt={logo.alt}
                            className="h-16 lg:h-20 object-contain"
                        />
                    ))}
                </div>
            </Marquee>
        </div>
    </section>
)

export default LogoCarousel
