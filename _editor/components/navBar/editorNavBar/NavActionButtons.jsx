import i18n from 'i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import screenfull from 'screenfull';
import { changeGlobalConfig, selectBox } from '../../../../common/actions';
import Ediphy from '../../../../core/editor/main';
import { isSection } from '../../../../common/utils';
import ReactDOM from "react-dom";
import { Popover, Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ActionCreators } from 'redux-undo';

import { connect } from 'react-redux';
import { updateUI } from "../../../../common/actions";
import { UI } from "../../../../common/UI.es6";
import { PopoverButton } from '../../carousel/Styles';
import { Description, NavButton, NavButtons } from "./Styles";
import { MatIcon } from "../../../../sass/general/constants";

const img_place_holder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAHCCAIAAAC8ESAzAAAAB3RJTUUH4QgEES4UoueqBwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAA3zSURBVHja7d1rUxtXgsdhpBag1h18mRqTfbHz/T/S7r6ZmMzETgyYi21AbIMyxmAwCCS3pP/zFOWqOEQckWr/fA7d5zT2P+ytAUCqZt0DAIA6CSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARGvVPQC428XFxfHJcfVr3QNhBhqNRqfsVL/WPRC4gxCyoMbj8e7u7tn5ed0DYQZaRfGP//5HURR1DwTuYGkUgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANE8UM9Sarfb21tbdY+CG/7488/Pnz/XPQqYmhCylNZbreFgWPcouOHg4EAIWUaWRgGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCa5whZNRf/UfdAVlDjP+oeCMySELKC3v62e3h4WPcoVlCv1/vlzU7do4AZszTKKjIbnBPfWFaREAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0D9TDFIqiWG9V1ovi8i+R5+fj07PTs7Oz8/PzuocGPJEQwsMajUav2xv0++12u8pgs/nXUspkL7eqhJ8+nRwcfDw6PrK1GywdIYQH9Hu9F9svqgR+v8fmZOPNzY2N6qPfH3w6OXn/5x9HR0d1DxmYghDCvYpm8/Wr14PB4OsU8AeajUan0/ml3d7b3//93e+mhrAshBDu1mq1dv7+pizLqQ5bqJK5NRptbKy/3d0dj8d1vwngYe4ahTsURbHzZqea4T3hyKHqP+l2ujtv3jxmHgnUzoUKt1Ule/3qdacsn/MKVQtfvXhZ91sBHiaEcFuv2xsOBs98kaqFo9GoymHd7wZ4gBDCDVXAXr18OZND2JvN5ovtbee5w4ITQrih3+ttbm7O6tXKTqdTdup+T8CPCCHcMBwMZ/hqzUZjMOjX/Z6AHxFCuNZsNsvO0++RuVPZLotmUfc7A+4lhHBtc3Oz2ZjxRbGxsVEUQgiLSwjh2sb6+sxfs9ForK/buQIWlxDCteZ81jCbZoSwwIQQvuFJB8gjhHBtPJ9jBef0ssBMCCFc+3J6OvPXHF+MT8/O6n5nwL2EEK59/vx55scnnX45PT8zI4TFJYRwbTweH5+czPY1Tz59Oh8LISwuIYQb9vf3ZjgprF7q4OBgHuNsFa2t0ejnfV9gdQkh3PDx8HCGPyms5pfHJ8fzGGdZtl9sv1ifw4OPkEYI4YZqDvf+/buZTArH4/Eff/4x8x86TvR6/aqCW0OTQnguIYTbqknh/rPXM6v+7e3vHR0dzWOEraI1OTd4OByut2xbA88ihHBb1bB3794dHz99SbN6haPj43fv389phO12e7Io2mq1tkZbtXyXYGUIIdzh7Pxs91+/PfnHe1VEd3/bHY/Hcxpev9/7et7vaDRqmRTCMwgh3O309PTXt2/39/en+iFf9ckf9j78uvv2fG67yRRF0e10v/3HbZNCeAYhhHtVMavmhW93dz9/efhB++oTPn369M+3v/7r3/+e31xw7eqAw1tTwMtJoX294amsqMADPh5+rD4G/f5gMCzb7Waz2biydhW/yuQx/P2D/cPDw58wnn6//3VddKIa0vb29u/v3tX9rYKlJITwKAcfP1YfVXI2NzfXW63JgU3j8fnp6ennL1/mOgX8VjWAXrd76zerLg4Hww97e6dz2CsVVp4QwhSq4J2czHoTtml0ys6dt8YURbE1GpkUwhP4GSEsk0G/f+fvV5PCwWBgoxl4AiGEpVHVrtfr3fdv7T4KTyOEsDS6nW5x/92hl5PCvkkhTE0IYWncty761eVGM3YfhSkJISyHZrPZ/e5+0Vsubx8dDk0KYSpCCMuh2+kUj3hq3qQQpiWEsBz6vdvP0d/HpBCmIoSwBKq5YKfTeeQnV5PCkUkhPJoQwhLolOVUR0yMhsNm09UNj+JSgSXw+HXRiaqanfKxM0gIJ4Sw6FpFUV6dRz+VB5+1ACaEEBZduyyfcPNLr9ebahIJsYQQFt1gynXRiVvn9wL3EUJYaK2i9YR10Qmro/AYQggLrV22n/xQYLfbde8oPMhFAgtt2vtFv3W1OureUXiAEMLimuo5+u9VBa06WvebgEUnhLCg/jpWaZrn6L/XedwOpZDsWdcYMA9VvaoE9rrdVqv1zEcgrp6sLz8eHtb9nmBxCSEshGaz2W63q/71e72pdlP7scnqqBDCDwgh1KnqX9lu9/v9Xrc3pyMjqvllq2idnZ/V/V5hQQkh1KAoivZmu5r8dbvdjY2NuX6tan5ZXq6Ofqz7TcOCEkL4eS77177sX6fsVP37OVugXa2O9oQQ7iOEMHeX659leTn/63TX19d//hag1Ve3Ogr3EUKYl2ajWXaq/vW7nU4t/fuq+urtsn3olhm4ixDCjDXWGp1O5+r+l27RajUX4AiIyb2jQgh3EkKYjSo2ZVlOnn8oimLRjkCaPFl/fn5e90Bg4QghzMBoOHr54sWcnn+YiY319bJdHh6ZFMJttliD59oabf3t9etFruBE36lMcBchhGepKvj61aulOO2oa99RuMsSXL2wsJaogmtX946W7See8QsrbDkuYFhAy1XBCWfWw/eW6RqGxbGMFVybnFm/YLezQu2W7DKGRbCkFVybnMrU6dY9Clgsy3clQ72Wt4ITVkfhlmW9mKEWy17BSq/XazaWePwwc64HeKwVqODa1Q7g3a7VUbi23Jc0/DSrUcG1q63gXr16ubm5WfdAYFEs/VUNP8HKVHBiY31j5+9vtBAmVuTChvlZsQquXU0KNza0EP6yOtc2zMPqVXDiawurX+seC9Rs1S5vmKFVreDEpIX/tfOLFhJuNa9weL7VruCEFsKaEMKdEir4lRYSLuI6h6lEVXCiquAvOzubWkikoEsdHiOwghOXz1S82XEfKYFadQ8AZq/f721sPmVy02q1toajwAqufXMf6f7BwcXaxZ2fY8rIShJCVk31B/poOKp7FEup+tZVM8JqQlz3QOCnSvybLwB8JYQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQzQP1LKXDo6P/+b//rXsU3HB2dlb3EOAphJCldHFxcXp6WvcogFVgaRSAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCieY6QRdVYa7fbZ+fndY+DGWgVRfU/FBZTY//DXt1jAIDaWBoFIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEE0IAYgmhABEE0IAogkhANGEEIBoQghANCEEIJoQAhBNCAGIJoQARBNCAKIJIQDRhBCAaEIIQDQhBCCaEAIQTQgBiCaEAEQTQgCiCSEA0YQQgGhCCEA0IQQgmhACEO3/AeDwuM9ery2mAAAAAElFTkSuQmCC";
/**
 * Action buttons in the editor's navbar
 */
