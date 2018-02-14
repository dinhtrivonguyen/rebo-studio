import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Button, OverlayTrigger, Popover, Tooltip, Overlay } from 'react-bootstrap';
import interact from 'interactjs';
import Alert from './../../common/alert/Alert';
import EditorBox from '../editor_box/EditorBox';
import { ID_PREFIX_SORTABLE_CONTAINER } from '../../../../common/constants';
import { ADD_BOX } from '../../../../common/actions';
import { isSortableBox, isBox } from '../../../../common/utils';
import Ediphy from '../../../../core/editor/main';
import i18n from 'i18next';

import './_editorBoxSortable.scss';
import { instanceExists, releaseClick, findBox } from '../../../../common/common_tools';

/**
 * EditorBoxSortable Component
 * @desc It is a special kind of EditorBox that is automatically added when a document is created. It cannot be moved or resized and it takes up the whole width of the page. It has different 'rows', named SortableContainers, where plugins are displayed, that can be sorted.
 */
export default class EditorBoxSortable extends Component {
    /**
     * Constructor
     * @param props React component props
     */
    constructor(props) {
        super(props);
        /**
         * Component's initial state
         * @type {{alert: null}}
         */
        this.state = {
            alert: null,
        };
        this.getNewIndex = this.getNewIndex.bind(this);
    }
    /**
     * Renders React Component
     * @returns {code} React rendered component
     */
    render() {
        let box = this.props.boxes[this.props.id];
        return (
            <div className="editorBoxSortable"
                onClick={e => {
                    if(box.children.length !== 0) {
                        this.props.onBoxSelected(this.props.id);
                    }
                    e.stopPropagation();
                }}>
                <div ref="sortableContainer"
                    className={(this.props.id === this.props.boxSelected && box.children.length > 0) ? ' selectedBox sortableContainerBox' : ' sortableContainerBox'}
                    style={{
                        position: 'relative',
                        boxSizing: 'border-box',
                    }}>
                    {this.state.alert}
                    {box.children.map((idContainer, index)=> {
                        let container = box.sortableContainers[idContainer];
                        return (<div key={index}
                            className={"editorBoxSortableContainer pos_relative " + container.style.className}
                            data-id={idContainer}
                            id={idContainer}
                            ref={idContainer}
                            style={
                                Object.assign({}, {
                                    height: container.height === 'auto' ? container.height : container.height + 'px',
                                }, container.style)
                            }>
                            <div className="disp_table width100 height100" style={{ minHeight: '100px' }}>
                                {container.colDistribution.map((col, i) => {
                                    if (container.cols[i]) {
                                        return (<div key={i}
                                            className={"colDist-i height100 disp_table_cell vert_al_top colNum" + i}
                                            style={{ width: col + "%" }}>
                                            {container.cols[i].map((row, j) => {
                                                return (<div key={j}
                                                    className={"colDist-j width100 pos_relative rowNum" + j}
                                                    style={{ height: row + "%", minHeight: parseInt(100 / (container.cols[i].length), 10) + 'px' }}
                                                    ref={e => {
                                                        if(e !== null) {
                                                            this.configureDropZone(
                                                                ReactDOM.findDOMNode(e),
                                                                "cell",
                                                                ".rib, .dnd", // + idContainer,
                                                                {
                                                                    idContainer: idContainer,
                                                                    i: i,
                                                                    j: j,
                                                                }
                                                            );
                                                        }
                                                    }}>
                                                    {container.children.map((idBox, ind) => {
                                                        if (this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
                                                            return (<EditorBox id={idBox}
                                                                key={ind}
                                                                boxes={this.props.boxes}
                                                                boxSelected={this.props.boxSelected}
                                                                boxLevelSelected={this.props.boxLevelSelected}
                                                                containedViews={this.props.containedViews}
                                                                containedViewSelected={this.props.containedViewSelected}
                                                                toolbars={this.props.toolbars}
                                                                lastActionDispatched={this.props.lastActionDispatched}
                                                                addMarkShortcut={this.props.addMarkShortcut}
                                                                deleteMarkCreator={this.props.deleteMarkCreator}
                                                                onRichMarkUpdated={this.props.onRichMarkUpdated}
                                                                markCreatorId={this.props.markCreatorId}
                                                                onBoxAdded={this.props.onBoxAdded}
                                                                onBoxSelected={this.props.onBoxSelected}
                                                                onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                                                onBoxMoved={this.props.onBoxMoved}
                                                                onBoxResized={this.props.onBoxResized}
                                                                onBoxDropped={this.props.onBoxDropped}
                                                                onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                                                onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                                                onSortableContainerResized={this.props.onSortableContainerResized}
                                                                onTextEditorToggled={this.props.onTextEditorToggled}
                                                                onRichMarksModalToggled={this.props.onRichMarksModalToggled}
                                                                setCorrectAnswer={this.props.setCorrectAnswer}
                                                                pageType={this.props.pageType}/>);

                                                        } else if (ind === container.children.length - 1) {
                                                            return (<span key={ind}><br/><br/></span>);
                                                        }

                                                        return null;
                                                    })}
                                                    {container.children.length === 0 ? (<div key={-1} style={{ height: '46px' }}/>) : null }
                                                </div>);
                                            })}
                                        </div>);
                                    }

                                    return null;
                                })}
                            </div>

                            <div className="sortableMenu width100 over_hidden">
                                <div className="iconsOverBar float_left pos_absolute bottom0">
                                    { box.children.length > 1 ? <OverlayTrigger placement="top" overlay={
                                        <Tooltip id="deleteTooltip">{i18n.t('Reorder')}
                                        </Tooltip>}>
                                        <i className="material-icons drag-handle btnOverBar">swap_vert</i>
                                    </OverlayTrigger> : null }

                                    <Overlay rootClose
                                        show={this.state.show === idContainer}
                                        placement="top"
                                        container={this/* .refs[idContainer]*/}
                                        target={() => ReactDOM.findDOMNode(this.refs['btn-' + idContainer])}
                                        onHide={() => {this.setState({ show: this.state.show === idContainer ? false : this.state.show });}}>
                                        <Popover id="popov" title={i18n.t("delete_container")}>
                                            <i style={{ color: 'yellow', fontSize: '13px', padding: '0 5px' }} className="material-icons">warning</i>
                                            { i18n.t("messages.delete_container") }
                                            <br/>
                                            <br/>
                                            <Button className="popoverButton"
                                                style={{ float: 'right' }}
                                                onClick={e => {
                                                    this.props.onSortableContainerDeleted(idContainer, box.id);
                                                    e.stopPropagation();
                                                    this.setState({ show: false });
                                                }}
                                                onTap={e => {
                                                    this.props.onSortableContainerDeleted(idContainer, box.id);
                                                    e.stopPropagation();
                                                    this.setState({ show: false });
                                                }} >
                                                {i18n.t("Accept")}
                                            </Button>
                                            <Button className="popoverButton"
                                                style={{ float: 'right' }}
                                                onClick={() => {this.setState({ show: false });}}>
                                                {i18n.t("Cancel")}
                                            </Button>
                                        </Popover>
                                    </Overlay>
                                    <OverlayTrigger placement="top" overlay={
                                        <Tooltip id="deleteTooltip">{i18n.t('delete')}
                                        </Tooltip>}>
                                        <Button
                                            onClick={() => {this.setState({ show: idContainer });}}
                                            ref={'btn-' + idContainer}
                                            className="material-icons delete-sortable btnOverBar">delete</Button>
                                    </OverlayTrigger>

                                </div>

                            </div>
                        </div>);
                    })}
                </div>

                <div className="dragContentHere" data-html2canvas-ignore
                    // style={{ backgroundColor: this.props.background }}
                    onClick={e => {
                        this.props.onBoxSelected(-1);
                        e.stopPropagation();}}>{i18n.t("messages.drag_content")}
                </div>

            </div>
        );
    }

