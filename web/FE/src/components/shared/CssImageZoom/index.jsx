import React, { useRef, useState } from 'react'

const CssImageZoom = ({ src, zoomLevel = 2.5, hoverDelay = 300 }) => {
    const containerRef = useRef(null)
    const lensRef = useRef(null)
    const zoomWindowRef = useRef(null)
    const animationFrameId = useRef(null)
    const hoverTimeoutId = useRef(null)

    const [imgClass, setImgClass] = useState('w-full')
    const [containerClass, setContainerClass] = useState('w-full')

    const handleMouseMove = e => {
        if (animationFrameId.current)
            cancelAnimationFrame(animationFrameId.current)

        animationFrameId.current = requestAnimationFrame(() => {
            if (
                !containerRef.current ||
                !lensRef.current ||
                !zoomWindowRef.current
            )
                return

            const container = containerRef.current
            const lens = lensRef.current
            const zoomWindow = zoomWindowRef.current

            const { left, top, width, height } =
                container.getBoundingClientRect()

            const lensWidth = width / zoomLevel
            const lensHeight = height / zoomLevel
            lens.style.width = `${lensWidth}px`
            lens.style.height = `${lensHeight}px`

            let lensX = e.clientX - left - lensWidth / 2
            let lensY = e.clientY - top - lensHeight / 2

            lensX = Math.max(0, Math.min(lensX, width - lensWidth))
            lensY = Math.max(0, Math.min(lensY, height - lensHeight))

            lens.style.transform = `translate(${lensX}px, ${lensY}px)`

            const backgroundPosX = -lensX * zoomLevel
            const backgroundPosY = -lensY * zoomLevel

            zoomWindow.style.backgroundPosition = `${backgroundPosX}px ${backgroundPosY}px`
        })
    }

    const handleMouseEnter = () => {
        hoverTimeoutId.current = setTimeout(() => {
            if (lensRef.current) lensRef.current.style.opacity = '1'
            if (zoomWindowRef.current) zoomWindowRef.current.style.opacity = '1'
        }, hoverDelay)
    }

    const handleMouseLeave = () => {
        if (hoverTimeoutId.current) {
            clearTimeout(hoverTimeoutId.current)
            hoverTimeoutId.current = null
        }

        if (animationFrameId.current)
            cancelAnimationFrame(animationFrameId.current)

        if (lensRef.current) lensRef.current.style.opacity = '0'
        if (zoomWindowRef.current) zoomWindowRef.current.style.opacity = '0'
    }

    const handleImageLoad = e => {
        const { naturalWidth, naturalHeight } = e.target
        if (naturalWidth > naturalHeight) {
            setImgClass('w-full h-auto')
            setContainerClass('w-full')
        } else {
            setImgClass('h-full w-auto')
            setContainerClass('h-full')
        }
    }

    return (
        <div
            ref={containerRef}
            className={`relative cursor-crosshair ${containerClass}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            <img
                src={src}
                alt="Sản phẩm"
                className={`${imgClass} block`}
                onLoad={handleImageLoad}
            />
            <div
                ref={lensRef}
                className="absolute top-0 left-0 border-2 border-green-600 bg-white/25 pointer-events-none transition-opacity duration-200"
                style={{ opacity: 0 }}
            />
            <div
                ref={zoomWindowRef}
                className="absolute top-0 left-full ml-4 border border-gray-300 pointer-events-none transition-opacity duration-200 overflow-hidden"
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${src})`,
                    backgroundSize: `${100 * (zoomLevel + 0.1)}%`,
                    backgroundRepeat: 'no-repeat',
                    opacity: 0,
                    zIndex: 10,
                }}
            />
        </div>
    )
}

export default CssImageZoom
