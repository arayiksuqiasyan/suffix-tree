import React, {useState} from "react"
import {v4 as uuid} from 'uuid'
import File from "./componet/file/File"

import {tree} from "./helpers/suffix";


function App() {
    const [suffix, setSuffix] = useState(tree);

    const clone = (item) => {
        if (!item) {
            return item;
        }
        let types = [Number, String, Boolean],
            result;

        types.forEach(function (type) {
            if (item instanceof type) {
                result = type(item);
            }
        });

        if (typeof result == "undefined") {
            if (Object.prototype.toString.call(item) === "[object Array]") {
                result = [];
                item.forEach(function (child, index, array) {
                    result[index] = clone(child);
                });
            } else if (typeof item == "object") {
                if (item.nodeType && typeof item.cloneNode == "function") {
                    result = item.cloneNode(true);
                } else if (!item.prototype) {
                    if (item instanceof Date) {
                        result = new Date(item);
                    } else {
                        result = {};
                        for (let i in item) {
                            result[i] = clone(item[i]);
                        }
                    }
                }
            } else {
                result = item;
            }
        }

        return result;
    }

    const onAdd = (id) => {
        const newSuffix = remapCurrentSuffix(id)
        setSuffix(newSuffix)
    }
    const remapCurrentSuffix = (parentId) => {
        const tempSuffix = clone(suffix)
        const recursiveMap = (level) => {
            if (level.id === parentId) {
                if (level.children) {
                    level.children.push({id: uuid(), parentId: 1, name: "Page"})
                } else {
                    level.children = [{id: uuid(), parentId: 1, name: "Page"}]
                }
            } else {
                if (level.children) {
                    level.children.forEach((elem) => {
                        recursiveMap(elem)
                    })
                }
            }
        }
        recursiveMap(tempSuffix)
        return tempSuffix
    }

    const deleteBtn = (id) => {
        const newSuffix = deleteBtnInSuffix(id)
        setSuffix(newSuffix)
    }
    const deleteBtnInSuffix = (id) => {
        const tempSuffix = clone(suffix)
        const recursiveMap = (level)=> {
            const founded = level?.children?.find((el)=>el.id === id)
            if(founded){
               level.children = level.children.filter((el)=> el.id !== id)
            }else{
                if(level.children){
                    level.children.forEach((elem)=>{
                        return recursiveMap(elem)
                    })
                }
            }
        }


        recursiveMap(tempSuffix)
        return tempSuffix
    }

    const onAddTask = (id, newTask) => {
        const newSuffix = remapCurrentSuffixForTasks(id, newTask);
        setSuffix(newSuffix)
    }
    const remapCurrentSuffixForTasks = (parentId, newTask) => {
        const tempSuffix = clone(suffix)
        const recursiveMap = (level) => {
            if (level.id === parentId) {
                if (level.tasks) {
                    level.tasks.push(newTask)
                } else {
                    level.tasks = [newTask]
                }
            } else {
                if (level.children) {
                    level.children.forEach((elem) => {
                        recursiveMap(elem)
                    })
                }
            }
        }
        recursiveMap(tempSuffix)
        return tempSuffix
    }

    const handleDrop = (parentId, task, target) => {
        const newSuffix = remapCurrentSuffixForDrop(parentId, task, target);
        setSuffix(newSuffix)
    }
    const remapCurrentSuffixForDrop = (parentId, task, target) => {

        const removeTask = (level) => {
            const funded = level.tasks?.find((t) => t.id === task.id)
            if (funded) {
                level.tasks = level.tasks.filter((t) => t.id !== funded.id)
            } else {
                if (level.children) {
                    level.children.forEach((elem) => {
                        removeTask(elem)
                    })
                }
            }

        }

        const onDropTask = (level) => {
                if (level.id === parentId) {
                if (level.tasks) {
                    const ul = target.parentElement;
                    const childs = ul.querySelectorAll('li')
                    const index = Array.prototype.findIndex.call(childs, (li) => li.id === target.id);
                    level.tasks.splice(index, 0, task)
                } else {
                    level.tasks = [task]
                }
            } else {
                if (level.children) {
                    level.children.forEach((elem) => {
                        onDropTask(elem, task)
                    })
                }
            }
        }

        const tempSuffix = clone(suffix)
        removeTask(tempSuffix)
        onDropTask(tempSuffix)
        return tempSuffix;
    }

    const editLiText = (editId,value)=> {
        const newSuffix = editLiTextHandler(editId,value);
        setSuffix(newSuffix)
    }
    const editLiTextHandler = (editId,value)=> {
         const tempSuffix = clone(suffix)

        const recursiveMap = (level) => {
             const founded = level.tasks?.find((el)=>el.id === editId)
            if (founded) {
                founded.name = value
            } else {
                if (level.children) {
                    level.children.forEach((elem) => {
                        recursiveMap(elem)
                    })
                }
            }
        }
        recursiveMap(tempSuffix)
        return tempSuffix

    }


    return (
        <div className="App">
            <File {...suffix}
                  onAdd={onAdd}
                  deleteBtn={deleteBtn}
                  onAddTask={onAddTask}
                  handleDrop={handleDrop}
                  editLiText={editLiText}/>
        </div>
    );
}

export default App;
