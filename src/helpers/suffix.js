import {v4 as uuid} from "uuid";

export let tree =  {
    id: uuid(),
        name: "Page",
    children: [
    {id: uuid(), parentId: 1, name: "Page"},
    {id: uuid(), parentId: 1, name: "Page"},
    {id: uuid(), parentId: 1, name: "Page"},
    {
        id: uuid(),
        parentId: 1,
        name: "Page",
        children: [
            {
                id: uuid(),
                parentId: 5,
                name: "Page",
            }
        ]
    },

],
    tasks: []
}