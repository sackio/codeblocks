import * as SceneActions from 'actions/scene';


const initialState = {
  bricks: [],
  past: [],     // Array of previous states for undo
  future: [],   // Array of future states for redo
};

// Helper to serialize brick data for history (avoid storing Three.js objects)
const serializeBricks = (bricks) => {
  if (!Array.isArray(bricks)) return [];

  return bricks.map((brick) => {
    // Handle both Brick instances and plain objects
    const color = brick._color || brick.color;
    const dimensions = brick._dimensions || brick.dimensions;
    const translation = brick._translation !== undefined ? brick._translation : brick.translation;
    const intersect = brick._intersect || brick.intersect;

    return {
      customId: brick.customId,
      position: {
        x: brick.position.x,
        y: brick.position.y,
        z: brick.position.z
      },
      rotation: {
        y: brick.rotation.y
      },
      color: color,
      dimensions: dimensions,
      translation: translation,
      // Store intersect data for reconstruction
      intersect: intersect ? {
        point: {
          x: intersect.point.x,
          y: intersect.point.y,
          z: intersect.point.z
        },
        face: intersect.face ? {
          normal: {
            x: intersect.face.normal.x,
            y: intersect.face.normal.y,
            z: intersect.face.normal.z
          }
        } : null
      } : null
    };
  });
};


export default function scene(state=initialState, action) {
  switch (action.type) {
    case SceneActions.ADD_BRICK: {
      const { brick } = action.payload;
      return {
        ...state,
        past: [...state.past, serializeBricks(state.bricks)],
        bricks: [ ...state.bricks, brick ],
        future: [], // Clear future when new action is taken
      };
    }
    case SceneActions.REMOVE_BRICK: {
      const { id } = action.payload;
      return {
        ...state,
        past: [...state.past, serializeBricks(state.bricks)],
        bricks: state.bricks.filter((b) => b.customId !== id),
        future: [],
      };
    }
    case SceneActions.UPDATE_BRICK: {
      const { brick } = action.payload;
      const filteredBricks = state.bricks.filter((b) => b.customId !== brick.customId);
      return {
        ...state,
        past: [...state.past, serializeBricks(state.bricks)],
        bricks: [ ...filteredBricks, brick ],
        future: [],
      };
    }
    case SceneActions.RESET_SCENE: {
      return {
        ...initialState,
        past: [...state.past, serializeBricks(state.bricks)],
      };
    }
    case SceneActions.SET_SCENE: {
      const { bricks } = action.payload;
      return {
        ...state,
        past: [...state.past, serializeBricks(state.bricks)],
        bricks,
        future: [],
      };
    }
    case SceneActions.UNDO: {
      if (state.past.length === 0) {
        return state; // Nothing to undo
      }
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);

      return {
        ...state,
        past: newPast,
        bricks: previous,
        future: [serializeBricks(state.bricks), ...state.future],
      };
    }
    case SceneActions.REDO: {
      if (state.future.length === 0) {
        return state; // Nothing to redo
      }
      const next = state.future[0];
      const newFuture = state.future.slice(1);

      return {
        ...state,
        past: [...state.past, serializeBricks(state.bricks)],
        bricks: next,
        future: newFuture,
      };
    }
    default: {
      return state;
    }
  }
}
