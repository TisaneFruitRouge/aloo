import { Point } from "../../elements/point";


export const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

export type Vector = {
    x: number;
    y: number;
}

// courtesy of https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
export function getDistanceFromLine(x:number, y:number, x1:number, y1:number, x2:number, y2:number) {

    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
  
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;
  
    let xx, yy;
  
    if (param < 0) {
      xx = x1;
      yy = y1;
    }
    else if (param > 1) {
      xx = x2;
      yy = y2;
    }
    else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
  
    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

// Function to find the point of intersection of two line segments
export function findIntersectionPoint(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
  const x1 = p1.getX(), y1 = p1.getY();
  const x2 = p2.getX(), y2 = p2.getY();
  const x3 = p3.getX(), y3 = p3.getY();
  const x4 = p4.getX(), y4 = p4.getY();

  const ua_numerator = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
  const ua_denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  const ub_numerator = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
  const ub_denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  
  if (
    ua_denominator === 0 || 
    ub_denominator === 0
  ) {
    return null;
  }

  const ua = ua_numerator / ua_denominator;
  const ub = ub_numerator / ub_denominator;

  if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
    const intersectionX = x1 + ua * (x2 - x1);
    const intersectionY = y1 + ua * (y2 - y1);
    const intersectionPoint = new Point(intersectionX, intersectionY);
    return intersectionPoint;
  } else {
    return null;
  }
}

/**
 * Determine the alignment of two points based on the mouse position
 * @param mousePoint Point where the mouse is currently located
 * @param lastPoint  Point where the last point was placed
 * @returns 'horizontal' if the points are aligned horizontally, 'vertical' if they are aligned vertically
 */
export function determineAlignment(mousePoint: Point, lastPoint:Point) {
    
  // Calculate the absolute differences in x and y coordinates
  const dx = Math.abs(mousePoint.getX() - lastPoint.getX());
  const dy = Math.abs(mousePoint.getY() - lastPoint.getY());
  
  // Determine alignment based on which difference is greater
  if (dx < dy) {
      return 'horizontal';
  } else {
      return 'vertical';
  }
}

/**
* Function to create two points aligned either vertically or horizontally
* @param mousePoint Point where the mouse is currently located
* @param lastPoint  Point where the last point was placed
* @param alignment  Alignment of the points ('vertical' or 'horizontal')
* @returns          An array containing the two points aligned either vertically or horizontally
*/
export function createAlignedPoints(mousePoint:Point, lastPoint:Point, alignment: string) {
  let point1, point2;
  if (alignment === 'vertical') {
      point1 = new Point(mousePoint.getX(), lastPoint.getY());
      point2 = new Point(mousePoint.getX(), mousePoint.getY()); 
  } else if (alignment === 'horizontal') {
      point1 = new Point(lastPoint.getX(), mousePoint.getY());
      point2 = new Point(mousePoint.getX(), mousePoint.getY()); 
  } else {
      throw new Error('Invalid alignment specified. Please use "vertical" or "horizontal".');
  }
  return [point1, point2];
}