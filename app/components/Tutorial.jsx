import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import 'styles/tutorial.css';

class Tutorial {
  constructor() {
    this.driverObj = driver({
      popoverClass: 'codeblocks-tutorial',
      animate: true,
      overlayOpacity: 0.75,
      stagePadding: 10,
      allowClose: true,
      overlayClickNext: false,
      doneBtnText: 'Got it!',
      prevBtnText: 'Previous',
      nextBtnText: 'Next',
      showButtons: true,
      smoothScroll: true
    });
  }

  start() {
    const steps = [
      {
        element: '.topbar__logo--1F90Y',
        popover: {
          title: '👋 Welcome to CodeBlocks!',
          description: 'CodeBlocks helps you learn programming by building with virtual LEGO bricks! Let\'s take a quick tour to show you how it works.',
          side: 'bottom'
        }
      },
      {
        element: '.topbar__section--2zVPa:nth-child(2)',
        popover: {
          title: '🔨 Build & Paint Modes',
          description: '<strong>Build Mode:</strong> Click on the grid to add new bricks<br><strong>Paint Mode:</strong> Click on existing bricks to change their color',
          side: 'bottom'
        }
      },
      {
        element: '.topbar__section--2zVPa:nth-child(3)',
        popover: {
          title: '🎨 Pick Your Colors',
          description: 'Click the color circle to choose any color you want for your bricks. You can make rainbows, patterns, or whatever you imagine!',
          side: 'bottom'
        }
      },
      {
        element: '.topbar__section--2zVPa:nth-child(4)',
        popover: {
          title: '🧱 Choose Brick Shapes',
          description: 'Click here to pick different brick shapes - rectangles, cylinders, slopes, wedges, and more! Try them all to build cool structures.',
          side: 'bottom'
        }
      },
      {
        element: '.topbar__rightSection--3_dXs button:nth-child(2)',
        popover: {
          title: '⚡ Script Editor - Write Code!',
          description: 'This is where the magic happens! Click "Script" to write JavaScript code that creates bricks automatically. You can make towers, grids, spirals, and patterns with just a few lines of code!',
          side: 'bottom'
        }
      },
      {
        element: '.topbar__rightSection--3_dXs button:nth-child(3)',
        popover: {
          title: '📋 JSON Editor - Save Your Work',
          description: 'JSON is a way to store your creation as text (called "data"). You can save it, share it with friends, or load it later. It\'s like a recipe for your LEGO build!',
          side: 'bottom'
        }
      },
      {
        element: '.topbar__rightSection--3_dXs button:nth-child(4)',
        popover: {
          title: '🗑️ Reset Button',
          description: 'Need to start over? Click "Reset" to clear everything and begin a new creation.',
          side: 'bottom'
        }
      },
      {
        popover: {
          title: '🚀 Ready to Build!',
          description: 'Now you\'re ready to create amazing things!<br><br><strong>Quick Tips:</strong><br>• Start in Build Mode and click the grid to add bricks<br>• Try the Script Editor to learn programming<br>• Experiment and have fun!<br><br>Happy building! 🎉'
        }
      }
    ];

    this.driverObj.setSteps(steps);
    this.driverObj.drive();
  }

  stop() {
    this.driverObj.destroy();
  }
}

export default Tutorial;
