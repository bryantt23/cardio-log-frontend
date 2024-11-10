import React, { useState } from 'react'
import CreatableSelect from 'react-select/creatable';

function CardioForm({ handleAddSession, cardioOptions }) {
    const [description, setDescription] = useState("")
    const [length, setLength] = useState("")

    return (
        <div>
            {description}
            <form onSubmit={(e) => handleAddSession(e, description, length)}>
                <label htmlFor='description'>Description</label>
                <CreatableSelect
                    name="description"
                    onChange={selectedOption => { setDescription(selectedOption?.value || "") }}
                    isClearable
                    options={cardioOptions}
                />
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

export default CardioForm