class NavActionButtons extends Component {

    state = {
        isFullScreenOn: screenfull.isFullscreen,
        showOverlay: false,
    };

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        const buttons = this.getButtons();
        const allowPublish = (this.props.globalConfig.thumbnail !== "")
            && this.props.globalConfig.title
            && (this.props.globalConfig.thumbnail !== img_place_holder);
        return (
            <NavButtons>
                <Overlay rootClose
                    name="confirmationOverlay"
                    show={this.state.showOverlay}
                    placement='bottom'
                    target={() => ReactDOM.findDOMNode(this.overlayTarget)}
                    onHide={this.hideOverlay}>
                    <Popover id="popov" title={i18n.t('messages.publish_alert_title')}>
                        <i style={{ color: 'yellow', fontSize: '16px', padding: '5px' }} className="material-icons">
                            {!allowPublish ? "warning" : "add_a_photo"}
                        </i>
                        {(allowPublish) ?
                            i18n.t('messages.publish_alert_text') :
                            i18n.t('messages.publish_not_allowed')}
                        <br />
                        <br />
                        <PopoverButton
                            name="popoverCancelButton"
                            onClick={this.hideOverlay}
                            style={{ float: 'right' }}>
                            {i18n.t("Cancel")}
                        </PopoverButton>
                        <PopoverButton
                            name="popoverAcceptButton"
                            disabled={!allowPublish}
                            style={{ float: 'right' }}
                            onClick={this.publish}>
                            {i18n.t("Accept")}
                        </PopoverButton>
                        <div style={{ clear: "both" }} />
                    </Popover>
                </Overlay>
                {buttons.map((item) => {
                    return !item.display ? null : (
                        <OverlayTrigger placement="bottom" key={item.name} overlay={
                            <Tooltip id={"navButtonTooltip"}>{item.tooltip}</Tooltip>}>
                            <NavButton
                                disabled={item.disabled}
                                key={item.name}
                                className={'navButton navbarButton_' + item.name}
                                name={item.name}
                                onClick={item.onClick}
                                title={item.tooltip}
                                ref={item.icon === 'public' ? button => { this.overlayTarget = button; } : null}>
                                <MatIcon children={item.icon} className={'material-icons'} />
                                <Description children={item.description} />
                            </NavButton>
                        </OverlayTrigger>
                    );
                })}
            </NavButtons>
        );
    }

    serverModalOpen = () => {
        this.props.dispatch(updateUI(UI.serverModal, true));
    };

    /**
     * Adds fullscreen listeners
     */
    componentDidMount() {
        screenfull.on('change', this.checkFullScreen);
        // fullScreenListener(this.checkFullScreen, true);

    }

    /**
     * Removes fullscreen listeners
     */
    componentWillUnmount() {
        screenfull.off('change', this.checkFullScreen);
        // fullScreenListener(this.checkFullScreen, false);

    }

    /**
     * Checks if the browser is in fullscreen mode and updates the state
     */
    checkFullScreen = () => {
        this.setState({ isFullScreenOn: screenfull.isFullscreen });
    };

    getButtons = () => {
        return [

            {
                name: 'fullscreen',
                description: i18n.t('fullscreen'),
                tooltip: i18n.t('messages.fullscreen'),
                display: true,
                disabled: false,
                icon: this.state.isFullScreenOn ? 'fullscreen_exit' : 'fullscreen',
                onClick: () => {
                    screenfull.toggle(document.documentElement);
                },
            },
            {
                name: 'appearance',
                description: i18n.t("Style.style"),
                tooltip: i18n.t("Style.edit"),
                display: true,
                icon: 'brush',
                onClick: () => {
                    this.props.toggleStyleConfig();
                },
            },
            {
                name: 'undo',
                description: i18n.t('Undo'),
                tooltip: i18n.t('messages.undo'),
                display: true,
                disabled: this.props.undoDisabled,
                icon: 'undo',
                onClick: () => { this.props.dispatch(ActionCreators.undo()); },
            },
            {
                name: 'redo',
                description: i18n.t('Redo'),
                tooltip: i18n.t('messages.redo'),
                display: true,
                disabled: this.props.redoDisabled,
                icon: 'redo',
                onClick: () => { this.props.dispatch(ActionCreators.redo()); },
            },
            {
                name: 'save',
                description: i18n.t('Save'),
                tooltip: i18n.t('messages.save_changes'),
                display: !Ediphy.Config.disable_save_button,
                // display: (!Ediphy.Config.disable_save_button && (Ediphy.Config.publish_button === undefined || !Ediphy.Config.publish_button)),
                disabled: false,
                icon: 'save',
                onClick: () => {
                    this.props.save();
                    this.serverModalOpen();
                },
            },
            {
                name: 'preview',
                description: i18n.t('Preview'),
                tooltip: i18n.t('messages.preview'),
                display: true,
                disabled: ((this.props.navItemSelected === 0 || (!this.props.navItemsById[this.props.navItemSelected] || this.props.navItemsById[this.props.navItemSelected].hidden) || (this.props.navItemSelected && !Ediphy.Config.sections_have_content && isSection(this.props.navItemSelected)))),
                icon: 'visibility',
                onClick: () => {
                    if (this.props.boxSelected !== 0) {
                        // this.props.onTextEditorToggled(this.props.boxSelected, false);
                        this.props.dispatch(selectBox(-1, this.props.boxesById[-1]));
                    }
                    this.props.dispatch(updateUI(UI.visorVisible, true));
                },
            },
            {
                name: 'publish',
                description: i18n.t('Publish'),
                tooltip: i18n.t('messages.publish_tooltip'),
                display: (Ediphy.Config.publish_button !== undefined && Ediphy.Config.publish_button && this.props.globalConfig.status === "draft"),
                disabled: false,
                icon: 'public',
                onClick: () => {
                    this.setState({ showOverlay: true });
                },
            },
            {
                name: 'unpublish',
                description: i18n.t('Unpublish'),
                tooltip: i18n.t('messages.unpublish'),
                display: (Ediphy.Config.publish_button !== undefined && Ediphy.Config.publish_button && this.props.globalConfig.status === "final"),
                disabled: false,
                icon: 'lock',
                onClick: () => {
                    this.props.dispatch(changeGlobalConfig("status", "draft"));
                    this.props.save();
                    this.serverModalOpen();
                },
            },
        ];
    };

    hideOverlay = () => this.setState({ showOverlay: false });

    publish = () => {
        // acciones de publicar
        window.exitFlag = true;
        const win = window.open('', '_self');
        this.props.dispatch(changeGlobalConfig("status", "final"));
        this.props.dispatch(updateUI(UI.publishing, true));
        this.props.save(win);
        this.setState({ showOverlay: false });
    };
}
export default connect(mapStateToProps)(NavActionButtons);

