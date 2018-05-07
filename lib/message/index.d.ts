/// <reference types="react" />
import * as React from 'react';
export declare type ConfigOnClose = () => void;
export interface ConfigOptions {
    top?: number;
    duration?: number;
    prefixCls?: string;
    getContainer?: () => HTMLElement;
    transitionName?: string;
}
declare const _default: {
    info(content: React.ReactNode, duration?: number | (() => void) | undefined, onClose?: ConfigOnClose | undefined): () => void;
    success(content: React.ReactNode, duration?: number | (() => void) | undefined, onClose?: ConfigOnClose | undefined): () => void;
    error(content: React.ReactNode, duration?: number | (() => void) | undefined, onClose?: ConfigOnClose | undefined): () => void;
    warn(content: React.ReactNode, duration?: number | (() => void) | undefined, onClose?: ConfigOnClose | undefined): () => void;
    warning(content: React.ReactNode, duration?: number | (() => void) | undefined, onClose?: ConfigOnClose | undefined): () => void;
    loading(content: React.ReactNode, duration?: number | (() => void) | undefined, onClose?: ConfigOnClose | undefined): () => void;
    config(options: ConfigOptions): void;
    destroy(): void;
};
export default _default;
