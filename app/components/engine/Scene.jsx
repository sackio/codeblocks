import React from 'react';
import PubSub from 'pubsub-js';
import If from 'if-only';

import Detector from 'utils/threejs/Detector';
import Brick from 'components/engine/Brick';
import Message from 'components/Message';
import ViewControls from 'components/ViewControls';
import { RollOverBrick } from 'components/engine/Helpers';
import {
  PerspectiveCamera,
  Controls,
  AmbientLight,
  Light,
  Plane,
  Renderer,
} from 'components/engine/core';
import { CSSToHex, getMeasurementsFromDimensions } from 'utils';
import { colors, base } from 'utils/constants';

import styles from 'styles/components/scene';


class Scene extends React.Component {
  state = {
    drag: false,
    isShiftDown: false,
    isDDown: false,
    isRDown: false,
    rotation: 0,
    coreObjects: [],
    selectedBrick: null,
    isDraggingBrick: false,
    lastClickTime: 0,
    lastClickTarget: null,
    longPressTimer: null,
  }

  constructor(props) {
    super(props);

    this._start = this._start.bind(this);
    this._stop = this._stop.bind(this);
    this._animate = this._animate.bind(this);
  }

  componentDidMount() {
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    this._initCore();
    this._initUtils();
    this._initEnv();

    this._setEventListeners();
    this._start();
  }

  componentDidUpdate(prevProps) {
    const { mode, grid, dimensions, objects } = this.props;
    if (mode !== prevProps.mode && mode === 'paint') {
      this.rollOverBrick.visible = false;
      this._deselectBrick(); // Deselect when switching to paint mode
    }
    else if (mode !== prevProps.mode && mode === 'build') {
      this.rollOverBrick.visible = true;
    }

    if (grid !== prevProps.grid && grid === true) {
      this.grid.visible = true;
    }
    else if (grid !== prevProps.grid && grid !== true) {
      this.grid.visible = false;
    }
    else if (prevProps.dimensions.x !== dimensions.x || prevProps.dimensions.z !== dimensions.z || prevProps.dimensions.type !== dimensions.type) {
      this.rollOverBrick.setShape(dimensions);
    }

    if (objects !== prevProps.objects) {
      this._setObjectsFromState();
    }
  }

  _initCore() {
    const scene = new THREE.Scene();
    this.scene = scene;

    const renderer = new Renderer({ antialias: true });
    renderer.init(window.innerWidth, window.innerHeight);
    this.renderer = renderer;

    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.init();
    this.camera = camera;

    const controls = new Controls(this.camera, this.renderer.domElement);
    controls.init();
    this.controls = controls;

    this.mount.appendChild(this.renderer.domElement);
  }

  _initEnv() {
    const light = new Light(0xffffff, 2);
    light.init();
    this.scene.add(light);

    // var spotLightHelper = new THREE.SpotLightHelper( light );
    // this.scene.add( spotLightHelper );

    const ambientLight = new AmbientLight(0x606060);
    this.scene.add(ambientLight);

    // testing
    const pointLight = new THREE.PointLight( 0xfff0f0, 0.6, 100, 0 );
    pointLight.position.set( -1000, 1500, 500 );
    this.scene.add( pointLight );

    const plane = new Plane(3000);
    this.plane = plane;
    this.scene.add(plane);

    const grid = new THREE.GridHelper( 1500, 60, new THREE.Color( 0xbfbfbf ), new THREE.Color( 0xdedede ) );
    this.grid = grid;
    this.scene.add(grid);

    this.setState({ coreObjects: [ light, ambientLight, pointLight, plane, grid, this.rollOverBrick ] });
  }

  _initUtils() {
    const { brickColor, dimensions } = this.props;
    const rollOverBrick = new RollOverBrick(brickColor, dimensions);
    this.scene.add(rollOverBrick);
    this.rollOverBrick = rollOverBrick;
    const raycaster = new THREE.Raycaster();
    this.raycaster = raycaster;
    const mouse = new THREE.Vector2();
    this.mouse = mouse;
  }

