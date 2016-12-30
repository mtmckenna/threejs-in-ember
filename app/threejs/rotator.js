export default class {
  constructor(element) {
    this.element = element;
  }

  rotationDeltas(event) {
    let newCoordinates = this.normalizedCoordinates(event, this.element);
    if (!this.currentCoordinates) { this.currentCoordinates = newCoordinates; }
    let x = newCoordinates.x - this.currentCoordinates.x;
    let y = newCoordinates.y - this.currentCoordinates.y;
    this.currentCoordinates = newCoordinates;
    return { x: x, y: y };
  }

  normalizedCoordinates(event) {
    let displayWidth  = this.element.clientWidth;
    let displayHeight = this.element.clientHeight;
    let coordinates = this.coordinatesFromEvent(event);

    return {
      x: coordinates.x / displayWidth,
      y: coordinates.y / displayHeight
    };
  }

  coordinatesFromEvent(event) {
    let coordinates = { x: null, y: null };
    if (event.buttons) {
      coordinates.x = event.clientX;
      coordinates.y = event.clientY;
    } else if (event.touches) {
      coordinates.x = event.touches[0].clientX;
      coordinates.y = event.touches[0].clientY;
    }

    return coordinates;
  }

  shouldRotate(event) {
    return !!event.buttons || !!event.touches;
  }

  userStoppedRotating() {
    this.currentCoordinates = null;
  }
}

