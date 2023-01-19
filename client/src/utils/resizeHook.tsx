import { useState, useEffect, useRef } from 'react';

const useResize = (): [number|undefined, number|undefined, React.MutableRefObject<HTMLDivElement | null>, React.MutableRefObject<HTMLDivElement | null>] => {
    // State keeps track of first render status to avoid infinite re-renders
    const [firstRender, setFirstRender] = useState<boolean>(true);
    // Container refs used to access width
    const container = useRef<HTMLDivElement | null>(null);
    const textContainer = useRef<HTMLDivElement | null>(null);
    // States which keep track of the updating width of the containers
    const [widthState, setWidthState] = useState<number>();
    const [textWidth, setTextWidth] = useState<number>();

    // Calculates the width of the containers
    const getContainerSize = () => {
        const newWidth = container.current?.clientWidth;
        const newTextWidth = textContainer.current?.clientWidth;
        setWidthState(newWidth);
        setTextWidth(newTextWidth);
    };

    // Prevents infinite re-renders
    // Without this, elements will appear in the incorrect position until window is manually resized
    if (firstRender === true && widthState !== undefined) {
        setFirstRender(false);
    };

    // When page loads, correct component width sizes will be loaded for reference throughout this component
    // Without this, elements will appear in the incorrect position until window is manually resized
    useEffect(() => {
        getContainerSize();
    }, [firstRender]);

    // Gathers width sizes needed for style related calculations in the component when window is resized
    useEffect(() => {
        // Detects the width on render (determined by container size, or window size if no container)
        getContainerSize();
        // Listens for resize changes, and detects dimensions again when they change
        window.addEventListener("resize", getContainerSize);
        // Cleanup the previously applied event listener
        return () => window.removeEventListener("resize", getContainerSize);
    }, []);

    return [widthState, textWidth, container, textContainer];
};

export default useResize;