function rotationDeltas(event, element, currentCoordinates) {
  let newPosition = normalizedCoordinates(event, element);
  if (!currentCoordinates) { currentCoordinates = newPosition; }
  let x = newPosition.x - currentCoordinates.x;
  let y = newPosition.y - currentCoordinates.y;
  return { x: x, y: y };
}

function normalizedCoordinates(event, element) {
  let displayWidth  = element.clientWidth;
  let displayHeight = element.clientHeight;
  let coordinates = coordinatesFromEvent(event);

  return {
    x: coordinates.x / displayWidth,
    y: coordinates.y / displayHeight
  };
}

function coordinatesFromEvent(event) {
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

function shouldRotate(event) {
  return !!event.buttons || !!event.touches;
}

export { shouldRotate, normalizedCoordinates, rotationDeltas };
