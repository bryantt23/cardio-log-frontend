import React, { useState } from 'react'
import CreatableSelect from 'react-select/creatable';

function CardioForm({ handleAddSession, cardioOptions }) {
    const [description, setDescription] = useState("Walking")
    const [length, setLength] = useState("")

    return (
        <div>
            <form onSubmit={(e) => handleAddSession(e, description, length)}>
                <label htmlFor='description'>Description</label>
                <CreatableSelect
                    className='description-text'
                    name="description"
                    onChange={selectedOption => { setDescription(selectedOption?.value || "") }}
                    isClearable
                    options={cardioOptions}
                    defaultValue={{ value: 'Walking', label: 'Walking' }}
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