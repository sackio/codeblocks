export function getBricks(state) {
  return state.scene.bricks;
}

export function getCanUndo(state) {
  return state.scene.past.length > 0;
}

export function getCanRedo(state) {
  return state.scene.future.length > 0;
}
