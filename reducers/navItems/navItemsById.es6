import {
    ADD_BOX, MOVE_BOX, ADD_NAV_ITEM, CHANGE_BACKGROUND, DELETE_BOX, EXPAND_NAV_ITEM,
    REORDER_NAV_ITEM, DELETE_NAV_ITEM, TOGGLE_NAV_ITEM, DUPLICATE_NAV_ITEM,
    DELETE_SORTABLE_CONTAINER, DROP_BOX,
    ADD_RICH_MARK, EDIT_RICH_MARK, DELETE_RICH_MARK,
    IMPORT_STATE, PASTE_BOX, CHANGE_BOX_LAYER, ADD_NAV_ITEMS, IMPORT_EDI,
} from '../../common/actions';
import { changeProp, changeProps, deleteProps, isView, findNavItemContainingBox, findDescendantNavItems, isContainedView } from '../../common/utils';
import { singleNavItemReducer } from './singleNavItemReducer';
import { navItemCreator } from '../_helpers/navItemCreator';

export default function(state = { 0: { id: 0, children: [], boxes: [], level: 0, type: '', hidden: false } }, action = {}) {
    switch (action.type) {
    case ADD_BOX:
        if (isView(action.payload.ids.parent)) {
            let b = changeProp(state, action.payload.ids.parent, singleNavItemReducer(state[action.payload.ids.parent], action));
            return b;
        }

        let s = state;
        return s;
    case MOVE_BOX:
        if (action.payload.container === 0 && action.payload.position === 'absolute' && !isContainedView(action.payload.parent)) {
            return changeProp(state, action.payload.parent, singleNavItemReducer(state[action.payload.parent], action));
        }
        return state;
    case CHANGE_BOX_LAYER:
        if (action.payload.container === 0 && !isContainedView(action.payload.parent)) {
            return changeProp(state, action.payload.parent, singleNavItemReducer(state[action.payload.parent], action));
        }
        return state;
    case ADD_NAV_ITEM:
        return changeProps(
            state,
            [
                action.payload.id,
                action.payload.parent,
            ], [
                navItemCreator(state, action),
                singleNavItemReducer(state[action.payload.parent], action),
            ]
        );
    case ADD_NAV_ITEMS:
        let navIds = action.payload.navs.map(nav => { return nav.id; });
        let navs = action.payload.navs.map(nav => { return navItemCreator(state, { type: ADD_NAV_ITEM, payload: nav }); });
        return changeProps(
            state,
            [...navIds, action.payload.parent],
            [...navs,
                singleNavItemReducer(state[action.payload.parent], { type: ADD_NAV_ITEM, payload: { parent: action.payload.parent, ids: navIds } }),
            ]
        );
    case CHANGE_BACKGROUND:
        if(isView(action.payload.id)) {
            return changeProp(state, action.payload.id, singleNavItemReducer(state[action.payload.id], action));
        }
        return state;
    case DELETE_BOX:
        if (isView(action.payload.parent) && action.payload.parent !== 0) {
            /* if(findNavItemContainingBox(state,action.payload.parent).extraFiles.length !== 0){
                            return changeProp(Object.assign({}, state,
                                            Object.assign(
                                                {},
                                                {
                                                    [findNavItemContainingBox(state, action.payload.parent).id]:
                                                    Object.assign(
                                                        {},
                                                        findNavItemContainingBox(state, action.payload.parent),
                                                        {extraFiles: {}
                                                        }
                                                    )
                                                }
                                            )
                                ),
                            action.payload.parent, singleNavItemReducer(state[action.payload.parent], action));
                        }*/
            return changeProp(state, action.payload.parent, singleNavItemReducer(state[action.payload.parent], action));
        }

        if(typeof findNavItemContainingBox(state, action.payload.parent) !== 'undefined' && findNavItemContainingBox(state, action.payload.parent).extraFiles.length !== 0) {
            return Object.assign({}, state,
                Object.assign({},
                    {
                        [findNavItemContainingBox(state, action.payload.parent).id]:
                                Object.assign(
                                    {},
                                    findNavItemContainingBox(state, action.payload.parent),
                                    { extraFiles: {},
                                    }
                                ),
                    }
                )
            );
        }

        return state;
    case DELETE_SORTABLE_CONTAINER:
        /* let item = findNavItemContainingBox(state, action.payload.parent);
                if(item) {
                    if(item.extraFiles.length !== 0) {
                        return Object.assign({}, state,
                            Object.assign({},
                                {
                                    [findNavItemContainingBox(state, action.payload.parent).id]:
                                    Object.assign(
                                        {},
                                        findNavItemContainingBox(state, action.payload.parent),
                                        { extraFiles: {},
                                        }
                                    ),
                                }
                            )
                        );
                    }
                }*/
        let nState = JSON.parse(JSON.stringify(state));
        /* for (let cv in action.payload.cvs) {
                for (let b in action.payload.cvs[cv]) {
                  delete nState[cv].parent[action.payload.cvs[cv][b]];
                }
              }*/
        return nState;
    case EXPAND_NAV_ITEM:
        return changeProp(state, action.payload.id, singleNavItemReducer(state[action.payload.id], action));
    case REORDER_NAV_ITEM:

        let itemsReordered = changeProps(
            state,
            [
                action.payload.id,
                action.payload.oldParent,
                action.payload.newParent,

            ], [
                // Cheaty sneaky, action is replaced
                singleNavItemReducer(state[action.payload.id], {
                    type: REORDER_NAV_ITEM,
                    payload: {
                        id: action.payload.id,
                        oldParent: action.payload.oldParent,
                        newParent: state[action.payload.newParent],
                    },
                }),
                singleNavItemReducer(state[action.payload.oldParent], action),
                singleNavItemReducer(state[action.payload.newParent], action),
            ]
        );

        // Some properties are inherited from parent (level, hidden, unitNumber, etc.)
        // We should update item's children with new inherited value
        let descendantsToUpdate = findDescendantNavItems(itemsReordered, action.payload.id);

        // We remove the first element (the item we moved)
        descendantsToUpdate.shift();

        // Generate new descendants so level are realigned
        let newDescendants = {};
        for (let descendant of descendantsToUpdate) {
            newDescendants[descendant] = (singleNavItemReducer(state[descendant], {
                type: REORDER_NAV_ITEM,
                payload: {
                    id: descendant,
                    // Choose parent from itemsReordered if it is immediate son else choose parent from already processed descendants
                    // This line assumes descendantsToUpdate are ordered from lowest to deepest level
                    newParent: newDescendants[itemsReordered[descendant].parent] || itemsReordered[action.payload.id],
                },
            }));
        }
        return changeProps(itemsReordered, descendantsToUpdate, Object.values(newDescendants));

    case DELETE_NAV_ITEM:
        let navState = JSON.parse(JSON.stringify(state));
        for (let cv in navState) {
            /* for (let box in action.payload.boxes) {
                console.log(action.payload.boxes, navState[cv])
                if (navState[cv].parent) {
                    let parents = Object.keys(navState[cv].parent).reduce((obj, key) => (obj[navState[cv].parent[key]] = key, obj), {});
                    if(parents[action.payload.boxes[box]]) {
                        delete navState[cv].parent[parents[action.payload.boxes[box]]];
                    }
                }
            } */
            if (navState[cv].linkedBoxes) {
                for (let mark in navState[cv].linkedBoxes) {
                    let box = navState[cv].linkedBoxes[mark];
                    if (action.payload.boxes.indexOf(box) !== -1) {
                        delete navState[cv].linkedBoxes[mark];
                    }
                }
            }
        }
        let stateWithNavItemsDeleted = deleteProps(navState, action.payload.ids);
        return changeProp(stateWithNavItemsDeleted, action.payload.parent, singleNavItemReducer(state[action.payload.parent], action));
    case TOGGLE_NAV_ITEM:
        // If parent is already hidden, do nothing
        if (state[state[action.payload.id].parent].hidden) {
            return state;
        }
        let itemsToToggle = findDescendantNavItems(state, action.payload.id);
        let itemsToggled = [];
        itemsToToggle.forEach(it => {
            // This is "cheaty"; we're replacing the original action
            itemsToggled.push(singleNavItemReducer(state[it], {
                type: TOGGLE_NAV_ITEM,
                payload: { value: (!state[action.payload.id].hidden) },
            }));
        });
        return changeProps(state, itemsToToggle, itemsToggled);
    case ADD_RICH_MARK:
        if (action.payload && action.payload.mark && (action.payload.mark.connectMode === 'existing' || action.payload.mark.connectMode === 'new') && action.payload.mark.connection) {
            if (!isContainedView(action.payload.mark.connection) && state[action.payload.mark.connection]) {
                return {
                    ...state,
                    [action.payload.mark.connection]: {
                        ...state[action.payload.mark.connection],
                        linkedBoxes: {
                            ...state[action.payload.mark.connection].linkedBoxes,
                            [action.payload.mark.id]: action.payload.mark.origin,
                        },
                    },
                };
            }
        }
        return state;
    case EDIT_RICH_MARK:
        if (action.payload && action.payload.mark && (action.payload.mark.connectMode === 'existing' || action.payload.mark.connectMode === 'new') && action.payload.mark.connection) {
            if (!isContainedView(action.payload.mark.connection) && state[action.payload.mark.connection]) {
                return {
                    ...state,
                    [action.payload.mark.connection]: {
                        ...state[action.payload.mark.connection],
                        linkedBoxes: {
                            ...state[action.payload.mark.connection].linkedBoxes,
                            [action.payload.mark.id]: action.payload.mark.origin,
                        },
                    },
                };
            }
        }
        return state;
    case DELETE_RICH_MARK:
        if(!isContainedView(action.payload.mark.connection) && isView(action.payload.mark.connection)) {
            if(action.payload.mark.connectMode === "existing" && state[action.payload.mark.connection]) {
                let lb = {
                    ...state[action.payload.mark.connection].linkedBoxes,
                };
                delete lb[action.payload.mark.id];
                return {
                    ...state,
                    [action.payload.mark.connection]: {
                        ...state[action.payload.mark.connection],
                        linkedBoxes: lb,
                    },
                };
            }
        }
        return state;
    case IMPORT_STATE:
        return action.payload.present.navItemsById || state;
    case DROP_BOX:
        if (isView(action.payload.parent) && isView(action.payload.oldParent)) {
            return changeProps(state, [action.payload.parent, action.payload.oldParent], [singleNavItemReducer(state[action.payload.parent], action), singleNavItemReducer(state[action.payload.oldParent], action)]);
        } else if (!isView(action.payload.parent) && isView(action.payload.oldParent)) {
            return changeProp(state, action.payload.oldParent, singleNavItemReducer(state[action.payload.oldParent], action));
        } else if (isView(action.payload.parent) && !isView(action.payload.oldParent)) {
            return changeProp(state, action.payload.parent, singleNavItemReducer(state[action.payload.parent], action));
        }
        return state;
    case PASTE_BOX:
        let newState = JSON.parse(JSON.stringify(state));
        if (isView(action.payload.ids.parent) && !isContainedView(action.payload.ids.parent)) {
            newState = changeProp(newState, action.payload.ids.parent, singleNavItemReducer(newState[action.payload.ids.parent], action));
        }

        if (action.payload.toolbar && action.payload.toolbar.state && action.payload.toolbar.state.__marks) {
            let marks = action.payload.toolbar.state.__marks;
            for (let mark in marks) {
                if (isView(marks[mark].connection)) {
                    if (newState[marks[mark].connection]) {
                        if (!newState[marks[mark].connection].linkedBoxes[action.payload.ids.id]) {
                            newState[marks[mark].connection].linkedBoxes[action.payload.ids.id] = [];
                        }
                        newState[marks[mark].connection].linkedBoxes[action.payload.ids.id].push(mark);

                    }
                }
            }
        }
        if(action.payload.children) {
            let ids = Object.keys(action.payload.children);

            for (let id in ids) {
                let marks = action.payload.children[ids[id]].toolbar.state.__marks;
                for (let mark in marks) {
                    if (isContainedView(marks[mark].connection)) {
                        if (newState[marks[mark].connection]) {
                            if (!newState[marks[mark].connection].linkedBoxes[ids[id]]) {
                                newState[marks[mark].connection].linkedBoxes[ids[id]] = [];
                            }
                            newState[marks[mark].connection].linkedBoxes[ids[id]].push(mark);

                        }
                    }
                }
            }
        }
        return newState;
    case IMPORT_EDI:
        let zero = { ...state[0] };
        let newZero = { ...action.payload.state.navItemsById[0] };
        return { ...state, ...action.payload.state.navItemsById, 0: { ...zero, children: [...zero.children, ...newZero.children] } };

    case DUPLICATE_NAV_ITEM:
        let oldNavItem = state[action.payload.id];
        let newState2 = JSON.parse(JSON.stringify(state));
        let newNavItem = { ...newState2[action.payload.id] };
        newNavItem.id = action.payload.newId;
        oldNavItem.boxes.map((box, ind)=>{
            newNavItem.boxes[ind] = action.payload.boxes[box];
        });

        for (let nav in newState2) {
            if (newState2[nav].linkedBoxes) {
                for (let lb in newState2[nav].linkedBoxes) {
                    let linkedBox = newState2[nav].linkedBoxes[lb];
                    let newMarkName = lb + action.payload.suffix;
                    let ind = Object.keys(action.payload.boxes).indexOf(linkedBox);
                    if(ind > -1) {
                        newState2[nav] = {
                            ...newState2[nav],
                            linkedBoxes: {
                                ...newState2[nav].linkedBoxes,
                                [newMarkName]: action.payload.boxes[linkedBox],
                            },
                        };
                    }
                }
            }
        }

        return { ...newState2,
            [newNavItem.parent]: { ...state[newNavItem.parent], children: [...state[newNavItem.parent].children, action.payload.newId] },
            [action.payload.newId]: newNavItem,
            [action.payload.id]: { ...state[action.payload.id] },
        };

    default:
        return state;
    }
}
