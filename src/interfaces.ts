import {ConnectionColours, PointColours} from "./enums";
import Point from "./classes/Point";
import Connection from "./classes/Connection";

export interface ShapeI {
    colour: PointColours | ConnectionColours
    key: string

    getName(): string
}

export interface FileI {
    name: string
}

export type IncidenceMatrixCell = Point | Connection | number | null
export type AdjacencyMatrixCell = Point | number | null

export interface IncidenceMatrixRowI extends Array<IncidenceMatrixCell> {
}

export interface AdjacencyMatrixRowI extends Array<AdjacencyMatrixCell> {
}

export interface IncidenceMatrixI extends Array<IncidenceMatrixRowI> {
}

export interface AdjacencyMatrixI extends Array<AdjacencyMatrixRowI> {
}

export interface PathI extends Array<Point> {
}
