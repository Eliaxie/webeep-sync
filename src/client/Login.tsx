import React, { FC, useEffect, useState } from 'react'
import { ipcRenderer, IpcRendererEvent } from 'electron'
import { Modal } from './components/Modal'

export let LoginModal: FC<{ onClose: () => void }> = (props) => {
    let [login, setLogin] = useState('');
    let [password, setPassword] = useState('');
    let [loading, setLoading] = useState(false)

    useEffect(() => {
        let listener = (e: IpcRendererEvent, success: boolean) => {
            setLoading(false)
            if (success) props.onClose()
        }
        ipcRenderer.on('login-return', listener)
        return () => { ipcRenderer.removeListener('login-return', listener) }
    }, [])

    return <Modal onClose={() => props.onClose()}>
        <form className="login" onSubmit={e => {
            e.preventDefault()
            setLoading(true)
            ipcRenderer.send('login', login, password)
        }}>
            <h3>login</h3>
            <label>
                codice persona
                <input type="text" autoFocus placeholder="10999999" onChange={e => {
                    setLogin(e.target.value)
                }} />
            </label>
            <label>
                password
                <input type="password" onChange={e => {
                    setPassword(e.target.value)
                }} />
            </label>
            <button
                className="confirm-button"
                disabled={loading}
                type="submit"
            >
                {loading ? '...' : 'login'}
            </button>
        </form>
    </Modal>
}