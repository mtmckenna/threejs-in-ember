export default class {
  constructor(element) {
    this.element = element;
  }

  get dimensions() {
    if (!this.element) { return { width: null, height: null }; }
    return { width: this.element.clientWidth, height: this.element.clientHeight };
  }

  rotationDeltas(event) {
    let newCoordinates = this.normalizedCoordinates(event, this.element);
    if (!this.currentCoordinates) { this.currentCoordinates = newCoordinates; }
    let deltas = this.coordinateDeltas(newCoordinates);
    this.currentCoordinates = newCoordinates;
    return deltas;
  }

  coordinateDeltas(newCoordinates) {
    let x = newCoordinates.x - this.currentCoordinates.x;
    let y = newCoordinates.y - this.currentCoordinates.y;
    return { x: x, y: y };
  }

  normalizedCoordinates(event) {
    let coordinates = this.coordinatesFromEvent(event);

    return {
      x: coordinates.x / this.dimensions.width,
      y: coordinates.y / this.dimensions.height
    };
  }

  coordinatesFromEvent(event) {
    let coordinates = { x: null, y: null };

    if (event.buttons) {
      coordinates = this.mouseCoordinatesFromEvent(event);
    } else if (event.touches) {
      coordinates = this.touchCoordinatesFromEvent(event);
    }

    return coordinates;
  }

  mouseCoordinatesFromEvent(event) {
    return { x: event.clientX, y: event.clientY };
  }

  touchCoordinatesFromEvent(event) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  shouldRotate(event) {
    return !!event.buttons || !!event.touches;
  }

  userStoppedRotating() {
    this.currentCoordinates = null;
  }
}