  _setObjectsFromState() {
    const { objects } = this.props;
    const { coreObjects } = this.state;

    // Convert serialized brick data to Brick instances if needed
    const brickObjects = objects.map((obj, index) => {
      // Check if it's already a Brick instance
      if (obj instanceof THREE.Mesh && obj.customId) {
        return obj;
      }

      // Otherwise, it's serialized data - reconstruct the Brick
      return this._reconstructBrick(obj);
    }).filter(Boolean); // Filter out any nulls from failed reconstructions

    this.scene.children = [ ...brickObjects, ...coreObjects ];
  }

  // Helper method to get actual Brick instances from the scene
  // (excludes coreObjects like lights, plane, grid, etc.)
  _getBrickInstancesFromScene() {
    return this.scene.children.filter(obj => obj instanceof Brick);
  }

  _reconstructBrick(data) {
    try {
      // Validate required fields
      if (!data || !data.position || !data.color || !data.dimensions) {
        console.warn('Invalid brick data, skipping:', data);
        return null;
      }

      // Reconstruct the intersect object needed by Brick constructor
      const intersect = {
        point: new THREE.Vector3(
          data.intersect?.point?.x || data.position.x,
          data.intersect?.point?.y || data.position.y,
          data.intersect?.point?.z || data.position.z
        ),
        face: data.intersect?.face ? {
          normal: new THREE.Vector3(
            data.intersect.face.normal.x,
            data.intersect.face.normal.y,
            data.intersect.face.normal.z
          )
        } : {
          normal: new THREE.Vector3(0, 1, 0) // Default upward normal
        }
      };

      // Create the brick with stored parameters
      const brick = new Brick(
        intersect,
        data.color,
        data.dimensions,
        data.rotation?.y || 0,
        data.translation || 0
      );

      // Restore the exact position
      brick.position.set(
        data.position.x,
        data.position.y,
        data.position.z
      );

      // Restore the customId if it exists
      if (data.customId) {
        brick.customId = data.customId;
      }

      return brick;
    } catch (err) {
      console.error('Failed to reconstruct brick:', err, data);
      return null;
    }
  }

  _setEventListeners() {
    document.addEventListener( 'mousemove', (event) => this._onMouseMove(event, this), false );
    document.addEventListener( 'mousedown', (event) => this._onMouseDown(event), false );
    document.addEventListener( 'mouseup', (event) => this._onMouseUp(event, this), false );
    document.addEventListener( 'keydown', (event) => this._onKeyDown(event, this), false );
    document.addEventListener( 'keyup', (event) => this._onKeyUp(event, this), false );
    window.addEventListener('resize', (event) => this._onWindowResize(event, this), false);

    // Touch events for mobile support
    document.addEventListener( 'touchstart', (event) => this._onTouchStart(event, this), false );
    document.addEventListener( 'touchmove', (event) => this._onTouchMove(event, this), false );
    document.addEventListener( 'touchend', (event) => this._onTouchEnd(event, this), false );
  }

