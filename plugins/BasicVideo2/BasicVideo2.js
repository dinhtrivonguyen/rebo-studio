import React from "react";
import VideoPlugin from './components/VideoPlugin.js';
require('./BasicVideo.scss');

export function BasicVideo2(base) {
    return {
        getConfig: function () {
            return {
                name: "BasicVideo2",
                flavor: "react",
                displayName: Dali.i18n.t("BasicVideo2.PluginName"),
                category: "multimedia",
                icon: "play_arrow"
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: Dali.i18n.t('BasicVideo.Video'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Dali.i18n.t('BasicVideo.URL'),
                                    type: 'text',
                                    value: base.getState().url,
                                    autoManaged: false
                                },
                                controls: {
                                    __name: Dali.i18n.t('BasicVideo.Show_controls'),
                                    type: 'checkbox',
                                    checked: base.getState().controls,
                                    autoManaged: false
                                },
                                autoplay: {
                                    __name: Dali.i18n.t('BasicVideo.Autoplay'),
                                    type: 'checkbox',
                                    checked: base.getState().autoplay,
                                    autoManaged: false
                                }
                            }
                        },
                        style: {
                            __name: Dali.i18n.t('BasicVideo.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Dali.i18n.t('BasicVideo.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100
                                },
                                borderWidth: {
                                    __name: Dali.i18n.t('BasicVideo.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('BasicVideo.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('BasicVideo.border_color'),
                                    type: 'color',
                                    value: '#000000'
                                },
                                borderRadius: {
                                    __name: Dali.i18n.t('BasicVideo.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50
                                },
                                opacity: {
                                    __name: Dali.i18n.t('BasicVideo.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.05
                                }

                            }
                        }
                    }
                }
            };
        },
        getInitialState: function () {
            return {
                url: "https://www.youtube.com/watch?time_continue=156&v=yqCwDurUrw0",
                controls: true,
                autoplay: false
            };
        },
        getRenderTemplate: function (state) {
            return (
                /* jshint ignore:start */
                <VideoPlugin state={state}></VideoPlugin>
                /* jshint ignore:end */
            );
        },
        handleToolbar: function (name, value) {
            base.setState(name, value);
        }

    };
}