    /**
     * After component updates
     * Sets up interact resizable features
     * @param prevProps React previous props
     * @param prevState React previous state
     */
    componentDidUpdate(prevProps, prevState) {
        this.props.boxes[this.props.id].children.map(id => {
            this.configureResizable(this.refs[id]);
        });
    }
    /**
     * After component mounts
     * Sets up interact sortable and resizable features
     */
    componentDidMount() {
        this.configureDropZone(ReactDOM.findDOMNode(this), "newContainer", ".rib");
        // this.configureDropZone(".editorBoxSortableContainer", "existingContainer", ".rib");

        this.props.boxes[this.props.id].children.map(id => {
            this.configureResizable(this.refs[id]);
        });

        let list = jQuery(this.refs.sortableContainer);
        list.sortable({
            handle: '.drag-handle',
            start: (event, ui) => {

                // Hide EditorShortcuts
                let bar = this.props.containedViewSelected === 0 ?
                    document.getElementById('editorBoxIcons') :
                    document.getElementById('contained_editorBoxIcons');

                if (bar !== null) {
                    bar.classList.add('hidden');
                }
            },
            stop: (event, ui) => {
                let indexes = [];
                let children = list[0].children;
                for (let i = 0; i < children.length; i++) {
                    indexes.push(children[i].getAttribute("data-id"));
                }
                if (indexes.length !== 0) {
                    this.props.onSortableContainerReordered(indexes, this.props.id);

                }
                list.sortable('cancel');
                // Unhide EditorShortcuts
                let bar = this.props.containedViewSelected === 0 ?
                    document.getElementById('editorBoxIcons') :
                    document.getElementById('contained_editorBoxIcons');
                if (bar !== null) {
                    bar.classList.remove('hidden');
                }
                window.dispatchEvent(new Event('resize'));

            },
        });
    }

