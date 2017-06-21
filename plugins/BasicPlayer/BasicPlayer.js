import React from "react";
import PlayerPlugin from './components/PlayerPluginEditor.js';
require('./BasicPlayer.scss');

export function BasicPlayer(base) {
    return {
        getConfig: function () {
            return {
                name: "BasicPlayer",
                flavor: "react",
                displayName: Dali.i18n.t("BasicPlayer.PluginName"),
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
                            __name: Dali.i18n.t('BasicPlayer.Video'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Dali.i18n.t('BasicPlayer.URL'),
                                    type: 'text',
                                    value: base.getState().url,
                                    autoManaged: false
                                },
                                controls: {
                                    __name: Dali.i18n.t('BasicPlayer.Show_controls'),
                                    type: 'checkbox',
                                    checked: base.getState().controls,
                                    autoManaged: false
                                },
                            }
                        },
                        style: {
                            __name: Dali.i18n.t('BasicPlayer.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Dali.i18n.t('BasicPlayer.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100
                                },
                                borderWidth: {
                                    __name: Dali.i18n.t('BasicPlayer.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('BasicPlayer.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('BasicPlayer.border_color'),
                                    type: 'color',
                                    value: '#000000'
                                },
                                borderRadius: {
                                    __name: Dali.i18n.t('BasicPlayer.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50
                                },
                                opacity: {
                                    __name: Dali.i18n.t('BasicPlayer.opacity'),
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
                controls: true
            };
        },
        getRenderTemplate: function (state) {
            return (
                /* jshint ignore:start */
                <div style={{width:"100%", height:"100%"}}>
                    <PlayerPlugin style={{width:"100%", height:"100%"}} state={state}></PlayerPlugin>
                </div>
                /* jshint ignore:end */
            );
        },
        handleToolbar: function (name, value) {
            base.setState(name, value);
        }

    };
}
