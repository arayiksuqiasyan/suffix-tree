import React, {useState} from 'react';
import {v4 as uuid} from 'uuid'
import "./file.css"

const File = ({id, name, children, tasks, onAdd, onAddTask, handleDrop, deleteBtn, editLiText}) => {
    const [edit, setEdit] = useState(null)
    const [value, setValue] = useState("")
    const [drop, setDrop] = useState(false)
    const [color, setColor] = useState(false)

    const enterHandler = (e) => {
        if (e.target.value.trim() !== "") {
            if (e.keyCode === 13) {
                if (edit) {
                    editLiText(edit, value)
                    setValue('')
                    setColor(false)
                    setEdit(null)
                } else {
                    const newTask = {id: uuid(), name: value}
                    onAddTask(id, newTask)
                    setValue('')
                    setColor(false)
                }

            }
        } else {
            setColor(false)
        }

    }

    const onDragStart = (e, task) => {
        e.dataTransfer.setData('task', JSON.stringify(task))
    }

    const onDrop = (e) => {
        const task = JSON.parse(e.dataTransfer.getData('task'));
        handleDrop(id, task, e.nativeEvent.target)
        setDrop(false)
    }

    const onDragOver = (e) => {
        e.preventDefault();
        setDrop(true)
    }

    const dragLeaveHandler = () => {
        setDrop(false)
    }

    return (
        <div className="file"
             onClick={() => setColor(false)}
        >
            <div className={`file-border ${color && "show"}`}
                 onClick={() => setColor(false)}
            >
                <span className="file-button"
                      onClick={() => onAdd(id)}>
                    <i className="fas fa-plus-circle"/>
                </span>

                <span className="delete-btn"
                      onClick={() => deleteBtn(id)}
                ><i className="fas fa-minus"/>
                </span>

                <p className="page-name">
                    {name}
                </p>
                <input
                    className="name"
                    value={value}
                    onKeyUp={(e) => enterHandler(e)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                        setColor(true)
                        setValue(e.target.value)
                    }}
                />
                <ul className={`${drop && "dropped"}`}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={dragLeaveHandler}
                >
                    {tasks?.map((item, index) => {
                        return <li
                            key={index}
                            id={item.id}
                            draggable={true}
                            className={`${color && "show"}`}
                            onDragStart={(e) => onDragStart(e, item)}
                        >
                            <span>
                                {item.name}
                            </span>
                            <span>
                                <i className="far fa-edit"
                                   onClick={() => {
                                       setEdit(item.id)
                                       editLiText(item)
                                       setValue(item.name)
                                   }}/>
                            </span>
                        </li>
                    })}
                </ul>
            </div>
            {!!children &&
            <div className="files">
                {children.map((item, idx) => {
                    return <File {...item}
                                 key={idx}
                                 onAdd={onAdd}
                                 deleteBtn={deleteBtn}
                                 onAddTask={onAddTask}
                                 handleDrop={handleDrop}
                                 editLiText={editLiText}
                    />
                })}
            </div>
            }
        </div>
    );
};

export default File;