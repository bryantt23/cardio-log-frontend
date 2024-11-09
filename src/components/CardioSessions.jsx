import React, { useEffect, useState, useRef } from 'react'
import { getSessions, addSession, copySession, toggleSession } from '../service/sessions'
import CardioForm from './CardioForm'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasFaStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons';

function CardioSessions() {
    const [sessions, setSessions] = useState([])
    const [sessionsDisplay, setSessionsDisplay] = useState([])
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(() => JSON.parse(localStorage.getItem('showOnlyFavorites')) || false)
    const topRef = useRef(null)
    const notify = (message) => toast(message)

    const fetchData = async () => {
        const data = await getSessions()
        setSessions(data.sessions)
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (showOnlyFavorites) {
            setSessionsDisplay(sessions.filter(session => session.isFavorite))
        }
        else {
            setSessionsDisplay(sessions)
        }
        localStorage.setItem('showOnlyFavorites', JSON.stringify(showOnlyFavorites))
    }, [sessions, showOnlyFavorites])

    const handleAddSession = async (e, description, length) => {
        e.preventDefault()
        try {
            await addSession(description, length * 60)
            fetchData()
            notify('Added session')
        } catch (error) {
            console.error("Error adding session:", error)
        }
    }

    const copyCardioSession = async (description, youTubeUrl, length, thumbnailUrl) => {
        try {
            await copySession(description, youTubeUrl, length, thumbnailUrl)
            notify('Copied session')
            fetchData()
        } catch (error) {
            console.error("Error adding session:", error)
        }
    }

    const toggleFavoriteSession = async (id) => {
        try {
            await toggleSession(id)
            fetchData()
        } catch (error) {
            console.error("Error toggling session:", error)
        }
    }

    const getFormattedLength = (time) => {
        const minutes = Math.floor(time / 60);
        const minutesString = minutes === 0 ? '' : `${minutes} minute${minutes === 1 ? "" : "s"}`
        const seconds = time % 60
        const secondsString = seconds === 0 ? '' : `${seconds} second${seconds === 1 ? "" : "s"}`
        return `${minutesString} ${secondsString}`
    }

    const scrollToRef = () => {
        topRef.current.scrollIntoView({ behavior: "smooth", block: 'start' })
    }

    return (
        <div>
            <ToastContainer />
            <h1 className="cardio-title" ref={topRef}>Cardio Sessions</h1>
            <div>
                <CardioForm handleAddSession={handleAddSession} />
                <div className='favorites-section'>
                    <label>
                        <input
                            type="checkbox"
                            checked={showOnlyFavorites}
                            onChange={() => setShowOnlyFavorites(cur => !cur)}
                        />
                        Show Only Favorites
                    </label>
                </div>

                <table className="cardio-table" border="1">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Description</th>
                            <th>YouTube URL</th>
                            <th>Finish Time</th>
                            <th>Length</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessionsDisplay.map(session => {
                            const { _id, description, finishTime, youTubeUrl, length, thumbnailUrl, isFavorite } = session
                            const date = new Date(finishTime)

                            // Specify options for the date
                            const dateOptions = {
                                month: 'long', // Full name of the month
                                day: 'numeric' // Numeric day
                            };

                            // Specify options for the time
                            const timeOptions = {
                                hour: 'numeric',   // Numeric hour
                                minute: '2-digit', // Two digit minute
                                hour12: true       // 12-hour time with AM/PM
                            };
                            return (<tr key={_id}>
                                <td>
                                    <FontAwesomeIcon
                                        icon={isFavorite ? fasFaStar : farFaStar}
                                        onClick={() => toggleFavoriteSession(_id)}
                                    />
                                </td>
                                <td>{description}</td>
                                <td>{youTubeUrl &&
                                    <a href={`${youTubeUrl}`} target='_blank'>
                                        <img src={thumbnailUrl} />
                                    </a>}</td>
                                <td>{`${date.toDateString('en-US', dateOptions)} ${date.toLocaleTimeString('en-US', timeOptions)}`}</td>
                                <td>{getFormattedLength(length)}</td>
                                <td><button onClick={() => {
                                    copyCardioSession(description, youTubeUrl, length, thumbnailUrl)
                                    scrollToRef()
                                }}>Copy Session</button></td>
                            </tr>)
                        }
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CardioSessions