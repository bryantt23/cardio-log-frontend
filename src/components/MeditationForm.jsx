import React, { useState } from 'react'

function MeditationForm({ handleAddSession }) {
    const [description, setDescription] = useState("")
    const [length, setLength] = useState("")

    return (
        <div>
            <form onSubmit={(e) => handleAddSession(e, description, length)}>
                <label htmlFor='description'>Description</label>
                <input
                    type="text"
                    value={description}
                    name="description"
                    onChange={e => setDescription(e.target.value)}
                ></input>
                <label htmlFor='length'>Length</label>
                <input
                    type="number"
                    placeholder='Minutes'
                    value={length}
                    name="length"
                    onChange={e => setLength(e.target.value)}
                ></input>
                <button type="submit">Add session</button>
            </form>
        </div>
    )
}

export default MeditationForm