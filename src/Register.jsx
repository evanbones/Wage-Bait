import Header from './components/Header/Header.jsx'
import { InfoBox } from './components/InfoBox/InfoBox.jsx'
import ActionButton from './components/ActionButton/ActionButton.jsx'
import  './Register.css'

function Register() {
    return (
        <>
            <Header />
            <div className="register-container"> 
                <InfoBox label="Username" />
                <InfoBox label="Email" />
                <InfoBox label="Password" type="password" />
                <InfoBox label="Confirm Password" type="password" />
                <ActionButton
                    className="btn-register"
                    
                >
                    Sign Up
                </ActionButton>
            </div>
        </>
    )
}
export default Register;