  _onWindowResize(event, scene) {
    scene.camera.aspect = window.innerWidth / window.innerHeight;
    scene.camera.updateProjectionMatrix();
    scene.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _onMouseMove(event, scene) {
    const { isDDown, isRDown, isDraggingBrick, selectedBrick } = this.state;
    const { mode, dimensions, objects, updateObject } = this.props;
    event.preventDefault();

    // Only set drag=true if mouse moved more than 5 pixels from initial position
    // This prevents accidental drags from small hand movements during clicks
    const DRAG_THRESHOLD = 5;
    const dx = event.clientX - (this.mouseDownX || 0);
    const dy = event.clientY - (this.mouseDownY || 0);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const drag = distance > DRAG_THRESHOLD;
    this.setState({ drag });
    const { width, height } = getMeasurementsFromDimensions(dimensions);
    const evenWidth = dimensions.x % 2 === 0;
    const evenDepth = dimensions.z % 2 === 0;
    scene.mouse.set( ( (event.clientX / window.innerWidth) ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
    scene.raycaster.setFromCamera( scene.mouse, scene.camera );

    // Handle dragging selected brick
    if (isDraggingBrick && selectedBrick) {
      // Raycast to plane at the brick's current Y level
      const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -selectedBrick.position.y);
      const intersectPoint = new THREE.Vector3();
      scene.raycaster.ray.intersectPlane(dragPlane, intersectPoint);

      if (intersectPoint) {
        // Move brick to new position (with offset)
        selectedBrick.position.x = intersectPoint.x + scene.dragOffset.x;
        selectedBrick.position.z = intersectPoint.z + scene.dragOffset.z;

        // Update selection box
        if (scene.selectionBox) {
          scene.selectionBox.update();
        }

        // Update in Redux store
        updateObject(selectedBrick);
      }
      return;
    }

    // Use actual brick instances from the scene instead of props.objects
    const bricks = this._getBrickInstancesFromScene();
    const intersects = scene.raycaster.intersectObjects( [ ...bricks, this.plane ], true );
    if ( intersects.length > 0) {
      const intersect = intersects[ 0 ];
      // Show rollover brick only in build mode (not in edit, paint, or delete modes)
      if (! isDDown && mode === 'build') {
        scene.rollOverBrick.position.copy( intersect.point ).add( intersect.face.normal );
        scene.rollOverBrick.position.divide( new THREE.Vector3( base, height, base) ).floor()
          .multiply( new THREE.Vector3( base, height, base ) )
          .add( new THREE.Vector3( evenWidth ? base : base / 2, height / 2, evenDepth ? base : base / 2 ) );
      }
      if (intersect.object instanceof Brick && (isDDown || isRDown || mode === 'paint' || mode === 'edit')) {
        this.setState({ brickHover: true });
      }
      else {
        this.setState({ brickHover: false });
      }
    }
  }

  _onMouseDown( event ) {
    const { selectedBrick } = this.state;
    const { objects } = this.props;

    this.setState({
      drag: false,
    });

    // Store mouse down position for drag threshold detection
    this.mouseDownX = event.clientX;
    this.mouseDownY = event.clientY;

    // Check if clicking on the selected brick to start dragging
    if (selectedBrick && event.target.localName === 'canvas') {
      this.mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
      this.raycaster.setFromCamera( this.mouse, this.camera );
      // Use actual brick instances from the scene instead of props.objects
      const bricks = this._getBrickInstancesFromScene();
      const intersects = this.raycaster.intersectObjects( bricks );

      if (intersects.length > 0 && intersects[0].object === selectedBrick) {
        this.setState({ isDraggingBrick: true });
        // Store the initial offset between mouse and brick center
        this.dragOffset = new THREE.Vector3().subVectors(selectedBrick.position, intersects[0].point);
      }
    }
  }

  _onMouseUp(event, scene) {
    const { mode, objects } = this.props;
    const { drag, isDDown, isRDown, isDraggingBrick, lastClickTime, lastClickTarget } = this.state;
    if (event.target.localName !== 'canvas') return;
    event.preventDefault();
    if (! drag) {
      scene.mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
      scene.raycaster.setFromCamera( scene.mouse, scene.camera );
      // Use actual brick instances from the scene instead of props.objects
      const bricks = this._getBrickInstancesFromScene();
      const intersects = scene.raycaster.intersectObjects( [ ...bricks, this.plane ] );
      if ( intersects.length > 0 ) {
        const intersect = intersects[ 0 ];
        if (mode === 'build') {
          // delete cube
          if ( isDDown ) {
            this._deleteCube(intersect);
          }
          // Double-click to select/deselect brick, single click to stack
          else if (intersect.object !== this.plane && intersect.object instanceof Brick) {
            const now = Date.now();
            const timeSinceLastClick = now - lastClickTime;
            const isDoubleClick = timeSinceLastClick < 300 && lastClickTarget === intersect.object;

            if (isDoubleClick) {
              // Double-click: select or deselect
              if (this.state.selectedBrick === intersect.object) {
                this._deselectBrick();
              } else {
                this._selectBrick(intersect.object);
              }
              this.setState({ lastClickTime: 0, lastClickTarget: null });
            } else {
              // First click: create brick on top (stacking) and record click
              this._createCube(intersect, scene.rollOverBrick);
              this.setState({ lastClickTime: now, lastClickTarget: intersect.object });
            }
          }
          // create cube if clicking on plane
          else if (intersect.object === this.plane) {
            this._createCube(intersect, scene.rollOverBrick);
            this.setState({ lastClickTime: 0, lastClickTarget: null });
          }
        }
        else if (mode === 'edit') {
          // Edit mode: single-click to select/deselect bricks (no double-click, no complex interactions)
          if (!drag && intersect.object !== this.plane && intersect.object instanceof Brick) {
            // Single click: select or deselect
            if (this.state.selectedBrick === intersect.object) {
              this._deselectBrick();
            } else {
              this._selectBrick(intersect.object);
            }
          } else if (intersect.object === this.plane) {
            // Clicking on plane deselects
            this._deselectBrick();
          }
        }
        else if (mode === 'paint') {
          this._paintCube(intersect);
        }
      }
    }
    else if (isDraggingBrick) {
      this.setState({ isDraggingBrick: false });
    }
  }

  _createCube(intersect, rollOverBrick) {
    const { rotation } = this.state;
    const { brickColor, dimensions, objects, addObject } = this.props;
    let canCreate = true;
    const { width, depth } = getMeasurementsFromDimensions(dimensions);
    // Use actual brick instances from the scene instead of props.objects
    const bricks = this._getBrickInstancesFromScene();
    const meshBoundingBox = new THREE.Box3().setFromObject(this.rollOverBrick);
    for (var i = 0; i < bricks.length; i++) {
      const brickBoundingBox = new THREE.Box3().setFromObject(bricks[i]);
      const collision = meshBoundingBox.intersectsBox(brickBoundingBox);
      if (collision) {
        const dx = Math.abs(brickBoundingBox.max.x - meshBoundingBox.max.x);
        const dz = Math.abs(brickBoundingBox.max.z - meshBoundingBox.max.z);
        const yIntsersect = brickBoundingBox.max.y - 9 > meshBoundingBox.min.y;
        if (yIntsersect && dx !== width && dz !== depth) {
          canCreate = false;
          break;
        }
      }
    }
    if (canCreate) {
      const { translation, rotation } = rollOverBrick;
      const brick = new Brick(intersect, brickColor, dimensions, rotation.y, translation);
      addObject(brick);
    }
  }

  _deleteCube(intersect) {
    const { removeObject } = this.props;
    if (intersect.object !== this.plane) {
      intersect.object.geometry.dispose();
      removeObject(intersect.object.customId);
    }
  }

  _paintCube(intersect) {
    const { brickColor, updateObject } = this.props;
    if (intersect.object !== this.plane) {
      intersect.object.updateColor(brickColor);
      updateObject(intersect.object);
    }
  }

  // Touch event handlers for mobile support
  _onTouchStart(event, scene) {
    if (event.touches.length === 1) {
      event.preventDefault();
      const touch = event.touches[0];

      // Store touch start position for drag threshold detection
      this.mouseDownX = touch.clientX;
      this.mouseDownY = touch.clientY;

      this.setState({ drag: false });

      // Convert touch to mouse event for brick selection logic
      const fakeEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        target: { localName: 'canvas' }
      };
      this._onMouseDown(fakeEvent);
    }
  }

  _onTouchMove(event, scene) {
    if (event.touches.length === 1) {
      event.preventDefault();
      const touch = event.touches[0];

      // Same drag threshold logic as mouse
      const DRAG_THRESHOLD = 5;
      const dx = touch.clientX - (this.mouseDownX || 0);
      const dy = touch.clientY - (this.mouseDownY || 0);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const drag = distance > DRAG_THRESHOLD;
      this.setState({ drag });

      // Convert touch to mouse event
      const fakeEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => {},
        target: { localName: 'canvas' }
      };
      this._onMouseMove(fakeEvent, scene);
    }
  }

