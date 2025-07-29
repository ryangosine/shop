import { combineReducers } from "redux";
import cartReducer from "./cartSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
});

export default rootReducer;

// const initialState = {};

// export default function reducer(state = initialState, action) {
//   switch (action.type) {
//     case "ADD_ITEM": {
//       const existingItem = state[action.item.id];
//       if (existingItem) {
//         return {
//           ...state,
//           [action.item.id]: {
//             ...existingItem,
//             quantity: existingItem.quantity + 1,
//           },
//         };
//       } else {
//         return {
//           ...state,
//           [action.item.id]: {
//             ...action.item,
//             quantity: 1,
//           },
//         };
//       }
//     }
//     case "UPDATE_QUANTITY": {
//       const { id, quantity } = action.item;

//       if (state[id]) {
//         return {
//           ...state,
//           [id]: {
//             ...state[id],
//             quantity,
//           },
//         };
//       } else {
//         return state;
//       }
//     }
//     case "REMOVE_ITEM": {
//       const newState = { ...state };
//       delete newState[action.item.id];
//       return newState;
//     }
//     case "CLEAR_CART": {
//       return {};
//     }
//     default:
//       return state;
//   }
// }

// export const getStoreItemArray = (state) => Object.values(state);
