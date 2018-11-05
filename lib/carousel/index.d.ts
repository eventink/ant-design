import * as React from 'react';
export declare type CarouselEffect = 'scrollx' | 'fade';
export interface CarouselProps {
    effect?: CarouselEffect;
    dots?: boolean;
    vertical?: boolean;
    autoplay?: boolean;
    easing?: string;
    beforeChange?: (from: number, to: number) => void;
    afterChange?: (current: number) => void;
    style?: React.CSSProperties;
    prefixCls?: string;
    accessibility?: boolean;
    nextArrow?: HTMLElement | any;
    prevArrow?: HTMLElement | any;
    pauseOnHover?: boolean;
    className?: string;
    adaptiveHeight?: boolean;
    arrows?: boolean;
    autoplaySpeed?: number;
    centerMode?: boolean;
    centerPadding?: string | any;
    cssEase?: string | any;
    dotsClass?: string;
    draggable?: boolean;
    fade?: boolean;
    focusOnSelect?: boolean;
    infinite?: boolean;
    initialSlide?: number;
    lazyLoad?: boolean;
    rtl?: boolean;
    slide?: string;
    slidesToShow?: number;
    slidesToScroll?: number;
    speed?: number;
    swipe?: boolean;
    swipeToSlide?: boolean;
    touchMove?: boolean;
    touchThreshold?: number;
    variableWidth?: boolean;
    useCSS?: boolean;
    slickGoTo?: number;
}
export default class Carousel extends React.Component<CarouselProps, {}> {
    static defaultProps: {
        dots: boolean;
        arrows: boolean;
        prefixCls: string;
        draggable: boolean;
    };
    innerSlider: any;
    private slick;
    constructor(props: CarouselProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    onWindowResized: () => void;
    saveSlick: (node: any) => void;
    next(): void;
    prev(): void;
    goTo(slide: number, dontAnimate?: boolean): void;
    render(): JSX.Element;
}