  _onTouchEnd(event, scene) {
    if (event.changedTouches.length === 1) {
      event.preventDefault();
      const touch = event.changedTouches[0];

      // Convert touch to mouse event
      const fakeEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        target: { localName: 'canvas' }
      };
      this._onMouseUp(fakeEvent, scene);
    }
  }

  _selectBrick(brick) {
    const { selectedBrick } = this.state;

    // Deselect previous brick
    if (selectedBrick) {
      this._deselectBrick();
    }

    // Select new brick
    this.setState({ selectedBrick: brick });

    // Add visual feedback (outline box)
    const boxHelper = new THREE.BoxHelper(brick, 0xffff00); // Yellow outline
    boxHelper.name = 'selectionBox';
    this.scene.add(boxHelper);
    this.selectionBox = boxHelper;
  }

  _deselectBrick() {
    const { selectedBrick } = this.state;
    if (selectedBrick && this.selectionBox) {
      this.scene.remove(this.selectionBox);
      this.selectionBox = null;
      this.setState({ selectedBrick: null });
    }
  }

  _moveBrickBy(dx, dy, dz) {
    const { selectedBrick } = this.state;
    const { updateObject } = this.props;
    if (!selectedBrick) return;

    // Move the brick
    selectedBrick.position.x += dx;
    selectedBrick.position.y += dy;
    selectedBrick.position.z += dz;

    // Update the selection box
    if (this.selectionBox) {
      this.selectionBox.update();
    }

    // Update in Redux store
    updateObject(selectedBrick);
  }

  _deleteSelectedBrick() {
    const { selectedBrick } = this.state;
    const { removeObject } = this.props;
    if (!selectedBrick) return;

    // Remove selection box
    if (this.selectionBox) {
      this.scene.remove(this.selectionBox);
      this.selectionBox = null;
    }

    // Remove brick
    selectedBrick.geometry.dispose();
    removeObject(selectedBrick.customId);
    this.setState({ selectedBrick: null });
  }

  _onKeyDown(event, scene) {
    const { selectedBrick } = scene.state;
    const { mode, undo, redo } = scene.props;
    const moveAmount = base; // 25 pixels per arrow key press

    // Handle Ctrl+Z (undo) and Ctrl+Y (redo) keyboard shortcuts
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 90) { // Ctrl+Z or Cmd+Z
      event.preventDefault();
      if (undo) {
        undo();
      }
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 89) { // Ctrl+Y or Cmd+Y
      event.preventDefault();
      if (redo) {
        redo();
      }
      return;
    }

    switch(event.keyCode) {
      case 16: // Shift
        scene.setState({
          isShiftDown: true,
        });
        break;
      case 68: // D key - delete mode (only in build mode, not in edit mode)
        if (mode === 'build') {
          scene.setState({
            isDDown: true,
          });
          scene.rollOverBrick.visible = false;
        }
        break;
      case 82: // R key - rotate (only in build mode, not in edit mode)
        if (mode === 'build') {
          scene.rollOverBrick.rotate( Math.PI / 2 );
          scene.setState({
            isRDown: true,
            rotation: scene.rollOverBrick.rotation.y,
          });
        }
        break;
      case 46: // Delete key - delete selected brick
      case 8: // Backspace key - delete selected brick
        scene._deleteSelectedBrick();
        event.preventDefault(); // Prevent browser back navigation on Backspace
        break;
      case 27: // Escape key - deselect brick
        scene._deselectBrick();
        break;
      case 37: // Left arrow
        if (selectedBrick) {
          scene._moveBrickBy(-moveAmount, 0, 0);
        } else {
          // Rotate camera left around target
          scene._rotateCameraAroundTarget(-Math.PI / 16);
        }
        event.preventDefault();
        break;
      case 38: // Up arrow
        if (selectedBrick) {
          scene._moveBrickBy(0, 0, -moveAmount);
        } else {
          // Tilt camera up
          scene._tiltCamera(Math.PI / 16);
        }
        event.preventDefault();
        break;
      case 39: // Right arrow
        if (selectedBrick) {
          scene._moveBrickBy(moveAmount, 0, 0);
        } else {
          // Rotate camera right around target
          scene._rotateCameraAroundTarget(Math.PI / 16);
        }
        event.preventDefault();
        break;
      case 40: // Down arrow
        if (selectedBrick) {
          scene._moveBrickBy(0, 0, moveAmount);
        } else {
          // Tilt camera down
          scene._tiltCamera(-Math.PI / 16);
        }
        event.preventDefault();
        break;
      case 187: // + key (also = key)
      case 107: // Numpad +
        scene._zoomIn();
        event.preventDefault();
        break;
      case 189: // - key
      case 109: // Numpad -
        scene._zoomOut();
        event.preventDefault();
        break;
    }
  }

  _onKeyUp(event, scene ) {
    const { mode } = this.props;
    switch (event.keyCode) {
      case 16:
        scene.setState({
          isShiftDown: false,
        });
        break;
      case 68:
        scene.setState({
          isDDown: false,
        });
        scene.rollOverBrick.visible = true && mode === 'build';
        break;
      case 82:
        scene.setState({
          isRDown: false,
        });
        break;
    }
  }

  _onTouchStart(event, scene) {
    const { selectedBrick } = this.state;
    const { objects, mode } = this.props;

    if (event.target.localName !== 'canvas' || mode !== 'build') return;

    const touch = event.touches[0];
    this.touchStartTime = Date.now();
    this.touchStartPos = { x: touch.clientX, y: touch.clientY };

    // Set up long-press detection for mobile selection
    const longPressTimer = setTimeout(() => {
      // Long press detected - select brick
      scene.mouse.set( ( touch.clientX / window.innerWidth ) * 2 - 1, - ( touch.clientY / window.innerHeight ) * 2 + 1 );
      scene.raycaster.setFromCamera( scene.mouse, scene.camera );
      const intersects = scene.raycaster.intersectObjects( objects );

      if (intersects.length > 0 && intersects[0].object instanceof Brick) {
        if (this.state.selectedBrick === intersects[0].object) {
          this._deselectBrick();
        } else {
          this._selectBrick(intersects[0].object);
        }
        // Vibrate feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, 500); // 500ms for long press

    this.setState({ longPressTimer });

    // Check if tapping on selected brick to start dragging
    if (selectedBrick) {
      scene.mouse.set( ( touch.clientX / window.innerWidth ) * 2 - 1, - ( touch.clientY / window.innerHeight ) * 2 + 1 );
      scene.raycaster.setFromCamera( scene.mouse, scene.camera );
      const intersects = scene.raycaster.intersectObjects( objects );

      if (intersects.length > 0 && intersects[0].object === selectedBrick) {
        this.setState({ isDraggingBrick: true });
        this.dragOffset = new THREE.Vector3().subVectors(selectedBrick.position, intersects[0].point);
      }
    }
  }

  _onTouchMove(event, scene) {
    const { longPressTimer, isDraggingBrick, selectedBrick } = this.state;
    const { objects, dimensions, updateObject } = this.props;

    if (event.target.localName !== 'canvas') return;

    // Cancel long press if finger moves
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      this.setState({ longPressTimer: null });
    }

    const touch = event.touches[0];

    // Handle dragging selected brick
    if (isDraggingBrick && selectedBrick) {
      event.preventDefault();
      scene.mouse.set( ( touch.clientX / window.innerWidth ) * 2 - 1, - ( touch.clientY / window.innerHeight ) * 2 + 1 );
      scene.raycaster.setFromCamera( scene.mouse, scene.camera );

      const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -selectedBrick.position.y);
      const intersectPoint = new THREE.Vector3();
      scene.raycaster.ray.intersectPlane(dragPlane, intersectPoint);

      if (intersectPoint) {
        selectedBrick.position.x = intersectPoint.x + scene.dragOffset.x;
        selectedBrick.position.z = intersectPoint.z + scene.dragOffset.z;

        if (scene.selectionBox) {
          scene.selectionBox.update();
        }

        updateObject(selectedBrick);
      }
    }
  }

  _onTouchEnd(event, scene) {
    const { longPressTimer, isDraggingBrick } = this.state;
    const { mode, objects } = this.props;

    if (event.target.localName !== 'canvas') return;

    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      this.setState({ longPressTimer: null });
    }

    // End drag if dragging
    if (isDraggingBrick) {
      this.setState({ isDraggingBrick: false });
      return;
    }

    // Handle tap for creating bricks (if not long press or drag)
    if (mode === 'build' && this.touchStartTime) {
      const touchDuration = Date.now() - this.touchStartTime;
      const touch = event.changedTouches[0];
      const touchMoved = Math.abs(touch.clientX - this.touchStartPos.x) > 10 ||
                        Math.abs(touch.clientY - this.touchStartPos.y) > 10;

      // Quick tap (not long press, not moved) - create brick
      if (touchDuration < 500 && !touchMoved) {
        scene.mouse.set( ( touch.clientX / window.innerWidth ) * 2 - 1, - ( touch.clientY / window.innerHeight ) * 2 + 1 );
        scene.raycaster.setFromCamera( scene.mouse, scene.camera );
        const intersects = scene.raycaster.intersectObjects( [ ...objects, this.plane ] );

        if (intersects.length > 0) {
          const intersect = intersects[0];
          // Create brick when tapping on plane or existing brick (stacking)
          if (intersect.object === this.plane || intersect.object instanceof Brick) {
            this._createCube(intersect, scene.rollOverBrick);
          }
        }
      }
    }

    this.touchStartTime = null;
    this.touchStartPos = null;
  }

  _start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this._animate);
    }
  }

  _stop() {
    cancelAnimationFrame(this.frameId);
  }

  _animate() {
    this.controls.update();
    PubSub.publish('monitor');

    // just testing
    this._renderScene();
    this.frameId = window.requestAnimationFrame(this._animate);
  }

  _renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  // Camera view control methods
  _setTopView = () => {
    this.camera.position.set(0, 1500, 0);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  _setFrontView = () => {
    this.camera.position.set(0, 500, 1200);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  _setSideView = () => {
    this.camera.position.set(1200, 500, 0);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  _setIsometricView = () => {
    this.camera.position.set(1000, 1000, 1000);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  _resetView = () => {
    // Reset to initial camera position
    this.camera.position.set(1000, 1000, 1000);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  _zoomIn = () => {
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    this.camera.position.addScaledVector(direction, 100);
    this.controls.update();
  }

  _zoomOut = () => {
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    this.camera.position.addScaledVector(direction, -100);
    this.controls.update();
  }

  // Custom camera position and target methods for scripting
  _setCameraPosition = (x, y, z) => {
    this.camera.position.set(x, y, z);
    this.controls.update();
  }

  _setCameraTarget = (x, y, z) => {
    this.camera.lookAt(x, y, z);
    this.controls.target.set(x, y, z);
    this.controls.update();
  }

  _setCameraView = (position, target) => {
    // position and target should be objects with x, y, z properties
    if (position) {
      this.camera.position.set(position.x, position.y, position.z);
    }
    if (target) {
      this.camera.lookAt(target.x, target.y, target.z);
      this.controls.target.set(target.x, target.y, target.z);
    }
    this.controls.update();
  }

  _getCameraPosition = () => {
    return {
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z
    };
  }

  _getCameraTarget = () => {
    return {
      x: this.controls.target.x,
      y: this.controls.target.y,
      z: this.controls.target.z
    };
  }

  _rotateCameraAroundTarget = (angle) => {
    // Rotate camera around Y axis (vertical) around the target point
    const target = this.controls.target;
    const position = this.camera.position;

    // Calculate offset from target
    const offset = new THREE.Vector3(
      position.x - target.x,
      position.y - target.y,
      position.z - target.z
    );

    // Rotate offset around Y axis
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const x = offset.x * cosAngle - offset.z * sinAngle;
    const z = offset.x * sinAngle + offset.z * cosAngle;

    // Apply new position
    this.camera.position.set(
      target.x + x,
      position.y,
      target.z + z
    );

    this.camera.lookAt(target);
    this.controls.update();
  }

  _tiltCamera = (angle) => {
    // Tilt camera up/down around the target point
    const target = this.controls.target;
    const position = this.camera.position;

    // Calculate offset from target
    const offset = new THREE.Vector3(
      position.x - target.x,
      position.y - target.y,
      position.z - target.z
    );

    const distance = offset.length();
    const currentAngle = Math.atan2(offset.y, Math.sqrt(offset.x * offset.x + offset.z * offset.z));
    const newAngle = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, currentAngle + angle));

    // Calculate horizontal distance
    const horizontalDistance = Math.sqrt(offset.x * offset.x + offset.z * offset.z);
    const horizontalAngle = Math.atan2(offset.z, offset.x);

    // Calculate new position
    const newY = distance * Math.sin(newAngle);
    const newHorizontalDistance = distance * Math.cos(newAngle);

    this.camera.position.set(
      target.x + newHorizontalDistance * Math.cos(horizontalAngle),
      target.y + newY,
      target.z + newHorizontalDistance * Math.sin(horizontalAngle)
    );

    this.camera.lookAt(target);
    this.controls.update();
  }

  // Capture screenshot of the canvas
  _captureScreenshot = () => {
    if (!this.renderer || !this.renderer.domElement) {
      return null;
    }

    // Render the scene to ensure we have the latest frame
    this.renderer.render(this.scene, this.camera);

    // Get the canvas as base64 data URL
    return this.renderer.domElement.toDataURL('image/png');
  }

  render() {
    const { brickHover, isShiftDown, isDDown, isRDown, selectedBrick } = this.state;
    const { mode, shifted } = this.props;
    return(
      <div>
        <div className={shifted ? styles.shifted : styles.scene} style={{ cursor: isShiftDown ? 'move' : (brickHover ? 'pointer' : 'default') }} ref={(mount) => { this.mount = mount }} />
        <ViewControls
          onTopView={this._setTopView}
          onFrontView={this._setFrontView}
          onSideView={this._setSideView}
          onIsometricView={this._setIsometricView}
          onResetView={this._resetView}
          onZoomIn={this._zoomIn}
          onZoomOut={this._zoomOut}
        />
        <If cond={isDDown && mode === 'build'}>
          <Message>
            <i className="ion-trash-a" />
            <span>Deleting bricks</span>
          </Message>
        </If>
        <If cond={isRDown && mode === 'build'}>
          <Message>
            <i className="ion-refresh" />
            <span>Rotating bricks</span>
          </Message>
        </If>
        <If cond={selectedBrick && mode === 'build' && !isDDown && !isRDown}>
          <Message>
            <i className="ion-arrow-move" />
            <span>Brick selected • Arrow keys or drag to move • Delete to remove • Esc to deselect</span>
          </Message>
        </If>
      </div>
    );
  }
}


export default Scene;