function mapStateToProps(state) {
    const { boxesById, boxSelected, globalConfig, navItemSelected, navItemsById } = state.undoGroup.present;
    return {
        boxesById,
        boxSelected,
        globalConfig,
        navItemsById,
        navItemSelected,
        status: state.status,
        everPublished: state.everPublished,
        undoDisabled: state.undoGroup.past.length === 0,
        redoDisabled: state.undoGroup.future.length === 0,
    };
}

NavActionButtons.propTypes = {
    /**
     * Redux actions trigger
     */
    dispatch: PropTypes.func,
    /**
     * Object that cointains the course's global configuration, stored in the Redux state
     */
    globalConfig: PropTypes.object.isRequired,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Object that contains all created views (identified by its *id*)
     */
    navItemsById: PropTypes.object.isRequired,
    /**
     * Toggles the "redo" feature
     */
    redoDisabled: PropTypes.bool,
    /**
     * Stores the changes in the remote server
     */
    save: PropTypes.func.isRequired,
    /**
     * Allows using the "undo" feature
     */
    undoDisabled: PropTypes.bool,
    /**
     * Current selected box
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Function for opening/closing Style config modal
     */
    toggleStyleConfig: PropTypes.func.isRequired,
    /**
     * Object containing all boxes
     */
    boxesById: PropTypes.object,
};
