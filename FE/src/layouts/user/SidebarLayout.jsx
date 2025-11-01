import React, {
    useState,
    useRef,
    useLayoutEffect,
    cloneElement,
    isValidElement,
} from 'react'
import Header from '~/components/user/home/Header'
import Footer from '~/components/user/home/Footer'
import DefaultSidebar from '~/components/user/product/Sidebar'
import { Outlet } from 'react-router-dom'
import FixedNavbar from '~/components/user/home/FixedNavbar'
import StickyBox from 'react-sticky-box'

const DEFAULT_HIDE_PRIORITY_LEFT = ['hot', 'featured', 'search', 'categories']
const DEFAULT_HIDE_PRIORITY_RIGHT = ['featuredPosts', 'consumerTips']

const DEFAULT_INITIAL_SECTIONS_STATE_LEFT = {
    search: true,
    categories: true,
    featured: true,
    hot: true,
}
const DEFAULT_INITIAL_SECTIONS_STATE_RIGHT = {
    featuredPosts: true,
    consumerTips: true,
}

const SidebarLayout = ({
    sidebar = <DefaultSidebar />,
    sidebarRight = null,
    leftHidePriority = DEFAULT_HIDE_PRIORITY_LEFT,
    rightHidePriority = DEFAULT_HIDE_PRIORITY_RIGHT,
    initialSectionsStateLeft = DEFAULT_INITIAL_SECTIONS_STATE_LEFT,
    initialSectionsStateRight = DEFAULT_INITIAL_SECTIONS_STATE_RIGHT,
}) => {
    const STICKY_OFFSET = 80

    const [leftVisibleSections, setLeftVisibleSections] = useState(
        initialSectionsStateLeft
    )
    const [rightVisibleSections, setRightVisibleSections] = useState(
        initialSectionsStateRight
    )

    const leftSidebarRef = useRef(null)
    const mainContentRef = useRef(null)
    const rightSidebarRef = useRef(null)

    useLayoutEffect(() => {
        const timer = setTimeout(() => {
            const mainNode = mainContentRef.current
            const leftNode = leftSidebarRef.current
            const rightNode = rightSidebarRef.current

            if (!mainNode) return
            const mainHeight = mainNode.offsetHeight
            console.log('mainHeight (delayed):', mainHeight)

            if (leftNode) {
                const leftSidebarHeight = leftNode.offsetHeight
                if (leftSidebarHeight > mainHeight) {
                    for (const sectionToHide of leftHidePriority) {
                        if (leftVisibleSections[sectionToHide]) {
                            setLeftVisibleSections(prev => ({
                                ...prev,
                                [sectionToHide]: false,
                            }))
                            break
                        }
                    }
                }
            }

            if (rightNode) {
                const rightSidebarHeight = rightNode.offsetHeight
                if (rightSidebarHeight > mainHeight) {
                    for (const sectionToHide of rightHidePriority) {
                        if (rightVisibleSections[sectionToHide]) {
                            setRightVisibleSections(prev => ({
                                ...prev,
                                [sectionToHide]: false,
                            }))
                            break
                        }
                    }
                }
            }
        }, 200)

        return () => clearTimeout(timer)
    }, [
        leftVisibleSections,
        rightVisibleSections,
        sidebar,
        sidebarRight,
        leftHidePriority,
        rightHidePriority,
    ])

    const controlledLeftSidebar = isValidElement(sidebar)
        ? cloneElement(sidebar, { sections: leftVisibleSections })
        : sidebar

    const controlledRightSidebar = isValidElement(sidebarRight)
        ? cloneElement(sidebarRight, { sections: rightVisibleSections })
        : sidebarRight

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <FixedNavbar />

            <div className="flex-1 py-6 px-[200px]">
                <div className="container mx-auto">
                    <div className="flex gap-6 items-start">
                        <StickyBox offsetTop={STICKY_OFFSET} offsetBottom={20}>
                            <aside
                                ref={leftSidebarRef}
                                className="w-58 bg-white rounded-lg shadow-md p-4 flex-shrink-0"
                            >
                                {controlledLeftSidebar}
                            </aside>
                        </StickyBox>

                        <main
                            ref={mainContentRef}
                            className="flex-1 bg-white rounded-lg shadow-md p-6"
                        >
                            <Outlet />
                        </main>

                        {sidebarRight && (
                            <StickyBox
                                offsetTop={STICKY_OFFSET}
                                offsetBottom={20}
                            >
                                <aside
                                    ref={rightSidebarRef}
                                    className="w-64 bg-white rounded-lg shadow-md p-4 flex-shrink-0"
                                >
                                    {controlledRightSidebar}
                                </aside>
                            </StickyBox>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default SidebarLayout