    /**
     * Sets up interact resizable features.
     * @param item Node that will be made resizable
     */
    configureResizable(item) {
        interact(item).resizable({
            enabled: this.props.id === this.props.boxSelected && item.style.height !== "auto",
            edges: { left: false, right: false, bottom: true, top: false },
            autoScroll: {
                container: document.getElementById('canvas'),
                margin: 50,
                distance: 0,
                interval: 0,
            },
            onmove: (event) => {
                event.target.style.height = event.rect.height + 'px';
            },
            onend: (event) => {
                this.props.onSortableContainerResized(event.target.getAttribute("data-id"), this.props.id, parseInt(event.target.style.height, 10));
            },
        });
    }

    /**
     * Sets up interact dropzone features
     * @param node Node that accepts dragged items
     * @param dropArea Denomination of the dropArea (cell, newContainer, existingContainer)
     * @param selector Selector of the elements accepted in the dropzone
     * @param extraParams Additional info, such as row and column
     */
    configureDropZone(node, dropArea, selector, extraParams) {
        interact(node).dropzone({
            accept: selector,
            overlap: 'pointer',
            ondropactivate: function(e) {
                e.target.classList.add('drop-active');
            },
            ondragenter: function(e) {
                e.target.classList.add("drop-target");
            },
            ondragleave: function(e) {
                e.target.classList.remove("drop-target");
            },
            ondrop: function(e) {
                let draggingFromRibbon = e.relatedTarget.className.indexOf("rib") !== -1;
                let clone = document.getElementById('clone');
                if (clone) {
                    clone.parentNode.removeChild(clone);
                }
                let newInd = extraParams ? this.getNewIndex(e.dragEvent.clientX, e.dragEvent.clientY, this.props.id, extraParams.idContainer) : 0;
                if (isSortableBox(this.props.id) && Ediphy.Plugins.get(e.relatedTarget.getAttribute("name")).getConfig().limitToOneInstance) {
                    if (draggingFromRibbon && instanceExists(e.relatedTarget.getAttribute("name"))) {
                        let alert = (<Alert className="pageModal"
                            show
                            hasHeader
                            backdrop={false}
                            title={<span><i className="material-icons alert-warning" >
                                        warning</i>{i18n.t("messages.alert")}</span>}
                            closeButton onClose={() => {this.setState({ alert: null });}}>
                            <span> {i18n.t('messages.instance_limit')} </span>
                        </Alert>);
                        this.setState({ alert: alert });

                        e.dragEvent.stopPropagation();
                        return;
                    }
                }
                if (dropArea === 'cell') {
                    // If element dragged is coming from PluginRibbon, create a new EditorBox
                    if (draggingFromRibbon) {
                        // Check if there is a limit in the number of plugin instances

                        let initialParams = {
                            parent: this.props.id,
                            container: extraParams.idContainer,
                            col: extraParams.i,
                            row: extraParams.j,
                            index: newInd,
                        };

                        Ediphy.Plugins.get(e.relatedTarget.getAttribute("name")).getConfig().callback(initialParams, ADD_BOX);
                        e.dragEvent.stopPropagation();
                    } else {
                        let boxDragged = this.props.boxes[this.props.boxSelected];
                        if (boxDragged && ((this.props.id !== boxDragged.parent) || (extraParams.idContainer !== boxDragged.container) || (extraParams.j !== boxDragged.row) || (extraParams.i !== boxDragged.col))) {
                            this.props.onBoxDropped(this.props.boxSelected,
                                extraParams.j,
                                extraParams.i,
                                this.props.id,
                                extraParams.idContainer,
                                boxDragged.parent, boxDragged.container, undefined, newInd);
                        }

                        for (let b in this.props.boxes) {
                            let dombox = findBox(b);
                            if (dombox) {
                                dombox.style.opacity = 1;
                            }
                        }

                    }
                } else {

                    let initialParams = {};
                    if (dropArea === 'existingContainer') {
                        initialParams = {
                            parent: this.props.id,
                            container: e.target.getAttribute("data-id"),
                            index: newInd,

                        };
                    } else if (dropArea === 'newContainer') {
                        initialParams = {
                            parent: this.props.id,
                            container: ID_PREFIX_SORTABLE_CONTAINER + Date.now(),
                            index: newInd,
                        };
                    }

                    Ediphy.Plugins.get(e.relatedTarget.getAttribute("name")).getConfig().callback(initialParams, ADD_BOX);
                    e.dragEvent.stopPropagation();
                }

            }.bind(this),
            ondropdeactivate: function(e) {
                e.target.classList.remove('drop-active');
                e.target.classList.remove("drop-target");
            },
        });
    }

