import { useState, useEffect, useRef } from 'react';

const useChartResize = (): [number|undefined, number|undefined, React.MutableRefObject<HTMLDivElement | null>] => {
    // Container ref used to access width and height
    const svgContainer = useRef<HTMLDivElement | null>(null);
    // States which keep track of the updating width and height of the svgContainer
    const [widthState, setWidthState] = useState<number>();
    const [heightState, setHeightState] = useState<number>();

    // Calculates the width and height of the svgContainer
    const getSvgContainerSize = () => {
        const newWidth = svgContainer.current?.clientWidth;
        setWidthState(newWidth);

        const newHeight = svgContainer.current?.clientHeight;
        setHeightState(newHeight);
    };

    // Grabs new width and height values when window is resized
    useEffect(() => {
        getSvgContainerSize();
        window.addEventListener("resize", getSvgContainerSize);
        return () => window.removeEventListener("resize", getSvgContainerSize);
    }, []);

    return [widthState, heightState, svgContainer];
}

export default useChartResize;