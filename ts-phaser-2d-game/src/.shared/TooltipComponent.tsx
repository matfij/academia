import { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';

type TooltipConfig = {
    containerWidth?: string;
    width?: string;
    top?: string;
    left?: string;
    transform?: string;
};

type TooltipComponentProps = {
    content: ReactNode;
    hint: ReactNode;
    config?: TooltipConfig;
};

const DEFAULT_CONFIG: TooltipConfig = {
    containerWidth: 'fit-content',
    width: '400px',
    top: '110%',
    left: '50%',
    transform: 'translateX(-50%)',
};

export const TooltipComponent = ({ content, hint, config }: TooltipComponentProps) => {
    const hintRef = useRef<HTMLDivElement>(null);
    const [cssConfig, setCssConfig] = useState(DEFAULT_CONFIG);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setCssConfig({ ...DEFAULT_CONFIG, ...config });
    }, [config]);

    const handleMouseEnter = () => {
        setIsVisible(true);
    };

    const handleMouseMove = ({clientX, clientY}: MouseEvent) => {
        const translateX = clientX > window.innerWidth / 2 ? '-110%' : '10%';
        const translateY = clientY > window.innerHeight / 2 ? '-110%' : '10%';

        setCssConfig((oldConfig) => ({
            ...oldConfig,
            top: `${clientY}px`,
            left: `${clientX}px`,
            transform: `translateX(${translateX}) translateY(${translateY})`,
        }));
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={(e) => handleMouseMove(e)}
            className="tooltipContainer"
            style={{ width: cssConfig.containerWidth }}
        >
            {content}
            {isVisible && (
                <div ref={hintRef} className="tooltipWrapper" style={cssConfig}>
                    {hint}
                </div>
            )}
        </div>
    );
};