    getNewIndex(x, y, parent, container) {
        let el = document.elementFromPoint(x, y);
        let rc = releaseClick(el, 'box-');
        let children = this.props.boxes[parent].sortableContainers[container].children; // .filter(box=>{return this.props.boxes[box].row === extraParams.j && this.props.boxes[box].col === extraParams.i});
        let newInd = children.indexOf(rc);
        return newInd === 0 ? 1 : ((newInd === -1 || newInd >= children.length) ? (children.length) : newInd);
    }

    /**
     * Before component unmounts
     * Unset interact listeners
     */
    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this)).unset();
        interact(".editorBoxSortableContainer").unset();

    }
}

EditorBoxSortable.propTypes = {
    /**
     * Identificador único de la caja
     */
    id: PropTypes.string.isRequired,
    /**
     * Diccionario que contiene todas las cajas creadas, accesibles por su *id*
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Caja seleccionada en el momento. Si no hay ninguna, -1
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Nivel de profundidad de caja seleccionada (sólo para plugins dentro de plugins)
     */
    boxLevelSelected: PropTypes.number.isRequired,
    /**
     * Diccionario que contiene todas las vistas contenidas, accesibles por su *id*
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Vista contenida seleccionada identificada por su *id*
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Diccionario que contiene todas las cajas y vistas creadas , accesibles por su *id*
     */
    toolbars: PropTypes.object.isRequired,
    /**
     * Última acción realizada en Redux
     */
    lastActionDispatched: PropTypes.any.isRequired,
    /**
     * Añade una marca a la caja
     */
    addMarkShortcut: PropTypes.func.isRequired,
    /**
     * Función que oculta el overlay de creación de marcas
     */
    deleteMarkCreator: PropTypes.func.isRequired,
    /**
     * Identificador de la caja en la que se va a crear una marca
     */
    markCreatorId: PropTypes.any.isRequired,
    /**
     * Añade una caja
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * Selecciona la caja
     */
    onBoxSelected: PropTypes.func.isRequired,
    /**
     * Aumenta el nivel de profundidad de selección (plugins dentro de plugins)
     */
    onBoxLevelIncreased: PropTypes.func.isRequired,
    /**
     * Mueve la caja
     */
    onBoxMoved: PropTypes.func.isRequired,
    /**
     * Redimensiona la caja
     */
    onBoxResized: PropTypes.func.isRequired,
    /**
     * Suelta la caja en una zona de un EditorBoxSortable
     */
    onBoxDropped: PropTypes.func.isRequired,
    /**
     * Alínea la caja verticalmente
     */
    onVerticallyAlignBox: PropTypes.func.isRequired,
    /**
     * Reordena las cajas dentro de su contenedor
     */
    onBoxesInsideSortableReorder: PropTypes.func.isRequired,
    /**
     * Borra un contenedor
     */
    onSortableContainerDeleted: PropTypes.func.isRequired,
    /**
     * Reordena los contenedores
     */
    onSortableContainerReordered: PropTypes.func.isRequired,
    /**
     * Redimensiona un contenedor
     */
    onSortableContainerResized: PropTypes.func.isRequired,
    /**
     * Hace aparecer/desaparecer el CKEditor
     */
    onTextEditorToggled: PropTypes.func.isRequired,
    /**
     * Indica el tipo de página en el que se encuentra la caja
     */
    pageType: PropTypes.string.isRequired,
    /**
      * Hace aparecer/desaparecer el modal de configuración de marcas
      */
    onRichMarksModalToggled: PropTypes.func.isRequired,
    /**
      * Actualiza marca
      */
    onRichMarkUpdated: PropTypes.func.isRequired,
};
