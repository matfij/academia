import { ReactNode, useEffect, useState } from 'react';

type TooltipConfig = {
    containerWidth?: string;
    hintWidth?: string;
};

type TooltipComponentProps = {
    content: ReactNode;
    hint: ReactNode;
    config?: TooltipConfig;
};

const DEFAULT_CONFIG: TooltipConfig = {
    containerWidth: 'fit-content',
    hintWidth: '400px',
};

export const TooltipComponent = ({ content, hint, config }: TooltipComponentProps) => {
    const [cssConfig, setCssConfig] = useState(DEFAULT_CONFIG);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setCssConfig({ ...DEFAULT_CONFIG, ...config });
    }, [config]);

    const handleMouseEnter = () => {
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="tooltipContainer"
            style={{ width: cssConfig.containerWidth }}
        >
            {content}
            {isVisible && (
                <div className="tooltipWrapper" style={{ width: cssConfig.hintWidth }}>
                    {hint}
                </div>
            )}
        </div>
    );
};
